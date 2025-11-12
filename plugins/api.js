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

  // Test Drives API - Brand-based + Admin
  const testDrives = {
    // Brand-specific endpoints
    create(brandCode, data) {
      return api.$post(`/${brandCode}/test-drives`, data)
    },

    getAll(brandCode, params = {}) {
      return api.$get(`/${brandCode}/test-drives`, { params })
    },

    getById(brandCode, id) {
      return api.$get(`/${brandCode}/test-drives/${id}`)
    },

    update(brandCode, id, data) {
      return api.$patch(`/${brandCode}/test-drives/${id}`, data)
    },

    delete(brandCode, id) {
      return api.$delete(`/${brandCode}/test-drives/${id}`)
    },

    assignStaff(brandCode, id, staffId) {
      return api.$patch(`/${brandCode}/test-drives/${id}/assign`, { staffId })
    },

    // Admin cross-brand endpoints
    admin: {
      getAll(params = {}) {
        return api.$get('/admin/test-drives/all', { params })
      },

      getById(id) {
        return api.$get(`/admin/test-drives/${id}`)
      }
    },

    // Legacy endpoints (for backward compatibility)
    createLegacy(data) {
      return api.$post('/test-drives', data)
    },

    getAllLegacy(params = {}) {
      return api.$get('/test-drives', { params })
    },

    getByIdLegacy(id) {
      return api.$get(`/test-drives/${id}`)
    },

    updateLegacy(id, data) {
      return api.$patch(`/test-drives/${id}`, data)
    },

    deleteLegacy(id) {
      return api.$delete(`/test-drives/${id}`)
    }
  }

  // Stock API - Brand-based + Admin
  const stock = {
    // Brand-specific endpoints
    create(brandCode, data) {
      return api.$post(`/${brandCode}/stock`, data)
    },

    getAll(brandCode, params = {}) {
      return api.$get(`/${brandCode}/stock`, { params })
    },

    getByCode(brandCode, vehicleCode) {
      return api.$get(`/${brandCode}/stock/${vehicleCode}`)
    },

    update(brandCode, vehicleCode, data) {
      return api.$patch(`/${brandCode}/stock/${vehicleCode}`, data)
    },

    delete(brandCode, vehicleCode) {
      return api.$delete(`/${brandCode}/stock/${vehicleCode}`)
    },

    // Admin cross-brand endpoints
    admin: {
      getAll(params = {}) {
        return api.$get('/admin/stock/all', { params })
      },

      compare(params = {}) {
        return api.$get('/admin/stock/compare', { params })
      }
    },

    // Legacy endpoints (for backward compatibility)
    createLegacy(data) {
      return api.$post('/stock', data)
    },

    getAllLegacy(params = {}) {
      return api.$get('/stock', { params })
    },

    getVehicles(params = {}) {
      return api.$get('/stock/vehicles', { params })
    },

    getById(id) {
      return api.$get(`/stock/${id}`)
    },

    updateLegacy(id, data) {
      return api.$patch(`/stock/${id}`, data)
    },

    updateStatus(id, status) {
      return api.$patch(`/stock/vehicles/${id}/status`, { status })
    },

    deleteLegacy(id) {
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

  // Events API - Brand-based + Admin
  const events = {
    // Brand-specific endpoints
    create(brandCode, data) {
      return api.$post(`/${brandCode}/events`, data)
    },

    getAll(brandCode, params = {}) {
      return api.$get(`/${brandCode}/events`, { params })
    },

    getById(brandCode, id) {
      return api.$get(`/${brandCode}/events/${id}`)
    },

    update(brandCode, id, data) {
      return api.$patch(`/${brandCode}/events/${id}`, data)
    },

    delete(brandCode, id) {
      return api.$delete(`/${brandCode}/events/${id}`)
    },

    // Admin cross-brand endpoints
    admin: {
      getAll(params = {}) {
        return api.$get('/admin/events/all', { params })
      },

      getById(id) {
        return api.$get(`/admin/events/${id}`)
      }
    },

    // Legacy endpoints (for backward compatibility)
    createLegacy(data) {
      return api.$post('/events', data)
    },

    getAllLegacy(params = {}) {
      return api.$get('/events', { params })
    },

    getByIdLegacy(id) {
      return api.$get(`/events/${id}`)
    },

    updateLegacy(id, data) {
      return api.$patch(`/events/${id}`, data)
    },

    deleteLegacy(id) {
      return api.$delete(`/events/${id}`)
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

    // Alias for assignVehiclesBatch
    assignVehicles(eventId, data) {
      return api.$post(`/events/${eventId}/vehicles/batch`, data)
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

    changePassword(data) {
      return api.$post('/auth/change-password', data)
    },

    lineLogin(data) {
      return api.$post('/auth/line-login', data)
    }
  }

  // Staffs API - Brand-based + Admin
  const staffs = {
    // Brand-specific endpoints
    create(brandCode, data) {
      return api.$post(`/${brandCode}/staff`, data)
    },

    getAll(brandCode, params = {}) {
      return api.$get(`/${brandCode}/staff`, { params })
    },

    getById(brandCode, id) {
      return api.$get(`/${brandCode}/staff/${id}`)
    },

    update(brandCode, id, data) {
      return api.$patch(`/${brandCode}/staff/${id}`, data)
    },

    delete(brandCode, id) {
      return api.$delete(`/${brandCode}/staff/${id}`)
    },

    getAvailableSales(brandCode) {
      return api.$get(`/${brandCode}/staff/available-sales`)
    },

    // Admin cross-brand endpoints
    admin: {
      getAll(params = {}) {
        return api.$get('/admin/staff/all', { params })
      },

      getById(id) {
        return api.$get(`/admin/staff/${id}`)
      },

      getPerformance(params = {}) {
        return api.$get('/admin/staff/performance', { params })
      }
    },

    // Legacy endpoint (for backward compatibility)
    getAllLegacy(params = {}) {
      return api.$get('/staffs', { params })
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

  // Users API
  const users = {
    getProfile() {
      return api.$get('/users/profile')
    },

    updateProfile(data) {
      return api.$patch('/users/profile', data)
    },

    getSettings() {
      return api.$get('/users/settings')
    },

    updateNotificationSettings(data) {
      return api.$patch('/users/settings/notifications', data)
    },

    updateSystemSettings(data) {
      return api.$patch('/users/settings/system', data)
    }
  }

  // Analytics API
  const analytics = {
    getDashboard(params = {}) {
      return api.$get('/analytics/dashboard', { params })
    },

    getVehicleStatistics(params = {}) {
      return api.$get('/analytics/vehicles/statistics', { params })
    },

    getEventStatistics(params = {}) {
      return api.$get('/analytics/events/statistics', { params })
    },

    getTestDriveStatistics(params = {}) {
      return api.$get('/analytics/test-drives/statistics', { params })
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
    lineIntegration,
    users,
    analytics
  })
}
