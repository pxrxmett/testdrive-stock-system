<template>
  <div class="space-y-6">
    <!-- Page Header with Brand Badge -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <span class="text-2xl">⚡</span>
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <h1 class="text-2xl font-bold text-gray-900">คิวทดลองขับ BYD</h1>
            <span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              รถไฟฟ้า
            </span>
          </div>
          <p class="text-gray-600">จัดการคิวทดลองขับรถยนต์ไฟฟ้า BYD</p>
        </div>
      </div>
      <button
        @click="handleAddQueue"
        class="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors text-white"
        style="background-color: #00A651"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>เพิ่มคิวใหม่</span>
      </button>
    </div>

    <!-- Brand Info Card -->
    <div class="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
      <div class="flex items-center space-x-3">
        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <p class="text-sm text-green-800">
          <strong>แบรนด์ BYD:</strong> คุณกำลังดูคิวทดลองขับสำหรับรถยนต์ไฟฟ้า BYD เท่านั้น
          (รถเก๋ง, SUV, รถไฟฟ้า)
        </p>
      </div>
    </div>

    <!-- Placeholder Content -->
    <div class="bg-white rounded-lg border border-gray-200 p-12 text-center">
      <div class="max-w-md mx-auto">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">ระบบคิว BYD</h3>
        <p class="text-gray-600 mb-6">
          หน้านี้จะแสดงคิวทดลองขับสำหรับรถยนต์ไฟฟ้า BYD โดยเฉพาะ<br />
          ซึ่งจะแยกออกจากคิวของ ISUZU เพื่อความชัดเจนในการจัดการ
        </p>
        <div class="bg-gray-50 rounded-lg p-4 text-left">
          <p class="text-sm font-semibold text-gray-900 mb-2">ฟีเจอร์ที่จะมี:</p>
          <ul class="text-sm text-gray-600 space-y-1">
            <li>✓ กรองเฉพาะรถ BYD (Atto 3, Dolphin, Seal, etc.)</li>
            <li>✓ พนักงานขาย BYD เท่านั้น</li>
            <li>✓ สถิติเฉพาะแบรนด์ BYD</li>
            <li>✓ ข้อมูลแบตเตอรี่และ charging time</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BydQueuePage',
  layout: 'dashboard',
  data() {
    return {
      brand: 'byd'
    }
  },
  head() {
    return {
      title: 'คิวทดลองขับ BYD - BYD EV System'
    }
  },
  methods: {
    handleAddQueue() {
      // Navigate to add queue page with brand preset
      this.$router.push('/dashboard/queue/add?brand=byd')
    }
  }
}
</script>
