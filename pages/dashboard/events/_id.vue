<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      <p class="mt-4 text-gray-600">กำลังโหลด...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ error }}</p>
      <button @click="$router.back()" class="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg">
        กลับ
      </button>
    </div>

    <!-- Event Details -->
    <div v-else-if="event">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button @click="$router.back()" class="p-2 hover:bg-gray-100 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ event.title }}</h1>
            <p class="text-sm text-gray-600">{{ formatEventId(event.id) }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <nuxt-link
            :to="`/dashboard/events/${event.id}/edit`"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            แก้ไข
          </nuxt-link>
          <button @click="deleteEvent" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            ลบ
          </button>
        </div>
      </div>

      <!-- Event Info Card -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-bold mb-4">ข้อมูลอีเวนต์</h2>
        <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt class="text-sm font-medium text-gray-500">สถานะ</dt>
            <dd class="mt-1">
              <span :class="getStatusClass(event.status)" class="inline-flex px-3 py-1 rounded-full text-sm font-medium">
                {{ mapStatusToThai(event.status) }}
              </span>
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">ประเภท</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ mapTypeToThai(event.type) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">สถานที่</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ event.location }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">วันที่จัดงาน</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ formatDate(event.startDate) }} - {{ formatDate(event.endDate) }}
            </dd>
          </div>
          <div v-if="event.startTime && event.endTime">
            <dt class="text-sm font-medium text-gray-500">เวลา</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ formatTime(event.startTime) }} - {{ formatTime(event.endTime) }}
            </dd>
          </div>
          <div v-if="event.createdAt">
            <dt class="text-sm font-medium text-gray-500">วันที่สร้าง</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ formatDate(event.createdAt) }}</dd>
          </div>
          <div v-if="event.description" class="md:col-span-2">
            <dt class="text-sm font-medium text-gray-500">รายละเอียด</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ event.description }}</dd>
          </div>
        </dl>
      </div>

      <!-- Vehicles Card -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold">รถยนต์ที่ใช้ในอีเวนต์</h2>
          <span class="text-sm text-gray-600">
            {{ vehicles.length }} คัน
          </span>
        </div>

        <div v-if="vehicles.length > 0" class="space-y-3">
          <div
            v-for="vehicle in vehicles"
            :key="vehicle.id"
            class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">{{ vehicle.model }}</p>
                <p class="text-sm text-gray-600">{{ vehicle.plateNumber }}</p>
              </div>
              <span :class="getVehicleStatusClass(vehicle.status)" class="px-2 py-1 rounded text-xs font-medium">
                {{ vehicle.status }}
              </span>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8 text-gray-500">
          ยังไม่มีรถยนต์ในอีเวนต์นี้
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div class="relative mx-auto p-8 border w-full max-w-md shadow-2xl rounded-xl bg-white">
        <!-- Icon -->
        <div class="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <!-- Title -->
        <h3 class="text-xl font-bold text-gray-900 text-center mb-2">
          ยืนยันการลบอีเวนต์
        </h3>

        <!-- Warning Text -->
        <p class="text-sm text-gray-600 text-center mb-6">
          การดำเนินการนี้ไม่สามารถย้อนกลับได้
        </p>

        <!-- Event Info Display -->
        <div v-if="event" class="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">อีเวนต์:</span>
            <span class="font-medium text-gray-900">{{ event.title }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">สถานที่:</span>
            <span class="font-medium text-gray-900">{{ event.location }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">รถที่จอง:</span>
            <span class="font-medium text-gray-900">{{ vehicles.length }} คัน</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-3">
          <button
            @click="cancelDelete"
            :disabled="deleting"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ยกเลิก
          </button>
          <button
            @click="confirmDelete"
            :disabled="deleting"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ deleting ? 'กำลังลบ...' : 'ลบอีเวนต์' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventDetails',
  layout: 'dashboard',
  data() {
    return {
      event: null,
      vehicles: [],
      loading: true,
      error: null,
      allEvents: [],
      showDeleteModal: false,
      deleting: false
    }
  },
  async mounted() {
    await this.fetchEvent()
  },
  methods: {
    async fetchEvent() {
      try {
        this.loading = true
        const eventId = this.$route.params.id

        // Fetch all events to get proper index for Event ID
        try {
          const allEventsResponse = await this.$api.events.getAll()
          this.allEvents = Array.isArray(allEventsResponse)
            ? allEventsResponse
            : (allEventsResponse.data || [])
        } catch (err) {
          console.error('Error fetching all events:', err)
          this.allEvents = []
        }

        // Fetch event details
        const event = await this.$api.events.getById(eventId)
        this.event = event

        // Fetch vehicles for this event
        try {
          const vehiclesResponse = await this.$api.events.getVehicles(eventId)
          this.vehicles = Array.isArray(vehiclesResponse)
            ? vehiclesResponse
            : (vehiclesResponse.data || vehiclesResponse.vehicles || [])
        } catch (err) {
          console.error('Error fetching vehicles:', err)
          this.vehicles = []
        }
      } catch (error) {
        console.error('Error fetching event:', error)
        this.error = 'ไม่สามารถโหลดข้อมูลอีเวนต์ได้'
      } finally {
        this.loading = false
      }
    },

    formatEventId(uuid) {
      if (!uuid) return 'N/A'
      // Find the index in all events array
      const eventIndex = this.allEvents.findIndex(e => e.id === uuid)
      if (eventIndex !== -1) {
        return `EVT-${String(eventIndex + 1).padStart(3, '0')}`
      }
      // Fallback if not found in array
      return 'EVT-000'
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },

    formatTime(timeString) {
      if (!timeString) return 'N/A'
      // If time is in format "HH:mm:ss", return "HH:mm"
      if (timeString.includes(':')) {
        return timeString.substring(0, 5)
      }
      return timeString
    },

    mapStatusToThai(status) {
      const map = {
        'planning': 'วางแผน',
        'preparing': 'เตรียมการ',
        'in_progress': 'กำลังดำเนินการ',
        'completed': 'เสร็จสิ้น',
        'overdue': 'เลยกำหนด'
      }
      return map[status] || status
    },

    mapTypeToThai(type) {
      const map = {
        'car_show': 'งานแสดงรถ',
        'test_drive': 'ทดลองขับ',
        'marketing': 'การตลาด',
        'delivery': 'ส่งมอบรถ',
        'emergency': 'ฉุกเฉิน'
      }
      return map[type] || type
    },

    getStatusClass(status) {
      const map = {
        'planning': 'text-gray-700 bg-gray-100 border border-gray-300',
        'preparing': 'text-orange-700 bg-orange-100 border border-orange-300',
        'in_progress': 'text-blue-700 bg-blue-100 border border-blue-300',
        'completed': 'text-green-700 bg-green-100 border border-green-300',
      }
      return map[status] || 'text-gray-700 bg-gray-100'
    },

    getVehicleStatusClass(status) {
      const statusLower = (status || '').toLowerCase()
      if (status === 'พร้อมใช้' || statusLower === 'available') {
        return 'text-green-700 bg-green-50'
      }
      return 'text-gray-700 bg-gray-50'
    },

    deleteEvent() {
      this.showDeleteModal = true
    },

    cancelDelete() {
      this.showDeleteModal = false
    },

    async confirmDelete() {
      try {
        this.deleting = true
        await this.$api.events.delete(this.event.id)
        this.$toast?.success('ลบอีเวนต์เรียบร้อยแล้ว')
        this.$router.push('/dashboard/events')
      } catch (error) {
        console.error('Error deleting event:', error)
        this.$toast?.error('ไม่สามารถลบอีเวนต์ได้')
        this.showDeleteModal = false
      } finally {
        this.deleting = false
      }
    }
  }
}
</script>
