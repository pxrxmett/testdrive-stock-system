<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div 
        class="fixed inset-0 transition-opacity" 
        @click="$emit('close')"
      >
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <!-- Modal -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <!-- Header -->
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ appointment ? 'รายละเอียดการนัดหมาย' : 'เพิ่มการนัดหมายใหม่' }}
            </h3>
            <button 
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600"
            >
              <Icon name="close" icon-class="w-5 h-5" />
            </button>
          </div>

          <!-- Content -->
          <div v-if="appointment" class="space-y-4">
            <!-- Customer Info -->
            <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span class="text-white font-medium text-sm">
                  {{ appointment.customerName.split(' ')[1]?.charAt(0) || 'ค' }}
                </span>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ appointment.customerName }}</p>
                <p class="text-sm text-gray-500">{{ appointment.phone }}</p>
                <p class="text-xs text-gray-400">{{ appointment.email }}</p>
              </div>
            </div>

            <!-- Appointment Details -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">วันที่</label>
                <p class="text-sm text-gray-900">{{ formatDate(appointment.date) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">เวลา</label>
                <p class="text-sm text-gray-900">{{ appointment.timeSlot }} น.</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ระยะเวลา</label>
                <p class="text-sm text-gray-900">{{ appointment.duration }} นาที</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
                <StatusBadge :status="appointment.status" />
              </div>
            </div>

            <!-- Car Model -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">รุ่นรถ</label>
              <p class="text-sm text-gray-900">{{ appointment.carModel }}</p>
            </div>

            <!-- Location -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">สาขา</label>
              <p class="text-sm text-gray-900">{{ appointment.location }}</p>
            </div>

            <!-- Sales Rep -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">เซลส์ผู้ดูแล</label>
              <p class="text-sm text-gray-900">{{ appointment.salesRep }}</p>
            </div>
          </div>

          <!-- New Appointment Form -->
          <div v-else class="space-y-4">
            <div class="text-center py-8">
              <Icon name="calendar" icon-class="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p class="text-gray-500">ฟอร์มเพิ่มการนัดหมายใหม่จะเพิ่มในเร็วๆ นี้</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            v-if="appointment"
            @click="editAppointment"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
          >
            แก้ไข
          </button>
          <button 
            @click="$emit('close')"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppointmentModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    appointment: {
      type: Object,
      default: null
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    editAppointment() {
      this.$emit('edit', this.appointment)
      this.$emit('close')
    }
  }
}
</script>
