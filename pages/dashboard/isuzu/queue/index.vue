<template>
  <div class="space-y-6">
    <!-- Page Header with Brand Badge -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
          <span class="text-2xl">🚗</span>
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <h1 class="text-2xl font-bold text-gray-900">คิวทดลองขับ ISUZU</h1>
            <span class="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
              รถยนต์
            </span>
          </div>
          <p class="text-gray-600">จัดการคิวทดลองขับรถยนต์ ISUZU</p>
        </div>
      </div>
      <button
        @click="handleAddQueue"
        class="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors text-white"
        style="background-color: #E31E24"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>เพิ่มคิวใหม่</span>
      </button>
    </div>

    <!-- Brand Info Card -->
    <div class="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
      <div class="flex items-center space-x-3">
        <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-sm text-red-800">
          <strong>แบรนด์ ISUZU:</strong> คุณกำลังดูคิวทดลองขับสำหรับรถยนต์ ISUZU เท่านั้น
          (รถกระบะ, รถบรรทุก, PPV)
        </p>
      </div>
    </div>

    <!-- Placeholder Content -->
    <div class="bg-white rounded-lg border border-gray-200 p-12 text-center">
      <div class="max-w-md mx-auto">
        <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">ระบบคิว ISUZU</h3>
        <p class="text-gray-600 mb-6">
          หน้านี้จะแสดงคิวทดลองขับสำหรับรถยนต์ ISUZU โดยเฉพาะ<br />
          ซึ่งจะแยกออกจากคิวของ BYD เพื่อความชัดเจนในการจัดการ
        </p>
        <div class="bg-gray-50 rounded-lg p-4 text-left">
          <p class="text-sm font-semibold text-gray-900 mb-2">ฟีเจอร์ที่จะมี:</p>
          <ul class="text-sm text-gray-600 space-y-1">
            <li>✓ กรองเฉพาะรถ ISUZU (D-MAX, MU-X, V-Cross, etc.)</li>
            <li>✓ พนักงานขาย ISUZU เท่านั้น</li>
            <li>✓ สถิติเฉพาะแบรนด์ ISUZU</li>
            <li>✓ เอกสารและฟอร์มเฉพาะ ISUZU</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IsuzuQueuePage',
  layout: 'dashboard',
  middleware: false,
  data() {
    return {
      brand: 'isuzu'
    }
  },
  head() {
    return {
      title: 'คิวทดลองขับ ISUZU - ISUZU Queue System'
    }
  },
  methods: {
    handleAddQueue() {
      // Navigate to add queue page with brand preset
      this.$router.push('/dashboard/queue/add?brand=isuzu')
    }
  }
}
</script>
