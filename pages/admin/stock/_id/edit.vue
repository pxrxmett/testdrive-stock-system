<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-3xl mx-auto">
      <!-- Page Header -->
      <div class="mb-8">
        <NuxtLink
          to="/admin/stock"
          class="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-2 mb-4"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>กลับไปหน้ารายการ</span>
        </NuxtLink>
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">แก้ไขข้อมูลรถยนต์</h1>
            <p class="text-sm text-gray-600 mt-1">แก้ไขข้อมูลรถยนต์ {{ vehicleData ? vehicleData.plateNumber : '' }}</p>
          </div>
          <BrandBadge v-if="vehicleData" :brand-code="vehicleData.brandCode" size="md" />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <p class="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="loadError" class="bg-white rounded-lg shadow-sm border border-red-200 p-12 text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-[#D52B1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p class="text-[#D52B1E] font-medium mb-2">ไม่พบข้อมูลรถยนต์</p>
        <p class="text-sm text-gray-500 mb-4">{{ loadError }}</p>
        <NuxtLink
          to="/admin/stock"
          class="inline-block px-6 py-2 bg-[#D52B1E] text-white rounded-lg hover:bg-[#B91C1C] transition-colors"
        >
          กลับไปหน้ารายการ
        </NuxtLink>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <!-- Brand (Read-only) -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            แบรนด์
          </label>
          <div class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-600">
            <div class="flex items-center space-x-2">
              <BrandBadge :brand-code="form.brandCode" size="sm" />
              <span class="text-sm">ไม่สามารถเปลี่ยนแบรนด์ได้</span>
            </div>
          </div>
        </div>

        <!-- Basic Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- Model -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              รุ่นรถ <span class="text-[#D52B1E]">*</span>
            </label>
            <input
              v-model="form.model"
              type="text"
              required
              placeholder="เช่น D-Max, MU-X, ATTO 3"
              :class="inputClasses('model')"
            >
            <p v-if="errors.model" class="mt-1 text-xs text-[#D52B1E]">{{ errors.model }}</p>
          </div>

          <!-- Plate Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ทะเบียนรถ <span class="text-[#D52B1E]">*</span>
            </label>
            <input
              v-model="form.plateNumber"
              type="text"
              required
              placeholder="เช่น 1กก 1234"
              :class="inputClasses('plateNumber')"
            >
            <p v-if="errors.plateNumber" class="mt-1 text-xs text-[#D52B1E]">{{ errors.plateNumber }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- Color -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              สี <span class="text-[#D52B1E]">*</span>
            </label>
            <input
              v-model="form.color"
              type="text"
              required
              placeholder="เช่น ขาว, ดำ, เงิน"
              :class="inputClasses('color')"
            >
            <p v-if="errors.color" class="mt-1 text-xs text-[#D52B1E]">{{ errors.color }}</p>
          </div>

          <!-- Year -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ปี <span class="text-[#D52B1E]">*</span>
            </label>
            <input
              v-model.number="form.year"
              type="number"
              required
              min="2000"
              max="2030"
              placeholder="เช่น 2024"
              :class="inputClasses('year')"
            >
            <p v-if="errors.year" class="mt-1 text-xs text-[#D52B1E]">{{ errors.year }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- Price -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ราคา (บาท)
            </label>
            <input
              v-model.number="form.price"
              type="number"
              min="0"
              step="1000"
              placeholder="เช่น 850000"
              :class="inputClasses('price')"
            >
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              สถานะ
            </label>
            <select
              v-model="form.status"
              :class="inputClasses('status')"
            >
              <option value="available">พร้อมใช้</option>
              <option value="in_use">กำลังใช้งาน</option>
              <option value="maintenance">บำรุงรักษา</option>
              <option value="locked">ล็อกสำหรับอีเวนต์</option>
            </select>
          </div>
        </div>

        <!-- Technical Information -->
        <div class="border-t border-gray-200 pt-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">ข้อมูลทางเทคนิค</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                ประเภท
              </label>
              <select
                v-model="form.type"
                :class="inputClasses('type')"
              >
                <option value="">-- เลือกประเภท --</option>
                <option value="pickup">กระบะ</option>
                <option value="suv">SUV</option>
                <option value="sedan">เก๋ง</option>
              </select>
            </div>

            <!-- Fuel Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                เชื้อเพลิง
              </label>
              <select
                v-model="form.fuelType"
                :class="inputClasses('fuelType')"
              >
                <option value="">-- เลือกเชื้อเพลิง --</option>
                <option value="diesel">ดีเซล</option>
                <option value="electric">ไฟฟ้า</option>
                <option value="hybrid">ไฮบริด</option>
              </select>
            </div>

            <!-- VIN -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                VIN (หมายเลขตัวถัง)
              </label>
              <input
                v-model="form.vin"
                type="text"
                placeholder="17 หลัก เช่น MPATFS86SJ0123456"
                :class="inputClasses('vin')"
                class="font-mono"
              >
            </div>

            <!-- Chassis Number -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                เลขตัวรถ
              </label>
              <input
                v-model="form.chassisNumber"
                type="text"
                placeholder="หมายเลขตัวรถ"
                :class="inputClasses('chassisNumber')"
                class="font-mono"
              >
            </div>

            <!-- Engine Number -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                เลขเครื่องยนต์
              </label>
              <input
                v-model="form.engineNumber"
                type="text"
                placeholder="หมายเลขเครื่องยนต์"
                :class="inputClasses('engineNumber')"
                class="font-mono"
              >
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            หมายเหตุ
          </label>
          <textarea
            v-model="form.notes"
            rows="4"
            placeholder="บันทึกข้อมูลเพิ่มเติม..."
            :class="inputClasses('notes')"
          ></textarea>
        </div>

        <!-- Timestamps (Read-only) -->
        <div v-if="vehicleData" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-2">สร้างเมื่อ</label>
            <div class="text-sm text-gray-600">{{ formatDate(vehicleData.createdAt) }}</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-2">แก้ไขล่าสุด</label>
            <div class="text-sm text-gray-600">{{ formatDate(vehicleData.updatedAt) }}</div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex space-x-3">
          <button
            type="button"
            @click="$router.back()"
            class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-150"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#D52B1E] to-[#B91C1C] text-white font-medium rounded-lg hover:from-[#B91C1C] hover:to-[#991B1B] transition-all duration-150 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {{ submitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { formatStockFromAPI, formatStockForUpdate } from '~/utils/brand'

export default {
  name: 'AdminStockEditPage',
  layout: 'dashboard',
  middleware: false, // TODO: Add admin middleware
  data() {
    return {
      vehicleData: null,
      loading: true,
      loadError: null,
      form: {
        brandCode: '',
        model: '',
        plateNumber: '',
        color: '',
        year: new Date().getFullYear(),
        price: null,
        status: 'available',
        type: '',
        fuelType: '',
        vin: '',
        chassisNumber: '',
        engineNumber: '',
        notes: ''
      },
      errors: {},
      submitting: false
    }
  },
  async mounted() {
    await this.loadVehicleData()
  },
  methods: {
    async loadVehicleData() {
      this.loading = true
      this.loadError = null

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
            // Try BYD if ISUZU returned 404
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

        this.vehicleData = formatStockFromAPI(response)

        // Ensure brandCode is set
        if (!this.vehicleData.brandCode && brandCode) {
          this.vehicleData.brandCode = brandCode
        }

        // Populate form
        this.form = {
          brandCode: this.vehicleData.brandCode,
          model: this.vehicleData.model,
          plateNumber: this.vehicleData.plateNumber,
          color: this.vehicleData.color,
          year: this.vehicleData.year,
          price: this.vehicleData.price,
          status: this.vehicleData.status,
          type: this.vehicleData.type || '',
          fuelType: this.vehicleData.fuelType || '',
          vin: this.vehicleData.vin || '',
          chassisNumber: this.vehicleData.chassisNumber || '',
          engineNumber: this.vehicleData.engineNumber || '',
          notes: this.vehicleData.notes || ''
        }

      } catch (error) {
        console.error('Error loading vehicle:', error)
        this.loadError = error.response?.status === 404
          ? 'ไม่พบข้อมูลรถยนต์ที่ระบุ'
          : 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
      } finally {
        this.loading = false
      }
    },

    inputClasses(field) {
      const base = 'w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-150'
      return this.errors[field]
        ? `${base} border-red-300 focus:ring-[#D52B1E] focus:border-[#D52B1E]`
        : `${base} border-gray-300 focus:ring-[#D52B1E] focus:border-[#D52B1E]`
    },

    validateForm() {
      this.errors = {}

      if (!this.form.model) {
        this.errors.model = 'กรุณากรอกรุ่นรถ'
      }
      if (!this.form.plateNumber) {
        this.errors.plateNumber = 'กรุณากรอกทะเบียนรถ'
      }
      if (!this.form.color) {
        this.errors.color = 'กรุณากรอกสี'
      }
      if (!this.form.year || this.form.year < 2000 || this.form.year > 2030) {
        this.errors.year = 'กรุณากรอกปีที่ถูกต้อง (2000-2030)'
      }

      return Object.keys(this.errors).length === 0
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        console.error('กรุณาตรวจสอบข้อมูลให้ครบถ้วน')
        return
      }

      this.submitting = true
      try {
        const brandCode = this.form.brandCode
        const data = formatStockForUpdate(this.form)

        await this.$api.stock.update(brandCode, this.vehicleData.id, data)

        console.log('Success:', 'บันทึกข้อมูลเรียบร้อยแล้ว')
        this.$router.push('/admin/stock')

      } catch (error) {
        console.error('Error updating vehicle:', error)

        if (error.response?.status === 400) {
          const serverErrors = error.response.data?.errors || {}
          this.errors = { ...this.errors, ...serverErrors }
          console.error(error.response.data?.message || 'ข้อมูลไม่ถูกต้อง')
        } else if (error.response?.status === 409) {
          console.error('ทะเบียนรถนี้มีอยู่ในระบบแล้ว')
        } else if (error.response?.status === 404) {
          console.error('ไม่พบข้อมูลรถยนต์')
        } else {
          console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
        }
      } finally {
        this.submitting = false
      }
    },

    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  },
  head() {
    return {
      title: 'แก้ไขรถยนต์ - Admin Dashboard'
    }
  }
}
</script>
