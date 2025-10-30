<template>
  <div class="month-view">
    <div class="weekday-headers">
      <div v-for="day in weekdays" :key="day" class="weekday-header">
        {{ day }}
      </div>
    </div>

    <div class="calendar-grid">
      <div
        v-for="day in calendarDays"
        :key="day.dateString"
        class="calendar-day"
        :class="{
          'other-month': !day.isCurrentMonth,
          'today': day.isToday,
          'selected': isSelected(day.dateString),
          'has-bookings': hasBookings(day.dateString)
        }"
        @click="selectDate(day.dateString)"
      >
        <div class="day-number">{{ day.day }}</div>

        <div v-if="hasBookings(day.dateString)" class="booking-indicators">
          <div class="indicator-dots">
            <span
              v-if="getDateBookings(day.dateString).pending > 0"
              class="dot pending"
              :title="`รอดำเนินการ ${getDateBookings(day.dateString).pending}`"
            ></span>
            <span
              v-if="getDateBookings(day.dateString).ongoing > 0"
              class="dot ongoing"
              :title="`กำลังทดลองขับ ${getDateBookings(day.dateString).ongoing}`"
            ></span>
            <span
              v-if="getDateBookings(day.dateString).completed > 0"
              class="dot completed"
              :title="`เสร็จสิ้น ${getDateBookings(day.dateString).completed}`"
            ></span>
          </div>
          <div class="booking-count">{{ getDateBookings(day.dateString).total }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'MonthView',
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
    },
    selectedDate: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      weekdays: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
    }
  },
  computed: {
    calendarDays() {
      const days = []
      const startOfMonth = this.currentDate.startOf('month')
      const endOfMonth = this.currentDate.endOf('month')
      const startDay = startOfMonth.day() // 0 = Sunday

      // Previous month days
      const prevMonthEnd = startOfMonth.subtract(1, 'day')
      for (let i = startDay - 1; i >= 0; i--) {
        const date = prevMonthEnd.subtract(i, 'day')
        days.push({
          date,
          dateString: date.format('YYYY-MM-DD'),
          day: date.date(),
          isCurrentMonth: false,
          isToday: date.isSame(dayjs(), 'day')
        })
      }

      // Current month days
      const daysInMonth = endOfMonth.date()
      for (let i = 1; i <= daysInMonth; i++) {
        const date = startOfMonth.date(i)
        days.push({
          date,
          dateString: date.format('YYYY-MM-DD'),
          day: i,
          isCurrentMonth: true,
          isToday: date.isSame(dayjs(), 'day')
        })
      }

      // Next month days
      const remainingDays = 42 - days.length // 6 weeks * 7 days
      for (let i = 1; i <= remainingDays; i++) {
        const date = endOfMonth.add(i, 'day')
        days.push({
          date,
          dateString: date.format('YYYY-MM-DD'),
          day: date.date(),
          isCurrentMonth: false,
          isToday: date.isSame(dayjs(), 'day')
        })
      }

      return days
    }
  },
  methods: {
    hasBookings(dateString) {
      return !!this.bookingsByDate[dateString]
    },
    getDateBookings(dateString) {
      return this.bookingsByDate[dateString] || { total: 0, pending: 0, ongoing: 0, completed: 0, cancelled: 0 }
    },
    isSelected(dateString) {
      return this.selectedDate && this.selectedDate.format('YYYY-MM-DD') === dateString
    },
    selectDate(dateString) {
      this.$emit('select-date', dateString)
    }
  }
}
</script>

<style scoped>
.month-view {
  padding: 12px;
}

.weekday-headers {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.weekday-header {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #6B7280;
  padding: 8px 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-day {
  aspect-ratio: 1;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  position: relative;
  display: flex;
  flex-direction: column;
}

.calendar-day:hover {
  background: #F9FAFB;
  border-color: #D1D5DB;
}

.calendar-day.other-month {
  background: #F9FAFB;
  opacity: 0.5;
}

.calendar-day.today {
  border-color: #3B82F6;
  background: #EFF6FF;
}

.calendar-day.selected {
  background: #DBEAFE;
  border-color: #3B82F6;
  border-width: 2px;
}

.calendar-day.has-bookings {
  border-color: #DA291C;
}

.day-number {
  font-size: 13px;
  font-weight: 500;
  color: #111827;
  text-align: center;
  margin-bottom: 4px;
}

.booking-indicators {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.indicator-dots {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
  justify-content: center;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.dot.pending {
  background-color: #F59E0B;
}

.dot.ongoing {
  background-color: #3B82F6;
}

.dot.completed {
  background-color: #10B981;
}

.dot.cancelled {
  background-color: #EF4444;
}

.booking-count {
  font-size: 11px;
  font-weight: 600;
  color: #DA291C;
  background: #FEF2F2;
  padding: 2px 6px;
  border-radius: 10px;
}

@media screen and (max-width: 767px) {
  .month-view {
    padding: 8px;
  }

  .weekday-header {
    font-size: 10px;
    padding: 4px 0;
  }

  .day-number {
    font-size: 11px;
  }

  .booking-count {
    font-size: 9px;
    padding: 1px 4px;
  }

  .dot {
    width: 4px;
    height: 4px;
  }
}
</style>
