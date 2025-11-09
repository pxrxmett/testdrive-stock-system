<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold mb-2">ยินดีต้อนรับสู่ระบบจัดการคิว Multi-Brand</h1>
          <p class="text-blue-100">จัดการคิวทดลองขับ ISUZU และ BYD ได้อย่างมีประสิทธิภาพ</p>
        </div>
        <div class="hidden md:flex items-center space-x-4">
          <div class="text-center">
            <div class="text-3xl mb-1">🚗</div>
            <div class="text-xs text-blue-200">ISUZU</div>
          </div>
          <div class="text-2xl text-blue-200">+</div>
          <div class="text-center">
            <div class="text-3xl mb-1">⚡</div>
            <div class="text-xs text-blue-200">BYD</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Brand Statistics Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- ISUZU Card -->
      <div class="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <span class="text-2xl">🚗</span>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900">ISUZU รถยนต์</h3>
              <p class="text-sm text-gray-600">รถกระบะ, รถบรรทุก, PPV</p>
            </div>
          </div>
          <nuxt-link
            to="/dashboard/isuzu/queue"
            class="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            ดูรายละเอียด →
          </nuxt-link>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">0</div>
            <div class="text-xs text-gray-600">คิวทั้งหมด</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">0</div>
            <div class="text-xs text-gray-600">สต็อกรถ</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">0</div>
            <div class="text-xs text-gray-600">พนักงาน</div>
          </div>
        </div>
      </div>

      <!-- BYD Card -->
      <div class="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <span class="text-2xl">⚡</span>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900">BYD รถไฟฟ้า</h3>
              <p class="text-sm text-gray-600">รถยนต์ไฟฟ้า 100%</p>
            </div>
          </div>
          <nuxt-link
            to="/dashboard/byd/queue"
            class="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            ดูรายละเอียด →
          </nuxt-link>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">0</div>
            <div class="text-xs text-gray-600">คิวทั้งหมด</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">0</div>
            <div class="text-xs text-gray-600">สต็อกรถ</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">0</div>
            <div class="text-xs text-gray-600">พนักงาน</div>
          </div>
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
