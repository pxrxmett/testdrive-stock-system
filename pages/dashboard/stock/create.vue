<template>
  <div class="space-y-6">
    <!-- Page Header -->
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
          <h1 class="text-2xl font-bold text-gray-900">เพิ่มรถใหม่</h1>
          <p class="text-sm text-gray-600">กรอกข้อมูลรถยนต์เพื่อเพิ่มเข้าสู่ระบบ</p>
        </div>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Basic Information Card -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">ข้อมูลพื้นฐาน</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              รุ่นรถ <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.model"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E]"
            >
              <option value="">-- เลือกรุ่นรถ --</option>
              <option v-for="model in vehicleModels" :key="model" :value="model">
                {{ model }}
              </option>
            </select>
            <p v-if="errors.model" class="mt-1 text-xs text-red-500">{{ errors.model }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ทะเบียน <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.plateNumber"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E]"
              placeholder="เช่น 1กก 1234"
              @blur="checkPlateNumberUnique"
            >
            <p v-if="errors.plateNumber" class="mt-1 text-xs text-red-500">{{ errors.plateNumber }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              สี
            </label>
            <select
              v-model="form.color"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E]"
            >
              <option value="">-- เลือกสี --</option>
              <option v-for="color in colors" :key="color" :value="color">
                {{ color }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ปี
            </label>
            <input
              v-model.number="form.year"
              type="number"
              min="2000"
              max="2025"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E]"
              placeholder="เช่น 2024"
            >
            <p v-if="errors.year" class="mt-1 text-xs text-red-500">{{ errors.year }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ราคา (บาท)
            </label>
            <input
              v-model.number="form.price"
              type="number"
              min="0"
              step="1000"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E]"
              placeholder="เช่น 850000"
            >
            <p v-if="errors.price" class="mt-1 text-xs text-red-500">{{ errors.price }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              สถานะ
            </label>
            <select
              v-model="form.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E]"
            >
              <option value="available">Available (พร้อมใช้)</option>
              <option value="test_drive">Test Drive (ทดลองขับ)</option>
              <option value="sold">Sold (ขายแล้ว)</option>
              <option value="maintenance">Maintenance (ซ่อมบำรุง)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Additional Information Card -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">ข้อมูลเพิ่มเติม</h2>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            หมายเหตุ
          </label>
          <textarea
            v-model="form.notes"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E]"
            placeholder="กรอกหมายเหตุเพิ่มเติม..."
          ></textarea>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end space-x-3">
        <button
          type="button"
          @click="$router.back()"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          :disabled="saving"
          class="px-6 py-2 bg-[#D52B1E] hover:bg-[#B91C1C] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <svg v-if="saving" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ saving ? 'กำลังบันทึก...' : 'บันทึก' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CreateVehicle',
  layout: 'dashboard',
  data() {
    return {
      saving: false,
      form: {
        model: '',
        plateNumber: '',
        color: '',
        year: new Date().getFullYear(),
        price: null,
        status: 'available',
        notes: ''
      },
      errors: {},
      vehicleModels: [
        'D-Max',
        'D-Max Spark',
        'MU-X',
        'V-Cross',
        'Hi-Lander',
        'Spacecab'
      ],
      colors: [
        'ขาว',
        'เงิน',
        'ดำ',
        'เทา',
        'แดง',
        'น้ำเงิน',
        'เขียว',
        'ทอง',
        'น้ำตาล'
      ]
    }
  },
  methods: {
    async checkPlateNumberUnique() {
      if (!this.form.plateNumber) return

      try {
        // Check if plate number already exists
        const response = await this.$api.stock.getAll({ plateNumber: this.form.plateNumber })
        const vehicles = response?.vehicles || response || []

        if (vehicles.length > 0) {
          this.errors.plateNumber = 'ทะเบียนนี้มีอยู่ในระบบแล้ว'
        } else {
          delete this.errors.plateNumber
        }
      } catch (error) {
        console.error('Error checking plate number:', error)
      }
    },

    validateForm() {
      this.errors = {}

      // Required fields
      if (!this.form.model) {
        this.errors.model = 'กรุณาเลือกรุ่นรถ'
      }
      if (!this.form.plateNumber) {
        this.errors.plateNumber = 'กรุณากรอกทะเบียน'
      }

      // Year validation
      if (this.form.year && (this.form.year < 2000 || this.form.year > 2025)) {
        this.errors.year = 'ปีต้องอยู่ระหว่าง 2000-2025'
      }

      // Price validation
      if (this.form.price && this.form.price < 0) {
        this.errors.price = 'ราคาต้องเป็นจำนวนบวก'
      }

      return Object.keys(this.errors).length === 0
    },

    async submitForm() {
      if (!this.validateForm()) {
        this.$toast?.error('กรุณากรอกข้อมูลให้ครบถ้วน')
        return
      }

      this.saving = true

      try {
        // Map form data to API format
        const vehicleData = {
          model: this.form.model,
          plate_number: this.form.plateNumber,
          color: this.form.color || null,
          year: this.form.year || null,
          price: this.form.price || null,
          status: this.form.status,
          notes: this.form.notes || null
        }

        console.log('📤 Creating vehicle with data:', JSON.stringify(vehicleData, null, 2))

        // Use correct API endpoint: POST /api/stock
        const response = await this.$api.stock.create(vehicleData)
        console.log('✅ Vehicle created successfully:', response)

        this.$toast?.success('เพิ่มรถเรียบร้อยแล้ว')
        this.$router.push('/dashboard/stock')
      } catch (error) {
        console.error('❌ Error creating vehicle:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        })

        const errorMessage = error.response?.data?.message
          || error.response?.data?.error
          || error.message
          || 'ไม่สามารถเพิ่มรถได้'

        this.$toast?.error(`เกิดข้อผิดพลาด: ${errorMessage}`)
      } finally {
        this.saving = false
      }
    }
  }
}
</script>
