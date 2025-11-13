<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-[#D52B1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">พนักงาน ISUZU</h1>
          <p class="text-gray-600">จัดการทีมขายและพนักงานประจำแบรนด์ ISUZU</p>
        </div>
      </div>
      <NuxtLink
        to="/admin/staff"
        class="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-150 shadow-sm hover:shadow-md"
      >
        จัดการพนักงาน
      </NuxtLink>
    </div>

    <!-- Info Card -->
    <div class="bg-white rounded-lg border border-gray-200 p-12 text-center">
      <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-10 h-10 text-[#D52B1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">ทีมขาย ISUZU</h3>
      <p class="text-gray-600 mb-4">จัดการข้อมูลพนักงานขายและเจ้าหน้าที่ประจำแบรนด์ ISUZU</p>
      <p class="text-sm text-gray-500">
        หน้านี้จะแสดงรายการพนักงาน ISUZU เท่านั้น สามารถจัดการผ่านหน้า Admin ด้านบน
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IsuzuStaffPage',
  layout: 'dashboard',
  middleware: false,
  head() {
    return {
      title: 'พนักงาน ISUZU - ISUZU Queue System'
    }
  }
}
</script>
