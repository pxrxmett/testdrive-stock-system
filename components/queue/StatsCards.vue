<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <!-- Total -->
    <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">ทั้งหมด</p>
          <p class="text-2xl font-semibold text-gray-900 mt-1">{{ stats.total }}</p>
        </div>
        <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
      </div>
    </div>

    <!-- In Progress -->
    <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">กำลังทดสอบ</p>
          <p class="text-2xl font-semibold text-gray-900 mt-1">{{ stats.inProgress }}</p>
          <div class="flex items-center mt-2">
            <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span class="text-xs text-gray-600">ดำเนินการอยู่</span>
          </div>
        </div>
        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Waiting -->
    <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">รอคิว</p>
          <p class="text-2xl font-semibold text-gray-900 mt-1">{{ stats.waiting }}</p>
          <div class="flex items-center mt-2">
            <svg class="w-3 h-3 text-yellow-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-xs text-gray-600">รอดำเนินการ</span>
          </div>
        </div>
        <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Completed -->
    <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">เสร็จสิ้น</p>
          <p class="text-2xl font-semibold text-gray-900 mt-1">{{ stats.completed }}</p>
          <div class="flex items-center mt-2">
            <svg class="w-3 h-3 text-blue-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span class="text-xs text-gray-600">สำเร็จแล้ว</span>
          </div>
        </div>
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QueueStatsCards',
  props: {
    stats: {
      type: Object,
      required: true,
      default: () => ({
        total: 0,
        inProgress: 0,
        waiting: 0,
        completed: 0
      })
    }
  }
}
</script>
