<template>
  <div class="day-view">
    <div class="day-header">
      <h3 class="day-title">{{ formattedDate }}</h3>
      <div class="booking-summary">
        <span class="summary-item">ทั้งหมด: {{ dayBookings.total }}</span>
        <span class="summary-item pending">รอดำเนินการ: {{ dayBookings.pending }}</span>
        <span class="summary-item ongoing">กำลังทดลอง: {{ dayBookings.ongoing }}</span>
        <span class="summary-item completed">เสร็จสิ้น: {{ dayBookings.completed }}</span>
      </div>
    </div>

    <div class="time-grid">
      <div
        v-for="slot in timeSlots"
        :key="slot.time"
        class="time-row"
      >
        <div class="time-label">
          <div class="time-text">{{ slot.time }}</div>
          <div class="time-range">{{ slot.range }}</div>
        </div>

        <div class="time-content">
          <div
            v-if="slot.bookings.length === 0"
            class="empty-slot"
            @click="$emit('create-booking', { date: currentDate.format('YYYY-MM-DD'), time: slot.time })"
          >
            <span class="empty-text">+ เพิ่มการจอง</span>
          </div>

          <div
            v-for="booking in slot.bookings"
            :key="booking.id"
            class="booking-detail"
            :class="`status-${booking.status}`"
            @click="$emit('select-booking', booking)"
          >
            <div class="booking-header">
              <div class="booking-time-badge">{{ booking.time }}</div>
              <div class="booking-status-badge" :class="`status-${booking.status}`">
                {{ getStatusText(booking.status) }}
              </div>
            </div>

            <div class="booking-info">
              <div class="info-row">
                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span class="info-text">{{ booking.customerName }}</span>
              </div>

              <div class="info-row">
                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span class="info-text">{{ booking.phone }}</span>
              </div>

              <div class="info-row">
                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span class="info-text vehicle">{{ booking.vehicleModel }}</span>
              </div>

              <div v-if="booking.notes" class="info-row notes">
                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <span class="info-text">{{ booking.notes }}</span>
              </div>
            </div>

            <div class="booking-actions">
              <button
                v-if="booking.status === 'pending'"
                @click.stop="$emit('confirm-booking', booking)"
                class="action-btn confirm"
              >
                ยืนยัน
              </button>
              <button
                @click.stop="$emit('edit-booking', booking)"
                class="action-btn edit"
              >
                แก้ไข
              </button>
              <button
                @click.stop="$emit('cancel-booking', booking)"
                class="action-btn cancel"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import 'dayjs/locale/th'

export default {
  name: 'DayView',
  props: {
    currentDate: {
      type: Object,
      required: true
    },
    bookings: {
      type: Array,
      default: () => []
    },
    bookingsByDate: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      openHours: [
        { time: '09:00', range: '09:00-10:00' },
        { time: '10:00', range: '10:00-11:00' },
        { time: '11:00', range: '11:00-12:00' },
        { time: '12:00', range: '12:00-13:00' },
        { time: '13:00', range: '13:00-14:00' },
        { time: '14:00', range: '14:00-15:00' },
        { time: '15:00', range: '15:00-16:00' },
        { time: '16:00', range: '16:00-17:00' },
        { time: '17:00', range: '17:00-18:00' }
      ]
    }
  },
  computed: {
    formattedDate() {
      dayjs.locale('th')
      return this.currentDate.format('วันdddd ที่ D MMMM YYYY')
    },
    dateString() {
      return this.currentDate.format('YYYY-MM-DD')
    },
    dayBookings() {
      return this.bookingsByDate[this.dateString] || {
        total: 0,
        pending: 0,
        ongoing: 0,
        completed: 0,
        cancelled: 0,
        bookings: []
      }
    },
    timeSlots() {
      return this.openHours.map(slot => ({
        ...slot,
        bookings: this.getTimeSlotBookings(slot.time)
      }))
    }
  },
  methods: {
    getTimeSlotBookings(timeSlot) {
      if (!this.dayBookings.bookings) return []

      return this.dayBookings.bookings.filter(booking => {
        const bookingTime = booking.appointmentTime || booking.appointment_time
        if (!bookingTime) return false

        const hour = bookingTime.split(':')[0]
        const slotHour = timeSlot.split(':')[0]
        return hour === slotHour
      }).map(booking => ({
        ...booking,
        time: booking.appointmentTime || booking.appointment_time,
        customerName: booking.customerName || booking.customer_name || 'N/A',
        phone: booking.phone || booking.customer_phone || 'N/A',
        vehicleModel: booking.vehicleModel || booking.vehicle_model || 'N/A'
      }))
    },
    getStatusText(status) {
      const statusMap = {
        pending: 'รอดำเนินการ',
        ongoing: 'กำลังทดลองขับ',
        completed: 'เสร็จสิ้น',
        cancelled: 'ยกเลิก'
      }
      return statusMap[status] || status
    }
  }
}
</script>

<style scoped>
.day-view {
  padding: 16px;
}

.day-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #E5E7EB;
}

.day-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
}

.booking-summary {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.summary-item {
  font-size: 13px;
  font-weight: 500;
  color: #6B7280;
  padding: 4px 12px;
  background: #F3F4F6;
  border-radius: 12px;
}

.summary-item.pending {
  background: #FEF3C7;
  color: #92400E;
}

.summary-item.ongoing {
  background: #DBEAFE;
  color: #1E40AF;
}

.summary-item.completed {
  background: #D1FAE5;
  color: #065F46;
}

.time-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.time-row {
  display: flex;
  gap: 16px;
}

.time-label {
  width: 100px;
  flex-shrink: 0;
  padding-top: 8px;
}

.time-text {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.time-range {
  font-size: 12px;
  color: #6B7280;
  margin-top: 2px;
}

.time-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-slot {
  min-height: 60px;
  border: 2px dashed #D1D5DB;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.empty-slot:hover {
  border-color: #3B82F6;
  background: #EFF6FF;
}

.empty-text {
  font-size: 13px;
  color: #6B7280;
  font-weight: 500;
}

.empty-slot:hover .empty-text {
  color: #3B82F6;
}

.booking-detail {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 4px solid;
}

.booking-detail:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.booking-detail.status-pending {
  border-left-color: #F59E0B;
  background: #FFFBEB;
}

.booking-detail.status-ongoing {
  border-left-color: #3B82F6;
  background: #EFF6FF;
}

.booking-detail.status-completed {
  border-left-color: #10B981;
  background: #ECFDF5;
}

.booking-detail.status-cancelled {
  border-left-color: #EF4444;
  background: #FEF2F2;
  opacity: 0.7;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.booking-time-badge {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}

.booking-status-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 12px;
}

.booking-status-badge.status-pending {
  background: #F59E0B;
  color: white;
}

.booking-status-badge.status-ongoing {
  background: #3B82F6;
  color: white;
}

.booking-status-badge.status-completed {
  background: #10B981;
  color: white;
}

.booking-status-badge.status-cancelled {
  background: #EF4444;
  color: white;
}

.booking-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-row.notes {
  padding-top: 8px;
  border-top: 1px solid #E5E7EB;
}

.icon {
  width: 16px;
  height: 16px;
  color: #6B7280;
  flex-shrink: 0;
}

.info-text {
  font-size: 13px;
  color: #374151;
}

.info-text.vehicle {
  font-weight: 600;
  color: #3B82F6;
}

.booking-actions {
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #E5E7EB;
}

.action-btn {
  flex: 1;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.confirm {
  background: #10B981;
  color: white;
}

.action-btn.confirm:hover {
  background: #059669;
}

.action-btn.edit {
  background: #F3F4F6;
  color: #374151;
}

.action-btn.edit:hover {
  background: #E5E7EB;
}

.action-btn.cancel {
  background: #FEE2E2;
  color: #991B1B;
}

.action-btn.cancel:hover {
  background: #FEF2F2;
}

@media screen and (max-width: 767px) {
  .day-view {
    padding: 12px;
  }

  .time-row {
    flex-direction: column;
    gap: 8px;
  }

  .time-label {
    width: 100%;
    padding-top: 0;
  }

  .booking-actions {
    flex-wrap: wrap;
  }

  .action-btn {
    min-width: calc(50% - 4px);
  }
}
</style>
