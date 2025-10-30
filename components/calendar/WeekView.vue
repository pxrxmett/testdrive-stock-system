<template>
  <div class="week-view">
    <div class="week-grid">
      <div class="time-column">
        <div class="time-header"></div>
        <div
          v-for="slot in timeSlots"
          :key="slot"
          class="time-slot"
        >
          {{ slot }}
        </div>
      </div>

      <div
        v-for="day in weekDays"
        :key="day.dateString"
        class="day-column"
        :class="{ 'is-today': day.isToday }"
      >
        <div class="day-header">
          <div class="day-name">{{ day.dayName }}</div>
          <div class="day-number" :class="{ 'is-today': day.isToday }">
            {{ day.day }}
          </div>
        </div>

        <div class="day-slots">
          <div
            v-for="slot in timeSlots"
            :key="slot"
            class="slot"
            @click="selectSlot(day.dateString, slot)"
          >
            <div
              v-for="booking in getSlotBookings(day.dateString, slot)"
              :key="booking.id"
              class="booking-card"
              :class="`status-${booking.status}`"
              @click.stop="$emit('select-booking', booking)"
            >
              <div class="booking-time">{{ booking.time }}</div>
              <div class="booking-customer">{{ booking.customerName }}</div>
              <div class="booking-vehicle">{{ booking.vehicleModel }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'WeekView',
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
      timeSlots: [
        '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00'
      ],
      dayNames: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
    }
  },
  computed: {
    weekDays() {
      const days = []
      const startOfWeek = this.currentDate.startOf('week')

      for (let i = 0; i < 7; i++) {
        const date = startOfWeek.add(i, 'day')
        days.push({
          date,
          dateString: date.format('YYYY-MM-DD'),
          day: date.date(),
          dayName: this.dayNames[date.day()],
          isToday: date.isSame(dayjs(), 'day')
        })
      }

      return days
    }
  },
  methods: {
    getSlotBookings(dateString, timeSlot) {
      const dateBookings = this.bookingsByDate[dateString]
      if (!dateBookings || !dateBookings.bookings) return []

      return dateBookings.bookings.filter(booking => {
        const bookingTime = booking.appointmentTime || booking.appointment_time
        if (!bookingTime) return false

        // Extract hour from booking time (e.g., "09:30" -> "09:00")
        const hour = bookingTime.split(':')[0]
        const slotHour = timeSlot.split(':')[0]
        return hour === slotHour
      })
    },
    selectSlot(dateString, timeSlot) {
      this.$emit('select-slot', { date: dateString, time: timeSlot })
    }
  }
}
</script>

<style scoped>
.week-view {
  padding: 12px;
  overflow-x: auto;
}

.week-grid {
  display: flex;
  min-width: 800px;
}

.time-column {
  width: 60px;
  flex-shrink: 0;
}

.time-header {
  height: 60px;
  border-bottom: 2px solid #E5E7EB;
}

.time-slot {
  height: 60px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  font-size: 12px;
  color: #6B7280;
  padding-top: 4px;
  border-bottom: 1px solid #F3F4F6;
}

.day-column {
  flex: 1;
  min-width: 100px;
  border-left: 1px solid #E5E7EB;
}

.day-column.is-today {
  background: #EFF6FF;
}

.day-header {
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom: 2px solid #E5E7EB;
  gap: 4px;
}

.day-name {
  font-size: 12px;
  color: #6B7280;
  font-weight: 500;
}

.day-number {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.day-number.is-today {
  background: #3B82F6;
  color: white;
}

.day-slots {
  position: relative;
}

.slot {
  height: 60px;
  border-bottom: 1px solid #F3F4F6;
  padding: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.slot:hover {
  background: #F9FAFB;
}

.booking-card {
  padding: 6px 8px;
  border-radius: 6px;
  margin-bottom: 4px;
  font-size: 11px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 3px solid;
}

.booking-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.booking-card.status-pending {
  background: #FEF3C7;
  border-left-color: #F59E0B;
  color: #92400E;
}

.booking-card.status-ongoing {
  background: #DBEAFE;
  border-left-color: #3B82F6;
  color: #1E40AF;
}

.booking-card.status-completed {
  background: #D1FAE5;
  border-left-color: #10B981;
  color: #065F46;
}

.booking-card.status-cancelled {
  background: #FEE2E2;
  border-left-color: #EF4444;
  color: #991B1B;
}

.booking-time {
  font-weight: 600;
  margin-bottom: 2px;
}

.booking-customer {
  font-weight: 500;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.booking-vehicle {
  opacity: 0.8;
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media screen and (max-width: 767px) {
  .week-grid {
    min-width: 600px;
  }

  .day-column {
    min-width: 80px;
  }

  .time-slot,
  .slot {
    height: 50px;
  }

  .booking-card {
    font-size: 9px;
    padding: 4px 6px;
  }
}
</style>
