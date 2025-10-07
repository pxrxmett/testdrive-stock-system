<template>
  <div class="card p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">สถิติด่วน</h3>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="text-center">
        <div class="text-2xl font-bold text-blue-600">{{ stats.total }}</div>
        <div class="text-sm text-gray-600">คิวทั้งหมด</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-green-600">{{ stats.inProgress }}</div>
        <div class="text-sm text-gray-600">กำลังทดสอบ</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-yellow-600">{{ stats.scheduled }}</div>
        <div class="text-sm text-gray-600">รอคิว</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-600">{{ stats.completed }}</div>
        <div class="text-sm text-gray-600">เสร็จสิ้น</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'QuickStats',
  computed: {
    ...mapGetters('dashboard', ['statsData']),
    stats() {
      return this.statsData
    }
  }
}
</script>
