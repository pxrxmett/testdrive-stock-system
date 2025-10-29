<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4 mb-4">
    <!-- Search Box -->
    <div class="mb-4">
      <div class="relative">
        <input
          v-model="filters.search"
          type="text"
          placeholder="ค้นหา ชื่อลูกค้า, เบอร์โทร, รถ..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          @input="emitFilters"
        >
        <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Filters Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <!-- Date Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">วันที่</label>
        <select
          v-model="filters.dateRange"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          @change="emitFilters"
        >
          <option value="all">ทั้งหมด</option>
          <option value="today">วันนี้</option>
          <option value="this_week">สัปดาห์นี้</option>
          <option value="this_month">เดือนนี้</option>
          <option value="custom">กำหนดเอง</option>
        </select>
      </div>

      <!-- Sales Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">พนักงานขาย</label>
        <select
          v-model="filters.salesId"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          @change="emitFilters"
        >
          <option value="">ทั้งหมด</option>
          <option v-for="sales in salesList" :key="sales.id" :value="sales.id">
            {{ sales.nickname || sales.firstName || sales.name }}
          </option>
          <option value="unassigned">ยังไม่ระบุ</option>
        </select>
      </div>

      <!-- Branch Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">สาขา</label>
        <select
          v-model="filters.branch"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          @change="emitFilters"
        >
          <option value="">ทั้งหมด</option>
          <option value="bangkok">กรุงเทพ</option>
          <option value="chiang_mai">เชียงใหม่</option>
          <option value="phuket">ภูเก็ต</option>
          <option value="pattaya">พัทยา</option>
        </select>
      </div>

      <!-- Vehicle Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">รุ่นรถ</label>
        <select
          v-model="filters.vehicle"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          @change="emitFilters"
        >
          <option value="">ทั้งหมด</option>
          <option value="d-max">D-MAX</option>
          <option value="mu-x">MU-X</option>
          <option value="v-cross">V-Cross</option>
          <option value="hi-lander">Hi-Lander</option>
        </select>
      </div>

      <!-- Status Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
        <select
          v-model="filters.status"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          @change="emitFilters"
        >
          <option value="">ทั้งหมด</option>
          <option value="pending">รอยืนยัน</option>
          <option value="confirmed">ยืนยันแล้ว</option>
          <option value="in_progress">กำลังทดลองขับ</option>
          <option value="completed">เสร็จสิ้น</option>
          <option value="cancelled">ยกเลิก</option>
          <option value="no_show">ไม่มาตามนัด</option>
        </select>
      </div>
    </div>

    <!-- Custom Date Range (shown when dateRange = 'custom') -->
    <div v-if="filters.dateRange === 'custom'" class="mt-4 grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">จากวันที่</label>
        <input
          v-model="filters.startDate"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          @change="emitFilters"
        >
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">ถึงวันที่</label>
        <input
          v-model="filters.endDate"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          @change="emitFilters"
        >
      </div>
    </div>

    <!-- Clear Filters Button -->
    <div class="mt-4 flex justify-end">
      <button
        @click="clearFilters"
        class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span>ล้างตัวกรอง</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QueueFilters',
  props: {
    salesList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      filters: {
        search: '',
        dateRange: 'all',
        salesId: '',
        branch: '',
        vehicle: '',
        status: '',
        startDate: '',
        endDate: ''
      }
    }
  },
  methods: {
    emitFilters() {
      this.$emit('filter-change', { ...this.filters })
    },
    clearFilters() {
      this.filters = {
        search: '',
        dateRange: 'all',
        salesId: '',
        branch: '',
        vehicle: '',
        status: '',
        startDate: '',
        endDate: ''
      }
      this.emitFilters()
    }
  }
}
</script>
