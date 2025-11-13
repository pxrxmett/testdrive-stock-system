<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-3xl mx-auto">
      <!-- Page Header -->
      <div class="mb-8">
        <NuxtLink
          to="/admin/staff"
          class="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-2 mb-4"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>กลับไปหน้ารายการ</span>
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900">เพิ่มพนักงานใหม่</h1>
        <p class="text-sm text-gray-600 mt-1">กรอกข้อมูลพนักงานที่ต้องการเพิ่มเข้าสู่ระบบ</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <!-- Brand Selection -->
        <div class="mb-6">
          <BrandSelector
            v-model="form.brandCode"
            label="แบรนด์"
            required
            :error="errors.brandCode"
            hint="เลือกแบรนด์ที่พนักงานสังกัด"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Employee Code -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              รหัสพนักงาน <span class="text-[#D52B1E]">*</span>
            </label>
            <input
              v-model="form.employeeCode"
              type="text"
              required
              placeholder="เช่น ISZ001, BYD001"
              :class="inputClasses('employeeCode')"
            >
            <p v-if="errors.employeeCode" class="mt-1 text-xs text-[#D52B1E]">{{ errors.employeeCode }}</p>
          </div>

          <!-- Role -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ตำแหน่ง <span class="text-[#D52B1E]">*</span>
            </label>
            <select
              v-model="form.role"
              required
              :class="inputClasses('role')"
            >
              <option value="">-- เลือกตำแหน่ง --</option>
              <option value="admin">ผู้ดูแลระบบ</option>
              <option value="manager">ผู้จัดการ</option>
              <option value="sales">พนักงานขาย</option>
            </select>
            <p v-if="errors.role" class="mt-1 text-xs text-[#D52B1E]">{{ errors.role }}</p>
          </div>
        </div>

        <!-- Full Name -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ชื่อ-นามสกุล (ไทย) <span class="text-[#D52B1E]">*</span>
          </label>
          <input
            v-model="form.fullName"
            type="text"
            required
            placeholder="เช่น สมชาย ใจดี"
            :class="inputClasses('fullName')"
          >
          <p v-if="errors.fullName" class="mt-1 text-xs text-[#D52B1E]">{{ errors.fullName }}</p>
        </div>

        <!-- Full Name EN -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ชื่อ-นามสกุล (อังกฤษ)
          </label>
          <input
            v-model="form.fullNameEn"
            type="text"
            placeholder="เช่น Somchai Jaidee"
            :class="inputClasses('fullNameEn')"
          >
          <p class="mt-1 text-xs text-gray-500">ไม่จำเป็นต้องกรอก</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              อีเมล <span class="text-[#D52B1E]">*</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="example@noknguekotto.com"
              :class="inputClasses('email')"
            >
            <p v-if="errors.email" class="mt-1 text-xs text-[#D52B1E]">{{ errors.email }}</p>
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              เบอร์โทรศัพท์ <span class="text-[#D52B1E]">*</span>
            </label>
            <input
              v-model="form.phone"
              type="tel"
              required
              placeholder="0812345678"
              :class="inputClasses('phone')"
            >
            <p v-if="errors.phone" class="mt-1 text-xs text-[#D52B1E]">{{ errors.phone }}</p>
          </div>
        </div>

        <!-- Status -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            สถานะ
          </label>
          <select
            v-model="form.status"
            :class="inputClasses('status')"
          >
            <option value="active">ใช้งานอยู่</option>
            <option value="inactive">ไม่ใช้งาน</option>
            <option value="on_leave">ลาพัก</option>
          </select>
        </div>

        <!-- Buttons -->
        <div class="mt-8 flex space-x-3">
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
    </div>
  </div>
</template>

<script>
import { formatStaffForAPI } from '~/utils/brand'

export default {
  name: 'AdminStaffCreatePage',
  layout: 'dashboard',
  middleware: false, // TODO: Add admin middleware
  data() {
    return {
      form: {
        brandCode: '',
        employeeCode: '',
        fullName: '',
        fullNameEn: '',
        email: '',
        phone: '',
        role: 'sales',
        status: 'active'
      },
      errors: {},
      submitting: false
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

      if (!this.form.brandCode) {
        this.errors.brandCode = 'กรุณาเลือกแบรนด์'
      }
      if (!this.form.employeeCode) {
        this.errors.employeeCode = 'กรุณากรอกรหัสพนักงาน'
      }
      if (!this.form.fullName) {
        this.errors.fullName = 'กรุณากรอกชื่อ-นามสกุล'
      }
      if (!this.form.email) {
        this.errors.email = 'กรุณากรอกอีเมล'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        this.errors.email = 'รูปแบบอีเมลไม่ถูกต้อง'
      }
      if (!this.form.phone) {
        this.errors.phone = 'กรุณากรอกเบอร์โทรศัพท์'
      }
      if (!this.form.role) {
        this.errors.role = 'กรุณาเลือกตำแหน่ง'
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
        const data = formatStaffForAPI(this.form)

        await this.$api.staffs.create(brandCode, data)

        this.$toast.success('เพิ่มพนักงานเรียบร้อยแล้ว')
        this.$router.push('/admin/staff')

      } catch (error) {
        console.error('Error creating staff:', error)

        if (error.response?.status === 400) {
          // Validation errors from backend
          const serverErrors = error.response.data?.errors || {}
          this.errors = { ...this.errors, ...serverErrors }
          this.$toast.error(error.response.data?.message || 'ข้อมูลไม่ถูกต้อง')
        } else if (error.response?.status === 409) {
          this.$toast.error('รหัสพนักงานหรืออีเมลนี้มีอยู่ในระบบแล้ว')
        } else {
          this.$toast.error('เกิดข้อผิดพลาดในการเพิ่มพนักงาน')
        }
      } finally {
        this.submitting = false
      }
    }
  },
  head() {
    return {
      title: 'เพิ่มพนักงานใหม่ - Admin Dashboard'
    }
  }
}
</script>
