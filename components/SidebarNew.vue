<template>
  <div :class="sidebarClasses">
    <!-- Logo Section -->
    <div class="p-4 h-16 flex items-center border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 7h-3V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12l4-4V9a2 2 0 0 0-2-2zM10 4h4v3h-4V4zM4 5h4v4H4V5zm0 6h6v5H4v-5zm8 5v-3h3l-3 3z"/>
          </svg>
        </div>
        <div v-if="!collapsed">
          <h1 class="text-sm font-bold text-gray-900">TestDrive System</h1>
          <p class="text-xs text-gray-500">Management Platform</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-3 space-y-2 overflow-y-auto">
      <!-- Dashboard Home -->
      <NavItem
        icon="home"
        label="Dashboard"
        :active="isActive('/dashboard') && $route.path === '/dashboard'"
        :collapsed="collapsed"
        @click="navigateTo('/dashboard')"
      />

      <!-- Divider -->
      <div class="my-3 border-t border-gray-200"></div>

      <!-- BRAND MANAGEMENT Section -->
      <CollapsibleSection
        title="Brand Management"
        icon="briefcase"
        iconColor="text-blue-600"
        titleColor="text-gray-700"
        :collapsed="collapsed"
        :defaultOpen="isBrandSectionOpen"
      >
        <!-- ISUZU Brand -->
        <CollapsibleSection
          title="ISUZU"
          icon="truck"
          iconColor="text-red-600"
          titleColor="text-gray-800"
          :collapsed="collapsed"
          :defaultOpen="isIsuzuOpen"
        >
          <div class="ml-2 space-y-1">
            <NavItem
              icon="clipboard"
              label="คิวทดลองขับ"
              :active="isActive('/dashboard/isuzu/queue')"
              :collapsed="collapsed"
              size="sm"
              @click="navigateTo('/dashboard/isuzu/queue')"
            />
            <NavItem
              icon="package"
              label="สต็อครถยนต์"
              :active="isActive('/dashboard/isuzu/stock')"
              :collapsed="collapsed"
              size="sm"
              @click="navigateTo('/dashboard/isuzu/stock')"
            />
            <NavItem
              icon="fileText"
              label="เอกสาร"
              :active="isActive('/dashboard/isuzu/documents')"
              :collapsed="collapsed"
              size="sm"
              @click="navigateTo('/dashboard/isuzu/documents')"
            />
            <NavItem
              icon="users"
              label="พนักงาน"
              :active="isActive('/dashboard/isuzu/staff')"
              :collapsed="collapsed"
              size="sm"
              @click="navigateTo('/dashboard/isuzu/staff')"
            />
          </div>
        </CollapsibleSection>

        <!-- BYD Brand -->
        <CollapsibleSection
          title="BYD"
          icon="zap"
          iconColor="text-green-600"
          titleColor="text-gray-800"
          :collapsed="collapsed"
          :defaultOpen="isBydOpen"
        >
          <div class="ml-2 space-y-1">
            <NavItem
              icon="clipboard"
              label="คิวทดลองขับ"
              :active="isActive('/dashboard/byd/queue')"
              :collapsed="collapsed"
              size="sm"
              @click="navigateTo('/dashboard/byd/queue')"
            />
            <NavItem
              icon="package"
              label="สต็อครถไฟฟ้า"
              :active="isActive('/dashboard/byd/stock')"
              :collapsed="collapsed"
              size="sm"
              @click="navigateTo('/dashboard/byd/stock')"
            />
            <NavItem
              icon="fileText"
              label="เอกสาร"
              :active="isActive('/dashboard/byd/documents')"
              :collapsed="collapsed"
              size="sm"
              @click="navigateTo('/dashboard/byd/documents')"
            />
            <NavItem
              icon="users"
              label="พนักงาน"
              :active="isActive('/dashboard/byd/staff')"
              :collapsed="collapsed"
              size="sm"
              @click="navigateTo('/dashboard/byd/staff')"
            />
          </div>
        </CollapsibleSection>
      </CollapsibleSection>

      <!-- Divider -->
      <div class="my-3 border-t border-gray-200"></div>

      <!-- ANALYTICS & REPORTS Section -->
      <CollapsibleSection
        title="Analytics & Reports"
        icon="barChart"
        iconColor="text-purple-600"
        titleColor="text-gray-700"
        :collapsed="collapsed"
        :defaultOpen="true"
      >
        <div class="ml-2 space-y-1">
          <NavItem
            icon="trendingUp"
            label="รายงานเปรียบเทียบ"
            :active="isActive('/dashboard/analytics')"
            :collapsed="collapsed"
            size="sm"
            @click="navigateTo('/dashboard/analytics')"
          />
          <NavItem
            icon="calendar"
            label="ปฏิทินรวม"
            :active="isActive('/dashboard/calendar')"
            :collapsed="collapsed"
            size="sm"
            @click="navigateTo('/dashboard/calendar')"
          />
          <NavItem
            icon="calendar"
            label="จัดการอีเวนต์"
            :active="isActive('/dashboard/events')"
            :collapsed="collapsed"
            size="sm"
            @click="navigateTo('/dashboard/events')"
          />
        </div>
      </CollapsibleSection>

      <!-- Divider -->
      <div class="my-3 border-t border-gray-200"></div>

      <!-- LEGACY Section (Optional - ซ่อนไว้ก่อน) -->
      <!-- <CollapsibleSection
        title="Legacy Pages"
        icon="archive"
        iconColor="text-gray-500"
        titleColor="text-gray-600"
        :collapsed="collapsed"
        :defaultOpen="false"
      >
        <div class="ml-2 space-y-1">
          <NavItem
            icon="clipboard"
            label="คิวรวม (Legacy)"
            :active="isActive('/dashboard/queue')"
            :collapsed="collapsed"
            size="sm"
            @click="navigateTo('/dashboard/queue')"
          />
          <NavItem
            icon="package"
            label="สต็อครวม (Legacy)"
            :active="isActive('/dashboard/stock')"
            :collapsed="collapsed"
            size="sm"
            @click="navigateTo('/dashboard/stock')"
          />
        </div>
      </CollapsibleSection> -->

      <!-- ADMIN Section -->
      <div v-if="isAdmin">
        <CollapsibleSection
          title="System Admin"
          icon="shield"
          iconColor="text-orange-600"
          titleColor="text-gray-700"
          :collapsed="collapsed"
          :defaultOpen="isAdminSectionOpen"
        >
          <div class="ml-2 space-y-1">
            <NavItem
              icon="users"
              label="พนักงานทั้งหมด"
              :active="isActive('/admin/staff')"
              :collapsed="collapsed"
              size="sm"
              @click="navigateTo('/admin/staff')"
            />
            <NavItem
              icon="link"
              label="LINE Users"
              :active="isActive('/admin/line-users')"
              :collapsed="collapsed"
              size="sm"
              :badge="pendingLineUsersCount"
              @click="navigateTo('/admin/line-users')"
            />
            <NavItem
              icon="database"
              label="สต็อคทั้งหมด"
              :active="isActive('/admin/stock')"
              :collapsed="collapsed"
              size="sm"
              @click="navigateTo('/admin/stock')"
            />
          </div>
        </CollapsibleSection>

        <!-- Divider -->
        <div class="my-3 border-t border-gray-200"></div>
      </div>

      <!-- Settings -->
      <NavItem
        icon="settings"
        label="ตั้งค่า"
        :active="isActive('/dashboard/settings')"
        :collapsed="collapsed"
        @click="navigateTo('/dashboard/settings')"
      />
    </nav>

    <!-- User Profile & Logout -->
    <div class="p-3 border-t border-gray-200 space-y-1">
      <NavItem
        icon="user"
        label="โปรไฟล์"
        :active="isActive('/dashboard/profile')"
        :collapsed="collapsed"
        @click="navigateTo('/dashboard/profile')"
      />
      <NavItem
        icon="logOut"
        label="ออกจากระบบ"
        :active="false"
        :collapsed="collapsed"
        @click="logout"
      />
    </div>

    <!-- Collapse Button -->
    <button
      @click="$emit('toggle')"
      class="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-110 z-10"
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
  name: 'SidebarNew',
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pendingLineUsersCount: 0
    }
  },
  computed: {
    sidebarClasses() {
      const width = this.collapsed ? 'w-16' : 'w-[280px]'
      return [
        'bg-white border-r border-gray-200 transition-all duration-300 flex flex-col relative shadow-sm',
        width
      ]
    },
    isAdmin() {
      const user = this.$store?.getters['auth/user']
      return user?.role === 'admin' || true // Temporarily allow all users
    },
    // Auto-detect which sections should be open based on current route
    isBrandSectionOpen() {
      return this.$route?.path?.includes('/isuzu/') || this.$route?.path?.includes('/byd/')
    },
    isIsuzuOpen() {
      return this.$route?.path?.includes('/isuzu/')
    },
    isBydOpen() {
      return this.$route?.path?.includes('/byd/')
    },
    isAdminSectionOpen() {
      return this.$route?.path?.includes('/admin/')
    }
  },
  async mounted() {
    document.addEventListener('keydown', this.handleKeyboard)
    console.log('SidebarNew mounted, current route:', this.$route?.path)

    if (this.isAdmin) {
      await this.fetchPendingLineUsersCount()
    }
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeyboard)
  },
  methods: {
    navigateTo(path) {
      try {
        this.$router.push(path)

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

    isActive(path) {
      if (!this.$route) return false

      // Exact match
      if (this.$route.path === path) return true

      // Nested routes
      if (path !== '/' && path !== '/dashboard' && this.$route.path.startsWith(path + '/')) return true

      // Admin paths
      if (path.includes('/admin/')) {
        return this.$route.path.startsWith(path) || this.$route.path.startsWith(path + '/')
      }

      // ISUZU brand paths
      if (path.includes('/isuzu/')) {
        return this.$route.path.startsWith(path) || this.$route.path.startsWith(path + '/')
      }

      // BYD brand paths
      if (path.includes('/byd/')) {
        return this.$route.path.startsWith(path) || this.$route.path.startsWith(path + '/')
      }

      // Events page
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
        if (!confirm('ต้องการออกจากระบบหรือไม่?')) {
          return
        }

        if (this.$auth && typeof this.$auth.logout === 'function') {
          await this.$auth.logout()
        }

        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('auth-token')
          localStorage.removeItem('user-data')
        }

        this.$router.push('/login')

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

    handleKeyboard(event) {
      if (event.key === 'Escape' && window.innerWidth < 1024) {
        this.$emit('toggle')
      }
    },

    async fetchPendingLineUsersCount() {
      try {
        const response = await this.$axios.get('/api/line-integration/pending-users')
        this.pendingLineUsersCount = response.data?.length || 0
      } catch (error) {
        console.error('Error fetching pending LINE users count:', error)
        this.pendingLineUsersCount = 0
      }
    }
  },

  watch: {
    '$route'(newRoute, oldRoute) {
      console.log('Route changed:', oldRoute?.path, '->', newRoute?.path)
    }
  }
}
</script>

<style scoped>
/* Scrollbar */
nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 2px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}
</style>
