// App Controller - Basic app information and health check

module.exports = {
  // GET /api
  getApiInfo(ctx) {
    ctx.sendJSON({
      name: 'Stock Management API',
      version: '1.0.0',
      description: 'API documentation for Stock Management System',
      status: 'active',
      timestamp: new Date().toISOString()
    })
  },

  // GET /api/health
  getHealth(ctx) {
    ctx.sendJSON({
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    })
  }
}
