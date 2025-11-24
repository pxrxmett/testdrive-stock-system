// Express Router version of API
// This wraps the existing API logic for use with Express

const express = require('express')
const router = express.Router()

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

// Helper to create context from Express req/res
function createContext(req, res) {
  return {
    req,
    res,
    method: req.method,
    url: req.url,
    path: req.path,
    query: req.query,
    body: req.body,
    params: req.params,
    sendJSON: (data, statusCode = 200) => {
      res.status(statusCode).json(data)
    },
    sendError: (message, statusCode = 500) => {
      res.status(statusCode).json({ error: message, statusCode })
    }
  }
}

// Wrapper to convert controller to Express handler
function wrap(controllerFn) {
  return (req, res, next) => {
    try {
      console.log(`📥 ${req.method} ${req.originalUrl || req.url}`)
      const ctx = createContext(req, res)
      controllerFn(ctx)
    } catch (error) {
      console.error('❌ Error in controller:', error)
      next(error)
    }
  }
}

// ========================================
// APP ENDPOINTS
// ========================================
router.get('/', wrap(appController.getApiInfo))
router.get('/health', wrap(appController.getHealth))

// ========================================
// AUTH ENDPOINTS
// ========================================
router.post('/auth/login', wrap(authController.login))
router.get('/auth/me', wrap(authController.getMe))
router.post('/auth/refresh-token', wrap(authController.refreshToken))
router.post('/auth/change-password', wrap(authController.changePassword))
router.post('/auth/line-login', wrap(authController.lineLogin))

// ========================================
// USERS ENDPOINTS
// ========================================
router.get('/users/profile', wrap(usersController.getProfile))
router.patch('/users/profile', wrap(usersController.updateProfile))
router.get('/users/settings', wrap(usersController.getSettings))
router.patch('/users/settings/notifications', wrap(usersController.updateNotificationSettings))
router.patch('/users/settings/system', wrap(usersController.updateSystemSettings))

// ========================================
// ANALYTICS ENDPOINTS
// ========================================
router.get('/analytics/dashboard', wrap(analyticsController.getDashboard))
router.get('/analytics/vehicles/statistics', wrap(analyticsController.getVehicleStatistics))
router.get('/analytics/events/statistics', wrap(analyticsController.getEventStatistics))
router.get('/analytics/test-drives/statistics', wrap(analyticsController.getTestDriveStatistics))

// ========================================
// BRANDS ENDPOINTS
// ========================================
router.get('/brands', wrap(brandsController.getAll))
router.get('/brands/code/:code', wrap(brandsController.getByCode))
router.get('/brands/:id', wrap(brandsController.getById))

// ========================================
// STOCK MANAGEMENT (NON-SCOPED)
// ========================================
router.post('/stock', wrap(stockController.create))
router.get('/stock', wrap(stockController.getAll))
router.get('/stock/vehicles', wrap(stockController.getVehicles))
router.post('/stock/upload', wrap(stockController.upload))
router.get('/stock/:id', wrap(stockController.getById))
router.patch('/stock/:id', wrap(stockController.update))
router.patch('/stock/vehicles/:id/status', wrap(stockController.updateStatus))
router.delete('/stock/vehicles/:id', wrap(stockController.deleteVehicle))

// Middleware to prevent "admin" from being treated as a brandCode
router.use('/:brandCode', (req, res, next) => {
  if (req.params.brandCode === 'admin') {
    return next('route') // Skip to next route handler
  }
  next()
})

// ========================================
// STOCK MANAGEMENT (BRAND-SCOPED)
// ========================================
router.post('/:brandCode/stock', wrap(stockController.createBrandScoped))
router.get('/:brandCode/stock/vehicles', wrap(stockController.getVehiclesBrandScoped))
router.post('/:brandCode/stock/upload', wrap(stockController.uploadBrandScoped))
router.get('/:brandCode/stock/:id', wrap(stockController.getByIdBrandScoped))
router.patch('/:brandCode/stock/:id', wrap(stockController.updateBrandScoped))
router.patch('/:brandCode/stock/vehicles/:id/status', wrap(stockController.updateStatusBrandScoped))
router.delete('/:brandCode/stock/vehicles/:id', wrap(stockController.deleteVehicleBrandScoped))
router.get('/:brandCode/stock', wrap(stockController.getAllBrandScoped))

// ========================================
// ADMIN - STOCK MANAGEMENT
// ========================================
router.get('/admin/stock/all', wrap(stockController.adminGetAll))
router.get('/admin/stock/summary', wrap(stockController.adminGetSummary))
router.get('/admin/stock/search', wrap(stockController.adminSearch))
router.get('/admin/stock/analytics/by-brand', wrap(stockController.adminGetAnalyticsByBrand))
router.get('/admin/stock/:id', wrap(stockController.adminGetById))

// ========================================
// TEST DRIVES (NON-SCOPED)
// ========================================
router.post('/test-drives', wrap(testDrivesController.create))
router.get('/test-drives', wrap(testDrivesController.getAll))
router.get('/test-drives/:id', wrap(testDrivesController.getById))
router.patch('/test-drives/:id', wrap(testDrivesController.update))
router.delete('/test-drives/:id', wrap(testDrivesController.deleteTestDrive))
router.post('/test-drives/:id/pdpa-consent', wrap(testDrivesController.pdpaConsent))
router.post('/test-drives/:id/signature', wrap(testDrivesController.submitSignature))

// ========================================
// TEST DRIVES (BRAND-SCOPED)
// ========================================
router.post('/:brandCode/test-drives', wrap(testDrivesController.createBrandScoped.bind(testDrivesController)))
router.get('/:brandCode/test-drives', wrap(testDrivesController.getAllBrandScoped.bind(testDrivesController)))
router.get('/:brandCode/test-drives/:id', wrap(testDrivesController.getByIdBrandScoped.bind(testDrivesController)))
router.patch('/:brandCode/test-drives/:id', wrap(testDrivesController.updateBrandScoped.bind(testDrivesController)))
router.delete('/:brandCode/test-drives/:id', wrap(testDrivesController.deleteTestDriveBrandScoped.bind(testDrivesController)))
router.post('/:brandCode/test-drives/:id/pdpa-consent', wrap(testDrivesController.pdpaConsentBrandScoped.bind(testDrivesController)))
router.post('/:brandCode/test-drives/:id/signature', wrap(testDrivesController.submitSignatureBrandScoped.bind(testDrivesController)))

// ========================================
// ADMIN - TEST DRIVES
// ========================================
router.get('/admin/test-drives/all', (req, res) => {
  console.log('🟢 MATCHED: /admin/test-drives/all')
  wrap(testDrivesController.adminGetAll.bind(testDrivesController))(req, res)
})
router.get('/admin/test-drives/export', wrap(testDrivesController.adminExport.bind(testDrivesController)))
router.get('/admin/test-drives/:id', (req, res) => {
  console.log('🔵 MATCHED: /admin/test-drives/:id with id=', req.params.id)
  wrap(testDrivesController.adminGetById.bind(testDrivesController))(req, res)
})

// ========================================
// STAFF (BRAND-SCOPED)
// ========================================
router.post('/:brandCode/staff', wrap(staffController.create))
router.get('/:brandCode/staff/available-sales', wrap(staffController.getAvailableSales))
router.get('/:brandCode/staff/:id', wrap(staffController.getById))
router.patch('/:brandCode/staff/:id', wrap(staffController.update))
router.delete('/:brandCode/staff/:id', wrap(staffController.deleteStaff))
router.get('/:brandCode/staff', wrap(staffController.getAll))

// ========================================
// ADMIN - STAFF
// ========================================
router.get('/admin/staff/all', wrap(staffController.adminGetAll))
router.get('/admin/staff/summary', wrap(staffController.adminGetSummary))
router.get('/admin/staff/performance', wrap(staffController.adminGetPerformance))
router.get('/admin/staff/:id', wrap(staffController.adminGetById))

// ========================================
// LINE INTEGRATION
// ========================================
router.post('/line-integration/check', wrap(lineIntegrationController.check))
router.post('/line-integration/link', wrap(lineIntegrationController.link))
router.post('/line-integration/link-simple', wrap(lineIntegrationController.linkSimple))
router.get('/line-integration/staff/:id', wrap(lineIntegrationController.getStaff))
router.get('/line-integration/pending-users', wrap(lineIntegrationController.getPendingUsers))
router.get('/line-integration/linked-users', wrap(lineIntegrationController.getLinkedUsers))
router.post('/line-integration/admin-link', wrap(lineIntegrationController.adminLink))
router.delete('/line-integration/unlink/:lineUserId', wrap(lineIntegrationController.unlink))

// ========================================
// LEGACY ENDPOINTS (for backward compatibility)
// ========================================

// Legacy LINE users endpoints
router.get('/line-users/pending', wrap(lineIntegrationController.getPendingUsers))
router.get('/line-users/linked', wrap(lineIntegrationController.getLinkedUsers))
router.post('/line-users/:id/link', (req, res) => {
  // Map old endpoint to new one
  req.body.lineUserId = req.params.id
  wrap(lineIntegrationController.adminLink)(req, res)
})
router.post('/line-users/:id/unlink', (req, res) => {
  req.params.lineUserId = req.params.id
  wrap(lineIntegrationController.unlink)(req, res)
})

// Legacy staff endpoint (returns all staff)
router.get('/staff', wrap(staffController.adminGetAll))

// ========================================
// EVENTS (NON-SCOPED)
// ========================================
router.post('/events', wrap(eventsController.create))
router.get('/events/calendar/view', wrap(eventsController.getCalendarView))
router.get('/events/:id/vehicles', wrap(eventsController.getEventVehicles))
router.post('/events/:id/vehicles/batch', wrap(eventsController.assignMultipleVehicles))
router.post('/events/:id/vehicles', wrap(eventsController.assignVehicle))
router.delete('/events/:id/vehicles/:vehicleId', wrap(eventsController.unassignVehicle))
router.patch('/events/:id/status', wrap(eventsController.updateStatus))
router.get('/events/:id', wrap(eventsController.getById))
router.patch('/events/:id', wrap(eventsController.update))
router.delete('/events/:id', wrap(eventsController.deleteEvent))
router.get('/events', wrap(eventsController.getAll))

// ========================================
// EVENTS (BRAND-SCOPED)
// ========================================
router.post('/:brandCode/events', wrap(eventsController.createBrandScoped))
router.get('/:brandCode/events/calendar/view', wrap(eventsController.getCalendarViewBrandScoped))
router.get('/:brandCode/events/:id/vehicles', wrap(eventsController.getEventVehiclesBrandScoped))
router.post('/:brandCode/events/:id/vehicles/batch', wrap(eventsController.assignMultipleVehiclesBrandScoped))
router.post('/:brandCode/events/:id/vehicles', wrap(eventsController.assignVehicleBrandScoped))
router.delete('/:brandCode/events/:id/vehicles/:vehicleId', wrap(eventsController.unassignVehicleBrandScoped))
router.patch('/:brandCode/events/:id/status', wrap(eventsController.updateStatusBrandScoped))
router.get('/:brandCode/events/:id', wrap(eventsController.getByIdBrandScoped))
router.patch('/:brandCode/events/:id', wrap(eventsController.updateBrandScoped))
router.delete('/:brandCode/events/:id', wrap(eventsController.deleteEventBrandScoped))
router.get('/:brandCode/events', wrap(eventsController.getAllBrandScoped))

// ========================================
// ADMIN - EVENTS
// ========================================
router.post('/admin/events', wrap(eventsController.adminCreate))
router.get('/admin/events/all', wrap(eventsController.adminGetAll))
router.get('/admin/events/calendar/view', wrap(eventsController.adminGetCalendarView))
router.get('/admin/events/:id', wrap(eventsController.adminGetById))
router.patch('/admin/events/:id', wrap(eventsController.adminUpdate))
router.delete('/admin/events/:id', wrap(eventsController.adminDelete))

module.exports = router
