<template>
  <div class="card p-4">
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
      <div class="flex items-center space-x-3">
        <select 
          :value="selectedStatus"
          @change="$emit('status-change', $event.target.value)"
          class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
        >
          <option value="all">ทุกสถานะ</option>
          <option value="in-progress">กำลังทดสอบ</option>
          <option value="scheduled">รอคิว</option>
          <option value="completed">เสร็จสิ้น</option>
          <option value="cancelled">ยกเลิก</option>
        </select>
        
        <select 
          :value="selectedLocation"
          @change="$emit('location-change', $event.target.value)"
          class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
        >
          <option value="all">ทุกสาขา</option>
          <option value="สาขาเซ็นทรัล บางนา">สาขาเซ็นทรัล บางนา</option>
          <option value="สาขาอีสท์วิลล์">สาขาอีสท์วิลล์</option>
          <option value="สาขาเวสต์เกต">สาขาเวสต์เกต</option>
        </select>
        
        <button class="btn-secondary flex items-center space-x-2 text-sm">
          <Icon name="filter" class="w-4 h-4" />
          <span>ตัวกรอง</span>
        </button>
      </div>
      
      <div class="flex items-center space-x-2">
        <button 
          @click="$emit('export')"
          class="btn-secondary flex items-center space-x-2 text-sm"
        >
          <Icon name="download" class="w-4 h-4" />
          <span>ส่งออก</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterPanel',
  props: {
    selectedStatus: {
      type: String,
      default: 'all'
    },
    selectedLocation: {
      type: String,
      default: 'all'
    }
  }
}
</script>
