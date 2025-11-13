<template>
  <span
    :class="[
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
      statusClasses
    ]"
  >
    <span :class="['w-2 h-2 rounded-full mr-2', dotClass]"></span>
    {{ statusLabel }}
  </span>
</template>

<script>
export default {
  name: 'StatusBadge',
  props: {
    status: {
      type: String,
      required: true
    }
  },
  computed: {
    statusConfig() {
      const configs = {
        pending: {
          label: 'รอยืนยัน',
          textColor: 'text-yellow-800',
          bgColor: 'bg-yellow-100',
          dotColor: 'bg-yellow-500'
        },
        confirmed: {
          label: 'ยืนยันแล้ว',
          textColor: 'text-green-800',
          bgColor: 'bg-green-100',
          dotColor: 'bg-green-500'
        },
        in_progress: {
          label: 'กำลังทดลองขับ',
          textColor: 'text-blue-800',
          bgColor: 'bg-blue-100',
          dotColor: 'bg-[#D52B1E]'
        },
        'in-progress': {
          label: 'กำลังทดลองขับ',
          textColor: 'text-blue-800',
          bgColor: 'bg-blue-100',
          dotColor: 'bg-[#D52B1E]'
        },
        completed: {
          label: 'เสร็จสิ้น',
          textColor: 'text-green-800',
          bgColor: 'bg-green-100',
          dotColor: 'bg-green-600'
        },
        cancelled: {
          label: 'ยกเลิก',
          textColor: 'text-red-800',
          bgColor: 'bg-red-100',
          dotColor: 'bg-red-500'
        },
        no_show: {
          label: 'ไม่มาตามนัด',
          textColor: 'text-gray-800',
          bgColor: 'bg-gray-100',
          dotColor: 'bg-gray-500'
        },
        scheduled: {
          label: 'รอคิว',
          textColor: 'text-yellow-800',
          bgColor: 'bg-yellow-100',
          dotColor: 'bg-yellow-500'
        }
      }
      return configs[this.status] || configs.pending
    },
    statusClasses() {
      return `${this.statusConfig.textColor} ${this.statusConfig.bgColor}`
    },
    dotClass() {
      return this.statusConfig.dotColor
    },
    statusLabel() {
      return this.statusConfig.label
    }
  }
}
</script>

<style scoped>
/* Smooth transitions */
span {
  transition: all 0.2s ease-in-out;
}
</style>
