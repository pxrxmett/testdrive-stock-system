export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
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
  }),

  getters: {
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
    
    statsData: (state) => {
      const filtered = state.filteredQueues
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
  },

  actions: {
    async fetchQueues() {
      try {
        this.loading = true
        this.error = null
        
        const { $api } = useNuxtApp()
        const response = await $api.testDrives.getAll()
        
        // แปลงข้อมูลจาก API ให้ตรงกับ frontend
        const queues = response.map(item => ({
          id: item.id,
          customerName: item.customerName,
          phone: item.phone,
          email: item.email,
          carModel: item.vehicleModel,
          timeSlot: item.timeSlot,
          date: item.date,
          duration: item.duration,
          status: item.status,
          priority: item.priority || 'medium',
          location: item.location,
          salesRep: item.salesRep,
          leadSource: item.leadSource,
          expectedRevenue: item.expectedRevenue,
          customerType: item.customerType,
          notes: item.notes,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }))
        
        this.queues = queues
      } catch (error) {
        console.error('Error fetching queues:', error)
        this.error = 'ไม่สามารถเชื่อมต่อ API ได้ กำลังใช้ข้อมูลตัวอย่าง'
        
        // ถ้า API ไม่พร้อม ใช้ mock data
        this.loadMockData()
      } finally {
        this.loading = false
      }
    },

    async createQueue(queueData) {
      try {
        this.loading = true
        this.error = null
        
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
        
        const { $api } = useNuxtApp()
        const response = await $api.testDrives.create(apiData)
        
        // แปลงกลับเป็นรูปแบบที่ frontend ใช้
        const newQueue = {
          id: response.id,
          customerName: response.customerName,
          phone: response.phone,
          email: response.email,
          carModel: response.vehicleModel,
          timeSlot: response.timeSlot,
          date: response.date,
          duration: response.duration,
          status: response.status,
          priority: response.priority,
          location: response.location,
          salesRep: response.salesRep,
          leadSource: response.leadSource,
          expectedRevenue: response.expectedRevenue,
          customerType: response.customerType,
          notes: response.notes,
          createdAt: response.createdAt,
          updatedAt: response.updatedAt
        }
        
        this.queues.unshift(newQueue)
        return { success: true, data: newQueue }
      } catch (error) {
        console.error('Error creating queue:', error)
        const errorMessage = error.data?.message || 'เกิดข้อผิดพลาดในการสร้างคิว'
        this.error = errorMessage
        return { success: false, error: errorMessage }
      } finally {
        this.loading = false
      }
    },

    loadMockData() {
      const mockData = [
        {
          id: 'TD241216001',
          customerName: 'คุณสมชาย โอดี',
          phone: '081-234-5678',
          email: 'somchai.o@gmail.com',
          carModel: 'D-MAX Blue Power 1.9 Ddi Z Hi-Lander',
          timeSlot: '09:00',
          date: '2024-12-16',
          duration: 60,
          status: 'in-progress',
          priority: 'high',
          location: 'สาขาเซ็นทรัล บางนา',
          salesRep: 'คุณจิรายุ ธนาสมบัติ',
          leadSource: 'เว็บไซต์',
          expectedRevenue: 850000,
          customerType: 'VIP',
          notes: 'ลูกค้า VIP ต้องการทดสอบในสนามทดสอบพิเศษ',
          createdAt: '2024-12-15T10:30:00.000Z',
          updatedAt: '2024-12-15T14:20:00.000Z'
        }
      ]
      
      this.queues = mockData
    }
  }
})
