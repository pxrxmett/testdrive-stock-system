<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
          <span class="text-2xl">📦</span>
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <h1 class="text-2xl font-bold text-gray-900">สต็อครถยนต์ ISUZU</h1>
            <span class="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
              รถยนต์
            </span>
          </div>
          <p class="text-gray-600">จัดการสต็อครถยนต์ ISUZU ทุกรุ่น</p>
        </div>
      </div>
    </div>

    <!-- Brand Info -->
    <div class="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
      <div class="flex items-center space-x-3">
        <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-sm text-red-800">
          <strong>แบรนด์ ISUZU:</strong> รถกระบะ, รถบรรทุก, และรถ PPV
        </p>
      </div>
    </div>

    <!-- Placeholder -->
    <div class="bg-white rounded-lg border border-gray-200 p-12 text-center">
      <div class="max-w-md mx-auto">
        <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">สต็อกรถยนต์ ISUZU</h3>
        <p class="text-gray-600 mb-4">
          จัดการสต็อกรถยนต์ ISUZU ทุกรุ่น พร้อมข้อมูลสเปค ราคา และสถานะ
        </p>
        <div class="grid grid-cols-3 gap-4 mt-6">
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">0</div>
            <div class="text-sm text-gray-600">D-MAX</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">0</div>
            <div class="text-sm text-gray-600">MU-X</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">0</div>
            <div class="text-sm text-gray-600">V-Cross</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IsuzuStockPage',
  layout: 'dashboard',
  head() {
    return {
      title: 'สต็อครถยนต์ ISUZU - ISUZU Queue System'
    }
  }
}
</script>
