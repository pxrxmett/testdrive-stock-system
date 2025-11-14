<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-3xl mx-auto">
      <!-- Page Header -->
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
        <h1 class="text-2xl font-bold text-gray-900">เพิ่มรถยนต์ใหม่</h1>
        <p class="text-sm text-gray-600 mt-1">กรอกข้อมูลรถยนต์เพื่อเพิ่มเข้าสู่ระบบหรืออัพโหลดไฟล์ Excel</p>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'form'"
              :class="[
                activeTab === 'form'
                  ? 'border-[#D52B1E] text-[#D52B1E]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              กรอกข้อมูล
            </button>
            <button
              @click="activeTab = 'upload'"
              :class="[
                activeTab === 'upload'
                  ? 'border-[#D52B1E] text-[#D52B1E]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              อัพโหลดไฟล์
            </button>
          </nav>
        </div>
      </div>

      <!-- Form Tab -->
      <form v-if="activeTab === 'form'" @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ราคา (บาท)</label>
            <input
              v-model.number="form.price"
              type="number"
              min="0"
              step="1000"
              placeholder="เช่น 850000"
              :class="inputClasses('price')"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
            <select v-model="form.status" :class="inputClasses('status')">
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
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ประเภท</label>
              <select v-model="form.type" :class="inputClasses('type')">
                <option value="">-- เลือกประเภท --</option>
                <option value="pickup">กระบะ</option>
                <option value="suv">SUV</option>
                <option value="sedan">เก๋ง</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">เชื้อเพลิง</label>
              <select v-model="form.fuelType" :class="inputClasses('fuelType')">
                <option value="">-- เลือกเชื้อเพลิง --</option>
                <option value="diesel">ดีเซล</option>
                <option value="electric">ไฟฟ้า</option>
                <option value="hybrid">ไฮบริด</option>
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">VIN (หมายเลขตัวถัง)</label>
              <input
                v-model="form.vin"
                type="text"
                placeholder="17 หลัก เช่น MPATFS86SJ0123456"
                :class="inputClasses('vin')"
                class="font-mono"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">เลขตัวรถ</label>
              <input v-model="form.chassisNumber" type="text" placeholder="หมายเลขตัวรถ" :class="inputClasses('chassisNumber')" class="font-mono">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">เลขเครื่องยนต์</label>
              <input v-model="form.engineNumber" type="text" placeholder="หมายเลขเครื่องยนต์" :class="inputClasses('engineNumber')" class="font-mono">
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">หมายเหตุ</label>
          <textarea v-model="form.notes" rows="4" placeholder="บันทึกข้อมูลเพิ่มเติม..." :class="inputClasses('notes')"></textarea>
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
            {{ submitting ? 'กำลังบันทึก...' : 'บันทึก' }}
          </button>
        </div>
      </form>

      <!-- Upload Tab -->
      <div v-if="activeTab === 'upload'" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">อัพโหลดไฟล์ Excel</h3>
          <p class="text-sm text-gray-600">อัพโหลดไฟล์ Excel (.xlsx, .xls) เพื่อเพิ่มรถยนต์หลายคันพร้อมกัน</p>
        </div>

        <!-- File Upload Area -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ไฟล์ Excel <span class="text-[#D52B1E]">*</span>
          </label>
          <div
            @drop.prevent="handleDrop"
            @dragover.prevent="dragover = true"
            @dragleave.prevent="dragover = false"
            :class="[
              'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
              dragover ? 'border-[#D52B1E] bg-red-50' : 'border-gray-300 hover:border-gray-400'
            ]"
          >
            <input
              ref="fileInput"
              type="file"
              accept=".xlsx,.xls"
              @change="handleFileSelect"
              class="hidden"
            >

            <div v-if="!selectedFile">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <p class="mt-2 text-sm text-gray-600">
                <button type="button" @click="$refs.fileInput.click()" class="text-[#D52B1E] hover:text-[#B91C1C] font-medium">
                  คลิกเพื่อเลือกไฟล์
                </button>
                หรือลากไฟล์มาวางที่นี่
              </p>
              <p class="mt-1 text-xs text-gray-500">รองรับไฟล์ .xlsx, .xls (ขนาดไม่เกิน 10MB)</p>
            </div>

            <div v-else class="flex items-center justify-center space-x-3">
              <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div class="text-left">
                <p class="text-sm font-medium text-gray-900">{{ selectedFile.name }}</p>
                <p class="text-xs text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
              </div>
              <button type="button" @click="selectedFile = null" class="text-gray-400 hover:text-red-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Download Template -->
        <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-start space-x-3">
            <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="flex-1">
              <h4 class="text-sm font-medium text-blue-900">ต้องการไฟล์ตัวอย่าง?</h4>
              <p class="text-sm text-blue-700 mt-1">
                ดาวน์โหลด
                <button type="button" class="font-medium underline hover:text-blue-900">
                  ไฟล์ Template Excel
                </button>
                เพื่อดูรูปแบบที่ถูกต้อง
              </p>
            </div>
          </div>
        </div>

        <!-- Upload Progress -->
        <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mb-6">
          <div class="flex items-center justify-between text-sm mb-2">
            <span class="font-medium text-gray-700">กำลังอัพโหลด...</span>
            <span class="text-gray-600">{{ uploadProgress }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-[#D52B1E] h-2 rounded-full transition-all duration-300"
              :style="{ width: uploadProgress + '%' }"
            ></div>
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
            type="button"
            @click="handleUpload"
            :disabled="!selectedFile || uploading"
            class="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#D52B1E] to-[#B91C1C] text-white font-medium rounded-lg hover:from-[#B91C1C] hover:to-[#991B1B] transition-all duration-150 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {{ uploading ? 'กำลังอัพโหลด...' : 'อัพโหลด' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatStockForAPI } from '~/utils/brand'

export default {
  name: 'AdminStockCreatePage',
  layout: 'dashboard',
  middleware: false,
  data() {
    return {
      activeTab: 'form',
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
      submitting: false,
      selectedFile: null,
      uploading: false,
      uploadProgress: 0,
      dragover: false
    }
  },
  methods: {
    inputClasses(field) {
      const base = 'w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-150'
      return this.errors[field]
        ? `${base} border-red-300 focus:ring-[#D52B1E] focus:border-[#D52B1E]`
        : `${base} border-gray-300 focus:ring-[#D52B1E] focus:border-[#D52B1E]`
    },

    validateForm() {
      this.errors = {}

      if (!this.form.brandCode) this.errors.brandCode = 'กรุณาเลือกแบรนด์'
      if (!this.form.model) this.errors.model = 'กรุณากรอกรุ่นรถ'
      if (!this.form.plateNumber) this.errors.plateNumber = 'กรุณากรอกทะเบียนรถ'
      if (!this.form.color) this.errors.color = 'กรุณากรอกสี'
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
        const data = formatStockForAPI(this.form)

        await this.$api.stock.create(brandCode, data)

        console.log('Success:', 'เพิ่มรถยนต์เรียบร้อยแล้ว')
        this.$router.push('/admin/stock')

      } catch (error) {
        console.error('Error creating vehicle:', error)

        if (error.response?.status === 400) {
          const serverErrors = error.response.data?.errors || {}
          this.errors = { ...this.errors, ...serverErrors }
          console.error(error.response.data?.message || 'ข้อมูลไม่ถูกต้อง')
        } else if (error.response?.status === 409) {
          console.error('ทะเบียนรถนี้มีอยู่ในระบบแล้ว')
        } else {
          console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
        }
      } finally {
        this.submitting = false
      }
    },

    handleFileSelect(event) {
      const file = event.target.files[0]
      if (file) {
        this.selectedFile = file
      }
    },

    handleDrop(event) {
      this.dragover = false
      const file = event.dataTransfer.files[0]
      if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
        this.selectedFile = file
      } else {
        console.error('กรุณาเลือกไฟล์ Excel (.xlsx, .xls)')
      }
    },

    async handleUpload() {
      if (!this.selectedFile) return

      this.uploading = true
      this.uploadProgress = 0

      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          if (this.uploadProgress < 90) {
            this.uploadProgress += 10
          }
        }, 200)

        await this.$api.stock.upload(this.selectedFile)

        clearInterval(progressInterval)
        this.uploadProgress = 100

        setTimeout(() => {
          console.log('Success:', 'อัพโหลดไฟล์เรียบร้อยแล้ว')
          this.$router.push('/admin/stock')
        }, 500)

      } catch (error) {
        console.error('Error uploading file:', error)
        console.error('เกิดข้อผิดพลาดในการอัพโหลดไฟล์')
        this.uploadProgress = 0
      } finally {
        this.uploading = false
      }
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }
  },
  head() {
    return {
      title: 'เพิ่มรถยนต์ - Admin Dashboard'
    }
  }
}
</script>
