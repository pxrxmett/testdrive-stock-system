// Authentication Middleware
// Protects routes from unauthorized access

export default function ({ store, redirect, route, app }) {
  // Check if user is authenticated
  const isAuthenticated = store.getters['auth/isAuthenticated']
  const token = app.$cookies.get('auth-token')

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/', '/testdrive', '/stock']
  const isPublicRoute = publicRoutes.includes(route.path) ||
                        route.path.startsWith('/testdrive/') ||
                        route.path.startsWith('/stock/') ||
                        route.path.startsWith('/dashboard/isuzu/') ||
                        route.path.startsWith('/dashboard/byd/')

  // If not authenticated and trying to access protected route
  if (!isAuthenticated && !token && !isPublicRoute) {
    console.log('🔒 Not authenticated, redirecting to login')
    return redirect('/login')
  }

  // If authenticated and trying to access login page, redirect to dashboard
  if ((isAuthenticated || token) && route.path === '/login') {
    console.log('✅ Already authenticated, redirecting to dashboard')
    return redirect('/dashboard')
  }

  // If token exists but user not in store, validate token
  if (token && !isAuthenticated && !isPublicRoute) {
    console.log('🔍 Token found, validating...')
    // This will be handled by nuxtServerInit or client-side checkAuth
  }
}
