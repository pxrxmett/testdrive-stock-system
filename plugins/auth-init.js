// Initialize authentication from cookie on page load
export default async function ({ store, app }) {
  // Check if token exists in cookie
  const token = app.$cookies.get('auth-token')

  if (token) {
    console.log('🔄 Restoring auth from cookie...')

    // Restore token to Vuex state
    store.commit('auth/setToken', token)

    try {
      // Validate token by fetching user info
      const user = await app.$axios.$get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      store.commit('auth/setUser', user)
      console.log('✅ Auth restored successfully:', user.username)
    } catch (error) {
      // Token invalid or expired
      console.error('❌ Token validation failed:', error.message)
      app.$cookies.remove('auth-token')
      store.commit('auth/clearAuth')
    }
  } else {
    console.log('ℹ️ No auth token found in cookie')
  }
}
