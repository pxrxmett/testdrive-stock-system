<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <span class="text-2xl">🔋</span>
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <h1 class="text-2xl font-bold text-gray-900">สต็อครถไฟฟ้า BYD</h1>
            <span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              รถไฟฟ้า
            </span>
          </div>
          <p class="text-gray-600">จัดการสต็อครถยนต์ไฟฟ้า BYD ทุกรุ่น</p>
        </div>
      </div>
    </div>

    <!-- Brand Info -->
    <div class="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
      <div class="flex items-center space-x-3">
        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <p class="text-sm text-green-800">
          <strong>แบรนด์ BYD:</strong> รถยนต์ไฟฟ้า 100% พร้อมเทคโนโลยี Blade Battery
        </p>
      </div>
    </div>

    <!-- Placeholder -->
    <div class="bg-white rounded-lg border border-gray-200 p-12 text-center">
      <div class="max-w-md mx-auto">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">สต็อครถไฟฟ้า BYD</h3>
        <p class="text-gray-600 mb-4">
          จัดการสต็อครถยนต์ไฟฟ้า BYD ทุกรุ่น พร้อมข้อมูลแบตเตอรี่และระยะทาง
        </p>
        <div class="grid grid-cols-3 gap-4 mt-6">
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">0</div>
            <div class="text-sm text-gray-600">Atto 3</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">0</div>
            <div class="text-sm text-gray-600">Dolphin</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">0</div>
            <div class="text-sm text-gray-600">Seal</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BydStockPage',
  layout: 'dashboard',
  head() {
    return {
      title: 'สต็อครถไฟฟ้า BYD - BYD EV System'
    }
  }
}
</script>
