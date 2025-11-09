<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center space-x-3">
      <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
        <span class="text-2xl">📄</span>
      </div>
      <div>
        <div class="flex items-center space-x-2">
          <h1 class="text-2xl font-bold text-gray-900">เอกสาร BYD</h1>
          <span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
            รถไฟฟ้า
          </span>
        </div>
        <p class="text-gray-600">เอกสารทดลองขับและสัญญาสำหรับ BYD</p>
      </div>
    </div>

    <!-- Placeholder -->
    <div class="bg-white rounded-lg border border-gray-200 p-12 text-center">
      <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">เอกสารทดลองขับ BYD</h3>
      <p class="text-gray-600">จัดการเอกสารและสัญญาทดลองขับรถยนต์ไฟฟ้า BYD</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BydDocumentsPage',
  layout: 'dashboard',
  middleware: false,
  head() {
    return {
      title: 'เอกสาร BYD - BYD EV System'
    }
  }
}
</script>
