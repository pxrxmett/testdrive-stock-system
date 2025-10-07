<template>
  <div class="card overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">วันที่/เวลา</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ลูกค้า</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">รถยนต์</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">เซลส์</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">สถานะ</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">จัดการ</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr 
            v-for="queue in queues" 
            :key="queue.id"
            class="table-row"
          >
            <td class="px-4 py-4">
              <div class="bg-red-50 border border-red-200 rounded-md p-3">
                <div class="flex items-center space-x-2">
                  <Icon name="calendar" class="w-4 h-4 text-red-600" />
                  <div>
                    <p class="text-sm font-semibold text-gray-900">{{ formatDate(queue.date) }}</p>
                    <p class="text-sm text-red-600">{{ queue.timeSlot }} น.</p>
                    <p class="text-xs text-gray-500">({{ queue.duration }})</p>
                  </div>
                </div>
              </div>
            </td>
            
            <td class="px-4 py-4">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span class="text-white font-medium text-xs">
                    {{ getInitial(queue.customerName) }}
                  </span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ queue.customerName }}</p>
                  <p class="text-xs text-gray-500">{{ queue.phone }}</p>
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {{ queue.customerType || 'Standard' }}
                  </span>
                </div>
              </div>
            </td>
            
            <td class="px-4 py-4">
              <div>
                <p class="text-sm font-medium text-gray-900">{{ queue.carModel || queue.vehicleModel }}</p>
                <p class="text-xs text-gray-500">รหัส: {{ queue.id }}</p>
                <p class="text-xs text-gray-400">{{ queue.location || 'โชว์รูม' }}</p>
              </div>
            </td>
            
            <td class="px-4 py-4">
              <div class="flex items-center space-x-2">
                <div class="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                  <span class="text-white font-medium text-xs">
                    {{ getInitial(queue.salesRep || queue.customerName) }}
                  </span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ queue.salesRep || 'เซลส์' }}</p>
                  <p class="text-xs text-gray-500">ผู้ดูแล</p>
                </div>
              </div>
            </td>
            
            <td class="px-4 py-4">
              <StatusBadge :status="queue.status" />
            </td>
            
            <td class="px-4 py-4">
              <div class="flex items-center space-x-1">
                <button 
                  @click="$emit('view', queue.id)"
                  class="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="ดู"
                >
                  <Icon name="eye" class="w-4 h-4" />
                </button>
                <button 
                  @click="$emit('edit', queue.id)"
                  class="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                  title="แก้ไข"
                >
                  <Icon name="edit" class="w-4 h-4" />
                </button>
                <button 
                  @click="$emit('delete', queue.id)"
                  class="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="ลบ"
                >
                  <Icon name="trash" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QueueTable',
  props: {
    queues: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    formatDate(dateString) {
      // Return Thai date string directly since it's already formatted
      return dateString || "ไม่ระบุวันที่"
    },
    getInitial(name) {
      if (!name) return 'N'
      const parts = name.split(' ')
      if (parts.length > 1) {
        return parts[1].charAt(0) || parts[0].charAt(0) || 'N'
      }
      return name.charAt(0) || 'N'
    }
  }
}
</script>

<style scoped>
.table-row:hover {
  background-color: #f8fafc;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.card {
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>