// plugins/api.js
export default function ({ $axios, app }, inject) {
  // Create a custom axios instance
  const api = $axios.create({
    headers: {
      common: {
        'Accept': 'application/json, text/plain, */*'
      }
    }
  })
  // Set baseURL to something different
  api.setBaseURL(process.env.apiUrl || 'http://localhost:3001/api')
  // Request interceptor
  api.onRequest(config => {
    console.log('Making request to ' + config.url)
    // Add auth token if available
    const token = app.$cookies.get('auth-token')
    if (token) {
      config.headers.common['Authorization'] = `Bearer ${token}`
    }
  })
  // Response interceptor
  api.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 401) {
      // Handle unauthorized
      app.$cookies.remove('auth-token')
      app.router.push('/login')
    }
    return Promise.reject(error)
  })

  // Test Drives API
  const testDrives = {
    create(data) {
      return api.$post('/test-drives', data)
    },

    getAll(params = {}) {
      return api.$get('/test-drives', { params })
    },

    getById(id) {
      return api.$get(`/test-drives/${id}`)
    },

    update(id, data) {
      return api.$patch(`/test-drives/${id}`, data)
    },

    delete(id) {
      return api.$delete(`/test-drives/${id}`)
    }
  }

  // Stock API
  const stock = {
    create(data) {
      return api.$post('/stock', data)
    },

    getAll(params = {}) {
      return api.$get('/stock', { params })
    },

    getVehicles(params = {}) {
      return api.$get('/stock/vehicles', { params })
    },

    getById(id) {
      return api.$get(`/stock/${id}`)
    },

    updateStatus(id, status) {
      return api.$patch(`/stock/vehicles/${id}/status`, { status })
    },

    delete(id) {
      return api.$delete(`/stock/vehicles/${id}`)
    }
  }

  // Events API
  const events = {
    create(data) {
      return api.$post('/events', data)
    },

    getAll(params = {}) {
      return api.$get('/events', { params })
    },

    getById(id) {
      return api.$get(`/events/${id}`)
    },

    update(id, data) {
      return api.$patch(`/events/${id}`, data)
    },

    delete(id) {
      return api.$delete(`/events/${id}`)
    },

    getStats() {
      return api.$get('/events/stats')
    },

    getOverdue() {
      return api.$get('/events/overdue')
    },

    bookVehicles(eventId, vehicleIds) {
      return api.$post(`/events/${eventId}/book-vehicles`, { vehicle_ids: vehicleIds })
    },

    returnVehicles(eventId, vehicleIds = null) {
      return api.$post(`/events/${eventId}/return-vehicles`, vehicleIds ? { vehicle_ids: vehicleIds } : {})
    },

    extendEvent(eventId, days) {
      return api.$patch(`/events/${eventId}/extend`, { extend_days: days })
    },

    autoReturnOverdue() {
      return api.$post('/events/auto-return')
    }
  }

  // Inject structured API with methods
  inject('api', {
    // Keep raw axios instance for backwards compatibility
    _axios: api,
    // API modules
    testDrives,
    stock,
    events
  })
}
