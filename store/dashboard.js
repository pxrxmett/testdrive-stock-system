export const state = () => ({
  searchTerm: '',
  selectedStatus: 'all',
  selectedLocation: 'all',
  selectedCarModel: 'all',
  selectedSalesRep: 'all',
  selectedCustomerType: 'all',
  dateRange: {
    start: '',
    end: ''
  },
  advancedSearchOpen: false,
  queues: [],
  loading: false,
  error: null
})

export const mutations = {
  setSearchTerm(state, term) {
    state.searchTerm = term
  },
  setSelectedStatus(state, status) {
    state.selectedStatus = status
  },
  setSelectedLocation(state, location) {
    state.selectedLocation = location
  },
  setSelectedCarModel(state, carModel) {
    state.selectedCarModel = carModel
  },
  setSelectedSalesRep(state, salesRep) {
    state.selectedSalesRep = salesRep
  },
  setSelectedCustomerType(state, customerType) {
    state.selectedCustomerType = customerType
  },
  setDateRange(state, dateRange) {
    state.dateRange = dateRange
  },
  setAdvancedSearchOpen(state, open) {
    state.advancedSearchOpen = open
  },
  clearFilters(state) {
    state.searchTerm = ''
    state.selectedStatus = 'all'
    state.selectedLocation = 'all'
    state.selectedCarModel = 'all'
    state.selectedSalesRep = 'all'
    state.selectedCustomerType = 'all'
    state.dateRange = { start: '', end: '' }
  },
  setQueues(state, queues) {
    state.queues = queues
  },
  addQueue(state, queue) {
    state.queues.unshift(queue)
  },
  updateQueue(state, { id, queue }) {
    const index = state.queues.findIndex(q => q.id === id)
    if (index !== -1) {
      state.queues.splice(index, 1, { ...queue, id })
    }
  },
  deleteQueue(state, id) {
    state.queues = state.queues.filter(q => q.id !== id)
  },
  setLoading(state, loading) {
    state.loading = loading
  },
  setError(state, error) {
    state.error = error
  }
}

export const actions = {
  async fetchQueues({ commit }) {
    try {
      commit('setLoading', true)
      commit('setError', null)

      // เรียก API จริง
      const response = await this.$api.testDrives.getAll()

      // แปลงข้อมูลจาก API ให้ตรงกับ frontend
      // Note: ตรวจสอบว่า API response มีโครงสร้างแบบไหน
      // อาจจะเป็น response.data หรือ response โดยตรง
      const apiData = Array.isArray(response) ? response : (response.data || [])

      const queues = apiData.map(item => {
        // Helper function to get value from multiple possible field names
        const getValue = (...fieldNames) => {
          for (const field of fieldNames) {
            if (field && field !== 'N/A' && field !== null && field !== undefined) {
              return field
            }
          }
          return null
        }

        // Format date and time
        const startTime = item.start_time || item.startTime || item.scheduled_start
        const formattedDate = startTime ? new Date(startTime).toLocaleDateString('th-TH') : (item.date || '-')
        const formattedTime = startTime ? new Date(startTime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : (item.timeSlot || '-')

        return {
          id: item.id,
          customerName: getValue(item.customer_name, item.customerName) || 'ไม่ระบุชื่อ',
          phone: getValue(item.customer_phone, item.customerPhone, item.phone) || 'ไม่ระบุเบอร์',
          email: getValue(item.customer_email, item.customerEmail, item.email) || '',
          carModel: getValue(item.vehicle?.model, item.vehicleModel, item.car_model) || 'ไม่ระบุรุ่นรถ',
          timeSlot: formattedTime,
          date: formattedDate,
          duration: item.duration || item.expected_duration || 60,
          status: item.status || 'scheduled',
          priority: item.priority || 'medium',
          location: getValue(item.test_route, item.location, item.test_location) || 'ไม่ระบุสถานที่',
          salesRep: getValue(item.staff_name, item.salesRep, item.sales_rep) || 'ไม่ระบุพนักงานขาย',
          leadSource: item.leadSource || item.lead_source || '',
          expectedRevenue: item.expectedRevenue || item.expected_revenue || 0,
          customerType: item.customerType || item.customer_type || 'Standard',
          notes: item.notes || '',
          createdAt: item.created_at || item.createdAt || new Date().toISOString(),
          updatedAt: item.updated_at || item.updatedAt || new Date().toISOString()
        }
      })

      commit('setQueues', queues)
    } catch (error) {
      console.error('Error fetching queues:', error)
      const errorMessage = error.response?.data?.message || error.message || 'ไม่สามารถดึงข้อมูลได้'
      commit('setError', `เกิดข้อผิดพลาด: ${errorMessage}`)

      // ไม่ต้องใช้ mock data แล้ว - แสดง error ให้ user เห็นแทน
      commit('setQueues', [])
    } finally {
      commit('setLoading', false)
    }
  },

  async createQueue({ commit }, queueData) {
    try {
      commit('setLoading', true)
      commit('setError', null)
      
      // แปลงข้อมูลให้ตรงกับ API schema
      const apiData = {
        customerName: queueData.customerName,
        phone: queueData.phone,
        email: queueData.email,
        vehicleModel: queueData.carModel,
        timeSlot: queueData.timeSlot,
        date: queueData.date,
        duration: parseInt(queueData.duration),
        location: queueData.location,
        salesRep: queueData.salesRep,
        leadSource: queueData.leadSource,
        expectedRevenue: queueData.expectedRevenue ? parseInt(queueData.expectedRevenue) : null,
        customerType: queueData.customerType,
        priority: queueData.priority,
        notes: queueData.notes
      }
      
      const response = await this.$api.testDrives.create(apiData)
      
      // แปลงกลับเป็นรูปแบบที่ frontend ใช้
      const newQueue = {
        id: response.data.id,
        customerName: response.data.customerName,
        phone: response.data.phone,
        email: response.data.email,
        carModel: response.data.vehicleModel,
        timeSlot: response.data.timeSlot,
        date: response.data.date,
        duration: response.data.duration,
        status: response.data.status,
        priority: response.data.priority,
        location: response.data.location,
        salesRep: response.data.salesRep,
        leadSource: response.data.leadSource,
        expectedRevenue: response.data.expectedRevenue,
        customerType: response.data.customerType,
        notes: response.data.notes,
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt
      }
      
      commit('addQueue', newQueue)
      return { success: true, data: newQueue }
    } catch (error) {
      console.error('Error creating queue:', error)
      const errorMessage = error.response?.data?.message || 'เกิดข้อผิดพลาดในการสร้างคิว'
      commit('setError', errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      commit('setLoading', false)
    }
  },

  async updateQueue({ commit }, { id, queueData }) {
    try {
      commit('setLoading', true)
      commit('setError', null)
      
      const apiData = {
        customerName: queueData.customerName,
        phone: queueData.phone,
        email: queueData.email,
        vehicleModel: queueData.carModel,
        timeSlot: queueData.timeSlot,
        date: queueData.date,
        duration: parseInt(queueData.duration),
        location: queueData.location,
        salesRep: queueData.salesRep,
        leadSource: queueData.leadSource,
        expectedRevenue: queueData.expectedRevenue ? parseInt(queueData.expectedRevenue) : null,
        customerType: queueData.customerType,
        priority: queueData.priority,
        notes: queueData.notes,
        status: queueData.status
      }
      
      const response = await this.$api.testDrives.update(id, apiData)
      
      const updatedQueue = {
        id: response.data.id,
        customerName: response.data.customerName,
        phone: response.data.phone,
        email: response.data.email,
        carModel: response.data.vehicleModel,
        timeSlot: response.data.timeSlot,
        date: response.data.date,
        duration: response.data.duration,
        status: response.data.status,
        priority: response.data.priority,
        location: response.data.location,
        salesRep: response.data.salesRep,
        leadSource: response.data.leadSource,
        expectedRevenue: response.data.expectedRevenue,
        customerType: response.data.customerType,
        notes: response.data.notes,
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt
      }
      
      commit('updateQueue', { id, queue: updatedQueue })
      return { success: true, data: updatedQueue }
    } catch (error) {
      console.error('Error updating queue:', error)
      const errorMessage = error.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตคิว'
      commit('setError', errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      commit('setLoading', false)
    }
  },

  async deleteQueue({ commit }, id) {
    try {
      commit('setLoading', true)
      commit('setError', null)
      
      await this.$api.testDrives.delete(id)
      commit('deleteQueue', id)
      return { success: true }
    } catch (error) {
      console.error('Error deleting queue:', error)
      const errorMessage = error.response?.data?.message || 'เกิดข้อผิดพลาดในการลบคิว'
      commit('setError', errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      commit('setLoading', false)
    }
  }

  // loadMockData ถูกลบออกแล้ว - ใช้ API จริงทั้งหมด
  // หาก API error จะแสดง error message แทนการใช้ mock data
}

export const getters = {
  filteredQueues: (state) => {
    return state.queues.filter(queue => {
      const matchesSearch = !state.searchTerm ||
        queue.customerName.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        queue.carModel.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        queue.id.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        queue.phone.includes(state.searchTerm) ||
        (queue.email && queue.email.toLowerCase().includes(state.searchTerm.toLowerCase())) ||
        (queue.salesRep && queue.salesRep.toLowerCase().includes(state.searchTerm.toLowerCase()))

      const matchesStatus = state.selectedStatus === 'all' || queue.status === state.selectedStatus
      const matchesLocation = state.selectedLocation === 'all' || queue.location === state.selectedLocation
      const matchesCarModel = state.selectedCarModel === 'all' || queue.carModel.includes(state.selectedCarModel)
      const matchesSalesRep = state.selectedSalesRep === 'all' || queue.salesRep === state.selectedSalesRep
      const matchesCustomerType = state.selectedCustomerType === 'all' || queue.customerType === state.selectedCustomerType

      let matchesDateRange = true
      if (state.dateRange.start && state.dateRange.end) {
        const queueDate = new Date(queue.date)
        const startDate = new Date(state.dateRange.start)
        const endDate = new Date(state.dateRange.end)
        matchesDateRange = queueDate >= startDate && queueDate <= endDate
      }

      return matchesSearch && matchesStatus && matchesLocation && 
             matchesCarModel && matchesSalesRep && matchesCustomerType && matchesDateRange
    }).sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.timeSlot}:00`)
      const dateB = new Date(`${b.date}T${b.timeSlot}:00`)
      return dateA - dateB
    })
  },
  
  statsData: (state, getters) => {
    const filtered = getters.filteredQueues
    return {
      total: filtered.length,
      inProgress: filtered.filter(q => q.status === 'in-progress').length,
      scheduled: filtered.filter(q => q.status === 'scheduled').length,
      completed: filtered.filter(q => q.status === 'completed').length,
      cancelled: filtered.filter(q => q.status === 'cancelled').length
    }
  },

  getQueueById: (state) => (id) => {
    return state.queues.find(queue => queue.id === id)
  }
}
