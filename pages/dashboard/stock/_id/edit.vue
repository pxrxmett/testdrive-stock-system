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
          <h1 class="text-2xl font-bold text-gray-900">แก้ไขข้อมูลรถ</h1>
          <p class="text-sm text-gray-600">รหัส: {{ vehicleId }}</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#D52B1E]"></div>
      <p class="text-gray-600 mt-2">กำลังโหลดข้อมูล...</p>
    </div>

    <!-- Edit Form -->
    <form v-else-if="formData" @submit.prevent="updateVehicle" class="space-y-6">
      <!-- Main Info Card -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">ข้อมูลทั่วไป</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Model -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              รุ่นรถ <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.model"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E]"
              placeholder="เช่น D-MAX, MU-X"
            />
          </div>

          <!-- Plate Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ทะเบียนรถ <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.plate_number"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E]"
              placeholder="เช่น กก-1234"
            />
          </div>

          <!-- Color -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              สี <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.color"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E]"
              placeholder="เช่น ขาว, ดำ, เงิน"
            />
          </div>

          <!-- Year -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ปี <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="formData.year"
              type="number"
              required
              min="2000"
              max="2030"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E]"
              placeholder="เช่น 2024"
            />
          </div>

          <!-- Price -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ราคา (บาท)
            </label>
            <input
              v-model.number="formData.price"
              type="number"
              min="0"
              step="1000"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E]"
              placeholder="เช่น 850000"
            />
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              สถานะ <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.status"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E]"
            >
              <option value="">-- เลือกสถานะ --</option>
              <option value="available">พร้อมใช้</option>
              <option value="in_use">ใช้งาน</option>
              <option value="maintenance">บำรุงรักษา</option>
              <option value="locked">ล็อกสำหรับอีเวนต์</option>
              <option value="unavailable">ไม่พร้อมใช้</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Technical Info Card -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">ข้อมูลทางเทคนิค</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- VIN -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              VIN (หมายเลขตัวถัง)
            </label>
            <input
              v-model="formData.vin"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E] font-mono"
              placeholder="17 หลัก เช่น MPATFS86SJ0123456"
            />
          </div>

          <!-- Chassis Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              เลขตัวรถ
            </label>
            <input
              v-model="formData.chassis_number"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E] font-mono"
              placeholder="หมายเลขตัวรถ"
            />
          </div>

          <!-- Engine Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              เลขเครื่องยนต์
            </label>
            <input
              v-model="formData.engine_number"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E] font-mono"
              placeholder="หมายเลขเครื่องยนต์"
            />
          </div>
        </div>
      </div>

      <!-- Notes Card -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">หมายเหตุ</h3>

        <textarea
          v-model="formData.notes"
          rows="4"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E]"
          placeholder="บันทึกข้อมูลเพิ่มเติม..."
        ></textarea>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-6">
        <button
          type="button"
          @click="$router.back()"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          ยกเลิก
        </button>

        <div class="flex items-center space-x-3">
          <button
            type="button"
            @click="resetForm"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            รีเซ็ต
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="px-6 py-2 bg-[#D52B1E] hover:bg-[#B91C1C] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <svg v-if="submitting" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ submitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข' }}</span>
          </button>
        </div>
      </div>
    </form>

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
  name: 'VehicleEdit',
  layout: 'dashboard',
  data() {
    return {
      formData: null,
      originalData: null,
      loading: false,
      submitting: false
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
        const vehicle = response?.vehicle || response || null

        if (vehicle) {
          // Store original data for reset
          this.originalData = { ...vehicle }

          // Initialize form data with API format
          this.formData = {
            model: vehicle.model || '',
            plate_number: vehicle.plate_number || vehicle.plateNumber || '',
            color: vehicle.color || '',
            year: vehicle.year || new Date().getFullYear(),
            price: vehicle.price || null,
            status: vehicle.status || 'available',
            vin: vehicle.vin || '',
            chassis_number: vehicle.chassis_number || vehicle.chassisNumber || '',
            engine_number: vehicle.engine_number || vehicle.engineNumber || '',
            notes: vehicle.notes || ''
          }

          console.log('✅ Loaded vehicle for editing:', this.formData)
        }
      } catch (error) {
        console.error('Error fetching vehicle:', error)
        this.$toast?.error('ไม่สามารถโหลดข้อมูลรถได้')
      } finally {
        this.loading = false
      }
    },

    async updateVehicle() {
      if (!this.formData) return

      // Validate required fields
      if (!this.formData.model || !this.formData.model.trim()) {
        this.$toast?.error('กรุณากรอกรุ่นรถ')
        return
      }

      if (!this.formData.plate_number || !this.formData.plate_number.trim()) {
        this.$toast?.error('กรุณากรอกทะเบียนรถ')
        return
      }

      if (!this.formData.color || !this.formData.color.trim()) {
        this.$toast?.error('กรุณากรอกสี')
        return
      }

      if (!this.formData.year) {
        this.$toast?.error('กรุณากรอกปี')
        return
      }

      if (!this.formData.status) {
        this.$toast?.error('กรุณาเลือกสถานะ')
        return
      }

      this.submitting = true

      try {
        // Prepare update data in API format (camelCase for Backend)
        const updateData = {
          model: this.formData.model.trim(),
          plateNumber: this.formData.plate_number.trim(),  // Changed from plate_number
          color: this.formData.color.trim(),
          year: parseInt(this.formData.year),
          price: this.formData.price ? parseInt(this.formData.price) : null,
          status: this.formData.status,
          vin: this.formData.vin?.trim() || null,
          chassisNumber: this.formData.chassis_number?.trim() || null,  // Changed from chassis_number
          engineNumber: this.formData.engine_number?.trim() || null,    // Changed from engine_number
          notes: this.formData.notes?.trim() || null
        }

        console.log('📤 Updating vehicle:', updateData)

        await this.$api.stock.update(this.vehicleId, updateData)

        this.$toast?.success('บันทึกข้อมูลเรียบร้อยแล้ว')

        // Navigate back to detail page
        this.$router.push(`/dashboard/stock/${this.vehicleId}`)
      } catch (error) {
        console.error('❌ Error updating vehicle:', error)

        let errorMessage = 'ไม่สามารถบันทึกข้อมูลได้'

        if (error.response?.data) {
          const data = error.response.data
          if (data.errors && Array.isArray(data.errors)) {
            errorMessage = data.errors.map(e => e.message || e).join(', ')
          } else if (data.message) {
            errorMessage = data.message
          } else if (data.error) {
            errorMessage = data.error
          }
        }

        this.$toast?.error(`เกิดข้อผิดพลาด: ${errorMessage}`)
      } finally {
        this.submitting = false
      }
    },

    resetForm() {
      if (confirm('รีเซ็ตฟอร์มหรือไม่? การเปลี่ยนแปลงทั้งหมดจะหายไป')) {
        this.formData = { ...this.originalData }
        this.$toast?.info('รีเซ็ตฟอร์มเรียบร้อยแล้ว')
      }
    }
  }
}
</script>

<style scoped>
/* Focus styles */
input:focus,
select:focus,
textarea:focus {
  outline: none;
}

/* Number input arrows */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  opacity: 1;
}
</style>
