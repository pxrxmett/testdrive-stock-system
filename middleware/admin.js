// Admin Authentication Middleware
// Ensures only admin users can access admin routes

export default function ({ store, redirect, route, app }) {
  // Check if user is authenticated
  const isAuthenticated = store.getters['auth/isAuthenticated']
  const token = app.$cookies.get('auth-token')
  const user = store.getters['auth/user']

  // If not authenticated, redirect to login
  if (!isAuthenticated && !token) {
    console.log('🔒 Not authenticated, redirecting to login')
    return redirect('/login')
  }

  // Check if user has admin role
  if (user && user.role !== 'admin') {
    console.log('❌ Unauthorized: Admin access required')
    return redirect('/dashboard')
  }

  console.log('✅ Admin access granted')
}
