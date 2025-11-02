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
          <h1 class="text-2xl font-bold text-gray-900">สร้างอีเวนต์ใหม่</h1>
          <p class="text-sm text-gray-600">กรอกข้อมูลอีเวนต์และเลือกรถที่ต้องการใช้งาน</p>
        </div>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Information Card -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">ข้อมูลพื้นฐาน</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Event Name -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ชื่ออีเวนต์ <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              maxlength="255"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="เช่น ISUZU Motor Show 2025"
            >
            <p v-if="errors.title" class="mt-1 text-xs text-red-500">{{ errors.title }}</p>
          </div>

          <!-- Location -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              สถานที่ <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.location"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="เช่น ศูนย์การค้าเซ็นทรัลเฟสติวัล เชียงใหม่"
            >
            <p v-if="errors.location" class="mt-1 text-xs text-red-500">{{ errors.location }}</p>
          </div>

          <!-- Start Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              วันเริ่มต้น <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.startDate"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
            <p v-if="errors.startDate" class="mt-1 text-xs text-red-500">{{ errors.startDate }}</p>
          </div>

          <!-- End Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              วันสิ้นสุด <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.endDate"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
            <p v-if="errors.endDate" class="mt-1 text-xs text-red-500">{{ errors.endDate }}</p>
          </div>

          <!-- Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ประเภทอีเวนต์ <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.type"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">-- เลือกประเภท --</option>
              <option value="promotion">โปรโมชั่น</option>
              <option value="motor_show">งานมอเตอร์โชว์</option>
              <option value="test_drive">งานทดลองขับ</option>
              <option value="roadshow">งานโรดโชว์</option>
              <option value="emergency">เหตุฉุกเฉิน</option>
              <option value="other">อื่นๆ</option>
            </select>
            <p v-if="errors.type" class="mt-1 text-xs text-red-500">{{ errors.type }}</p>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              สถานะ <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.status"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">-- เลือกสถานะ --</option>
              <option value="planning">วางแผน</option>
              <option value="preparing">เตรียมการ</option>
              <option value="in_progress">กำลังดำเนินการ</option>
            </select>
            <p v-if="errors.status" class="mt-1 text-xs text-red-500">{{ errors.status }}</p>
          </div>

          <!-- Description -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              รายละเอียด
            </label>
            <textarea
              v-model="form.description"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="กรอกรายละเอียดเพิ่มเติมเกี่ยวกับอีเวนต์..."
            ></textarea>
          </div>
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
          class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <svg v-if="saving" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ saving ? 'กำลังบันทึก...' : 'สร้างอีเวนต์' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'AddEvent',
  layout: 'dashboard',
  data() {
    return {
      saving: false,
      form: {
        title: '',
        location: '',
        startDate: '',
        endDate: '',
        type: '',
        status: 'planning',
        description: ''
      },
      errors: {}
    }
  },
  methods: {
    validateForm() {
      this.errors = {}

      // Required fields
      if (!this.form.title || this.form.title.trim().length === 0) {
        this.errors.title = 'กรุณากรอกชื่ออีเวนต์'
      } else if (this.form.title.length > 255) {
        this.errors.title = 'ชื่ออีเวนต์ต้องไม่เกิน 255 ตัวอักษร'
      }

      if (!this.form.location || this.form.location.trim().length === 0) {
        this.errors.location = 'กรุณากรอกสถานที่'
      }

      if (!this.form.startDate) {
        this.errors.startDate = 'กรุณาเลือกวันเริ่มต้น'
      }

      if (!this.form.endDate) {
        this.errors.endDate = 'กรุณาเลือกวันสิ้นสุด'
      }

      if (!this.form.type) {
        this.errors.type = 'กรุณาเลือกประเภทอีเวนต์'
      }

      if (!this.form.status) {
        this.errors.status = 'กรุณาเลือกสถานะ'
      }

      // Date validation
      if (this.form.startDate && this.form.endDate) {
        const start = new Date(this.form.startDate)
        const end = new Date(this.form.endDate)

        if (end < start) {
          this.errors.endDate = 'วันสิ้นสุดต้องมาหลังวันเริ่มต้น'
        }
      }

      return Object.keys(this.errors).length === 0
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        this.$toast?.error('กรุณากรอกข้อมูลให้ครบถ้วน')
        return
      }

      this.saving = true

      try {
        // Map to backend API format
        const eventData = {
          title: this.form.title.trim(),
          location: this.form.location.trim(),
          startDate: this.form.startDate + 'T00:00:00.000Z',  // ISO 8601 format
          endDate: this.form.endDate + 'T23:59:59.999Z',      // ISO 8601 format
          status: this.form.status,
          type: this.form.type,
          description: this.form.description.trim() || ''
        }

        console.log('📤 Creating event:', JSON.stringify(eventData, null, 2))

        const response = await this.$api.events.create(eventData)
        console.log('✅ Event created:', response)

        this.$toast?.success(`สร้างอีเวนต์ "${this.form.title}" เรียบร้อยแล้ว`)

        // Redirect to events list
        this.$router.push('/dashboard/events')
      } catch (error) {
        console.error('❌ Error creating event:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        })

        // Log full error response for debugging
        console.error('🔍 Full error response:', JSON.stringify(error.response?.data, null, 2))

        // Handle validation errors from backend
        if (error.response?.data?.message) {
          const messages = error.response.data.message
          if (Array.isArray(messages)) {
            console.error('📋 Validation errors:', messages)
            this.$toast?.error('Validation errors: ' + messages.join(', '))
          } else {
            this.$toast?.error(messages)
          }
        } else {
          this.$toast?.error('ไม่สามารถสร้างอีเวนต์ได้: ' + error.message)
        }
      } finally {
        this.saving = false
      }
    }
  }
}
</script>
