<template>
  <div class="card p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">กิจกรรมล่าสุด</h3>
      <nuxt-link to="/dashboard/queue" class="text-sm text-red-600 hover:text-red-700">
        ดูทั้งหมด
      </nuxt-link>
    </div>
    
    <div v-if="recentQueues.length > 0" class="space-y-3">
      <div
        v-for="queue in recentQueues"
        :key="queue.id"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
      >
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span class="text-white text-xs font-medium">
              {{ queue.customerName.split(' ')[1]?.charAt(0) || 'ค' }}
            </span>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">{{ queue.customerName }}</p>
            <p class="text-xs text-gray-500">{{ queue.carModel }}</p>
          </div>
        </div>

        <div class="text-right">
          <p class="text-sm text-gray-900">{{ queue.timeSlot }}</p>
          <StatusBadge :status="queue.status" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>
      <p class="text-sm text-gray-500 mb-2">ยังไม่มีกิจกรรมล่าสุด</p>
      <nuxt-link to="/dashboard/queue/add" class="text-xs text-red-600 hover:text-red-700">
        เพิ่มคิวใหม่
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'RecentActivity',
  computed: {
    ...mapState('dashboard', ['queues']),
    recentQueues() {
      return this.queues.slice(0, 5)
    }
  }
}
</script>
