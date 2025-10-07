export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  // ใช้ $fetch แทน axios
  const api = {
    async get(url, options = {}) {
      return await $fetch(url, {
        baseURL: config.public.apiBaseUrl,
        method: 'GET',
        ...options
      })
    },
    
    async post(url, body, options = {}) {
      return await $fetch(url, {
        baseURL: config.public.apiBaseUrl,
        method: 'POST',
        body,
        ...options
      })
    },
    
    async patch(url, body, options = {}) {
      return await $fetch(url, {
        baseURL: config.public.apiBaseUrl,
        method: 'PATCH',
        body,
        ...options
      })
    },
    
    async delete(url, options = {}) {
      return await $fetch(url, {
        baseURL: config.public.apiBaseUrl,
        method: 'DELETE',
        ...options
      })
    }
  }

  // Test Drive API
  const testDrives = {
    create(data) {
      return api.post('/test-drives', data)
    },
    
    getAll(params = {}) {
      return api.get('/test-drives', { params })
    },
    
    getById(id) {
      return api.get(`/test-drives/${id}`)
    },
    
    update(id, data) {
      return api.patch(`/test-drives/${id}`, data)
    },
    
    delete(id) {
      return api.delete(`/test-drives/${id}`)
    }
  }

  // Stock API
  const stock = {
    create(data) {
      return api.post('/stock', data)
    },
    
    getAll(params = {}) {
      return api.get('/stock', { params })
    },
    
    getVehicles(params = {}) {
      return api.get('/stock/vehicles', { params })
    },
    
    getById(id) {
      return api.get(`/stock/${id}`)
    },
    
    updateStatus(id, status) {
      return api.patch(`/stock/vehicles/${id}/status`, { status })
    },
    
    delete(id) {
      return api.delete(`/stock/vehicles/${id}`)
    }
  }

  return {
    provide: {
      api: {
        testDrives,
        stock
      }
    }
  }
})
