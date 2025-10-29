<template>
  <div class="bg-white rounded-lg border border-gray-200 mb-4 overflow-hidden">
    <!-- Header: Sales Info & Stats -->
    <div
      class="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-all"
      @click="toggleCollapse"
    >
      <div class="flex items-center justify-between">
        <!-- Left: Sales Info -->
        <div class="flex items-center space-x-4">
          <!-- Avatar -->
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            {{ salesInitial }}
          </div>

          <!-- Name & Badge -->
          <div>
            <div class="flex items-center space-x-2">
              <h3 class="text-lg font-bold text-gray-900">{{ salesName }}</h3>
              <span class="px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full">
                {{ queueCount }} คิว
              </span>
            </div>
            <div class="flex items-center space-x-3 mt-1">
              <span class="text-xs text-yellow-600 font-medium">
                🟡 {{ stats.pending }} รอยืนยัน
              </span>
              <span class="text-xs text-green-600 font-medium">
                🟢 {{ stats.confirmed }} ยืนยันแล้ว
              </span>
              <span class="text-xs text-gray-600 font-medium">
                ✅ {{ stats.completed }} เสร็จสิ้น
              </span>
            </div>
          </div>
        </div>

        <!-- Right: Collapse Button -->
        <button
          class="p-2 hover:bg-white/50 rounded-lg transition-colors"
          @click.stop="toggleCollapse"
        >
          <svg
            :class="['w-5 h-5 text-gray-600 transition-transform', { 'rotate-180': !isCollapsed }]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Queue Cards -->
    <transition name="expand">
      <div v-show="!isCollapsed" class="p-4 space-y-3 bg-gray-50">
        <QueueCard
          v-for="queue in queues"
          :key="queue.id"
          :queue="queue"
          @click="$emit('queue-click', queue)"
          @view="$emit('queue-view', queue)"
          @edit="$emit('queue-edit', queue)"
          @confirm="$emit('queue-confirm', queue)"
          @cancel="$emit('queue-cancel', queue)"
        />

        <!-- Empty State -->
        <div v-if="queues.length === 0" class="text-center py-8 text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p class="text-sm">ไม่มีคิวในขณะนี้</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import QueueCard from './QueueCard.vue'

export default {
  name: 'SalesGroupCard',
  components: {
    QueueCard
  },
  props: {
    salesPerson: {
      type: Object,
      default: null
    },
    queues: {
      type: Array,
      default: () => []
    },
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isCollapsed: this.collapsed
    }
  },
  computed: {
    salesName() {
      if (!this.salesPerson) return '⚠️ ไม่ระบุพนักงานขาย'
      return this.salesPerson.nickname || this.salesPerson.firstName || this.salesPerson.name || 'N/A'
    },
    salesInitial() {
      if (!this.salesPerson) return '?'
      const name = this.salesName
      return name.charAt(0).toUpperCase()
    },
    queueCount() {
      return this.queues.length
    },
    stats() {
      return {
        pending: this.queues.filter(q => q.status === 'pending').length,
        confirmed: this.queues.filter(q => q.status === 'confirmed').length,
        completed: this.queues.filter(q => q.status === 'completed').length
      }
    }
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed
      this.$emit('toggle', this.isCollapsed)
    }
  }
}
</script>

<style scoped>
/* Expand/Collapse Animation */
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease;
  max-height: 2000px;
  overflow: hidden;
}

.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Rotate Animation */
.rotate-180 {
  transform: rotate(180deg);
}
</style>
