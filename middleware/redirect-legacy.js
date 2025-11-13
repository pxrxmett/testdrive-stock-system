// Middleware to redirect legacy routes to new brand-specific routes

export default function ({ route, redirect }) {
  // Redirect legacy queue routes to ISUZU as default
  if (route.path === '/dashboard/queue' || route.path === '/dashboard/queue/') {
    return redirect('/dashboard/isuzu/queue')
  }

  // Redirect legacy stock routes to admin stock (requires admin access)
  if (route.path === '/dashboard/stock' || route.path === '/dashboard/stock/') {
    return redirect('/admin/stock')
  }

  // Redirect legacy documents routes to ISUZU as default
  if (route.path === '/dashboard/documents' || route.path === '/dashboard/documents/') {
    return redirect('/dashboard/isuzu/documents')
  }

  // Redirect /stock to /admin/stock
  if (route.path === '/stock' || route.path === '/stock/') {
    return redirect('/admin/stock')
  }

  // Redirect /dashboard/staff to /admin/staff
  if (route.path === '/dashboard/staff' || route.path === '/dashboard/staff/') {
    return redirect('/admin/staff')
  }
}
