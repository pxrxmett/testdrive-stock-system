<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold mb-2">ยินดีต้อนรับสู่ระบบจัดการคิว ISUZU</h1>
          <p class="text-red-100">จัดการคิวทดลองขับและติดตามสถิติได้อย่างมีประสิทธิภาพ</p>
        </div>
        <div class="hidden md:block">
          <svg class="w-16 h-16 text-red-200" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <nuxt-link 
        to="/dashboard/queue" 
        class="card p-6 hover:shadow-md transition-shadow cursor-pointer group"
      >
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <Icon name="list" icon-class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">จัดการคิว</h3>
            <p class="text-sm text-gray-600">จัดการคิวทดลองขับรถยนต์</p>
          </div>
        </div>
      </nuxt-link>

      <nuxt-link 
        to="/dashboard/analytics" 
        class="card p-6 hover:shadow-md transition-shadow cursor-pointer group"
      >
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
            <Icon name="chart" icon-class="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">รายงาน</h3>
            <p class="text-sm text-gray-600">ดูสถิติและรายงาน</p>
          </div>
        </div>
      </nuxt-link>

      <nuxt-link 
        to="/dashboard/calendar" 
        class="card p-6 hover:shadow-md transition-shadow cursor-pointer group"
      >
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
            <Icon name="calendar" icon-class="w-6 h-6 text-purple-600" />
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
  async mounted() {
    if (this.$store) {
      await this.$store.dispatch('dashboard/fetchQueues')
    }
  }
}
</script>
