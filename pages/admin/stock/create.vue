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
        <h1 class="text-2xl font-bold text-gray-900">เพิ่มรถยนต์ใหม่</h1>
        <p class="text-sm text-gray-600 mt-1">กรอกข้อมูลรถยนต์เพื่อเพิ่มเข้าสู่ระบบ</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <!-- Brand Selector -->
        <div class="mb-6">
          <BrandSelector
            v-model="form.brandCode"
            label="แบรนด์"
            required
            :error="errors.brandCode"
            hint="เลือกแบรนด์ของรถยนต์"
          />
        </div>

        <!-- Basic Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- Model -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              รุ่นรถ <span class="text-red-600">*</span>
            </label>
            <input
              v-model="form.model"
              type="text"
              required
              placeholder="เช่น D-Max, MU-X, ATTO 3"
              :class="inputClasses('model')"
            >
            <p v-if="errors.model" class="mt-1 text-xs text-red-600">{{ errors.model }}</p>
          </div>

          <!-- Plate Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ทะเบียนรถ <span class="text-red-600">*</span>
            </label>
            <input
              v-model="form.plateNumber"
              type="text"
              required
              placeholder="เช่น 1กก 1234"
              :class="inputClasses('plateNumber')"
            >
            <p v-if="errors.plateNumber" class="mt-1 text-xs text-red-600">{{ errors.plateNumber }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- Color -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              สี <span class="text-red-600">*</span>
            </label>
            <input
              v-model="form.color"
              type="text"
              required
              placeholder="เช่น ขาว, ดำ, เงิน"
              :class="inputClasses('color')"
            >
            <p v-if="errors.color" class="mt-1 text-xs text-red-600">{{ errors.color }}</p>
          </div>

          <!-- Year -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ปี <span class="text-red-600">*</span>
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
            <p v-if="errors.year" class="mt-1 text-xs text-red-600">{{ errors.year }}</p>
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
            <p class="mt-1 text-xs text-gray-500">ไม่จำเป็นต้องกรอก</p>
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
            class="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-150 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {{ submitting ? 'กำลังบันทึก...' : 'บันทึก' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { formatStockForAPI } from '~/utils/brand'

export default {
  name: 'AdminStockCreatePage',
  layout: 'dashboard',
  middleware: false, // TODO: Add admin middleware
  data() {
    return {
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
  methods: {
    inputClasses(field) {
      const base = 'w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-150'
      return this.errors[field]
        ? `${base} border-red-300 focus:ring-red-500 focus:border-red-500`
        : `${base} border-gray-300 focus:ring-red-500 focus:border-red-500`
    },

    validateForm() {
      this.errors = {}

      if (!this.form.brandCode) {
        this.errors.brandCode = 'กรุณาเลือกแบรนด์'
      }
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
        this.$toast.error('กรุณาตรวจสอบข้อมูลให้ครบถ้วน')
        return
      }

      this.submitting = true
      try {
        const brandCode = this.form.brandCode
        const data = formatStockForAPI(this.form)

        await this.$api.stock.create(brandCode, data)

        this.$toast.success('เพิ่มรถยนต์เรียบร้อยแล้ว')
        this.$router.push('/admin/stock')

      } catch (error) {
        console.error('Error creating vehicle:', error)

        if (error.response?.status === 400) {
          const serverErrors = error.response.data?.errors || {}
          this.errors = { ...this.errors, ...serverErrors }
          this.$toast.error(error.response.data?.message || 'ข้อมูลไม่ถูกต้อง')
        } else if (error.response?.status === 409) {
          this.$toast.error('ทะเบียนรถนี้มีอยู่ในระบบแล้ว')
        } else {
          this.$toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
        }
      } finally {
        this.submitting = false
      }
    }
  },
  head() {
    return {
      title: 'เพิ่มรถยนต์ - Admin Dashboard'
    }
  }
}
</script>
