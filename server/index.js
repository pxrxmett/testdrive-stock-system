// Standalone API Server for Stock Management System
// Runs on port 3000

const express = require('express')
const apiRouter = require('./api/express-router')

const app = express()
const PORT = process.env.API_PORT || 3000

// Body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.statusCode = 200
    res.end()
    return
  }

  next()
})

// API routes
app.use('/api', apiRouter)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Stock Management API',
    version: '1.0.0',
    status: 'active',
    endpoints: '/api',
    docs: 'See OpenAPI documentation'
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.url,
    message: `Cannot ${req.method} ${req.url}`
  })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({
    error: err.message || 'Internal Server Error',
    statusCode: 500
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Stock Management API Server`)
  console.log(`📍 Running at: http://localhost:${PORT}`)
  console.log(`📚 API Base: http://localhost:${PORT}/api`)
  console.log(`⏰ Started at: ${new Date().toISOString()}\n`)
})

module.exports = app
