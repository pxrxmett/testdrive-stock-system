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
    <LoadingSkeleton
      v-if="loading"
      variant="card"
      :count="1"
    />

    <!-- Quick Stats -->
    <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-2xl font-bold text-[#D52B1E]">{{ todayAppointments.length }}</p>
            <p class="text-sm text-gray-600">นัดหมายวันนี้</p>
          </div>
          <Icon name="calendar" icon-class="w-8 h-8 text-red-400" />
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
    <div v-if="!loading" class="card">
      <!-- Calendar Header -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <!-- Left: Date Navigation -->
          <div class="flex items-center gap-3">
            <button
              @click="previousPeriod"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <i class="material-icons text-gray-600">chevron_left</i>
            </button>

            <div class="text-center min-w-[200px]">
              <h2 class="text-lg font-bold text-gray-900">{{ currentDateDisplay }}</h2>
            </div>

            <button
              @click="nextPeriod"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <i class="material-icons text-gray-600">chevron_right</i>
            </button>

            <button
              @click="goToToday"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              วันนี้
            </button>
          </div>

          <!-- Right: View Toggle & Filter -->
          <div class="flex items-center gap-3">
            <!-- Car Model Filter -->
            <select
              v-model="selectedCarModel"
              class="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E]"
            >
              <option value="">ทุกรุ่นรถ</option>
              <option v-for="model in carModels" :key="model" :value="model">
                {{ model }}
              </option>
            </select>

            <!-- View Toggle -->
            <div class="inline-flex rounded-lg border border-gray-300 bg-white">
              <button
                @click="currentView = 'month'"
                :class="[
                  'px-4 py-2 text-sm font-medium rounded-l-lg transition-colors',
                  currentView === 'month'
                    ? 'bg-[#D52B1E] text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                ]"
              >
                เดือน
              </button>
              <button
                @click="currentView = 'week'"
                :class="[
                  'px-4 py-2 text-sm font-medium border-l border-gray-300 transition-colors',
                  currentView === 'week'
                    ? 'bg-[#D52B1E] text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                ]"
              >
                สัปดาห์
              </button>
              <button
                @click="currentView = 'day'"
                :class="[
                  'px-4 py-2 text-sm font-medium border-l border-gray-300 rounded-r-lg transition-colors',
                  currentView === 'day'
                    ? 'bg-[#D52B1E] text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                ]"
              >
                วัน
              </button>
            </div>
          </div>
        </div>

        <!-- Status Legend -->
        <div class="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-100">
          <span class="text-sm text-gray-600 font-medium">สถานะ:</span>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span class="text-xs text-gray-600">รอดำเนินการ</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-[#D52B1E]"></span>
            <span class="text-xs text-gray-600">กำลังทดลองขับ</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-green-500"></span>
            <span class="text-xs text-gray-600">เสร็จสิ้น</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-red-500"></span>
            <span class="text-xs text-gray-600">ยกเลิก</span>
          </div>
        </div>
      </div>

      <!-- Calendar Views -->
      <div class="calendar-container">
        <MonthView
          v-if="currentView === 'month'"
          :current-date="currentDate"
          :bookings="filteredBookings"
          :bookings-by-date="bookingsByDate"
          :selected-date="selectedDate"
          @select-date="handleDateSelected"
        />

        <WeekView
          v-if="currentView === 'week'"
          :current-date="currentDate"
          :bookings="filteredBookings"
          :bookings-by-date="bookingsByDate"
          @select-slot="handleSlotSelected"
          @select-booking="handleAppointmentSelected"
        />

        <DayView
          v-if="currentView === 'day'"
          :current-date="currentDate"
          :bookings="filteredBookings"
          :bookings-by-date="bookingsByDate"
          @create-booking="handleCreateBooking"
          @select-booking="handleAppointmentSelected"
          @confirm-booking="handleConfirmBooking"
          @edit-booking="handleEditBooking"
          @cancel-booking="handleCancelBooking"
        />
      </div>
    </div>

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
            class="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
            @click="handleAppointmentSelected(appointment)"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-[#D52B1E] rounded-full flex items-center justify-center">
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
              <p class="text-lg font-semibold text-[#D52B1E]">{{ appointment.timeSlot }}</p>
              <StatusBadge :status="appointment.status" />
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Appointments -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">นัดหมายที่จะมาถึง</h3>
          <nuxt-link to="/dashboard/queue" class="text-sm text-[#D52B1E] hover:text-red-700">
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
import dayjs from 'dayjs'
import 'dayjs/locale/th'
import MonthView from '~/components/calendar/MonthView.vue'
import WeekView from '~/components/calendar/WeekView.vue'
import DayView from '~/components/calendar/DayView.vue'

dayjs.locale('th')

export default {
  name: 'CalendarPage',
  layout: 'dashboard',
  components: {
    MonthView,
    WeekView,
    DayView
  },
  head() {
    return {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
        }
      ]
    }
  },
  data() {
    return {
      currentView: 'month',
      currentDate: dayjs(),
      selectedDate: null,
      selectedCarModel: '',
      selectedAppointment: null,
      showModal: false,
      loading: false,
      queues: []
    }
  },
  computed: {
    currentDateDisplay() {
      if (this.currentView === 'month') {
        return this.currentDate.format('MMMM YYYY')
      } else if (this.currentView === 'week') {
        const startOfWeek = this.currentDate.startOf('week')
        const endOfWeek = this.currentDate.endOf('week')
        return `${startOfWeek.format('D MMM')} - ${endOfWeek.format('D MMM YYYY')}`
      } else {
        return this.currentDate.format('D MMMM YYYY')
      }
    },

    carModels() {
      // Extract unique car models from queues
      const models = new Set()
      this.queues.forEach(queue => {
        const model = queue.vehicleModel || queue.vehicle_model
        if (model) models.add(model)
      })
      return Array.from(models).sort()
    },

    filteredBookings() {
      if (!this.selectedCarModel) {
        return this.appointments
      }
      return this.appointments.filter(appointment =>
        appointment.carModel === this.selectedCarModel
      )
    },

    bookingsByDate() {
      const byDate = {}

      this.filteredBookings.forEach(booking => {
        const dateStr = booking.date
        if (!dateStr) return

        if (!byDate[dateStr]) {
          byDate[dateStr] = {
            total: 0,
            pending: 0,
            ongoing: 0,
            completed: 0,
            cancelled: 0,
            bookings: []
          }
        }

        byDate[dateStr].total++
        byDate[dateStr][booking.status] = (byDate[dateStr][booking.status] || 0) + 1
        byDate[dateStr].bookings.push(booking)
      })

      return byDate
    },

    appointments() {
      // Map queues to appointment format with proper date/time handling
      return this.queues.map(queue => {
        // Extract date from test_drive_date (API format)
        const testDriveDate = queue.test_drive_date || queue.testDriveDate || queue.appointmentDate || queue.appointment_date
        const testDriveTime = queue.test_drive_time || queue.testDriveTime || queue.appointmentTime || queue.appointment_time

        // Format date to YYYY-MM-DD
        let dateStr = ''
        if (testDriveDate) {
          try {
            const date = new Date(testDriveDate)
            dateStr = date.toISOString().split('T')[0]
          } catch (e) {
            // If already in YYYY-MM-DD format
            dateStr = testDriveDate
          }
        }

        return {
          id: queue.id,
          date: dateStr,
          timeSlot: testDriveTime || 'N/A',
          appointmentTime: testDriveTime || 'N/A',
          appointment_time: testDriveTime || 'N/A',
          test_drive_time: testDriveTime || 'N/A',
          customerName: queue.customer_name || queue.customerName || 'N/A',
          customer_name: queue.customer_name || queue.customerName || 'N/A',
          carModel: queue.vehicle_model || queue.vehicleModel || 'N/A',
          vehicleModel: queue.vehicle_model || queue.vehicleModel || 'N/A',
          vehicle_model: queue.vehicle_model || queue.vehicleModel || 'N/A',
          phone: queue.customer_phone || queue.phone || 'N/A',
          customer_phone: queue.customer_phone || queue.phone || 'N/A',
          location: queue.location || queue.branch || 'N/A',
          status: queue.status || 'scheduled',
          notes: queue.notes || '',
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

    previousPeriod() {
      if (this.currentView === 'month') {
        this.currentDate = this.currentDate.subtract(1, 'month')
      } else if (this.currentView === 'week') {
        this.currentDate = this.currentDate.subtract(1, 'week')
      } else {
        this.currentDate = this.currentDate.subtract(1, 'day')
      }
    },

    nextPeriod() {
      if (this.currentView === 'month') {
        this.currentDate = this.currentDate.add(1, 'month')
      } else if (this.currentView === 'week') {
        this.currentDate = this.currentDate.add(1, 'week')
      } else {
        this.currentDate = this.currentDate.add(1, 'day')
      }
    },

    goToToday() {
      this.currentDate = dayjs()
      this.currentView = 'day'
    },

    handleDateSelected(dateString) {
      this.selectedDate = dayjs(dateString)
      this.currentDate = dayjs(dateString)
      this.currentView = 'day'
    },

    handleSlotSelected({ date, time }) {
      this.currentDate = dayjs(date)
      this.currentView = 'day'
    },

    handleAppointmentSelected(appointment) {
      this.selectedAppointment = appointment
      this.showModal = true
    },

    handleCreateBooking({ date, time }) {
      this.$router.push({
        path: '/dashboard/queue/add',
        query: { date, time }
      })
    },

    handleConfirmBooking(booking) {
      // Future Enhancement: Implement booking confirmation API
      // await this.$api.testDrives.confirm(booking.id)
      console.log('Confirm booking:', booking)
      this.$toast?.info('ฟีเจอร์นี้จะพัฒนาในเวอร์ชันถัดไป')
    },

    handleEditBooking(booking) {
      this.$router.push(`/dashboard/queue/${booking.id}/edit`)
    },

    async handleCancelBooking(booking) {
      if (!confirm('คุณต้องการยกเลิกการจองนี้หรือไม่?')) return

      try {
        // Future Enhancement: Implement cancel booking API
        // await this.$api.testDrives.cancel(booking.id)
        console.log('Cancel booking:', booking)
        this.$toast?.info('ฟีเจอร์นี้จะพัฒนาในเวอร์ชันถัดไป')
        await this.refreshData()
      } catch (error) {
        console.error('Error canceling booking:', error)
        this.$toast?.error('ไม่สามารถยกเลิกการจองได้')
      }
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
