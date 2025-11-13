<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button
          @click="$router.back()"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">รายละเอียดรถ</h1>
          <p class="text-sm text-gray-600">รหัส: {{ vehicleId }}</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="editVehicle"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>แก้ไข</span>
        </button>
        <button
          @click="deleteVehicle"
          class="px-4 py-2 bg-[#D52B1E] hover:bg-[#B91C1C] text-white rounded-lg font-medium transition-colors"
        >
          ลบรถ
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="text-gray-600 mt-2">กำลังโหลดข้อมูล...</p>
    </div>

    <!-- Content -->
    <div v-else-if="vehicle" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Info -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Status Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">ข้อมูลทั่วไป</h3>
            <span :class="getStatusClass(vehicle.status)" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
              {{ getStatusText(vehicle.status) }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-sm text-gray-500">รุ่นรถ</div>
              <div class="text-base font-medium text-gray-900 mt-1">{{ vehicle.model || 'N/A' }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">ทะเบียน</div>
              <div class="text-base font-bold text-blue-600 mt-1">{{ vehicle.plate_number || vehicle.plateNumber || 'N/A' }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">สี</div>
              <div class="text-base font-medium text-gray-900 mt-1">{{ vehicle.color || 'N/A' }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">ปี</div>
              <div class="text-base font-medium text-gray-900 mt-1">{{ vehicle.year || 'N/A' }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">ราคา</div>
              <div class="text-base font-medium text-gray-900 mt-1">
                {{ vehicle.price ? vehicle.price.toLocaleString() + ' บาท' : 'N/A' }}
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-500">สถานะ</div>
              <div class="text-base font-medium text-gray-900 mt-1">{{ getStatusText(vehicle.status) }}</div>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="vehicle.notes" class="bg-white rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">หมายเหตุ</h3>
          <p class="text-gray-700">{{ vehicle.notes }}</p>
        </div>
      </div>

      <!-- Sidebar Info -->
      <div class="space-y-6">
        <!-- Quick Info -->
        <div class="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h3 class="text-sm font-semibold text-blue-900 mb-3">ข้อมูลเพิ่มเติม</h3>
          <div class="space-y-3">
            <div>
              <div class="text-xs text-blue-600">สร้างเมื่อ</div>
              <div class="text-sm font-medium text-blue-900">{{ formatDate(vehicle.created_at || vehicle.createdAt) }}</div>
            </div>
            <div v-if="vehicle.updated_at || vehicle.updatedAt">
              <div class="text-xs text-blue-600">แก้ไขล่าสุด</div>
              <div class="text-sm font-medium text-blue-900">{{ formatDate(vehicle.updated_at || vehicle.updatedAt) }}</div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">การจัดการ</h3>
          <div class="space-y-2">
            <button
              @click="editVehicle"
              class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              แก้ไขข้อมูล
            </button>
            <button
              v-if="vehicle.status === 'available'"
              @click="updateStatus('maintenance')"
              class="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
            >
              ส่งบำรุงรักษา
            </button>
            <button
              v-if="vehicle.status === 'maintenance'"
              @click="updateStatus('available')"
              class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              พร้อมใช้งาน
            </button>
            <button
              @click="deleteVehicle"
              class="w-full px-4 py-2 bg-[#D52B1E] hover:bg-[#B91C1C] text-white rounded-lg font-medium transition-colors"
            >
              ลบรถ
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-12">
      <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">ไม่พบข้อมูลรถ</h3>
      <p class="text-gray-500">ไม่สามารถโหลดข้อมูลรถได้</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VehicleDetail',
  layout: 'dashboard',
  data() {
    return {
      vehicle: null,
      loading: false
    }
  },
  computed: {
    vehicleId() {
      return this.$route.params.id
    }
  },
  async mounted() {
    await this.fetchVehicle()
  },
  methods: {
    async fetchVehicle() {
      this.loading = true
      try {
        const response = await this.$api.stock.getById(this.vehicleId)
        this.vehicle = response?.vehicle || response || null
        console.log('✅ Fetched vehicle:', this.vehicle)
      } catch (error) {
        console.error('Error fetching vehicle:', error)
        this.$toast?.error('ไม่สามารถโหลดข้อมูลรถได้')
      } finally {
        this.loading = false
      }
    },

    getStatusText(status) {
      const statusMap = {
        'available': 'พร้อมใช้',
        'in_use': 'ใช้งาน',
        'maintenance': 'บำรุงรักษา',
        'locked': 'ล็อกสำหรับอีเวนต์',
        'unavailable': 'ไม่พร้อมใช้'
      }
      return statusMap[status] || status
    },

    getStatusClass(status) {
      switch (status) {
        case 'available':
        case 'พร้อมใช้':
          return 'text-green-700 bg-green-50'
        case 'in_use':
        case 'ใช้งาน':
          return 'text-blue-700 bg-blue-50'
        case 'maintenance':
        case 'บำรุงรักษา':
          return 'text-amber-700 bg-amber-50'
        case 'locked':
        case 'ล็อกสำหรับอีเวนต์':
          return 'text-purple-700 bg-purple-50'
        case 'unavailable':
        case 'ไม่พร้อมใช้':
          return 'text-red-700 bg-red-50'
        default:
          return 'text-gray-700 bg-gray-50'
      }
    },

    formatDate(date) {
      if (!date) return 'N/A'
      try {
        return new Date(date).toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch (e) {
        return date
      }
    },

    editVehicle() {
      this.$router.push(`/dashboard/stock/${this.vehicleId}/edit`)
    },

    async updateStatus(newStatus) {
      try {
        await this.$api.stock.updateStatus(this.vehicleId, newStatus)
        this.$toast?.success('อัปเดตสถานะเรียบร้อย')
        await this.fetchVehicle()
      } catch (error) {
        console.error('Error updating status:', error)
        this.$toast?.error('ไม่สามารถอัปเดตสถานะได้')
      }
    },

    async deleteVehicle() {
      if (!confirm(`ลบรถ ${this.vehicle.plate_number || this.vehicle.plateNumber} หรือไม่?\n\nการดำเนินการนี้ไม่สามารถย้อนกลับได้`)) {
        return
      }

      try {
        await this.$api.stock.delete(this.vehicleId)
        this.$toast?.success('ลบรถเรียบร้อยแล้ว')
        this.$router.push('/dashboard/stock')
      } catch (error) {
        console.error('Error deleting vehicle:', error)
        this.$toast?.error('ไม่สามารถลบรถได้')
      }
    }
  }
}
</script>
