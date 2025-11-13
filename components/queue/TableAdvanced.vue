<template>
  <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
    <!-- Table Header -->
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">
          รายการคิวทั้งหมด ({{ queues.length }})
        </h3>
        <div class="flex items-center space-x-3">
          <select
            v-model="filters.branch"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="">ทุกสาขา</option>
            <option value="กรุงเทพ">กรุงเทพ</option>
            <option value="เชียงใหม่">เชียงใหม่</option>
            <option value="ภูเก็ต">ภูเก็ต</option>
          </select>
          <button class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
            </svg>
            <span>ตัวกรอง</span>
          </button>
          <button class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span>ส่งออก</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              วันที่/เวลา
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ลูกค้า
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              รถยนต์
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              เซลล์
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              สถานะ
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              จัดการ
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="queue in filteredQueues"
            :key="queue.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <!-- Date/Time Column -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ formatDate(queue.testDriveDate) }}</div>
                  <div class="text-sm text-gray-500">{{ queue.testDriveTime }}</div>
                  <div class="text-xs text-gray-400">{{ queue.duration || '60' }} นาที</div>
                </div>
              </div>
            </td>

            <!-- Customer Column -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm" :class="getAvatarColor(queue.customerName)">
                  {{ getInitials(queue.customerName) }}
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ queue.customerName }}</div>
                  <div class="text-sm text-gray-500">{{ queue.customerPhone }}</div>
                  <span
                    v-if="queue.customerType"
                    :class="getCustomerTypeClass(queue.customerType)"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1"
                  >
                    {{ getCustomerTypeLabel(queue.customerType) }}
                  </span>
                </div>
              </div>
            </td>

            <!-- Vehicle Column -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ queue.vehicleModel }}</div>
              <div class="text-xs text-gray-500">รหัส: {{ getQueueCode(queue.id) }}</div>
              <div class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 mt-1">
                {{ queue.branch || 'กรุงเทพ' }}
              </div>
            </td>

            <!-- Sales Column -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div v-if="queue.salesPerson" class="flex items-center space-x-2">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-xs">
                  {{ getInitials(queue.salesPerson) }}
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ queue.salesPerson }}</div>
                  <div class="text-xs text-gray-500">{{ queue.salesPosition || 'เซลล์' }}</div>
                </div>
              </div>
              <div v-else class="text-sm text-gray-400">-</div>
            </td>

            <!-- Status Column -->
            <td class="px-6 py-4 whitespace-nowrap">
              <button
                :class="getStatusButtonClass(queue.status)"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer hover:shadow-md"
                @click="$emit('status-click', queue)"
              >
                {{ getStatusLabel(queue.status) }}
              </button>
            </td>

            <!-- Actions Column -->
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <button
                  @click="$emit('view', queue)"
                  class="text-gray-400 hover:text-blue-600 transition-colors"
                  title="ดูรายละเอียด"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
                <button
                  @click="$emit('edit', queue)"
                  class="text-gray-400 hover:text-yellow-600 transition-colors"
                  title="แก้ไข"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                <button
                  @click="$emit('delete', queue)"
                  class="text-gray-400 hover:text-red-600 transition-colors"
                  title="ลบ"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="filteredQueues.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">ไม่มีคิว</h3>
      <p class="mt-1 text-sm text-gray-500">ลองเพิ่มคิวทดลองขับใหม่</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QueueTableAdvanced',
  props: {
    queues: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      filters: {
        branch: ''
      }
    }
  },
  computed: {
    filteredQueues() {
      if (!this.filters.branch) return this.queues
      return this.queues.filter(q => q.branch === this.filters.branch)
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('th-TH', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    },

    getInitials(name) {
      if (!name) return '?'
      const parts = name.split(' ')
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
    },

    getAvatarColor(name) {
      const colors = [
        'bg-red-100 text-red-600',
        'bg-blue-100 text-blue-600',
        'bg-green-100 text-green-600',
        'bg-yellow-100 text-yellow-600',
        'bg-purple-100 text-purple-600',
        'bg-pink-100 text-pink-600'
      ]
      const hash = name ? name.charCodeAt(0) % colors.length : 0
      return colors[hash]
    },

    getCustomerTypeClass(type) {
      const classes = {
        vip: 'bg-purple-100 text-purple-700',
        family: 'bg-blue-100 text-blue-700',
        business: 'bg-green-100 text-green-700'
      }
      return classes[type] || 'bg-gray-100 text-gray-700'
    },

    getCustomerTypeLabel(type) {
      const labels = {
        vip: 'VIP',
        family: 'ครอบครัว',
        business: 'ธุรกิจ'
      }
      return labels[type] || type
    },

    getQueueCode(id) {
      if (!id) return 'N/A'
      // Convert to string and get first 8 characters
      const idStr = String(id)
      return idStr.substring(0, 8).toUpperCase()
    },

    getStatusButtonClass(status) {
      const classes = {
        pending: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
        confirmed: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
        in_progress: 'bg-green-100 text-green-700 hover:bg-green-200',
        completed: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
        cancelled: 'bg-red-100 text-red-700 hover:bg-red-200'
      }
      return classes[status] || 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    },

    getStatusLabel(status) {
      const labels = {
        pending: 'รอดำเนินการ',
        confirmed: 'ยืนยันแล้ว',
        in_progress: 'กำลังทดสอบ',
        completed: 'เสร็จสิ้น',
        cancelled: 'ยกเลิก'
      }
      return labels[status] || status
    }
  }
}
</script>
