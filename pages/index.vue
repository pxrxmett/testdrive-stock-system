<template>
  <div class="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
    <div class="max-w-md w-full mx-4">
      <div class="bg-white rounded-lg shadow-lg p-8 text-center">
        <div class="w-16 h-16 bg-[#D52B1E] rounded-lg flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
          </svg>
        </div>
        
        <h1 class="text-2xl font-bold text-gray-900 mb-2">ISUZU Queue Management</h1>
        <p class="text-gray-600 mb-8">ระบบจัดการคิวทดลองขับและคลังสินค้า</p>
        
        <div class="space-y-3">
          <nuxt-link 
            to="/dashboard" 
            class="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <span>เข้าสู่ระบบ</span>
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </nuxt-link>
          
          <div class="text-sm text-gray-500">
            หรือ <a href="#" class="text-[#D52B1E] hover:text-red-700">สมัครสมาชิก</a>
          </div>
        </div>
      </div>
      
      <!-- Features -->
      <div class="mt-8 grid grid-cols-1 gap-4">
        <div class="bg-white/80 backdrop-blur rounded-lg p-4 text-center">
          <h3 class="font-medium text-gray-900 mb-1">จัดการคิวทดลองขับ</h3>
          <p class="text-sm text-gray-600">จัดการและติดตามคิวทดลองขับรถยนต์</p>
        </div>
        
        <div class="bg-white/80 backdrop-blur rounded-lg p-4 text-center">
          <h3 class="font-medium text-gray-900 mb-1">รายงานและสถิติ</h3>
          <p class="text-sm text-gray-600">ดูสถิติและรายงานการใช้งาน</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  head() {
    return {
      title: 'ISUZU Queue Management System'
    }
  }
}
</script>
