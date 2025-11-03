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

          <!-- Start Time -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              เวลาเริ่มต้น <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.startTime"
              type="time"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
            <p v-if="errors.startTime" class="mt-1 text-xs text-red-500">{{ errors.startTime }}</p>
          </div>

          <!-- End Time -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              เวลาสิ้นสุด <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.endTime"
              type="time"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
            <p v-if="errors.endTime" class="mt-1 text-xs text-red-500">{{ errors.endTime }}</p>
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
              <option value="car_show">งานแสดงรถ</option>
              <option value="test_drive">ทดลองขับ</option>
              <option value="marketing">การตลาด</option>
              <option value="delivery">ส่งมอบรถ</option>
              <option value="emergency">ฉุกเฉิน</option>
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

      <!-- Vehicle Selection Card -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg font-bold text-gray-900">เลือกรถยนต์</h2>
            <p class="text-sm text-gray-600">เลือกรถที่ต้องการนำไปแสดงในอีเวนต์</p>
          </div>
          <span class="text-sm text-gray-600">
            เลือกแล้ว: <span class="font-semibold text-purple-600">{{ selectedVehicles.length }}</span> คัน
          </span>
        </div>

        <!-- Loading State -->
        <div v-if="loadingVehicles" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p class="mt-2 text-sm text-gray-600">กำลังโหลดรถยนต์...</p>
        </div>

        <!-- Vehicle List -->
        <div v-else-if="availableVehicles.length > 0" class="space-y-2 max-h-96 overflow-y-auto">
          <label
            v-for="vehicle in availableVehicles"
            :key="vehicle.id"
            class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            :class="{ 'border-purple-500 bg-purple-50': selectedVehicles.includes(vehicle.id) }"
          >
            <input
              type="checkbox"
              :value="vehicle.id"
              v-model="selectedVehicles"
              class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            >
            <div class="ml-3 flex-1">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {{ vehicle.model || 'N/A' }}
                  </p>
                  <p class="text-xs text-gray-600">
                    {{ vehicle.plateNumber || 'ไม่มีทะเบียน' }} • {{ vehicle.category || 'ไม่ระบุ' }}
                  </p>
                </div>
                <span
                  class="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                  :class="getVehicleStatusClass(vehicle.status)"
                >
                  {{ vehicle.status }}
                </span>
              </div>
            </div>
          </label>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
          <p class="mt-2 text-sm text-gray-600">ไม่มีรถที่พร้อมใช้งาน</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end space-x-3 bg-white p-4 rounded-lg border border-gray-200">
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
      loadingVehicles: false,
      availableVehicles: [],
      selectedVehicles: [],
      form: {
        title: '',
        location: '',
        startDate: '',
        endDate: '',
        startTime: '09:00',
        endTime: '18:00',
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
      console.log('🎯 handleSubmit called!')
      console.log('📝 Form data:', this.form)

      if (!this.validateForm()) {
        console.log('❌ Validation failed:', this.errors)
        this.$toast?.error('กรุณากรอกข้อมูลให้ครบถ้วน')
        return
      }

      console.log('✅ Validation passed!')
      this.saving = true

      try {
        // Get current user ID from auth (using Vuex store)
        console.log('🔍 Checking auth...')
        console.log('Store state:', this.$store.state.auth)
        const currentUser = this.$store.state.auth?.user
        console.log('👤 Current user:', currentUser)

        if (!currentUser || !currentUser.id) {
          console.error('❌ No user ID found!')
          this.$toast?.error('ไม่พบข้อมูลผู้ใช้ กรุณา login ใหม่')
          this.saving = false
          return
        }

        console.log('✅ User ID found:', currentUser.id)

        // Map to backend API format (match API documentation)
        const eventData = {
          title: this.form.title.trim(),
          description: this.form.description.trim() || '',
          type: this.form.type,
          status: this.form.status,
          location: this.form.location.trim(),
          startDate: this.form.startDate,  // Format: "YYYY-MM-DD"
          endDate: this.form.endDate,      // Format: "YYYY-MM-DD"
          startTime: this.form.startTime + ':00',  // Format: "HH:mm:ss"
          endTime: this.form.endTime + ':00',      // Format: "HH:mm:ss"
          createdBy: currentUser.id,       // UUID of current user
          notes: this.form.description.trim() || ''
        }

        console.log('📤 Creating event:', JSON.stringify(eventData, null, 2))
        console.log('👤 Creating as user:', currentUser.username, '(ID:', currentUser.id, ')')

        const response = await this.$api.events.create(eventData)
        console.log('✅ Event created:', response)

        // Assign selected vehicles to the event
        if (response && response.id) {
          await this.assignVehiclesToEvent(response.id)
        }

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
    },

    async fetchVehicles() {
      try {
        this.loadingVehicles = true
        const response = await this.$api.stock.getAll()
        const vehicles = Array.isArray(response) ? response : (response.data || response.vehicles || response.stock || [])

        // Filter only available vehicles
        this.availableVehicles = vehicles
          .filter(v => v.status === 'พร้อมใช้' || v.status === 'available')
          .map(v => ({
            id: v.id,
            model: v.modelGeneral || v.model || v.modelCode || 'N/A',
            plateNumber: v.carCard || v.plate_number || v.plateNumber || 'ไม่มีทะเบียน',
            category: v.type || v.category || 'ไม่ระบุ',
            status: v.status || 'ไม่ระบุ'
          }))

        console.log('📦 Loaded', this.availableVehicles.length, 'available vehicles')
      } catch (error) {
        console.error('Error fetching vehicles:', error)
        this.$toast?.error('ไม่สามารถโหลดข้อมูลรถยนต์ได้')
        this.availableVehicles = []
      } finally {
        this.loadingVehicles = false
      }
    },

    getVehicleStatusClass(status) {
      const statusLower = (status || '').toLowerCase()
      if (status === 'พร้อมใช้' || statusLower === 'available') {
        return 'text-green-700 bg-green-50 border border-green-200'
      } else if (status === 'ใช้งานอยู่' || statusLower === 'in_use') {
        return 'text-blue-700 bg-blue-50 border border-blue-200'
      } else if (status === 'ซ่อมแซม' || statusLower === 'maintenance') {
        return 'text-orange-700 bg-orange-50 border border-orange-200'
      } else {
        return 'text-gray-700 bg-gray-50 border border-gray-200'
      }
    },

    async assignVehiclesToEvent(eventId) {
      if (this.selectedVehicles.length === 0) {
        console.log('⚠️ No vehicles selected, skipping assignment')
        return
      }

      try {
        console.log('🚗 Assigning', this.selectedVehicles.length, 'vehicles to event', eventId)
        console.log('📋 Vehicle IDs:', this.selectedVehicles)

        // Use the API endpoint to assign vehicles
        // POST /api/events/{id}/vehicles/batch with { vehicleIds: [...] }
        const result = await this.$api.events.assignVehicles(eventId, {
          vehicleIds: this.selectedVehicles
        })

        console.log('✅ Vehicles assigned successfully, response:', result)

        // Verify by fetching vehicles for this event
        const verifyVehicles = await this.$api.events.getVehicles(eventId)
        console.log('🔍 Verification - vehicles in event:', verifyVehicles)
      } catch (error) {
        console.error('❌ Error assigning vehicles:', error)
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        })
        this.$toast?.warning('สร้างอีเวนต์สำเร็จ แต่ไม่สามารถเพิ่มรถยนต์ได้')
      }
    }
  },

  async mounted() {
    await this.fetchVehicles()
  }
}
</script>
