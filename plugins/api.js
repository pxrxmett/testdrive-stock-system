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

    // ✅ PDPA consent - ตาม API Spec
    submitPdpaConsent(brandCode, id, data) {
      return api.$post(`/${brandCode}/test-drives/${id}/pdpa-consent`, data)
    },

    // ✅ Signature - ตาม API Spec
    submitSignature(brandCode, id, data) {
      return api.$post(`/${brandCode}/test-drives/${id}/signature`, data)
    },

    // Admin cross-brand endpoints
    admin: {
      getAll(params = {}) {
        return api.$get('/admin/test-drives/all', { params })
      },

      getById(id) {
        return api.$get(`/admin/test-drives/${id}`)
      },

      // ✅ Export report - ตาม API Spec
      export(params = {}) {
        return api.$get('/admin/test-drives/export', { params })
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
    },

    submitPdpaConsentLegacy(id, data) {
      return api.$post(`/test-drives/${id}/pdpa-consent`, data)
    },

    submitSignatureLegacy(id, data) {
      return api.$post(`/test-drives/${id}/signature`, data)
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

    // ✅ แก้ไขตาม API Spec: DELETE /api/{brandCode}/stock/vehicles/{id}
    delete(brandCode, vehicleCode) {
      return api.$delete(`/${brandCode}/stock/vehicles/${vehicleCode}`)
    },

    updateStatus(brandCode, id, status) {
      return api.$patch(`/${brandCode}/stock/vehicles/${id}/status`, { status })
    },

    // Bulk upload from Excel file (brand-specific)
    upload(brandCode, file, data) {
      const formData = new FormData()
      formData.append('file', file)
      if (data) {
        Object.keys(data).forEach(key => {
          formData.append(key, data[key])
        })
      }
      return api.$post(`/${brandCode}/stock/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },

    // Admin cross-brand endpoints
    admin: {
      getAll(params = {}) {
        return api.$get('/admin/stock/all', { params })
      },

      getById(id) {
        return api.$get(`/admin/stock/${id}`)
      },

      getSummary(params = {}) {
        return api.$get('/admin/stock/summary', { params })
      },

      search(params = {}) {
        return api.$get('/admin/stock/search', { params })
      },

      getAnalyticsByBrand(params = {}) {
        return api.$get('/admin/stock/analytics/by-brand', { params })
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

    updateStatusLegacy(id, status) {
      return api.$patch(`/stock/vehicles/${id}/status`, { status })
    },

    deleteLegacy(id) {
      return api.$delete(`/stock/vehicles/${id}`)
    },

    // Legacy upload
    uploadLegacy(file, data) {
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

    // ✅ Calendar view (brand-specific) - ตาม API Spec
    getCalendarView(brandCode, params = {}) {
      return api.$get(`/${brandCode}/events/calendar/view`, { params })
    },

    // Vehicle management for events (brand-specific)
    assignVehicle(brandCode, eventId, vehicleData) {
      return api.$post(`/${brandCode}/events/${eventId}/vehicles`, vehicleData)
    },

    getVehicles(brandCode, eventId) {
      return api.$get(`/${brandCode}/events/${eventId}/vehicles`)
    },

    assignVehiclesBatch(brandCode, eventId, vehicleIds) {
      return api.$post(`/${brandCode}/events/${eventId}/vehicles/batch`, { vehicleIds })
    },

    unassignVehicle(brandCode, eventId, vehicleId) {
      return api.$delete(`/${brandCode}/events/${eventId}/vehicles/${vehicleId}`)
    },

    updateStatus(brandCode, eventId, status) {
      return api.$patch(`/${brandCode}/events/${eventId}/status`, { status })
    },

    // Admin cross-brand endpoints
    admin: {
      getAll(params = {}) {
        return api.$get('/admin/events/all', { params })
      },

      getById(id) {
        return api.$get(`/admin/events/${id}`)
      },

      create(data) {
        return api.$post('/admin/events', data)
      },

      update(id, data) {
        return api.$patch(`/admin/events/${id}`, data)
      },

      delete(id) {
        return api.$delete(`/admin/events/${id}`)
      },

      // ✅ Calendar view (cross-brand) - ตาม API Spec
      getCalendarView(params = {}) {
        return api.$get('/admin/events/calendar/view', { params })
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

    // Legacy vehicle management
    assignVehicleLegacy(eventId, vehicleData) {
      return api.$post(`/events/${eventId}/vehicles`, vehicleData)
    },

    getVehiclesLegacy(eventId) {
      return api.$get(`/events/${eventId}/vehicles`)
    },

    assignVehiclesBatchLegacy(eventId, vehicleIds) {
      return api.$post(`/events/${eventId}/vehicles/batch`, { vehicleIds })
    },

    unassignVehicleLegacy(eventId, vehicleId) {
      return api.$delete(`/events/${eventId}/vehicles/${vehicleId}`)
    },

    updateStatusLegacy(eventId, status) {
      return api.$patch(`/events/${eventId}/status`, { status })
    },

    getCalendarViewLegacy(params = {}) {
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

  // ✅ Brands API - ตาม API Spec
  const brands = {
    getAll() {
      return api.$get('/brands')
    },

    getById(id) {
      return api.$get(`/brands/${id}`)
    },

    getByCode(code) {
      return api.$get(`/brands/code/${code}`)
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
    analytics,
    brands
  })
}
