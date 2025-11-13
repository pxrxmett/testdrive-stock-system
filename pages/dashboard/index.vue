<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white shadow-lg">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold mb-2">ยินดีต้อนรับสู่ระบบจัดการคิว Multi-Brand</h1>
          <p class="text-blue-100">จัดการคิวทดลองขับ ISUZU และ BYD ได้อย่างมีประสิทธิภาพ</p>
        </div>
        <div class="hidden md:flex items-center space-x-4">
          <div class="text-center">
            <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm mb-2">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 16H9m10 0h3l-3.333-5.333M21 16v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1M3 16h3m0 0 3.333-5.333M6 16v5a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1m-3-5L10 3h4l3 8M6 11h12"/>
              </svg>
            </div>
            <div class="text-xs text-blue-200 font-medium">ISUZU</div>
          </div>
          <div class="text-2xl text-blue-200">+</div>
          <div class="text-center">
            <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm mb-2">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <div class="text-xs text-blue-200 font-medium">BYD</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Brand Statistics Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- ISUZU Card -->
      <div class="bg-white border border-red-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center shadow-sm">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 16H9m10 0h3l-3.333-5.333M21 16v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1M3 16h3m0 0 3.333-5.333M6 16v5a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1m-3-5L10 3h4l3 8M6 11h12"/>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900">ISUZU รถยนต์</h3>
              <p class="text-sm text-gray-600">รถกระบะ, รถบรรทุก, PPV</p>
            </div>
          </div>
          <nuxt-link
            to="/dashboard/isuzu/queue"
            class="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1"
          >
            <span>ดูรายละเอียด</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </nuxt-link>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center p-3 bg-red-50 rounded-lg">
            <div class="text-2xl font-bold text-red-600">{{ isuzuStats.queues }}</div>
            <div class="text-xs text-gray-600 mt-1">คิวทั้งหมด</div>
          </div>
          <div class="text-center p-3 bg-red-50 rounded-lg">
            <div class="text-2xl font-bold text-red-600">{{ isuzuStats.stock }}</div>
            <div class="text-xs text-gray-600 mt-1">สต็อกรถ</div>
          </div>
          <div class="text-center p-3 bg-red-50 rounded-lg">
            <div class="text-2xl font-bold text-red-600">{{ isuzuStats.staff }}</div>
            <div class="text-xs text-gray-600 mt-1">พนักงาน</div>
          </div>
        </div>
      </div>

      <!-- BYD Card -->
      <div class="bg-white border border-green-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center shadow-sm">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900">BYD รถไฟฟ้า</h3>
              <p class="text-sm text-gray-600">รถยนต์ไฟฟ้า 100%</p>
            </div>
          </div>
          <nuxt-link
            to="/dashboard/byd/queue"
            class="px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
          >
            <span>ดูรายละเอียด</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </nuxt-link>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center p-3 bg-green-50 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ bydStats.queues }}</div>
            <div class="text-xs text-gray-600 mt-1">คิวทั้งหมด</div>
          </div>
          <div class="text-center p-3 bg-green-50 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ bydStats.stock }}</div>
            <div class="text-xs text-gray-600 mt-1">สต็อกรถ</div>
          </div>
          <div class="text-center p-3 bg-green-50 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ bydStats.staff }}</div>
            <div class="text-xs text-gray-600 mt-1">พนักงาน</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <nuxt-link
        to="/dashboard/isuzu/queue"
        class="card p-6 hover:shadow-md transition-all cursor-pointer group border-l-4 border-blue-500"
      >
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">จัดการคิว</h3>
            <p class="text-sm text-gray-600">จัดการคิวทดลองขับรถยนต์</p>
          </div>
        </div>
      </nuxt-link>

      <nuxt-link
        to="/dashboard/analytics"
        class="card p-6 hover:shadow-md transition-all cursor-pointer group border-l-4 border-green-500"
      >
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">รายงาน</h3>
            <p class="text-sm text-gray-600">ดูสถิติและรายงาน</p>
          </div>
        </div>
      </nuxt-link>

      <nuxt-link
        to="/dashboard/calendar"
        class="card p-6 hover:shadow-md transition-all cursor-pointer group border-l-4 border-purple-500"
      >
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">ปฏิทิน</h3>
            <p class="text-sm text-gray-600">ดูปฏิทินการนัดหมาย</p>
          </div>
        </div>
      </nuxt-link>
    </div>

    <!-- Quick Stats -->
    <QuickStats />

    <!-- Recent Activity -->
    <RecentActivity />
  </div>
</template>

<script>
export default {
  name: 'DashboardIndex',
  layout: 'dashboard',
  data() {
    return {
      isuzuStats: {
        queues: 0,
        stock: 0,
        staff: 0
      },
      bydStats: {
        queues: 0,
        stock: 0,
        staff: 0
      },
      loading: true
    }
  },
  async mounted() {
    await this.fetchStats()
  },
  methods: {
    async fetchStats() {
      try {
        this.loading = true

        // Fetch ISUZU stats
        if (this.$axios) {
          try {
            const isuzuQueues = await this.$axios.get('/api/queues?brand=isuzu')
            this.isuzuStats.queues = isuzuQueues.data?.length || 0
          } catch (e) {
            console.log('ISUZU queues not available')
          }

          try {
            const isuzuStock = await this.$axios.get('/api/stock?brand=isuzu')
            this.isuzuStats.stock = isuzuStock.data?.length || 0
          } catch (e) {
            console.log('ISUZU stock not available')
          }

          try {
            const isuzuStaff = await this.$axios.get('/api/staff?brand=isuzu')
            this.isuzuStats.staff = isuzuStaff.data?.length || 0
          } catch (e) {
            console.log('ISUZU staff not available')
          }

          // Fetch BYD stats
          try {
            const bydQueues = await this.$axios.get('/api/queues?brand=byd')
            this.bydStats.queues = bydQueues.data?.length || 0
          } catch (e) {
            console.log('BYD queues not available')
          }

          try {
            const bydStock = await this.$axios.get('/api/stock?brand=byd')
            this.bydStats.stock = bydStock.data?.length || 0
          } catch (e) {
            console.log('BYD stock not available')
          }

          try {
            const bydStaff = await this.$axios.get('/api/staff?brand=byd')
            this.bydStats.staff = bydStaff.data?.length || 0
          } catch (e) {
            console.log('BYD staff not available')
          }
        }

        // Dispatch to store if available
        if (this.$store) {
          await this.$store.dispatch('dashboard/fetchQueues').catch(() => {})
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
