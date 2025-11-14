// Main API Router for Stock Management System
// This handles ALL API endpoints specified in the OpenAPI documentation

const authController = require('./controllers/auth')
const appController = require('./controllers/app')
const usersController = require('./controllers/users')
const analyticsController = require('./controllers/analytics')
const brandsController = require('./controllers/brands')
const stockController = require('./controllers/stock')
const testDrivesController = require('./controllers/test-drives')
const staffController = require('./controllers/staff')
const lineIntegrationController = require('./controllers/line-integration')
const eventsController = require('./controllers/events')

// Helper to parse request body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (e) {
        resolve({})
      }
    })
    req.on('error', reject)
  })
}

// Helper to send JSON response
function sendJSON(res, data, statusCode = 200) {
  res.statusCode = statusCode
  if (typeof res.setHeader === 'function') {
    res.setHeader('Content-Type', 'application/json')
  } else if (typeof res.header === 'function') {
    res.header('Content-Type', 'application/json')
  }
  res.end(JSON.stringify(data))
}

// Helper to send error response
function sendError(res, message, statusCode = 500) {
  sendJSON(res, { error: message, statusCode }, statusCode)
}

// Extract path params from URL
function extractParams(url, pattern) {
  const urlParts = url.split('?')[0].split('/')
  const patternParts = pattern.split('/')
  const params = {}

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      const paramName = patternParts[i].substring(1)
      params[paramName] = urlParts[i]
    }
  }

  return params
}

// Match URL pattern with dynamic segments
function matchPattern(url, pattern) {
  const urlParts = url.split('?')[0].split('/')
  const patternParts = pattern.split('/')

  if (urlParts.length !== patternParts.length) {
    return false
  }

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      continue
    }
    if (urlParts[i] !== patternParts[i]) {
      return false
    }
  }

  return true
}

// Parse query parameters
function parseQuery(url) {
  const queryString = url.split('?')[1]
  if (!queryString) return {}

  const params = {}
  queryString.split('&').forEach(param => {
    const [key, value] = param.split('=')
    params[decodeURIComponent(key)] = decodeURIComponent(value || '')
  })
  return params
}

// Main middleware handler
module.exports = async function (req, res, next) {
  const url = req.url
  const method = req.method
  const path = url.split('?')[0]

  console.log(`📥 ${method} ${url}`)

  // CORS headers
  if (typeof res.setHeader === 'function') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }

  if (method === 'OPTIONS') {
    res.statusCode = 200
    res.end()
    return
  }

  try {
    // Prepare request context with bound sendJSON and sendError
    const ctx = {
      req,
      res,
      method,
      url,
      path,
      query: parseQuery(url),
      body: null,
      params: {},
      sendJSON: (data, statusCode) => sendJSON(res, data, statusCode),
      sendError: (message, statusCode) => sendError(res, message, statusCode)
    }

    // Parse body for POST/PATCH/PUT requests
    if (['POST', 'PATCH', 'PUT'].includes(method)) {
      ctx.body = await parseBody(req)
    }

    // ========================================
    // APP ENDPOINTS
    // ========================================

    if (path === '/api' && method === 'GET') {
      return appController.getApiInfo(ctx)
    }

    if (path === '/api/health' && method === 'GET') {
      return appController.getHealth(ctx)
    }

    // ========================================
    // AUTH ENDPOINTS
    // ========================================

    if (path === '/api/auth/login' && method === 'POST') {
      return authController.login(ctx)
    }

    if (path === '/api/auth/me' && method === 'GET') {
      return authController.getMe(ctx)
    }

    if (path === '/api/auth/refresh-token' && method === 'POST') {
      return authController.refreshToken(ctx)
    }

    if (path === '/api/auth/change-password' && method === 'POST') {
      return authController.changePassword(ctx)
    }

    if (path === '/api/auth/line-login' && method === 'POST') {
      return authController.lineLogin(ctx)
    }

    // ========================================
    // USERS ENDPOINTS
    // ========================================

    if (path === '/api/users/profile' && method === 'GET') {
      return usersController.getProfile(ctx)
    }

    if (path === '/api/users/profile' && method === 'PATCH') {
      return usersController.updateProfile(ctx)
    }

    if (path === '/api/users/settings' && method === 'GET') {
      return usersController.getSettings(ctx)
    }

    if (path === '/api/users/settings/notifications' && method === 'PATCH') {
      return usersController.updateNotificationSettings(ctx)
    }

    if (path === '/api/users/settings/system' && method === 'PATCH') {
      return usersController.updateSystemSettings(ctx)
    }

    // ========================================
    // ANALYTICS ENDPOINTS
    // ========================================

    if (path === '/api/analytics/dashboard' && method === 'GET') {
      return analyticsController.getDashboard(ctx)
    }

    if (path === '/api/analytics/vehicles/statistics' && method === 'GET') {
      return analyticsController.getVehicleStatistics(ctx)
    }

    if (path === '/api/analytics/events/statistics' && method === 'GET') {
      return analyticsController.getEventStatistics(ctx)
    }

    if (path === '/api/analytics/test-drives/statistics' && method === 'GET') {
      return analyticsController.getTestDriveStatistics(ctx)
    }

    // ========================================
    // BRANDS ENDPOINTS
    // ========================================

    if (path === '/api/brands' && method === 'GET') {
      return brandsController.getAll(ctx)
    }

    if (matchPattern(path, '/api/brands/:id') && method === 'GET' && !path.includes('/code/')) {
      ctx.params = extractParams(path, '/api/brands/:id')
      return brandsController.getById(ctx)
    }

    if (matchPattern(path, '/api/brands/code/:code') && method === 'GET') {
      ctx.params = extractParams(path, '/api/brands/code/:code')
      return brandsController.getByCode(ctx)
    }

    // ========================================
    // STOCK MANAGEMENT (NON-SCOPED)
    // ========================================

    if (path === '/api/stock' && method === 'POST') {
      return stockController.create(ctx)
    }

    if (path === '/api/stock' && method === 'GET') {
      return stockController.getAll(ctx)
    }

    if (path === '/api/stock/vehicles' && method === 'GET') {
      return stockController.getVehicles(ctx)
    }

    if (matchPattern(path, '/api/stock/:id') && method === 'GET' && !path.includes('/vehicles/')) {
      ctx.params = extractParams(path, '/api/stock/:id')
      return stockController.getById(ctx)
    }

    if (matchPattern(path, '/api/stock/:id') && method === 'PATCH' && !path.includes('/vehicles/')) {
      ctx.params = extractParams(path, '/api/stock/:id')
      return stockController.update(ctx)
    }

    if (matchPattern(path, '/api/stock/vehicles/:id/status') && method === 'PATCH') {
      ctx.params = extractParams(path, '/api/stock/vehicles/:id/status')
      return stockController.updateStatus(ctx)
    }

    if (matchPattern(path, '/api/stock/vehicles/:id') && method === 'DELETE') {
      ctx.params = extractParams(path, '/api/stock/vehicles/:id')
      return stockController.deleteVehicle(ctx)
    }

    if (path === '/api/stock/upload' && method === 'POST') {
      return stockController.upload(ctx)
    }

    // ========================================
    // STOCK MANAGEMENT (BRAND-SCOPED)
    // ========================================

    if (matchPattern(path, '/api/:brandCode/stock') && method === 'POST' && !path.includes('/admin/')) {
      ctx.params = extractParams(path, '/api/:brandCode/stock')
      return stockController.createBrandScoped(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/stock') && method === 'GET' && !path.includes('/admin/') && !path.includes('/vehicles')) {
      ctx.params = extractParams(path, '/api/:brandCode/stock')
      return stockController.getAllBrandScoped(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/stock/vehicles') && method === 'GET') {
      ctx.params = extractParams(path, '/api/:brandCode/stock/vehicles')
      return stockController.getVehiclesBrandScoped(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/stock/:id') && method === 'GET' && !path.includes('/vehicles/')) {
      ctx.params = extractParams(path, '/api/:brandCode/stock/:id')
      return stockController.getByIdBrandScoped(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/stock/:id') && method === 'PATCH' && !path.includes('/vehicles/')) {
      ctx.params = extractParams(path, '/api/:brandCode/stock/:id')
      return stockController.updateBrandScoped(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/stock/vehicles/:id/status') && method === 'PATCH') {
      ctx.params = extractParams(path, '/api/:brandCode/stock/vehicles/:id/status')
      return stockController.updateStatusBrandScoped(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/stock/vehicles/:id') && method === 'DELETE') {
      ctx.params = extractParams(path, '/api/:brandCode/stock/vehicles/:id')
      return stockController.deleteVehicleBrandScoped(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/stock/upload') && method === 'POST') {
      ctx.params = extractParams(path, '/api/:brandCode/stock/upload')
      return stockController.uploadBrandScoped(ctx)
    }

    // ========================================
    // ADMIN - STOCK MANAGEMENT (CROSS-BRAND)
    // ========================================

    if (path === '/api/admin/stock/all' && method === 'GET') {
      return stockController.adminGetAll(ctx)
    }

    if (path === '/api/admin/stock/summary' && method === 'GET') {
      return stockController.adminGetSummary(ctx)
    }

    if (path === '/api/admin/stock/search' && method === 'GET') {
      return stockController.adminSearch(ctx)
    }

    if (matchPattern(path, '/api/admin/stock/:id') && method === 'GET') {
      ctx.params = extractParams(path, '/api/admin/stock/:id')
      return stockController.adminGetById(ctx)
    }

    if (path === '/api/admin/stock/analytics/by-brand' && method === 'GET') {
      return stockController.adminGetAnalyticsByBrand(ctx)
    }

    // ========================================
    // TEST DRIVES (NON-SCOPED)
    // ========================================

    if (path === '/api/test-drives' && method === 'POST') {
      return testDrivesController.create(ctx)
    }

    if (path === '/api/test-drives' && method === 'GET') {
      return testDrivesController.getAll(ctx)
    }

    if (matchPattern(path, '/api/test-drives/:id') && method === 'GET' && !path.includes('/pdpa-consent') && !path.includes('/signature')) {
      ctx.params = extractParams(path, '/api/test-drives/:id')
      return testDrivesController.getById(ctx)
    }

    if (matchPattern(path, '/api/test-drives/:id') && method === 'PATCH') {
      ctx.params = extractParams(path, '/api/test-drives/:id')
      return testDrivesController.update(ctx)
    }

    if (matchPattern(path, '/api/test-drives/:id') && method === 'DELETE') {
      ctx.params = extractParams(path, '/api/test-drives/:id')
      return testDrivesController.deleteTestDrive(ctx)
    }

    if (matchPattern(path, '/api/test-drives/:id/pdpa-consent') && method === 'POST') {
      ctx.params = extractParams(path, '/api/test-drives/:id/pdpa-consent')
      return testDrivesController.pdpaConsent(ctx)
    }

    if (matchPattern(path, '/api/test-drives/:id/signature') && method === 'POST') {
      ctx.params = extractParams(path, '/api/test-drives/:id/signature')
      return testDrivesController.submitSignature(ctx)
    }

    // ========================================
    // TEST DRIVES (BRAND-SCOPED)
    // ========================================

    if (matchPattern(path, '/api/:brandCode/test-drives') && method === 'POST' && !path.includes('/admin/')) {
      ctx.params = extractParams(path, '/api/:brandCode/test-drives')
      return testDrivesController.createBrandScoped(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/test-drives') && method === 'GET' && !path.includes('/admin/')) {
      ctx.params = extractParams(path, '/api/:brandCode/test-drives')
      return testDrivesController.getAllBrandScoped(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/test-drives/:id') && method === 'GET' && !path.includes('/pdpa-consent') && !path.includes('/signature')) {
      ctx.params = extractParams(path, '/api/:brandCode/test-drives/:id')
      return testDrivesController.getByIdBrandScoped(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/test-drives/:id') && method === 'PATCH') {
      ctx.params = extractParams(path, '/api/:brandCode/test-drives/:id')
      return testDrivesController.updateBrandScoped(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/test-drives/:id') && method === 'DELETE') {
      ctx.params = extractParams(path, '/api/:brandCode/test-drives/:id')
      return testDrivesController.deleteTestDriveBrandScoped(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/test-drives/:id/pdpa-consent') && method === 'POST') {
      ctx.params = extractParams(path, '/api/:brandCode/test-drives/:id/pdpa-consent')
      return testDrivesController.pdpaConsentBrandScoped(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/test-drives/:id/signature') && method === 'POST') {
      ctx.params = extractParams(path, '/api/:brandCode/test-drives/:id/signature')
      return testDrivesController.submitSignatureBrandScoped(ctx)
    }

    // ========================================
    // ADMIN - TEST DRIVES (CROSS-BRAND)
    // ========================================

    if (path === '/api/admin/test-drives/all' && method === 'GET') {
      return testDrivesController.adminGetAll(ctx)
    }

    if (path === '/api/admin/test-drives/export' && method === 'GET') {
      return testDrivesController.adminExport(ctx)
    }

    if (matchPattern(path, '/api/admin/test-drives/:id') && method === 'GET') {
      ctx.params = extractParams(path, '/api/admin/test-drives/:id')
      return testDrivesController.adminGetById(ctx)
    }

    // ========================================
    // STAFF (BRAND-SCOPED)
    // ========================================

    if (matchPattern(path, '/api/:brandCode/staff') && method === 'POST' && !path.includes('/admin/') && !path.includes('/available-sales')) {
      ctx.params = extractParams(path, '/api/:brandCode/staff')
      return staffController.create(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/staff') && method === 'GET' && !path.includes('/admin/') && !path.includes('/available-sales')) {
      ctx.params = extractParams(path, '/api/:brandCode/staff')
      return staffController.getAll(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/staff/available-sales') && method === 'GET') {
      ctx.params = extractParams(path, '/api/:brandCode/staff/available-sales')
      return staffController.getAvailableSales(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/staff/:id') && method === 'GET') {
      ctx.params = extractParams(path, '/api/:brandCode/staff/:id')
      return staffController.getById(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/staff/:id') && method === 'PATCH') {
      ctx.params = extractParams(path, '/api/:brandCode/staff/:id')
      return staffController.update(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/staff/:id') && method === 'DELETE') {
      ctx.params = extractParams(path, '/api/:brandCode/staff/:id')
      return staffController.deleteStaff(ctx)
    }

    // ========================================
    // ADMIN - STAFF (CROSS-BRAND)
    // ========================================

    if (path === '/api/admin/staff/all' && method === 'GET') {
      return staffController.adminGetAll(ctx)
    }

    if (path === '/api/admin/staff/summary' && method === 'GET') {
      return staffController.adminGetSummary(ctx)
    }

    if (path === '/api/admin/staff/performance' && method === 'GET') {
      return staffController.adminGetPerformance(ctx)
    }

    if (matchPattern(path, '/api/admin/staff/:id') && method === 'GET') {
      ctx.params = extractParams(path, '/api/admin/staff/:id')
      return staffController.adminGetById(ctx)
    }

    // ========================================
    // LINE INTEGRATION
    // ========================================

    if (path === '/api/line-integration/check' && method === 'POST') {
      return lineIntegrationController.check(ctx)
    }

    if (path === '/api/line-integration/link' && method === 'POST') {
      return lineIntegrationController.link(ctx)
    }

    if (path === '/api/line-integration/link-simple' && method === 'POST') {
      return lineIntegrationController.linkSimple(ctx)
    }

    if (matchPattern(path, '/api/line-integration/staff/:id') && method === 'GET') {
      ctx.params = extractParams(path, '/api/line-integration/staff/:id')
      return lineIntegrationController.getStaff(ctx)
    }

    if (path === '/api/line-integration/pending-users' && method === 'GET') {
      return lineIntegrationController.getPendingUsers(ctx)
    }

    if (path === '/api/line-integration/linked-users' && method === 'GET') {
      return lineIntegrationController.getLinkedUsers(ctx)
    }

    if (path === '/api/line-integration/admin-link' && method === 'POST') {
      return lineIntegrationController.adminLink(ctx)
    }

    if (matchPattern(path, '/api/line-integration/unlink/:lineUserId') && method === 'DELETE') {
      ctx.params = extractParams(path, '/api/line-integration/unlink/:lineUserId')
      return lineIntegrationController.unlink(ctx)
    }

    // ========================================
    // EVENTS (NON-SCOPED)
    // ========================================

    if (path === '/api/events' && method === 'POST') {
      return eventsController.create(ctx)
    }

    if (path === '/api/events' && method === 'GET') {
      return eventsController.getAll(ctx)
    }

    if (path === '/api/events/calendar/view' && method === 'GET') {
      return eventsController.getCalendarView(ctx)
    }

    if (matchPattern(path, '/api/events/:id') && method === 'GET' && !path.includes('/vehicles') && !path.includes('/status')) {
      ctx.params = extractParams(path, '/api/events/:id')
      return eventsController.getById(ctx)
    }

    if (matchPattern(path, '/api/events/:id') && method === 'PATCH' && !path.includes('/status')) {
      ctx.params = extractParams(path, '/api/events/:id')
      return eventsController.update(ctx)
    }

    if (matchPattern(path, '/api/events/:id') && method === 'DELETE') {
      ctx.params = extractParams(path, '/api/events/:id')
      return eventsController.deleteEvent(ctx)
    }

    if (matchPattern(path, '/api/events/:id/vehicles') && method === 'POST' && !path.includes('/batch')) {
      ctx.params = extractParams(path, '/api/events/:id/vehicles')
      return eventsController.assignVehicle(ctx)
    }

    if (matchPattern(path, '/api/events/:id/vehicles') && method === 'GET') {
      ctx.params = extractParams(path, '/api/events/:id/vehicles')
      return eventsController.getEventVehicles(ctx)
    }

    if (matchPattern(path, '/api/events/:id/vehicles/batch') && method === 'POST') {
      ctx.params = extractParams(path, '/api/events/:id/vehicles/batch')
      return eventsController.assignMultipleVehicles(ctx)
    }

    if (matchPattern(path, '/api/events/:id/vehicles/:vehicleId') && method === 'DELETE') {
      ctx.params = extractParams(path, '/api/events/:id/vehicles/:vehicleId')
      return eventsController.unassignVehicle(ctx)
    }

    if (matchPattern(path, '/api/events/:id/status') && method === 'PATCH') {
      ctx.params = extractParams(path, '/api/events/:id/status')
      return eventsController.updateStatus(ctx)
    }

    // ========================================
    // EVENTS (BRAND-SCOPED)
    // ========================================

    if (matchPattern(path, '/api/:brandCode/events') && method === 'POST' && !path.includes('/admin/')) {
      ctx.params = extractParams(path, '/api/:brandCode/events')
      return eventsController.createBrandScoped(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/events') && method === 'GET' && !path.includes('/admin/') && !path.includes('/calendar/')) {
      ctx.params = extractParams(path, '/api/:brandCode/events')
      return eventsController.getAllBrandScoped(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/events/calendar/view') && method === 'GET') {
      ctx.params = extractParams(path, '/api/:brandCode/events/calendar/view')
      return eventsController.getCalendarViewBrandScoped(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/events/:id') && method === 'GET' && !path.includes('/vehicles') && !path.includes('/status')) {
      ctx.params = extractParams(path, '/api/:brandCode/events/:id')
      return eventsController.getByIdBrandScoped(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/events/:id') && method === 'PATCH' && !path.includes('/status')) {
      ctx.params = extractParams(path, '/api/:brandCode/events/:id')
      return eventsController.updateBrandScoped(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/events/:id') && method === 'DELETE') {
      ctx.params = extractParams(path, '/api/:brandCode/events/:id')
      return eventsController.deleteEventBrandScoped(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/events/:id/vehicles') && method === 'POST' && !path.includes('/batch')) {
      ctx.params = extractParams(path, '/api/:brandCode/events/:id/vehicles')
      return eventsController.assignVehicleBrandScoped(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/events/:id/vehicles') && method === 'GET') {
      ctx.params = extractParams(path, '/api/:brandCode/events/:id/vehicles')
      return eventsController.getEventVehiclesBrandScoped(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/events/:id/vehicles/batch') && method === 'POST') {
      ctx.params = extractParams(path, '/api/:brandCode/events/:id/vehicles/batch')
      return eventsController.assignMultipleVehiclesBrandScoped(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/events/:id/vehicles/:vehicleId') && method === 'DELETE') {
      ctx.params = extractParams(path, '/api/:brandCode/events/:id/vehicles/:vehicleId')
      return eventsController.unassignVehicleBrandScoped(ctx)
    }

    if (matchPattern(path, '/api/:brandCode/events/:id/status') && method === 'PATCH') {
      ctx.params = extractParams(path, '/api/:brandCode/events/:id/status')
      return eventsController.updateStatusBrandScoped(ctx)
    }

    // ========================================
    // ADMIN - EVENTS (CROSS-BRAND)
    // ========================================

    if (path === '/api/admin/events' && method === 'POST') {
      return eventsController.adminCreate(ctx)
    }

    if (path === '/api/admin/events/all' && method === 'GET') {
      return eventsController.adminGetAll(ctx)
    }

    if (path === '/api/admin/events/calendar/view' && method === 'GET') {
      return eventsController.adminGetCalendarView(ctx)
    }

    if (matchPattern(path, '/api/admin/events/:id') && method === 'GET') {
      ctx.params = extractParams(path, '/api/admin/events/:id')
      return eventsController.adminGetById(ctx)
    }

    if (matchPattern(path, '/api/admin/events/:id') && method === 'PATCH') {
      ctx.params = extractParams(path, '/api/admin/events/:id')
      return eventsController.adminUpdate(ctx)
    }

    if (matchPattern(path, '/api/admin/events/:id') && method === 'DELETE') {
      ctx.params = extractParams(path, '/api/admin/events/:id')
      return eventsController.adminDelete(ctx)
    }

    // If no route matched, return 404
    return sendError(res, `Route ${method} ${path} not found`, 404)

  } catch (error) {
    console.error('API Error:', error)
    return sendError(res, error.message || 'Internal server error', 500)
  }
}
