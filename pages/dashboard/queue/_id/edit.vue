<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button
          @click="goBack"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">แก้ไขคิว</h1>
          <p class="text-sm text-gray-600">รหัสคิว: {{ queueId }}</p>
        </div>
      </div>
      <StatusBadge v-if="form.status" :status="form.status" />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="text-gray-600 mt-2">กำลังโหลดข้อมูล...</p>
    </div>

    <!-- Edit Form -->
    <form v-else-if="!loading" @submit.prevent="saveQueue" class="space-y-6">
      <!-- Customer Information Card -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>ข้อมูลลูกค้า</span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ชื่อลูกค้า <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.customerName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E]"
              placeholder="กรอกชื่อลูกค้า"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              เบอร์โทร <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.phone"
              type="tel"
              required
              pattern="[0-9]{9,10}"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E]"
              placeholder="0812345678"
            >
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              อีเมล
            </label>
            <input
              v-model="form.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E]"
              placeholder="customer@example.com"
            >
          </div>
        </div>
      </div>

      <!-- Vehicle & Sales Information Card -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span>ข้อมูลรถและพนักงาน</span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              รถที่ต้องการทดลองขับ <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.vehicleId"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E]"
              @change="onVehicleChange"
            >
              <option value="">-- เลือกรถ --</option>
              <option v-for="vehicle in availableVehicles" :key="vehicle.id" :value="vehicle.id">
                {{ vehicle.model || vehicle.vehicleModel }} - {{ vehicle.plateNumber || vehicle.plate_number }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              พนักงานขายที่รับผิดชอบ
            </label>
            <select
              v-model="form.salesId"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E]"
            >
              <option value="">-- ยังไม่ระบุ --</option>
              <option v-for="sales in salesList" :key="sales.id" :value="sales.id">
                {{ sales.nickname || sales.firstName || sales.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Appointment DateTime Card -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>วันและเวลานัดหมาย</span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              วันที่ <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.appointmentDate"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E]"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              เวลา <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.appointmentTime"
              type="time"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E]"
            >
          </div>
        </div>
      </div>

      <!-- Status Card -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">สถานะคิว</h2>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            สถานะ <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.status"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E]"
          >
            <option value="pending">รอยืนยัน</option>
            <option value="confirmed">ยืนยันแล้ว</option>
            <option value="in_progress">กำลังทดลองขับ</option>
            <option value="completed">เสร็จสิ้น</option>
            <option value="cancelled">ยกเลิก</option>
            <option value="no_show">ไม่มาตามนัด</option>
          </select>
        </div>
      </div>

      <!-- Notes Card -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">หมายเหตุ</h2>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            หมายเหตุเพิ่มเติม
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
          @click="goBack"
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
import StatusBadge from '~/components/StatusBadge.vue'

export default {
  name: 'QueueEdit',
  layout: 'dashboard',
  components: {
    StatusBadge
  },
  data() {
    return {
      loading: false,
      saving: false,
      availableVehicles: [],
      salesList: [],
      form: {
        customerName: '',
        phone: '',
        email: '',
        vehicleId: '',
        vehicleModel: '',
        plateNumber: '',
        salesId: '',
        appointmentDate: '',
        appointmentTime: '',
        status: 'pending',
        notes: ''
      }
    }
  },
  computed: {
    queueId() {
      return this.$route.params.id
    }
  },
  async mounted() {
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        // Fetch queue data, vehicles, and sales in parallel
        const [queueData, vehiclesData, salesData] = await Promise.all([
          this.fetchQueue(),
          this.fetchVehicles(),
          this.fetchSales()
        ])

        this.populateForm(queueData)
        this.availableVehicles = vehiclesData
        this.salesList = salesData
      } catch (error) {
        console.error('Error fetching data:', error)
        this.$toast?.error('ไม่สามารถโหลดข้อมูลได้')
      } finally {
        this.loading = false
      }
    },

    async fetchQueue() {
      try {
        const response = await this.$api.testDrives.getById(this.queueId)
        return response
      } catch (error) {
        console.error('Error fetching queue:', error)
        throw error
      }
    },

    async fetchVehicles() {
      try {
        const response = await this.$api.stock.getVehicles({ status: 'available' })
        return response?.vehicles || response || []
      } catch (error) {
        console.error('Error fetching vehicles:', error)
        // Return empty array if API fails
        return []
      }
    },

    async fetchSales() {
      try {
        // Use staffs endpoint instead of non-existent users endpoint
        const response = await this.$api.staffs.getAll({ role: 'sales' })
        const salesData = response?.staffs || response?.data || response || []
        console.log('✅ Fetched sales list from staffs API:', salesData.length)
        return salesData
      } catch (error) {
        console.warn('⚠️ Could not fetch sales from API, using mock data:', error.message)
        // Fallback to mock data if API is not available
        return [
          { id: 1, name: 'พนักงาน A', firstName: 'สมชาย', nickname: 'ชาย' },
          { id: 2, name: 'พนักงาน B', firstName: 'สมหญิง', nickname: 'หญิง' },
          { id: 3, name: 'พนักงาน C', firstName: 'สมศรี', nickname: 'ศรี' },
          { id: 4, name: 'พนักงาน D', firstName: 'สมหมาย', nickname: 'หมาย' },
          { id: 5, name: 'พนักงาน E', firstName: 'สมพร', nickname: 'พร' }
        ]
      }
    },

    populateForm(queue) {
      if (!queue) return

      this.form = {
        customerName: queue.customerName || queue.customer_name || '',
        phone: queue.phone || queue.customer_phone || '',
        email: queue.email || queue.customer_email || '',
        vehicleId: queue.vehicleId || queue.vehicle_id || queue.vehicle?.id || '',
        vehicleModel: queue.vehicleModel || queue.vehicle_model || queue.vehicle?.model || '',
        plateNumber: queue.plateNumber || queue.plate_number || queue.vehicle?.plate_number || '',
        salesId: queue.salesId || queue.sales_id || queue.sales?.id || '',
        appointmentDate: this.formatDateForInput(queue.appointmentDate || queue.appointment_date),
        appointmentTime: queue.appointmentTime || queue.appointment_time || '',
        status: queue.status || 'pending',
        notes: queue.notes || ''
      }
    },

    formatDateForInput(date) {
      if (!date) return ''
      try {
        const d = new Date(date)
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      } catch (e) {
        return date
      }
    },

    onVehicleChange() {
      // Update vehicle model and plate number when vehicle is selected
      const selectedVehicle = this.availableVehicles.find(v => v.id === this.form.vehicleId)
      if (selectedVehicle) {
        this.form.vehicleModel = selectedVehicle.model || selectedVehicle.vehicleModel || ''
        this.form.plateNumber = selectedVehicle.plateNumber || selectedVehicle.plate_number || ''
      }
    },

    async saveQueue() {
      this.saving = true
      try {
        // Prepare data for API in snake_case format
        const updateData = {
          customer_name: this.form.customerName,
          customer_phone: this.form.phone,
          customer_email: this.form.email || null,
          vehicle_id: this.form.vehicleId ? parseInt(this.form.vehicleId) : null,
          vehicle_model: this.form.vehicleModel || null,
          plate_number: this.form.plateNumber || null,
          sales_id: this.form.salesId ? parseInt(this.form.salesId) : null,
          appointment_date: this.form.appointmentDate,
          appointment_time: this.form.appointmentTime,
          status: this.form.status,
          notes: this.form.notes || null
        }

        console.log('📤 Updating queue with data:', JSON.stringify(updateData, null, 2))

        await this.$api.testDrives.update(this.queueId, updateData)

        this.$toast?.success('บันทึกข้อมูลสำเร็จ')

        // Redirect back to detail page
        this.$router.push(`/dashboard/queue/${this.queueId}`)
      } catch (error) {
        console.error('❌ Error saving queue:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        })

        const errorMessage = error.response?.data?.message
          || error.response?.data?.error
          || error.message
          || 'ไม่สามารถบันทึกข้อมูลได้'

        this.$toast?.error(`เกิดข้อผิดพลาด: ${errorMessage}`)
      } finally {
        this.saving = false
      }
    },

    goBack() {
      this.$router.push(`/dashboard/queue/${this.queueId}`)
    }
  }
}
</script>
