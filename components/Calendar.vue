<template>
  <div class="card">
    <!-- Calendar Header -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ monthNames[currentMonth] }} {{ currentYear }}
          </h3>
          <div class="flex items-center space-x-2">
            <button 
              @click="previousMonth"
              class="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Icon name="chevron-left" icon-class="w-4 h-4 text-gray-600" />
            </button>
            <button 
              @click="nextMonth"
              class="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Icon name="chevron-right" icon-class="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <button 
            @click="goToToday"
            class="btn-secondary text-sm"
          >
            วันนี้
          </button>
          <button 
            :class="[
              'px-3 py-1.5 text-sm rounded-md transition-colors',
              viewMode === 'month' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
            @click="viewMode = 'month'"
          >
            เดือน
          </button>
          <button 
            :class="[
              'px-3 py-1.5 text-sm rounded-md transition-colors',
              viewMode === 'week' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
            @click="viewMode = 'week'"
          >
            สัปดาห์
          </button>
        </div>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="p-4">
      <!-- Days of Week Header -->
      <div class="grid grid-cols-7 gap-1 mb-2">
        <div 
          v-for="day in dayNames" 
          :key="day"
          class="p-2 text-center text-sm font-medium text-gray-600"
        >
          {{ day }}
        </div>
      </div>

      <!-- Calendar Days -->
      <div class="grid grid-cols-7 gap-1">
        <div 
          v-for="date in calendarDays" 
          :key="`${date.year}-${date.month}-${date.day}`"
          :class="[
            'min-h-[100px] p-2 border border-gray-200 rounded-md cursor-pointer transition-colors',
            date.isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 text-gray-400',
            date.isToday ? 'ring-2 ring-red-500' : '',
            date.isSelected ? 'bg-red-50 border-red-200' : ''
          ]"
          @click="selectDate(date)"
        >
          <div class="flex items-center justify-between mb-1">
            <span :class="[
              'text-sm font-medium',
              date.isToday ? 'text-[#D52B1E]' : date.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
            ]">
              {{ date.day }}
            </span>
            <div class="flex items-center space-x-1">
              <div 
                v-if="getAppointmentsForDate(date).length > 0"
                class="w-2 h-2 bg-red-500 rounded-full"
              ></div>
            </div>
          </div>

          <!-- Appointments for this date -->
          <div class="space-y-1">
            <div 
              v-for="appointment in getAppointmentsForDate(date).slice(0, 2)" 
              :key="appointment.id"
              :class="[
                'text-xs p-1 rounded truncate',
                getStatusClasses(appointment.status)
              ]"
              @click.stop="selectAppointment(appointment)"
            >
              {{ appointment.timeSlot }} {{ appointment.customerName }}
            </div>
            <div 
              v-if="getAppointmentsForDate(date).length > 2"
              class="text-xs text-gray-500 text-center"
            >
              +{{ getAppointmentsForDate(date).length - 2 }} เพิ่มเติม
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Calendar',
  props: {
    appointments: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentDate: new Date(),
      selectedDate: null,
      viewMode: 'month',
      monthNames: [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
      ],
      dayNames: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
    }
  },
  computed: {
    currentYear() {
      return this.currentDate.getFullYear()
    },
    currentMonth() {
      return this.currentDate.getMonth()
    },
    calendarDays() {
      const year = this.currentYear
      const month = this.currentMonth
      
      // First day of the month
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      
      // Start from the first Sunday of the calendar
      const startDate = new Date(firstDay)
      startDate.setDate(startDate.getDate() - firstDay.getDay())
      
      const days = []
      const today = new Date()
      
      // Generate 42 days (6 weeks)
      for (let i = 0; i < 42; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)
        
        const isCurrentMonth = date.getMonth() === month
        const isToday = date.toDateString() === today.toDateString()
        const isSelected = this.selectedDate && date.toDateString() === this.selectedDate.toDateString()
        
        days.push({
          year: date.getFullYear(),
          month: date.getMonth(),
          day: date.getDate(),
          date: date,
          isCurrentMonth,
          isToday,
          isSelected
        })
      }
      
      return days
    }
  },
  methods: {
    previousMonth() {
      this.currentDate = new Date(this.currentYear, this.currentMonth - 1, 1)
    },
    nextMonth() {
      this.currentDate = new Date(this.currentYear, this.currentMonth + 1, 1)
    },
    goToToday() {
      this.currentDate = new Date()
      this.selectedDate = new Date()
    },
    selectDate(date) {
      this.selectedDate = date.date
      this.$emit('date-selected', date.date)
    },
    selectAppointment(appointment) {
      this.$emit('appointment-selected', appointment)
    },
    getAppointmentsForDate(date) {
      const dateString = date.date.toISOString().split('T')[0]
      return this.appointments.filter(appointment => 
        appointment.date === dateString
      )
    },
    getStatusClasses(status) {
      const classes = {
        'scheduled': 'bg-yellow-100 text-yellow-800',
        'in-progress': 'bg-green-100 text-green-800',
        'completed': 'bg-blue-100 text-blue-800',
        'cancelled': 'bg-gray-100 text-gray-600'
      }
      return classes[status] || classes['scheduled']
    }
  }
}
</script>
