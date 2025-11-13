<template>
  <div
    class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer"
    @click="handleClick"
  >
    <!-- Header: Time and Status -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center space-x-2">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-sm font-medium text-gray-700">{{ formattedTime }}</span>
      </div>
      <StatusBadge :status="queue.status" />
    </div>

    <!-- Customer Info -->
    <div class="mb-3">
      <div class="flex items-center space-x-2 mb-1">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="font-semibold text-gray-900">{{ queue?.customerName || queue?.customer_name || 'N/A' }}</span>
      </div>

      <div class="flex items-center space-x-2 text-sm text-gray-600">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <span>{{ queue?.phone || queue?.customer_phone || 'N/A' }}</span>
      </div>
    </div>

    <!-- Vehicle Info -->
    <div class="flex items-center space-x-2 mb-4 text-sm">
      <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
      <span class="font-medium text-[#D52B1E]">{{ vehicleName }}</span>
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center justify-between pt-3 border-t border-gray-100" @click.stop>
      <div class="flex items-center space-x-2">
        <button
          @click="handleView"
          class="px-3 py-1.5 text-xs font-medium text-[#D52B1E] hover:bg-blue-50 rounded-lg transition-colors"
        >
          ดูรายละเอียด
        </button>
        <button
          @click="handleEdit"
          class="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          แก้ไข
        </button>
        <button
          v-if="queue.status === 'pending'"
          @click="handleConfirm"
          class="px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors"
        >
          ยืนยัน
        </button>
      </div>

      <button
        @click="handleCancel"
        class="px-3 py-1.5 text-xs font-medium text-[#D52B1E] hover:bg-red-50 rounded-lg transition-colors"
      >
        ยกเลิก
      </button>
    </div>
  </div>
</template>

<script>
import StatusBadge from './StatusBadge.vue'

export default {
  name: 'QueueCard',
  components: {
    StatusBadge
  },
  props: {
    queue: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedTime() {
      if (!this.queue?.appointmentTime && !this.queue?.appointment_time) return 'N/A'
      const time = this.queue.appointmentTime || this.queue.appointment_time
      // If it's already in HH:MM format, return it
      if (typeof time === 'string' && time.includes(':')) {
        return time
      }
      // Otherwise try to format it
      try {
        const date = new Date(time)
        return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      } catch (e) {
        return time
      }
    },
    vehicleName() {
      const vehicle = this.queue?.vehicle
      const model = this.queue?.vehicleModel || this.queue?.vehicle_model || vehicle?.model
      const plateNumber = this.queue?.plateNumber || this.queue?.plate_number || vehicle?.plate_number

      if (model && plateNumber) {
        return `${model} (${plateNumber})`
      }
      return model || plateNumber || 'N/A'
    }
  },
  methods: {
    handleClick() {
      this.$emit('click', this.queue)
    },
    handleView() {
      this.$emit('view', this.queue)
    },
    handleEdit() {
      this.$emit('edit', this.queue)
    },
    handleConfirm() {
      this.$emit('confirm', this.queue)
    },
    handleCancel() {
      this.$emit('cancel', this.queue)
    }
  }
}
</script>

<style scoped>
.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
