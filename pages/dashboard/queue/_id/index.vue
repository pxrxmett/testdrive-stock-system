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
          <h1 class="text-2xl font-bold text-gray-900">รายละเอียดคิว</h1>
          <p class="text-sm text-gray-600">รหัสคิว: {{ queueId }}</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="editQueue"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>แก้ไข</span>
        </button>
        <button
          @click="cancelQueue"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
        >
          ยกเลิกคิว
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="text-gray-600 mt-2">กำลังโหลดข้อมูล...</p>
    </div>

    <!-- Content -->
    <div v-else-if="queue" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Main Info -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Status & DateTime Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-gray-900">สถานะและเวลานัด</h2>
            <StatusBadge :status="queue.status" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600 mb-1">วันที่นัดหมาย</p>
              <p class="font-medium text-gray-900">{{ formattedDate }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">เวลานัดหมาย</p>
              <p class="font-medium text-gray-900">{{ formattedTime }}</p>
            </div>
          </div>
        </div>

        <!-- Customer Info Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>ข้อมูลลูกค้า</span>
          </h2>
          <div class="space-y-3">
            <div class="flex items-center justify-between py-2 border-b border-gray-100">
              <span class="text-gray-600">ชื่อลูกค้า</span>
              <span class="font-medium text-gray-900">{{ queue.customerName || queue.customer_name || 'N/A' }}</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b border-gray-100">
              <span class="text-gray-600">เบอร์โทร</span>
              <a :href="`tel:${queue.phone || queue.customer_phone}`" class="font-medium text-blue-600 hover:underline">
                {{ queue.phone || queue.customer_phone || 'N/A' }}
              </a>
            </div>
            <div class="flex items-center justify-between py-2 border-b border-gray-100">
              <span class="text-gray-600">อีเมล</span>
              <a :href="`mailto:${queue.email || queue.customer_email}`" class="font-medium text-blue-600 hover:underline">
                {{ queue.email || queue.customer_email || 'N/A' }}
              </a>
            </div>
          </div>
        </div>

        <!-- Vehicle Info Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>ข้อมูลรถที่ทดลองขับ</span>
          </h2>
          <div class="space-y-3">
            <div class="flex items-center justify-between py-2 border-b border-gray-100">
              <span class="text-gray-600">รุ่นรถ</span>
              <span class="font-medium text-gray-900">{{ queue.vehicleModel || queue.vehicle_model || 'N/A' }}</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b border-gray-100">
              <span class="text-gray-600">ทะเบียน</span>
              <span class="font-medium text-gray-900">{{ queue.plateNumber || queue.plate_number || 'N/A' }}</span>
            </div>
          </div>
        </div>

        <!-- Notes Card -->
        <div v-if="queue.notes" class="bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">หมายเหตุ</h2>
          <p class="text-gray-700 whitespace-pre-wrap">{{ queue.notes }}</p>
        </div>
      </div>

      <!-- Right Column: Sales & Timeline -->
      <div class="space-y-6">
        <!-- Sales Info Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">พนักงานขายที่รับผิดชอบ</h2>
          <div v-if="queue.sales" class="flex items-center space-x-3">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              {{ salesInitial }}
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ salesName }}</p>
              <p class="text-sm text-gray-600">{{ queue.sales.phone || 'ไม่มีเบอร์โทร' }}</p>
            </div>
          </div>
          <div v-else class="text-center py-4 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p>ยังไม่ได้มอบหมายพนักงานขาย</p>
          </div>
        </div>

        <!-- Timeline Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">ไทม์ไลน์</h2>
          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p class="text-sm font-medium text-gray-900">สร้างคิว</p>
                <p class="text-xs text-gray-600">{{ formattedCreatedAt }}</p>
              </div>
            </div>
            <div v-if="queue.updatedAt && queue.createdAt !== queue.updatedAt" class="flex items-start space-x-3">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p class="text-sm font-medium text-gray-900">อัพเดทล่าสุด</p>
                <p class="text-xs text-gray-600">{{ formattedUpdatedAt }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">การดำเนินการ</h2>
          <div class="space-y-2">
            <button
              v-if="queue.status === 'pending'"
              @click="confirmQueue"
              class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              ยืนยันคิว
            </button>
            <button
              v-if="queue.status === 'confirmed'"
              @click="startTestDrive"
              class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              เริ่มทดลองขับ
            </button>
            <button
              v-if="queue.status === 'in_progress'"
              @click="completeTestDrive"
              class="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              เสร็จสิ้น
            </button>
            <button
              @click="callCustomer"
              class="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>โทรหาลูกค้า</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      <p class="font-medium">ไม่พบข้อมูลคิว</p>
      <p class="text-sm">ไม่พบคิวที่มี ID: {{ queueId }}</p>
    </div>
  </div>
</template>

<script>
import StatusBadge from '~/components/StatusBadge.vue'

export default {
  name: 'QueueDetail',
  components: {
    StatusBadge
  },
  data() {
    return {
      queue: null,
      loading: false
    }
  },
  computed: {
    queueId() {
      return this.$route.params.id
    },
    salesName() {
      if (!this.queue?.sales) return 'N/A'
      return this.queue.sales.nickname || this.queue.sales.firstName || this.queue.sales.name || 'N/A'
    },
    salesInitial() {
      return this.salesName.charAt(0).toUpperCase()
    },
    formattedDate() {
      const date = this.queue?.appointmentDate || this.queue?.appointment_date
      if (!date) return 'N/A'
      try {
        return new Date(date).toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      } catch (e) {
        return date
      }
    },
    formattedTime() {
      const time = this.queue?.appointmentTime || this.queue?.appointment_time
      if (!time) return 'N/A'
      return time
    },
    formattedCreatedAt() {
      const date = this.queue?.createdAt || this.queue?.created_at
      if (!date) return 'N/A'
      try {
        return new Date(date).toLocaleString('th-TH')
      } catch (e) {
        return date
      }
    },
    formattedUpdatedAt() {
      const date = this.queue?.updatedAt || this.queue?.updated_at
      if (!date) return 'N/A'
      try {
        return new Date(date).toLocaleString('th-TH')
      } catch (e) {
        return date
      }
    }
  },
  async mounted() {
    await this.fetchQueue()
  },
  methods: {
    async fetchQueue() {
      try {
        this.loading = true
        const response = await this.$api.testDrives.getById(this.queueId)
        this.queue = response
      } catch (error) {
        console.error('Error fetching queue:', error)
        this.$toast?.error('ไม่สามารถโหลดข้อมูลคิวได้')
        this.queue = null
      } finally {
        this.loading = false
      }
    },
    editQueue() {
      this.$router.push(`/dashboard/queue/${this.queueId}/edit`)
    },
    async confirmQueue() {
      if (confirm('ยืนยันคิวนี้หรือไม่?')) {
        try {
          await this.$api.testDrives.update(this.queueId, { status: 'confirmed' })
          this.$toast?.success('ยืนยันคิวสำเร็จ')
          await this.fetchQueue()
        } catch (error) {
          console.error('Error confirming queue:', error)
          this.$toast?.error('ไม่สามารถยืนยันคิวได้')
        }
      }
    },
    async startTestDrive() {
      if (confirm('เริ่มทดลองขับหรือไม่?')) {
        try {
          await this.$api.testDrives.update(this.queueId, { status: 'in_progress' })
          this.$toast?.success('เริ่มทดลองขับแล้ว')
          await this.fetchQueue()
        } catch (error) {
          console.error('Error starting test drive:', error)
          this.$toast?.error('ไม่สามารถเริ่มทดลองขับได้')
        }
      }
    },
    async completeTestDrive() {
      if (confirm('ทดลองขับเสร็จสิ้นหรือไม่?')) {
        try {
          await this.$api.testDrives.update(this.queueId, { status: 'completed' })
          this.$toast?.success('ทดลองขับเสร็จสิ้น')
          await this.fetchQueue()
        } catch (error) {
          console.error('Error completing test drive:', error)
          this.$toast?.error('ไม่สามารถบันทึกผลได้')
        }
      }
    },
    async cancelQueue() {
      if (confirm('ยกเลิกคิวนี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้')) {
        try {
          await this.$api.testDrives.update(this.queueId, { status: 'cancelled' })
          this.$toast?.success('ยกเลิกคิวสำเร็จ')
          this.$router.push('/dashboard/queue')
        } catch (error) {
          console.error('Error cancelling queue:', error)
          this.$toast?.error('ไม่สามารถยกเลิกคิวได้')
        }
      }
    },
    callCustomer() {
      const phone = this.queue?.phone || this.queue?.customer_phone
      if (phone) {
        window.location.href = `tel:${phone}`
      } else {
        this.$toast?.error('ไม่มีเบอร์โทรศัพท์')
      }
    }
  }
}
</script>
