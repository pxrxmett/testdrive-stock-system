<template>
  <div class="space-y-4">
    <!-- Compact Page Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2.5">
        <div class="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-[#D52B1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <h1 class="text-xl font-bold text-gray-900">สต็อครถยนต์ ISUZU</h1>
            <BrandBadge brand-code="isuzu" size="sm" />
          </div>
          <p class="text-sm text-gray-600 mt-0.5">จัดการสต็อครถยนต์ ISUZU ทุกรุ่น</p>
        </div>
      </div>
      <NuxtLink
        to="/admin/stock"
        class="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 shadow-sm transition-all duration-150"
      >
        ดูทุกแบรนด์
      </NuxtLink>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white p-6 rounded-lg border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">รถทั้งหมด</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">{{ stats.total }}</p>
          </div>
          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">พร้อมใช้</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">{{ stats.available }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">กำลังใช้งาน</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">{{ stats.inUse }}</p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-[#D52B1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">บำรุงรักษา</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">{{ stats.maintenance }}</p>
          </div>
          <div class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <LoadingSkeleton
      v-if="loading"
      variant="card"
      :count="3"
      grid
      :cols="1"
    />

    <!-- Empty State -->
    <EmptyState
      v-else-if="!loading && vehicles.length === 0"
      title="ยังไม่มีสต็อกรถยนต์"
      description="เริ่มต้นเพิ่มรถยนต์ ISUZU เข้าสู่ระบบ สต็อกจะแสดงที่นี่เมื่อมีการเพิ่มเข้ามา"
      actionLabel="เพิ่มรถใหม่"
      actionVariant="primary"
      @action="handleAddStock"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full">
          <svg class="w-8 h-8 text-[#D52B1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
        </div>
      </template>
    </EmptyState>

    <!-- Vehicle List -->
    <div v-else class="bg-white rounded-lg border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">รายการรถยนต์ ({{ vehicles.length }})</h3>
      </div>
      <div class="divide-y divide-gray-200">
        <div
          v-for="vehicle in vehicles"
          :key="vehicle.id"
          class="p-6 hover:bg-gray-50 transition-colors duration-150"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3">
                <h4 class="text-base font-semibold text-gray-900">{{ vehicle.model }}</h4>
                <span :class="getStatusBadgeClasses(vehicle.status)" class="px-2.5 py-1 text-xs font-semibold rounded-full border">
                  {{ getStatusDisplayName(vehicle.status) }}
                </span>
              </div>
              <div class="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                <span>ทะเบียน: {{ vehicle.plateNumber || 'ไม่มีทะเบียน' }}</span>
                <span>•</span>
                <span>สี: {{ vehicle.color }}</span>
                <span>•</span>
                <span>ปี: {{ vehicle.year }}</span>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <NuxtLink
                :to="`/admin/stock/${vehicle.id}`"
                class="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                ดูรายละเอียด
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatStockFromAPI } from '~/utils/brand'

export default {
  name: 'IsuzuStockPage',
  layout: 'dashboard',
  middleware: false,
  data() {
    return {
      vehicles: [],
      loading: false,
      stats: {
        total: 0,
        available: 0,
        inUse: 0,
        maintenance: 0
      }
    }
  },
  mounted() {
    this.loadStock()
  },
  methods: {
    async loadStock() {
      this.loading = true
      try {
        const response = await this.$api.stock.getAll('ISUZU', {})
        this.vehicles = (response.data || response).map(formatStockFromAPI)
        this.updateStats()
      } catch (error) {
        console.error('Error loading ISUZU stock:', error)
        console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลสต็อก')
        this.vehicles = []
      } finally {
        this.loading = false
      }
    },

    updateStats() {
      this.stats = {
        total: this.vehicles.length,
        available: this.vehicles.filter(v => v.status === 'available').length,
        inUse: this.vehicles.filter(v => v.status === 'in_use').length,
        maintenance: this.vehicles.filter(v => v.status === 'maintenance').length
      }
    },

    getStatusDisplayName(status) {
      const statusMap = {
        'available': 'พร้อมใช้',
        'in_use': 'กำลังใช้งาน',
        'maintenance': 'บำรุงรักษา',
        'locked': 'ล็อกสำหรับอีเวนต์'
      }
      return statusMap[status] || status
    },

    getStatusBadgeClasses(status) {
      const classMap = {
        'available': 'bg-green-50 text-green-700 border-green-200',
        'in_use': 'bg-red-50 text-[#B91C1C] border-red-200',
        'maintenance': 'bg-amber-50 text-amber-700 border-amber-200',
        'locked': 'bg-purple-50 text-purple-700 border-purple-200'
      }
      return classMap[status] || 'bg-gray-50 text-gray-700 border-gray-200'
    },

    handleAddStock() {
      this.$router.push('/admin/stock/create?brand=isuzu')
    }
  },
  head() {
    return {
      title: 'สต็อครถยนต์ ISUZU - ISUZU Queue System'
    }
  }
}
</script>
