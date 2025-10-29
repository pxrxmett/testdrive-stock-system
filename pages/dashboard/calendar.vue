<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">ปฏิทินการนัดหมาย</h1>
        <p class="text-gray-600">จัดการและดูปฏิทินการนัดหมายทดลองขับ</p>
      </div>
      <div class="flex items-center space-x-3">
        <button 
          @click="refreshData"
          class="btn-secondary flex items-center space-x-2"
        >
          <Icon name="refresh" icon-class="w-4 h-4" />
          <span>รีเฟรช</span>
        </button>
        <button 
          @click="addAppointment"
          class="btn-primary flex items-center space-x-2"
        >
          <Icon name="plus" icon-class="w-4 h-4" />
          <span>เพิ่มนัดหมาย</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card p-8 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
      <p class="text-gray-600">กำลังโหลดข้อมูลปฏิทิน...</p>
    </div>

    <!-- Quick Stats -->
    <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-2xl font-bold text-blue-600">{{ todayAppointments.length }}</p>
            <p class="text-sm text-gray-600">นัดหมายวันนี้</p>
          </div>
          <Icon name="calendar" icon-class="w-8 h-8 text-blue-400" />
        </div>
      </div>

      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-2xl font-bold text-green-600">{{ upcomingAppointments.length }}</p>
            <p class="text-sm text-gray-600">นัดหมายที่จะมาถึง</p>
          </div>
          <Icon name="clock" icon-class="w-8 h-8 text-green-400" />
        </div>
      </div>
      
      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-2xl font-bold text-yellow-600">{{ thisWeekAppointments.length }}</p>
            <p class="text-sm text-gray-600">สัปดาห์นี้</p>
          </div>
          <Icon name="calendar" icon-class="w-8 h-8 text-yellow-400" />
        </div>
      </div>
      
      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-2xl font-bold text-purple-600">{{ thisMonthAppointments.length }}</p>
            <p class="text-sm text-gray-600">เดือนนี้</p>
          </div>
          <Icon name="calendar" icon-class="w-8 h-8 text-purple-400" />
        </div>
      </div>
    </div>

    <!-- Calendar Component -->
    <Calendar
      v-if="!loading"
      :appointments="appointments"
      @date-selected="handleDateSelected"
      @appointment-selected="handleAppointmentSelected"
    />

    <!-- Today's Schedule -->
    <div v-if="!loading" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Today's Appointments -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">นัดหมายวันนี้</h3>
          <span class="text-sm text-gray-500">{{ getCurrentDate() }}</span>
        </div>
        
        <div v-if="todayAppointments.length === 0" class="text-center py-8">
          <Icon name="calendar" icon-class="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p class="text-gray-500">ไม่มีนัดหมายในวันนี้</p>
        </div>
        
        <div v-else class="space-y-3">
          <div 
            v-for="appointment in todayAppointments" 
            :key="appointment.id"
            class="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
            @click="handleAppointmentSelected(appointment)"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span class="text-white font-medium text-sm">
                  {{ appointment.customerName.split(' ')[1]?.charAt(0) || 'ค' }}
                </span>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ appointment.customerName }}</p>
                <p class="text-sm text-gray-600">{{ appointment.carModel }}</p>
                <p class="text-xs text-gray-500">{{ appointment.location }}</p>
              </div>
            </div>
            
            <div class="text-right">
              <p class="text-lg font-semibold text-blue-600">{{ appointment.timeSlot }}</p>
              <StatusBadge :status="appointment.status" />
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Appointments -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">นัดหมายที่จะมาถึง</h3>
          <nuxt-link to="/dashboard/queue" class="text-sm text-red-600 hover:text-red-700">
            ดูทั้งหมด
          </nuxt-link>
        </div>
        
        <div v-if="upcomingAppointments.length === 0" class="text-center py-8">
          <Icon name="clock" icon-class="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p class="text-gray-500">ไม่มีนัดหมายที่จะมาถึง</p>
        </div>
        
        <div v-else class="space-y-3">
          <div 
            v-for="appointment in upcomingAppointments.slice(0, 5)" 
            :key="appointment.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            @click="handleAppointmentSelected(appointment)"
          >
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <span class="text-white text-xs font-medium">
                  {{ appointment.customerName.split(' ')[1]?.charAt(0) || 'ค' }}
                </span>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ appointment.customerName }}</p>
                <p class="text-sm text-gray-600">{{ appointment.carModel }}</p>
                <p class="text-xs text-gray-500">{{ appointment.location }}</p>
              </div>
            </div>
            
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">{{ formatDate(appointment.date) }}</p>
              <p class="text-sm text-gray-600">{{ appointment.timeSlot }}</p>
              <StatusBadge :status="appointment.status" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Weekly Overview -->
    <div v-if="!loading" class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">ภาพรวมสัปดาห์นี้</h3>
      <div class="grid grid-cols-7 gap-4">
        <div 
          v-for="(day, index) in weekDays" 
          :key="index"
          class="text-center"
        >
          <div class="text-sm font-medium text-gray-600 mb-2">{{ day.name }}</div>
          <div class="text-lg font-bold text-gray-900 mb-2">{{ day.date }}</div>
          <div class="space-y-1">
            <div 
              v-for="appointment in day.appointments.slice(0, 3)" 
              :key="appointment.id"
              class="text-xs p-1 rounded bg-red-100 text-red-800 truncate cursor-pointer"
              @click="handleAppointmentSelected(appointment)"
            >
              {{ appointment.timeSlot }} {{ appointment.customerName.split(' ')[1] || 'ค' }}
            </div>
            <div 
              v-if="day.appointments.length > 3"
              class="text-xs text-gray-500"
            >
              +{{ day.appointments.length - 3 }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Appointment Modal -->
    <AppointmentModal 
      :is-open="showModal"
      :appointment="selectedAppointment"
      @close="closeModal"
      @edit="editAppointment"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'CalendarPage',
  layout: 'dashboard',
  data() {
    return {
      selectedDate: null,
      selectedAppointment: null,
      showModal: false,
      loading: false,
      queues: []
    }
  },
  computed: {
    appointments() {
      // Map queues to appointment format with proper date/time handling
      return this.queues.map(queue => {
        // Extract date from appointmentDate or appointment_date
        const appointmentDate = queue.appointmentDate || queue.appointment_date
        const appointmentTime = queue.appointmentTime || queue.appointment_time

        // Format date to YYYY-MM-DD
        let dateStr = ''
        if (appointmentDate) {
          try {
            const date = new Date(appointmentDate)
            dateStr = date.toISOString().split('T')[0]
          } catch (e) {
            dateStr = appointmentDate
          }
        }

        return {
          id: queue.id,
          date: dateStr,
          timeSlot: appointmentTime || 'N/A',
          customerName: queue.customerName || queue.customer_name || 'N/A',
          carModel: queue.vehicleModel || queue.vehicle_model || 'N/A',
          location: queue.branch || 'N/A',
          status: queue.status || 'pending',
          ...queue
        }
      })
    },

    todayAppointments() {
      const today = new Date().toISOString().split('T')[0]
      return this.appointments.filter(appointment => 
        appointment.date === today
      ).sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))
    },

    upcomingAppointments() {
      const today = new Date().toISOString().split('T')[0]
      return this.appointments.filter(appointment => 
        appointment.date > today
      ).sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date)
        if (dateCompare === 0) {
          return a.timeSlot.localeCompare(b.timeSlot)
        }
        return dateCompare
      })
    },

    thisWeekAppointments() {
      const today = new Date()
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      
      const startStr = weekStart.toISOString().split('T')[0]
      const endStr = weekEnd.toISOString().split('T')[0]
      
      return this.appointments.filter(appointment => 
        appointment.date >= startStr && appointment.date <= endStr
      )
    },

    thisMonthAppointments() {
      const today = new Date()
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      
      const startStr = monthStart.toISOString().split('T')[0]
      const endStr = monthEnd.toISOString().split('T')[0]
      
      return this.appointments.filter(appointment => 
        appointment.date >= startStr && appointment.date <= endStr
      )
    },

    weekDays() {
      const today = new Date()
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay())
      
      const days = []
      const dayNames = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart)
        date.setDate(weekStart.getDate() + i)
        const dateStr = date.toISOString().split('T')[0]
        
        days.push({
          name: dayNames[i],
          date: date.getDate(),
          appointments: this.appointments.filter(appointment => 
            appointment.date === dateStr
          )
        })
      }
      
      return days
    }
  },
  async mounted() {
    await this.fetchAppointments()
  },
  methods: {
    async fetchAppointments() {
      try {
        this.loading = true
        // Fetch directly from API for calendar view
        const response = await this.$api.testDrives.getAll()

        // Handle different response formats
        if (Array.isArray(response)) {
          this.queues = response
        } else if (response.testDrives) {
          this.queues = response.testDrives
        } else if (response.data) {
          this.queues = response.data
        } else {
          this.queues = []
        }

        console.log('✅ Fetched calendar appointments:', this.queues.length)
      } catch (error) {
        console.error('Error fetching calendar data:', error)
        this.$toast?.error('ไม่สามารถโหลดข้อมูลปฏิทินได้')
        this.queues = []
      } finally {
        this.loading = false
      }
    },


    handleDateSelected(date) {
      this.selectedDate = date
    },
    
    handleAppointmentSelected(appointment) {
      this.selectedAppointment = appointment
      this.showModal = true
    },
    
    closeModal() {
      this.showModal = false
      this.selectedAppointment = null
    },
    
    editAppointment(appointment) {
      this.$router.push(`/dashboard/queue/${appointment.id}/edit`)
    },
    
    addAppointment() {
      this.$router.push('/dashboard/queue/add')
    },
    
    async refreshData() {
      await this.fetchAppointments()
      this.$toast?.success('รีเฟรชข้อมูลเรียบร้อย')
    },
    
    getCurrentDate() {
      return new Date().toLocaleDateString('th-TH', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short'
      })
    }
  }
}
</script>
