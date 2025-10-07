<template>
  <span :class="statusClasses">
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
        'in-progress': {
          classes: 'status-badge status-in-progress',
          label: 'กำลังทดสอบ'
        },
        'scheduled': {
          classes: 'status-badge status-scheduled',
          label: 'รอคิว'
        },
        'completed': {
          classes: 'status-badge status-completed',
          label: 'เสร็จสิ้น'
        },
        'cancelled': {
          classes: 'status-badge status-cancelled',
          label: 'ยกเลิก'
        }
      }
      return configs[this.status] || configs['scheduled']
    },
    statusClasses() {
      return this.statusConfig.classes
    },
    statusLabel() {
      return this.statusConfig.label
    }
  }
}
</script>
