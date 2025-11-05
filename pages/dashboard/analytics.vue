<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">รายงานและสถิติ</h1>
        <p class="text-gray-600">ดูสถิติและรายงานการใช้งานระบบ</p>
      </div>
      <!-- Period filter buttons -->
      <div class="flex items-center space-x-2">
        <button
          @click="setPeriod(1)"
          :class="selectedPeriod === 1 ? 'btn-primary' : 'btn-secondary'"
          class="text-sm"
        >
          1 เดือน
        </button>
        <button
          @click="setPeriod(3)"
          :class="selectedPeriod === 3 ? 'btn-primary' : 'btn-secondary'"
          class="text-sm"
        >
          3 เดือน
        </button>
        <button
          @click="setPeriod(6)"
          :class="selectedPeriod === 6 ? 'btn-primary' : 'btn-secondary'"
          class="text-sm"
        >
          6 เดือน
        </button>
        <button
          @click="setPeriod(12)"
          :class="selectedPeriod === 12 ? 'btn-primary' : 'btn-secondary'"
          class="text-sm"
        >
          1 ปี
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Dashboard Stats -->
      <div v-if="dashboardStats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-6 rounded-lg border border-gray-200">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-medium text-gray-600">รถทั้งหมด</p>
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ dashboardStats.vehicles?.total || 0 }}</p>
          <p class="text-sm text-gray-500 mt-1">คัน</p>
        </div>

        <div class="bg-white p-6 rounded-lg border border-gray-200">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-medium text-gray-600">รถพร้อมใช้</p>
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ dashboardStats.vehicles?.available || 0 }}</p>
          <p class="text-sm text-gray-500 mt-1">คัน</p>
        </div>

        <div class="bg-white p-6 rounded-lg border border-gray-200">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-medium text-gray-600">อีเวนต์ทั้งหมด</p>
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ dashboardStats.events?.total || 0 }}</p>
          <p class="text-sm text-gray-500 mt-1">อีเวนต์</p>
        </div>

        <div class="bg-white p-6 rounded-lg border border-gray-200">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-medium text-gray-600">การทดลองขับ</p>
            <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ dashboardStats.testDrives?.total || 0 }}</p>
          <p class="text-sm text-gray-500 mt-1">ครั้ง</p>
        </div>
      </div>

      <!-- Vehicle Statistics -->
      <div v-if="vehicleStats" class="bg-white p-6 rounded-lg border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">สถิติรถยนต์</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600">อัตราการใช้งาน</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ vehicleStats.utilizationRate?.toFixed(1) || 0 }}%</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600">รถใช้งานอยู่</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ vehicleStats.statusSummary?.inUse || 0 }}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600">รถบำรุงรักษา</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ vehicleStats.statusSummary?.maintenance || 0 }}</p>
          </div>
        </div>
      </div>

      <!-- Event Statistics -->
      <div v-if="eventStats" class="bg-white p-6 rounded-lg border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">สถิติอีเวนต์</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600">อีเวนต์กำลังดำเนินการ</p>
            <p class="text-2xl font-bold text-blue-600 mt-1">{{ eventStats.statusSummary?.inProgress || 0 }}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600">อีเวนต์ที่เสร็จสิ้น</p>
            <p class="text-2xl font-bold text-green-600 mt-1">{{ eventStats.statusSummary?.completed || 0 }}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600">เฉลี่ยรถต่ออีเวนต์</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ eventStats.avgVehiclesPerEvent?.toFixed(1) || 0 }}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600">ระยะเวลาเฉลี่ย (วัน)</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ eventStats.avgEventDuration?.toFixed(1) || 0 }}</p>
          </div>
        </div>
      </div>

      <!-- Test Drive Statistics -->
      <div v-if="testDriveStats" class="bg-white p-6 rounded-lg border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">สถิติการทดลองขับ</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600">ทดลองขับทั้งหมด</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ testDriveStats.statusSummary?.total || 0 }}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600">เสร็จสิ้น</p>
            <p class="text-2xl font-bold text-green-600 mt-1">{{ testDriveStats.statusSummary?.completed || 0 }}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600">ถูกยกเลิก</p>
            <p class="text-2xl font-bold text-red-600 mt-1">{{ testDriveStats.statusSummary?.cancelled || 0 }}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600">อัตรายืนยัน</p>
            <p class="text-2xl font-bold text-blue-600 mt-1">{{ testDriveStats.confirmationRate?.toFixed(1) || 0 }}%</p>
          </div>
        </div>
      </div>
    </template>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <p class="text-red-800 font-medium">{{ error }}</p>
      <button @click="loadAnalytics()" class="mt-4 btn-primary">
        ลองอีกครั้ง
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Analytics',
  layout: 'dashboard',

  data() {
    return {
      selectedPeriod: 12, // months
      startDate: null,
      endDate: null,
      loading: false,
      error: null,
      dashboardStats: null,
      vehicleStats: null,
      eventStats: null,
      testDriveStats: null
    }
  },

  async mounted() {
    this.setPeriod(12) // Default to 12 months
    await this.loadAnalytics()
  },

  methods: {
    setPeriod(months) {
      this.selectedPeriod = months

      // Calculate date range
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - months)

      // Format as YYYY-MM-DD
      this.endDate = end.toISOString().split('T')[0]
      this.startDate = start.toISOString().split('T')[0]

      console.log(`📅 Period set to ${months} months:`, {
        startDate: this.startDate,
        endDate: this.endDate
      })

      this.loadAnalytics()
    },

    async loadAnalytics() {
      this.loading = true
      this.error = null

      try {
        console.log('📊 Loading analytics with date range:', {
          startDate: this.startDate,
          endDate: this.endDate
        })

        // Prepare query parameters
        const params = {}
        if (this.startDate) params.startDate = this.startDate
        if (this.endDate) params.endDate = this.endDate

        // Load each endpoint separately with individual error handling
        // This allows partial data display if some endpoints fail
        const results = await Promise.allSettled([
          this.$api.analytics.getDashboard(params).catch(e => {
            console.warn('Dashboard stats failed:', e.response?.data?.message)
            return null
          }),
          this.$api.analytics.getVehicleStatistics(params).catch(e => {
            console.warn('Vehicle stats failed:', e.response?.data?.message)
            return null
          }),
          this.$api.analytics.getEventStatistics(params).catch(e => {
            console.warn('Event stats failed:', e.response?.data?.message)
            return null
          }),
          this.$api.analytics.getTestDriveStatistics(params).catch(e => {
            console.warn('Test drive stats failed:', e.response?.data?.message)
            return null
          })
        ])

        // Extract successful results
        this.dashboardStats = results[0].status === 'fulfilled' ? results[0].value : null
        this.vehicleStats = results[1].status === 'fulfilled' ? results[1].value : null
        this.eventStats = results[2].status === 'fulfilled' ? results[2].value : null
        this.testDriveStats = results[3].status === 'fulfilled' ? results[3].value : null

        // Check if any data loaded successfully
        const hasData = this.dashboardStats || this.vehicleStats || this.eventStats || this.testDriveStats

        if (!hasData) {
          this.error = 'Backend Analytics API ยังไม่พร้อมใช้งาน (500 Internal Server Error)\n\nกรุณาติดต่อ Backend Developer เพื่อแก้ไข Analytics endpoints'
        } else {
          console.log('✅ Analytics loaded (partial):', {
            dashboard: !!this.dashboardStats,
            vehicles: !!this.vehicleStats,
            events: !!this.eventStats,
            testDrives: !!this.testDriveStats
          })
        }
      } catch (error) {
        console.error('❌ Error loading analytics:', error)
        this.error = 'Backend Analytics API มีปัญหา กรุณาติดต่อ Backend Developer'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
