<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-semibold text-gray-900">เอกสารทดลองขับ</h1>
              <p class="text-sm text-gray-600">จัดการและพิมพ์เอกสารทดลองขับรถยนต์</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="px-6 py-6 space-y-6">
      <!-- Filters -->
      <section class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">ค้นหาและกรองข้อมูล</h3>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              v-model="filters.search"
              type="text"
              placeholder="ค้นหาชื่อลูกค้า, เบอร์โทร..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              @input="loadTestDrives"
            />
          </div>

          <select
            v-model="filters.status"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            @change="loadTestDrives"
          >
            <option value="">สถานะทั้งหมด</option>
            <option value="scheduled">กำหนดการแล้ว</option>
            <option value="in_progress">กำลังทดลองขับ</option>
            <option value="completed">เสร็จสิ้น</option>
            <option value="cancelled">ยกเลิก</option>
          </select>

          <input
            v-model="filters.date"
            type="date"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            @change="loadTestDrives"
          />

          <button
            @click="clearFilters"
            class="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span class="text-sm">รีเซ็ต</span>
          </button>
        </div>
      </section>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <svg class="animate-spin h-12 w-12 text-red-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg class="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="text-lg font-medium text-red-900 mb-2">เกิดข้อผิดพลาด</h3>
        <p class="text-red-700">{{ error }}</p>
        <button @click="loadTestDrives" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          ลองอีกครั้ง
        </button>
      </div>

      <!-- Table -->
      <div v-else class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่-เวลา</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อลูกค้า</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เบอร์โทร</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รุ่นรถ</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">PDPA</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ลายเซ็น</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">การจัดการ</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="testDrive in filteredTestDrives" :key="testDrive.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDateTime(testDrive.start_time || testDrive.startTime || testDrive.scheduled_start) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ testDrive.customer_name || testDrive.customerName || '-' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ testDrive.customer_phone || testDrive.customerPhone || testDrive.phone || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ testDrive.vehicle?.model || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(testDrive.status)" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ getStatusText(testDrive.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span v-if="testDrive.pdpa_consent" class="text-green-600">
                    <svg class="w-5 h-5 inline" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </span>
                  <span v-else class="text-red-600">
                    <svg class="w-5 h-5 inline" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                    </svg>
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span v-if="testDrive.signature_data" class="text-green-600">
                    <svg class="w-5 h-5 inline" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </span>
                  <span v-else class="text-gray-400">
                    <svg class="w-5 h-5 inline" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/>
                    </svg>
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button
                    @click="viewDocument(testDrive.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    ดูเอกสาร
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredTestDrives.length === 0 && !loading" class="text-center py-12">
          <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">ไม่พบข้อมูลเอกสาร</h3>
          <p class="text-gray-600 mb-4">ยังไม่มีข้อมูลการทดลองขับในระบบ หรือลองปรับเปลี่ยนเงื่อนไขการค้นหา</p>
        </div>

        <!-- Pagination Info -->
        <div v-if="filteredTestDrives.length > 0" class="bg-white px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600">
              แสดง <span class="font-medium text-gray-900">{{ filteredTestDrives.length }}</span> รายการ
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'TestDrivesList',
  layout: 'dashboard',
  data() {
    return {
      testDrives: [],
      loading: false,
      error: null,
      filters: {
        search: '',
        status: '',
        date: ''
      }
    }
  },
  computed: {
    filteredTestDrives() {
      let filtered = this.testDrives

      // Search filter
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase()
        filtered = filtered.filter(td => {
          const name = (td.customer_name || td.customerName || '').toLowerCase()
          const phone = td.customer_phone || td.customerPhone || td.phone || ''
          return name.includes(search) || phone.includes(search)
        })
      }

      // Status filter
      if (this.filters.status) {
        filtered = filtered.filter(td => td.status === this.filters.status)
      }

      // Date filter
      if (this.filters.date) {
        filtered = filtered.filter(td => {
          const datetime = td.start_time || td.startTime || td.scheduled_start
          if (!datetime) return false
          const tdDate = new Date(datetime).toISOString().split('T')[0]
          return tdDate === this.filters.date
        })
      }

      return filtered
    }
  },
  methods: {
    async loadTestDrives() {
      this.loading = true
      this.error = null

      try {
        const response = await this.$api.testDrives.getAll()
        this.testDrives = Array.isArray(response) ? response : (response.data || [])
      } catch (error) {
        console.error('Error loading test drives:', error)
        this.error = error.response?.data?.message || 'ไม่สามารถโหลดข้อมูลได้'
        this.$toast?.error(this.error)
      } finally {
        this.loading = false
      }
    },

    clearFilters() {
      this.filters = {
        search: '',
        status: '',
        date: ''
      }
      this.loadTestDrives()
    },

    viewDocument(id) {
      this.$router.push(`/dashboard/documents/${id}`)
    },

    formatDateTime(datetime) {
      if (!datetime) return '-'
      const date = new Date(datetime)
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    getStatusClass(status) {
      const statusClasses = {
        'scheduled': 'bg-blue-100 text-blue-800',
        'in_progress': 'bg-yellow-100 text-yellow-800',
        'completed': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800'
      }
      return statusClasses[status] || 'bg-gray-100 text-gray-800'
    },

    getStatusText(status) {
      const statusTexts = {
        'scheduled': 'กำหนดการแล้ว',
        'in_progress': 'กำลังทดลองขับ',
        'completed': 'เสร็จสิ้น',
        'cancelled': 'ยกเลิก'
      }
      return statusTexts[status] || status
    }
  },

  mounted() {
    this.loadTestDrives()
  },

  head() {
    return {
      title: 'เอกสารทดลองขับ - ISUZU Enterprise System'
    }
  }
}
</script>
