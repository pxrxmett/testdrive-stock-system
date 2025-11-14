// Initialize authentication from cookie on page load
export default async function ({ store, app }) {
  // Check if token exists in cookie
  const token = app.$cookies.get('auth-token')

  if (token) {
    console.log('🔄 Restoring auth from cookie...')

    // Restore token to Vuex state
    store.commit('auth/setToken', token)

    try {
      // Validate token by fetching user info with timeout
      const user = await Promise.race([
        app.$axios.$get('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Auth timeout')), 5000)
        )
      ])

      store.commit('auth/setUser', user)
      console.log('✅ Auth restored successfully:', user.username)
    } catch (error) {
      // Token invalid, expired, or backend unavailable
      console.warn('⚠️ Token validation failed:', error.message)
      // Don't remove token on timeout - might be backend issue
      if (error.message !== 'Auth timeout') {
        app.$cookies.remove('auth-token')
        store.commit('auth/clearAuth')
      }
    }
  } else {
    console.log('ℹ️ No auth token found in cookie')
  }
}
