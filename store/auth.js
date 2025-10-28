// Authentication Store
export const state = () => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
})

export const mutations = {
  setUser(state, user) {
    state.user = user
    state.isAuthenticated = !!user
  },

  setToken(state, token) {
    state.token = token
  },

  setLoading(state, loading) {
    state.loading = loading
  },

  setError(state, error) {
    state.error = error
  },

  clearAuth(state) {
    state.user = null
    state.token = null
    state.isAuthenticated = false
    state.error = null
  }
}

export const actions = {
  async login({ commit }, credentials) {
    try {
      commit('setLoading', true)
      commit('setError', null)

      // Call login API
      const response = await this.$axios.$post('/auth/login', {
        username: credentials.username,
        password: credentials.password
      })

      // Validate response has token
      const token = response.access_token || response.token

      if (!token) {
        console.error('Login response missing token:', response)
        throw new Error('Backend ไม่ส่ง access token กลับมา')
      }

      console.log('✅ Token received:', token.substring(0, 20) + '...')

      commit('setToken', token)

      // Save to cookie (7 days)
      this.$cookies.set('auth-token', token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })

      console.log('✅ Token saved to cookie')

      // Get user info
      const user = response.user || await this.$axios.$get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      commit('setUser', user)
      console.log('✅ User authenticated:', user.username)

      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'เข้าสู่ระบบไม่สำเร็จ'
      commit('setError', errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      commit('setLoading', false)
    }
  },

  async logout({ commit }) {
    try {
      // Clear cookie
      this.$cookies.remove('auth-token')

      // Clear state
      commit('clearAuth')

      // Redirect to login
      this.$router.push('/login')

      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, error: error.message }
    }
  },

  async checkAuth({ commit, state }) {
    // Check if token exists in cookie
    const token = this.$cookies.get('auth-token')

    if (!token) {
      commit('clearAuth')
      return false
    }

    try {
      commit('setToken', token)

      // Verify token by getting user info
      const user = await this.$axios.$get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      commit('setUser', user)
      return true
    } catch (error) {
      // Token invalid or expired
      console.error('Token validation failed:', error)
      this.$cookies.remove('auth-token')
      commit('clearAuth')
      return false
    }
  },

  async refreshToken({ commit, state }) {
    try {
      const response = await this.$axios.$post('/auth/refresh-token')

      const token = response.access_token || response.token
      commit('setToken', token)

      // Update cookie
      this.$cookies.set('auth-token', token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      })

      return { success: true }
    } catch (error) {
      console.error('Token refresh failed:', error)
      commit('clearAuth')
      return { success: false }
    }
  }
}

export const getters = {
  isAuthenticated: state => state.isAuthenticated,
  user: state => state.user,
  token: state => state.token,
  loading: state => state.loading,
  error: state => state.error
}
