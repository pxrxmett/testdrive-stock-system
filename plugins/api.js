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
  api.setBaseURL(process.env.apiUrl || 'http://localhost:3000/api')
  // Request interceptor
  api.onRequest(config => {
    console.log('Making request to ' + config.url)
    // Add auth token if available
    const token = app.$cookies.get('auth-token')

    if (token) {
      config.headers.common['Authorization'] = `Bearer ${token}`
      console.log('✅ Auth token added to request')
    } else {
      console.log('ℹ️ No auth token found')
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

    update(id, data) {
      return api.$patch(`/stock/${id}`, data)
    },

    updateStatus(id, status) {
      return api.$patch(`/stock/vehicles/${id}/status`, { status })
    },

    delete(id) {
      return api.$delete(`/stock/vehicles/${id}`)
    },

    // Bulk upload from Excel file
    upload(file, data) {
      const formData = new FormData()
      formData.append('file', file)
      if (data) {
        Object.keys(data).forEach(key => {
          formData.append(key, data[key])
        })
      }
      return api.$post('/stock/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
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

    // Get event statistics
    getStats() {
      return api.$get('/events/stats').catch(error => {
        // If endpoint doesn't exist, return empty stats
        console.warn('Events stats endpoint not available:', error.message)
        return { data: { total: 0, active: 0, bookedVehicles: 0, upcoming: 0 } }
      })
    },

    // Vehicle management for events
    assignVehicle(eventId, vehicleData) {
      return api.$post(`/events/${eventId}/vehicles`, vehicleData)
    },

    getVehicles(eventId) {
      return api.$get(`/events/${eventId}/vehicles`)
    },

    assignVehiclesBatch(eventId, vehicleIds) {
      return api.$post(`/events/${eventId}/vehicles/batch`, { vehicleIds })
    },

    unassignVehicle(eventId, vehicleId) {
      return api.$delete(`/events/${eventId}/vehicles/${vehicleId}`)
    },

    updateStatus(eventId, status) {
      return api.$patch(`/events/${eventId}/status`, { status })
    },

    // Return vehicles from event
    returnVehicles(eventId) {
      return api.$post(`/events/${eventId}/return-vehicles`)
    },

    // Extend event duration
    extendEvent(eventId, days) {
      return api.$patch(`/events/${eventId}/extend`, { days })
    },

    // Auto return overdue vehicles
    autoReturnOverdue() {
      return api.$post('/events/auto-return-overdue')
    },

    getCalendarView(params = {}) {
      return api.$get('/events/calendar/view', { params })
    }
  }

  // Auth API
  const auth = {
    login(credentials) {
      return api.$post('/auth/login', credentials)
    },

    me() {
      return api.$get('/auth/me')
    },

    refreshToken(refreshToken) {
      return api.$post('/auth/refresh-token', { refreshToken })
    },

    lineLogin(data) {
      return api.$post('/auth/line-login', data)
    }
  }

  // Staffs API
  const staffs = {
    create(data) {
      return api.$post('/staffs', data)
    },

    getAll(params = {}) {
      return api.$get('/staffs', { params })
    },

    getById(id) {
      return api.$get(`/staffs/${id}`)
    }
  }

  // Line Integration API
  const lineIntegration = {
    check(data) {
      return api.$post('/line-integration/check', data)
    },

    link(data) {
      return api.$post('/line-integration/link', data)
    },

    getStaffInfo(id) {
      return api.$get(`/line-integration/staff/${id}`)
    }
  }

  // Inject structured API with methods
  inject('api', {
    // Keep raw axios instance for backwards compatibility
    _axios: api,
    // API modules
    auth,
    testDrives,
    stock,
    events,
    staffs,
    lineIntegration
  })
}
