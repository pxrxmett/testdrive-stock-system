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
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">แก้ไขข้อมูลพนักงาน</h1>
            <p class="text-sm text-gray-600 mt-1">แก้ไขข้อมูลพนักงาน {{ staffData ? staffData.employeeCode : '' }}</p>
          </div>
          <BrandBadge v-if="staffData" :brand-code="staffData.brandCode" size="md" />
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
        <p class="text-[#D52B1E] font-medium mb-2">ไม่พบข้อมูลพนักงาน</p>
        <p class="text-sm text-gray-500 mb-4">{{ loadError }}</p>
        <NuxtLink
          to="/admin/staff"
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

        <!-- Timestamps (Read-only) -->
        <div v-if="staffData" class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-2">สร้างเมื่อ</label>
            <div class="text-sm text-gray-600">{{ formatDate(staffData.createdAt) }}</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-2">แก้ไขล่าสุด</label>
            <div class="text-sm text-gray-600">{{ formatDate(staffData.updatedAt) }}</div>
          </div>
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
            {{ submitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { formatStaffFromAPI, formatStaffForAPI } from '~/utils/brand'

export default {
  name: 'AdminStaffEditPage',
  layout: 'dashboard',
  middleware: false, // TODO: Add admin middleware
  data() {
    return {
      staffData: null,
      loading: true,
      loadError: null,
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
  async mounted() {
    await this.loadStaffData()
  },
  methods: {
    async loadStaffData() {
      this.loading = true
      this.loadError = null

      try {
        const id = this.$route.params.id

        // Use admin endpoint to get staff regardless of brand
        const response = await this.$api.staffs.admin.getById(id)
        this.staffData = formatStaffFromAPI(response)

        // Populate form
        this.form = {
          brandCode: this.staffData.brandCode,
          employeeCode: this.staffData.employeeCode,
          fullName: this.staffData.fullName,
          fullNameEn: this.staffData.fullNameEn || '',
          email: this.staffData.email,
          phone: this.staffData.phone,
          role: this.staffData.role,
          status: this.staffData.status
        }

      } catch (error) {
        console.error('Error loading staff:', error)
        this.loadError = error.response?.status === 404
          ? 'ไม่พบข้อมูลพนักงานที่ระบุ'
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

        await this.$api.staffs.update(brandCode, this.staffData.id, data)

        this.$toast.success('บันทึกข้อมูลเรียบร้อยแล้ว')
        this.$router.push('/admin/staff')

      } catch (error) {
        console.error('Error updating staff:', error)

        if (error.response?.status === 400) {
          // Validation errors from backend
          const serverErrors = error.response.data?.errors || {}
          this.errors = { ...this.errors, ...serverErrors }
          this.$toast.error(error.response.data?.message || 'ข้อมูลไม่ถูกต้อง')
        } else if (error.response?.status === 409) {
          this.$toast.error('รหัสพนักงานหรืออีเมลนี้มีอยู่ในระบบแล้ว')
        } else if (error.response?.status === 404) {
          this.$toast.error('ไม่พบข้อมูลพนักงาน')
        } else {
          this.$toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
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
      title: 'แก้ไขพนักงาน - Admin Dashboard'
    }
  }
}
</script>
