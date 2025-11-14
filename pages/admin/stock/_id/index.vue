<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <NuxtLink
          to="/admin/stock"
          class="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-2 mb-4"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>กลับไปหน้ารายการ</span>
        </NuxtLink>
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">รายละเอียดรถยนต์</h1>
            <p class="text-sm text-gray-600 mt-1">ข้อมูลรถยนต์ {{ vehicle ? vehicle.plateNumber : '' }}</p>
          </div>
          <div class="flex items-center space-x-3">
            <BrandBadge v-if="vehicle" :brand-code="vehicle.brandCode" size="md" />
            <NuxtLink
              v-if="vehicle"
              :to="`/admin/stock/${vehicle.id}/edit`"
              class="px-4 py-2 bg-[#D52B1E] text-white rounded-lg hover:bg-[#B91C1C] transition-colors"
            >
              แก้ไข
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <p class="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-sm border border-red-200 p-12 text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p class="text-red-600 font-medium mb-2">ไม่พบข้อมูลรถยนต์</p>
        <p class="text-sm text-gray-500 mb-4">{{ error }}</p>
        <NuxtLink
          to="/admin/stock"
          class="inline-block px-6 py-2 bg-[#D52B1E] text-white rounded-lg hover:bg-[#B91C1C] transition-colors"
        >
          กลับไปหน้ารายการ
        </NuxtLink>
      </div>

      <!-- Content -->
      <div v-else-if="vehicle" class="space-y-6">
        <!-- Basic Info Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">ข้อมูลพื้นฐาน</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="text-sm font-medium text-gray-500">รุ่นรถ</label>
              <p class="text-base text-gray-900 mt-1">{{ vehicle.model }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">ทะเบียนรถ</label>
              <p class="text-base text-gray-900 mt-1">{{ vehicle.plateNumber || 'ไม่มีทะเบียน' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">สี</label>
              <p class="text-base text-gray-900 mt-1">{{ vehicle.color }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">ปี</label>
              <p class="text-base text-gray-900 mt-1">{{ vehicle.year }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">ราคา</label>
              <p class="text-base text-gray-900 mt-1">{{ vehicle.price ? formatNumber(vehicle.price) + ' บาท' : '-' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">สถานะ</label>
              <div class="mt-1">
                <span :class="getStatusBadgeClass(vehicle.status)" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                  {{ getStatusLabel(vehicle.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Technical Info Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">ข้อมูลทางเทคนิค</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="text-sm font-medium text-gray-500">ประเภท</label>
              <p class="text-base text-gray-900 mt-1">{{ getTypeLabel(vehicle.type) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">เชื้อเพลิง</label>
              <p class="text-base text-gray-900 mt-1">{{ getFuelTypeLabel(vehicle.fuelType) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">VIN</label>
              <p class="text-base text-gray-900 mt-1 font-mono">{{ vehicle.vin || '-' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">เลขตัวรถ</label>
              <p class="text-base text-gray-900 mt-1 font-mono">{{ vehicle.chassisNumber || '-' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">เลขเครื่องยนต์</label>
              <p class="text-base text-gray-900 mt-1 font-mono">{{ vehicle.engineNumber || '-' }}</p>
            </div>
          </div>
        </div>

        <!-- Notes Card -->
        <div v-if="vehicle.notes" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">หมายเหตุ</h2>
          <p class="text-base text-gray-700 whitespace-pre-wrap">{{ vehicle.notes }}</p>
        </div>

        <!-- Timestamps Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">ข้อมูลระบบ</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="text-sm font-medium text-gray-500">รหัสรถ</label>
              <p class="text-base text-gray-900 mt-1 font-mono">{{ vehicle.id }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">สร้างเมื่อ</label>
              <p class="text-base text-gray-900 mt-1">{{ formatDate(vehicle.createdAt) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">แก้ไขล่าสุด</label>
              <p class="text-base text-gray-900 mt-1">{{ formatDate(vehicle.updatedAt) }}</p>
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
  name: 'AdminStockDetailPage',
  layout: 'dashboard',
  middleware: false,
  data() {
    return {
      vehicle: null,
      loading: true,
      error: null
    }
  },
  async mounted() {
    await this.loadVehicle()
  },
  methods: {
    async loadVehicle() {
      this.loading = true
      this.error = null

      try {
        const id = this.$route.params.id

        // Try fetching from both brands (admin endpoint doesn't exist)
        let response = null
        let brandCode = null

        try {
          response = await this.$api.stock.getByCode('ISUZU', id)
          brandCode = 'ISUZU'
        } catch (error) {
          if (error.response?.status === 404) {
            try {
              response = await this.$api.stock.getByCode('BYD', id)
              brandCode = 'BYD'
            } catch (bydError) {
              throw bydError
            }
          } else {
            throw error
          }
        }

        this.vehicle = formatStockFromAPI(response)

        if (!this.vehicle.brandCode && brandCode) {
          this.vehicle.brandCode = brandCode
        }

      } catch (error) {
        console.error('Error loading vehicle:', error)
        this.error = error.response?.status === 404
          ? 'ไม่พบข้อมูลรถยนต์ที่ระบุ'
          : 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
      } finally {
        this.loading = false
      }
    },

    formatDate(dateString) {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    formatNumber(number) {
      return new Intl.NumberFormat('th-TH').format(number)
    },

    getStatusLabel(status) {
      const labels = {
        available: 'พร้อมใช้',
        in_use: 'กำลังใช้งาน',
        maintenance: 'บำรุงรักษา',
        locked: 'ล็อกสำหรับอีเวนต์'
      }
      return labels[status] || status
    },

    getStatusBadgeClass(status) {
      const classes = {
        available: 'bg-green-100 text-green-700 border border-green-200',
        in_use: 'bg-blue-100 text-blue-700 border border-blue-200',
        maintenance: 'bg-amber-100 text-amber-700 border border-amber-200',
        locked: 'bg-purple-100 text-purple-700 border border-purple-200'
      }
      return classes[status] || 'bg-gray-100 text-gray-700 border border-gray-200'
    },

    getTypeLabel(type) {
      const labels = {
        pickup: 'กระบะ',
        suv: 'SUV',
        sedan: 'เก๋ง'
      }
      return labels[type] || type || '-'
    },

    getFuelTypeLabel(fuelType) {
      const labels = {
        diesel: 'ดีเซล',
        electric: 'ไฟฟ้า',
        hybrid: 'ไฮบริด'
      }
      return labels[fuelType] || fuelType || '-'
    }
  }
}
</script>
