<template>
  <div class="card p-6">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-base font-semibold text-gray-900">ยอดขายรายเดือน</h3>
        <p class="text-sm text-gray-600">เปรียบเทียบตลอดปี</p>
      </div>
      <div class="flex items-center space-x-2">
        <button class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200 transition-colors">
          6 เดือน
        </button>
        <button class="px-2 py-1 bg-red-600 text-white rounded text-xs">
          12 เดือน
        </button>
      </div>
    </div>
    
    <div class="h-48 bg-gray-50 rounded-md flex items-end justify-center space-x-2 p-4 border">
      <div 
        v-for="(data, index) in chartData" 
        :key="index"
        class="flex flex-col items-center space-y-1"
      >
        <div 
          class="bg-red-600 rounded-t transition-all duration-300 hover:bg-red-700 cursor-pointer"
          :style="{ width: '16px', height: data.height + '%' }"
          @mouseover="showTooltip(index, data)"
          @mouseleave="hideTooltip"
        ></div>
        <span class="text-xs text-gray-500">{{ data.month }}</span>
      </div>
    </div>
    
    <div class="mt-4 flex items-center justify-center space-x-4 text-sm">
      <div class="flex items-center space-x-1">
        <div class="w-2 h-2 bg-red-600 rounded-full"></div>
        <span class="text-gray-600">ยอดขาย</span>
      </div>
      <div class="flex items-center space-x-1">
        <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
        <span class="text-gray-600">เป้าหมาย</span>
      </div>
    </div>

    <!-- Tooltip -->
    <div 
      v-if="tooltip.show"
      class="absolute bg-gray-800 text-white px-2 py-1 rounded text-xs"
      :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }"
    >
      {{ tooltip.content }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'RevenueChart',
  data() {
    return {
      chartData: [
        { height: 45, month: 'ม.ค.', value: '2.1M' },
        { height: 52, month: 'ก.พ.', value: '2.4M' },
        { height: 48, month: 'มี.ค.', value: '2.2M' },
        { height: 61, month: 'เม.ย.', value: '2.8M' },
        { height: 55, month: 'พ.ค.', value: '2.5M' },
        { height: 67, month: 'มิ.ย.', value: '3.1M' },
        { height: 59, month: 'ก.ค.', value: '2.7M' },
        { height: 73, month: 'ส.ค.', value: '3.4M' },
        { height: 69, month: 'ก.ย.', value: '3.2M' },
        { height: 81, month: 'ต.ค.', value: '3.7M' },
        { height: 76, month: 'พ.ย.', value: '3.5M' },
        { height: 84, month: 'ธ.ค.', value: '3.9M' }
      ],
      tooltip: {
        show: false,
        x: 0,
        y: 0,
        content: ''
      }
    }
  },
  methods: {
    showTooltip(index, data) {
      this.tooltip = {
        show: true,
        x: 100 + (index * 30),
        y: 100,
        content: `${data.month}: ${data.value}`
      }
    },
    hideTooltip() {
      this.tooltip.show = false
    }
  }
}
</script>
