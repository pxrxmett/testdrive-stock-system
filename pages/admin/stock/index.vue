<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">จัดการสต็อกรถยนต์ทั้งหมด</h1>
          <p class="text-sm text-gray-600 mt-1">ดูและจัดการสต็อกรถยนต์จากทุกแบรนด์</p>
        </div>
        <NuxtLink
          to="/admin/stock/create"
          class="px-4 py-2.5 bg-gradient-to-r from-[#D52B1E] to-[#B91C1C] text-white text-sm font-medium rounded-lg hover:from-[#B91C1C] hover:to-[#991B1B] transition-all duration-150 shadow-sm hover:shadow-md"
        >
          + เพิ่มรถใหม่
        </NuxtLink>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
              <div class="flex items-center mt-2">
                <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span class="text-xs text-gray-600">สถานะปกติ</span>
              </div>
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
              <div class="flex items-center mt-2">
                <div class="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                <span class="text-xs text-gray-600">ใช้งานอยู่</span>
              </div>
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
              <div class="flex items-center mt-2">
                <div class="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                <span class="text-xs text-gray-600">ซ่อมแซม</span>
              </div>
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

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <BrandFilter v-model="filters.brandCode" @change="loadStock" :show-label="false" label="แบรนด์" />
          </div>

          <div>
            <select
              v-model="filters.status"
              @change="loadStock"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">สถานะทั้งหมด</option>
              <option value="available">พร้อมใช้</option>
              <option value="in_use">กำลังใช้งาน</option>
              <option value="maintenance">บำรุงรักษา</option>
              <option value="locked">ล็อกสำหรับอีเวนต์</option>
            </select>
          </div>

          <div>
            <select
              v-model="filters.type"
              @change="loadStock"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">ประเภททั้งหมด</option>
              <option value="pickup">กระบะ</option>
              <option value="suv">SUV</option>
              <option value="sedan">เก๋ง</option>
            </select>
          </div>

          <div>
            <select
              v-model="filters.fuelType"
              @change="loadStock"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">เชื้อเพลิงทั้งหมด</option>
              <option value="diesel">ดีเซล</option>
              <option value="electric">ไฟฟ้า</option>
              <option value="hybrid">ไฮบริด</option>
            </select>
          </div>

          <div>
            <input
              v-model="filters.search"
              @input="debouncedSearch"
              type="text"
              placeholder="ค้นหา (รุ่น, ทะเบียน, VIN...)"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
          </div>
        </div>
      </div>

      <!-- Stock List -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <!-- Loading State -->
        <LoadingSkeleton
          v-if="loading"
          variant="table"
          :count="5"
        />

        <!-- Empty State -->
        <EmptyState
          v-else-if="!loading && stock.length === 0"
          title="ไม่พบสต็อกรถยนต์"
          description="ลองปรับเปลี่ยนตัวกรองหรือเพิ่มรถยนต์ใหม่เข้าสู่ระบบสต็อก"
          actionLabel="เพิ่มรถใหม่"
          actionVariant="primary"
          @action="() => $router.push('/admin/stock/create')"
        >
          <template #icon>
            <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full">
              <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </div>
          </template>
        </EmptyState>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">รหัส</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">รุ่น</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">แบรนด์</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">ทะเบียน</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">สี</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">ปี</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">สถานะ</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">จัดการ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="vehicle in stock"
                :key="vehicle.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-6 py-4">
                  <span class="text-sm font-medium text-gray-900">{{ vehicle.id }}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ vehicle.model }}</div>
                  <div v-if="vehicle.vin" class="text-xs text-gray-500 font-mono">{{ vehicle.vin }}</div>
                </td>
                <td class="px-6 py-4">
                  <BrandBadge :brand-code="vehicle.brandCode" size="sm" />
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-gray-900">{{ vehicle.plateNumber || 'ไม่มีทะเบียน' }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-gray-600">{{ vehicle.color }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-gray-600">{{ vehicle.year }}</span>
                </td>
                <td class="px-6 py-4">
                  <span :class="getStatusBadgeClasses(vehicle.status)" class="px-2.5 py-1 text-xs font-semibold rounded-full border">
                    {{ getStatusDisplayName(vehicle.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right space-x-2">
                  <NuxtLink
                    :to="`/admin/stock/${vehicle.id}`"
                    class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-150"
                  >
                    ดู
                  </NuxtLink>
                  <NuxtLink
                    :to="`/admin/stock/${vehicle.id}/edit`"
                    class="text-sm font-medium text-[#D52B1E] hover:text-[#991B1B] transition-colors duration-150"
                  >
                    แก้ไข
                  </NuxtLink>
                  <button
                    @click="confirmDelete(vehicle)"
                    class="text-sm font-medium text-[#D52B1E] hover:text-red-800 transition-colors duration-150"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div class="text-sm text-gray-600">
            แสดง {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, totalRecords) }} จาก {{ totalRecords }} รายการ
          </div>
          <div class="flex space-x-2">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ก่อนหน้า
            </button>
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="changePage(page)"
              :class="page === currentPage ? 'bg-[#D52B1E] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
              class="px-3 py-1 rounded border border-gray-300 text-sm"
            >
              {{ page }}
            </button>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatStockFromAPI } from '~/utils/brand'

export default {
  name: 'AdminStockListPage',
  layout: 'dashboard',
  middleware: false, // TODO: Add admin middleware
  data() {
    return {
      stock: [],
      loading: false,
      filters: {
        brandCode: '',
        status: '',
        type: '',
        fuelType: '',
        search: ''
      },
      stats: {
        total: 0,
        available: 0,
        inUse: 0,
        maintenance: 0
      },
      currentPage: 1,
      pageSize: 20,
      totalRecords: 0,
      totalPages: 0,
      searchTimeout: null
    }
  },
  computed: {
    visiblePages() {
      const pages = []
      const maxVisible = 5
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2))
      let end = Math.min(this.totalPages, start + maxVisible - 1)

      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    }
  },
  mounted() {
    this.loadStock()
  },
  methods: {
    async loadStock() {
      this.loading = true
      try {
        const params = {
          page: this.currentPage,
          limit: this.pageSize
        }

        // Add filters
        if (this.filters.brandCode) params.brandCode = this.filters.brandCode
        if (this.filters.status) params.status = this.filters.status
        if (this.filters.type) params.type = this.filters.type
        if (this.filters.fuelType) params.fuelType = this.filters.fuelType
        if (this.filters.search) params.search = this.filters.search

        const response = await this.$api.stock.admin.getAll(params)

        // Format stock data
        this.stock = (response.data || response).map(formatStockFromAPI)
        this.totalRecords = response.total || this.stock.length
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize)

        // Update stats
        this.updateStats()

      } catch (error) {
        console.error('Error loading stock:', error)
        console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลสต็อก')
        this.stock = []
      } finally {
        this.loading = false
      }
    },

    updateStats() {
      this.stats = {
        total: this.stock.length,
        available: this.stock.filter(v => v.status === 'available').length,
        inUse: this.stock.filter(v => v.status === 'in_use').length,
        maintenance: this.stock.filter(v => v.status === 'maintenance').length
      }
    },

    debouncedSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1
        this.loadStock()
      }, 500)
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.loadStock()
      }
    },

    getStatusDisplayName(status) {
      const statusMap = {
        'available': 'พร้อมใช้',
        'in_use': 'กำลังใช้งาน',
        'maintenance': 'บำรุงรักษา',
        'locked': 'ล็อกสำหรับอีเวนต์',
        'unavailable': 'ไม่พร้อมใช้'
      }
      return statusMap[status] || status
    },

    getStatusBadgeClasses(status) {
      const classMap = {
        'available': 'bg-green-50 text-green-700 border-green-200',
        'in_use': 'bg-red-50 text-[#B91C1C] border-red-200',
        'maintenance': 'bg-amber-50 text-amber-700 border-amber-200',
        'locked': 'bg-purple-50 text-purple-700 border-purple-200',
        'unavailable': 'bg-red-50 text-red-700 border-red-200'
      }
      return classMap[status] || 'bg-gray-50 text-gray-700 border-gray-200'
    },

    async confirmDelete(vehicle) {
      if (!confirm(`ต้องการลบรถยนต์ ${vehicle.model} (${vehicle.plateNumber || vehicle.id}) หรือไม่?`)) {
        return
      }

      try {
        await this.$api.stock.delete(vehicle.brandCode, vehicle.id)
        console.log('Success:', 'ลบรถยนต์เรียบร้อยแล้ว')
        await this.loadStock()
      } catch (error) {
        console.error('Error deleting vehicle:', error)
        console.error('เกิดข้อผิดพลาดในการลบรถยนต์')
      }
    }
  },
  head() {
    return {
      title: 'จัดการสต็อกรถยนต์ทั้งหมด - Admin Dashboard'
    }
  }
}
</script>
