<template>
  <div :class="sidebarClasses">
    <!-- Logo Section -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 7h-3V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12l4-4V9a2 2 0 0 0-2-2zM10 4h4v3h-4V4zM4 5h4v4H4V5zm0 6h6v5H4v-5zm8 5v-3h3l-3 3z"/>
          </svg>
        </div>
        <div v-if="!collapsed">
          <h1 class="text-sm font-semibold text-gray-900">ISUZU Queue</h1>
          <p class="text-xs text-gray-500">Management System</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
      <!-- Main Navigation -->
      <div class="space-y-1">
        <NavItem 
          icon="queue"
          label="จัดการคิวทดลองขับ"
          :active="isActive('/dashboard/queue')"
          :collapsed="collapsed"
          @click="navigateTo('/dashboard/queue')"
        />
        <NavItem 
          icon="stock"
          label="จัดการสต็อกรถยนต์"
          :active="isActive('/dashboard/stock')"
          :collapsed="collapsed"
          @click="navigateTo('/dashboard/stock')"
        />
        <NavItem 
          icon="calendar"
          label="จัดการอีเวนต์"
          :active="isActive('/dashboard/events')"
          :collapsed="collapsed"
          @click="navigateTo('/dashboard/events')"
        />
      </div>
      
      <!-- Data Management Section -->
      <div class="pt-4">
        <div v-if="!collapsed" class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 px-2">
          ข้อมูล
        </div>
        <div v-else class="border-t border-gray-200 my-2"></div>
        
        <div class="space-y-1">
          <NavItem 
            icon="chart"
            label="รายงาน"
            :active="isActive('/dashboard/analytics')"
            :collapsed="collapsed"
            @click="navigateTo('/dashboard/analytics')"
          />
          <NavItem 
            icon="calendar"
            label="ปฏิทิน"
            :active="isActive('/dashboard/calendar')"
            :collapsed="collapsed"
            @click="navigateTo('/dashboard/calendar')"
          />
          <NavItem 
            icon="settings"
            label="ตั้งค่า"
            :active="isActive('/dashboard/settings')"
            :collapsed="collapsed"
            @click="navigateTo('/dashboard/settings')"
          />
        </div>
      </div>
    </nav>

    <!-- User Section -->
    <div class="p-3 border-t border-gray-200">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
          <span class="text-white font-medium text-xs">A</span>
        </div>
        <div v-if="!collapsed" class="flex-1 min-w-0">
          <p class="text-xs font-medium text-gray-900 truncate">Admin</p>
          <p class="text-xs text-gray-500 truncate">admin@isuzu.co.th</p>
        </div>
        <button 
          v-if="!collapsed"
          @click="logout"
          class="p-1 rounded-md hover:bg-gray-100 transition-colors"
          title="ออกจากระบบ"
        >
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Collapse Button -->
    <button 
      @click="$emit('toggle')"
      class="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow z-10"
      :title="collapsed ? 'ขยาย Sidebar' : 'ย่อ Sidebar'"
    >
      <svg 
        class="w-3 h-3 text-gray-600 transition-transform duration-200" 
        :class="{ 'rotate-180': collapsed }"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    collapsed: {
      type: Boolean,
      default: false
    },
    currentView: {
      type: String,
      default: 'queue'
    }
  },
  computed: {
    sidebarClasses() {
      return [
        'bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-lg relative',
        this.collapsed ? 'w-16' : 'w-60'
      ]
    }
  },
  methods: {
    navigateTo(path) {
      try {
        // ใช้ Nuxt router สำหรับ navigation
        this.$router.push(path)
        
        // Emit navigate event สำหรับ parent component
        const viewName = this.getViewFromPath(path)
        this.$emit('navigate', viewName)
        
        // ปิด sidebar บน mobile หลังจาก navigate
        if (window.innerWidth < 1024) {
          this.$emit('toggle')
        }
        
        console.log(`Navigated to: ${path}`)
      } catch (error) {
        console.error('Navigation error:', error)
        this.$toast?.error('เกิดข้อผิดพลาดในการเปลี่ยนหน้า')
      }
    },
    
    getViewFromPath(path) {
      if (path.includes('/queue')) return 'queue'
      if (path.includes('/stock')) return 'stock'
      if (path.includes('/events')) return 'events'
      if (path.includes('/analytics')) return 'analytics'
      if (path.includes('/calendar')) return 'calendar'
      if (path.includes('/settings')) return 'settings'
      return 'queue'
    },
    
    isActive(path) {
      // ตรวจสอบว่า route ปัจจุบันตรงกับ path หรือไม่
      if (!this.$route) return false
      
      // สำหรับ exact match
      if (this.$route.path === path) return true
      
      // สำหรับ nested routes
      if (path !== '/' && this.$route.path.startsWith(path + '/')) return true
      
      // สำหรับ stock page - รองรับทั้ง /stock และ /dashboard/stock
      if (path.includes('/stock')) {
        return this.$route.path === '/stock' || 
               this.$route.path === '/dashboard/stock' ||
               this.$route.path.startsWith('/stock/') ||
               this.$route.path.startsWith('/dashboard/stock/')
      }
      
      // สำหรับ events page
      if (path.includes('/events')) {
        return this.$route.path === '/events' || 
               this.$route.path === '/dashboard/events' ||
               this.$route.path.startsWith('/events/') ||
               this.$route.path.startsWith('/dashboard/events/')
      }
      
      return false
    },
    
    async logout() {
      try {
        // แสดง confirmation dialog
        if (!confirm('ต้องการออกจากระบบหรือไม่?')) {
          return
        }
        
        // เรียก API logout (ถ้ามี auth system)
        if (this.$auth && typeof this.$auth.logout === 'function') {
          await this.$auth.logout()
        }
        
        // Clear localStorage/sessionStorage
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('auth-token')
          localStorage.removeItem('user-data')
        }
        
        // Redirect ไปหน้า login
        this.$router.push('/login')
        
        // แสดง success message
        if (this.$toast) {
          this.$toast.success('ออกจากระบบเรียบร้อยแล้ว')
        }
        
        console.log('User logged out successfully')
      } catch (error) {
        console.error('Logout error:', error)
        if (this.$toast) {
          this.$toast.error('เกิดข้อผิดพลาดในการออกจากระบบ')
        }
      }
    },
    
    // เพิ่ม method สำหรับ handle keyboard navigation
    handleKeyboard(event) {
      // ESC key - ปิด sidebar บน mobile
      if (event.key === 'Escape' && window.innerWidth < 1024) {
        this.$emit('toggle')
      }
    }
  },
  
  mounted() {
    // เพิ่ม keyboard event listener
    document.addEventListener('keydown', this.handleKeyboard)
    
    // Log current route สำหรับ debugging
    console.log('Sidebar mounted, current route:', this.$route?.path)
  },
  
  beforeDestroy() {
    // ลบ event listener
    document.removeEventListener('keydown', this.handleKeyboard)
  },
  
  watch: {
    // Watch route changes
    '$route'(newRoute, oldRoute) {
      console.log('Route changed:', oldRoute?.path, '->', newRoute?.path)
    }
  }
}
</script>

<style scoped>
/* Active link styles */
.nuxt-link-active {
  background-color: theme('colors.blue.50');
  color: theme('colors.blue.700');
  border-right: 2px solid theme('colors.blue.700');
}

/* Smooth transitions */
.transition-colors {
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}

/* Hover effects */
.group:hover svg {
  transform: translateX(2px);
  transition: transform 0.15s ease-in-out;
}

/* Focus styles for accessibility */
button:focus,
a:focus {
  outline: 2px solid theme('colors.blue.500');
  outline-offset: 2px;
  border-radius: 0.5rem;
}

/* Custom scrollbar for sidebar */
aside::-webkit-scrollbar {
  width: 4px;
}

aside::-webkit-scrollbar-track {
  background: transparent;
}

aside::-webkit-scrollbar-thumb {
  background: theme('colors.gray.300');
  border-radius: 2px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: theme('colors.gray.400');
}
</style>