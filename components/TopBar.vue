<template>
  <div class="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <button
          @click="$emit('toggle-sidebar')"
          class="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <Icon name="menu" icon-class="w-5 h-5 text-gray-600" />
        </button>

        <div>
          <h2 class="text-lg font-semibold text-gray-900">
            {{ pageTitle }}
          </h2>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <!-- Notifications Dropdown (Facebook Style - Full Spec) -->
        <div class="relative">
          <button
            @click="toggleNotifications"
            :class="[
              'relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors',
              showNotifications && 'bg-gray-100 text-gray-700'
            ]"
          >
            <Icon name="bell" icon-class="w-5 h-5" />
            <!-- Badge Counter (20x20px) -->
            <span
              v-if="unreadNotifications > 0"
              class="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[20px] h-[20px] px-1 bg-[#EF4444] text-white text-[11px] font-bold rounded-full border-2 border-white"
            >
              {{ unreadNotifications > 9 ? '9+' : unreadNotifications }}
            </span>
          </button>

          <!-- Dropdown Panel (360px width) -->
          <div
            v-if="showNotifications"
            v-click-outside="closeNotifications"
            class="absolute right-0 mt-2 w-[360px] bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-fade-in"
            style="max-height: calc(100vh - 80px);"
          >
            <!-- Header with 3-dots menu -->
            <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 class="text-xl font-bold text-gray-900">การแจ้งเตือน</h3>
              <button
                @click="navigateTo('/dashboard/settings')"
                class="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                title="ตั้งค่าการแจ้งเตือน"
              >
                <!-- 3 dots menu -->
                <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>

            <!-- Tabs -->
            <div class="flex border-b border-gray-200">
              <button
                @click="activeTab = 'all'"
                :class="[
                  'flex-1 px-4 py-3 text-sm font-medium transition-colors',
                  activeTab === 'all'
                    ? 'text-[#D52B1E] border-b-2 border-[#D52B1E]'
                    : 'text-gray-600 hover:bg-gray-50'
                ]"
              >
                ทั้งหมด
              </button>
              <button
                @click="activeTab = 'unread'"
                :class="[
                  'flex-1 px-4 py-3 text-sm font-medium transition-colors',
                  activeTab === 'unread'
                    ? 'text-[#D52B1E] border-b-2 border-[#D52B1E]'
                    : 'text-gray-600 hover:bg-gray-50'
                ]"
              >
                ยังไม่ได้อ่าน
              </button>
            </div>

            <!-- Notifications List with Section Headers -->
            <div class="overflow-y-auto" style="max-height: 480px;">
              <template v-if="filteredNotifications.length > 0">
                <template v-for="(group, sectionName) in groupedNotifications">
                  <!-- Section Header (Sticky) -->
                  <div
                    :key="`section-${sectionName}`"
                    class="sticky top-0 bg-[#F9FAFB] px-4 py-2 text-sm font-semibold text-gray-700 z-10"
                  >
                    {{ sectionName }}
                  </div>

                  <!-- Notification Items (72px min height, 56x56px icon, 12x12px dot) -->
                  <div
                    v-for="notification in group"
                    :key="notification.id"
                    @click="handleNotificationClick(notification)"
                    :class="[
                      'px-4 py-3 min-h-[72px] flex items-start hover:bg-[#F9FAFB] cursor-pointer transition-colors border-b border-gray-100',
                      !notification.read && 'bg-[#EFF6FF]'
                    ]"
                  >
                    <!-- Icon (56x56px) -->
                    <div
                      :class="[
                        'w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0',
                        getNotificationIconBg(notification.type)
                      ]"
                    >
                      <span class="text-2xl">{{ getNotificationIcon(notification.type) }}</span>
                    </div>

                    <!-- Content -->
                    <div class="flex-1 min-w-0 ml-3">
                      <div class="flex items-start justify-between gap-2">
                        <div class="flex-1">
                          <p :class="['text-sm leading-snug', notification.read ? 'text-gray-700' : 'text-gray-900 font-medium']">
                            {{ notification.title }}
                          </p>
                          <p class="text-xs text-gray-600 mt-1">{{ notification.subtitle }}</p>
                          <p class="text-xs text-gray-500 mt-1">{{ notification.time }}</p>
                        </div>
                        <!-- Unread Dot (12x12px) -->
                        <div
                          v-if="!notification.read"
                          class="w-3 h-3 bg-[#3B82F6] rounded-full flex-shrink-0 mt-1"
                        ></div>
                      </div>
                    </div>
                  </div>
                </template>
              </template>

              <!-- Empty State -->
              <div v-else class="px-4 py-12 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="bell" icon-class="w-8 h-8 text-gray-300" />
                </div>
                <p class="text-sm font-medium text-gray-900">ไม่มีการแจ้งเตือน</p>
                <p class="text-xs text-gray-500 mt-1">
                  {{ activeTab === 'unread' ? 'คุณได้อ่านการแจ้งเตือนทั้งหมดแล้ว' : 'คุณไม่มีการแจ้งเตือนในขณะนี้' }}
                </p>
              </div>
            </div>

            <!-- Footer (Isuzu Red) -->
            <div v-if="notifications.length > 0" class="border-t border-gray-200">
              <NuxtLink
                to="/dashboard/notifications"
                class="block px-4 py-3 text-center text-sm font-medium text-[#D52B1E] hover:bg-gray-50 transition-colors"
              >
                ดูการแจ้งเตือนทั้งหมด →
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Settings Button -->
        <button
          @click="navigateTo('/dashboard/settings')"
          class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
        >
          <Icon name="settings" icon-class="w-5 h-5" />
        </button>

        <!-- User Menu Dropdown (Native HTML) -->
        <div class="relative">
          <button
            @click="toggleUserMenu"
            :class="[
              'flex items-center space-x-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors',
              showUserMenu && 'bg-gray-100 text-gray-700'
            ]"
          >
            <div class="w-7 h-7 bg-gradient-to-br from-[#D52B1E] to-[#B91C1C] rounded-full flex items-center justify-center">
              <span class="text-white font-semibold text-xs">{{ userInitials }}</span>
            </div>
            <span class="hidden md:block text-sm text-gray-700 font-medium">{{ userName }}</span>
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- User Menu Panel -->
          <div
            v-if="showUserMenu"
            v-click-outside="closeUserMenu"
            class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-fade-in"
          >
            <!-- User Info Header -->
            <div class="px-4 py-3 border-b border-gray-200">
              <p class="text-sm font-semibold text-gray-900">{{ userName }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ userEmail }}</p>
            </div>

            <!-- Menu Items -->
            <div class="py-1">
              <NuxtLink
                to="/dashboard/profile"
                class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                @click.native="closeUserMenu"
              >
                <Icon name="user" icon-class="w-4 h-4 mr-3 text-gray-500" />
                <span>โปรไฟล์</span>
              </NuxtLink>
              <NuxtLink
                to="/dashboard/settings"
                class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                @click.native="closeUserMenu"
              >
                <Icon name="settings" icon-class="w-4 h-4 mr-3 text-gray-500" />
                <span>ตั้งค่า</span>
              </NuxtLink>

              <div class="border-t border-gray-200 my-1"></div>

              <button
                @click="handleHelp"
                class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
              >
                <Icon name="help" icon-class="w-4 h-4 mr-3 text-gray-500" />
                <span>ช่วยเหลือ</span>
              </button>

              <div class="border-t border-gray-200 my-1"></div>

              <button
                @click="handleLogout"
                class="w-full flex items-center px-4 py-2 text-sm text-[#D52B1E] hover:bg-red-50 transition-colors text-left"
              >
                <Icon name="logOut" icon-class="w-4 h-4 mr-3 text-[#D52B1E]" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopBar',
  props: {
    currentView: {
      type: String,
      default: 'queue'
    },
    sidebarCollapsed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showNotifications: false,
      showUserMenu: false,
      activeTab: 'all', // 'all' or 'unread'
      notifications: [
        {
          id: 1,
          type: 'isuzu_queue',
          title: 'มีคิวใหม่จาก ISUZU ที่ต้องดำเนินการ',
          subtitle: '5 รายการรอดำเนินการ',
          time: '5 นาทีที่แล้ว',
          timestamp: Date.now() - 5 * 60 * 1000, // 5 minutes ago
          read: false,
          link: '/dashboard/isuzu/queue'
        },
        {
          id: 2,
          type: 'byd_queue',
          title: 'การทดลองขับ BYD เสร็จสิ้นแล้ว',
          subtitle: '1 รายการเสร็จสมบูรณ์',
          time: '3 ชั่วโมงที่แล้ว',
          timestamp: Date.now() - 3 * 60 * 60 * 1000, // 3 hours ago
          read: false,
          link: '/dashboard/byd/queue'
        },
        {
          id: 3,
          type: 'document',
          title: 'มีเอกสารใหม่รอการอนุมัติ',
          subtitle: '3 เอกสารจากลูกค้า',
          time: 'เมื่อวาน',
          timestamp: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
          read: true,
          link: '/dashboard/documents'
        },
        {
          id: 4,
          type: 'warning',
          title: 'สต็อกรถยนต์ใกล้หมด',
          subtitle: 'ISUZU D-MAX เหลือ 2 คัน',
          time: '2 วันที่แล้ว',
          timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
          read: true,
          link: '/dashboard/isuzu/stock'
        },
        {
          id: 5,
          type: 'isuzu_queue',
          title: 'ลูกค้ายืนยันการนัดหมายทดลองขับ',
          subtitle: 'นัดหมายวันพรุ่งนี้ 10:00 น.',
          time: '5 วันที่แล้ว',
          timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
          read: true,
          link: '/dashboard/isuzu/queue'
        }
      ]
    }
  },
  computed: {
    pageTitle() {
      const titles = {
        queue: 'จัดการคิวทดลองขับ',
        analytics: 'รายงานและสถิติ',
        calendar: 'ปฏิทินนัดหมาย',
        staff: 'จัดการพนักงาน',
        stock: 'จัดการสต็อก',
        settings: 'ตั้งค่าระบบ',
        profile: 'โปรไฟล์'
      }

      // Try to get from route
      const route = this.$route?.path || ''
      for (const [key, title] of Object.entries(titles)) {
        if (route.includes(key)) {
          return title
        }
      }

      return titles[this.currentView] || 'แดชบอร์ด'
    },
    userName() {
      return this.$store?.getters['auth/user']?.name || 'Admin User'
    },
    userEmail() {
      return this.$store?.getters['auth/user']?.email || 'admin@testdrive.com'
    },
    userInitials() {
      const name = this.userName
      const names = name.split(' ')
      if (names.length >= 2) {
        return names[0][0] + names[1][0]
      }
      return name.substring(0, 2).toUpperCase()
    },
    unreadNotifications() {
      return this.notifications.filter(n => !n.read).length
    },
    filteredNotifications() {
      if (this.activeTab === 'unread') {
        return this.notifications.filter(n => !n.read)
      }
      return this.notifications
    },
    groupedNotifications() {
      const now = Date.now()
      const oneDay = 24 * 60 * 60 * 1000
      const sevenDays = 7 * 24 * 60 * 60 * 1000

      const groups = {
        'วันนี้': [],
        'เมื่อวาน': [],
        'สัปดาห์นี้': [],
        'เก่ากว่านี้': []
      }

      this.filteredNotifications.forEach(notification => {
        const timeDiff = now - notification.timestamp

        if (timeDiff < oneDay) {
          groups['วันนี้'].push(notification)
        } else if (timeDiff < 2 * oneDay) {
          groups['เมื่อวาน'].push(notification)
        } else if (timeDiff < sevenDays) {
          groups['สัปดาห์นี้'].push(notification)
        } else {
          groups['เก่ากว่านี้'].push(notification)
        }
      })

      // Remove empty groups
      const result = {}
      Object.keys(groups).forEach(key => {
        if (groups[key].length > 0) {
          result[key] = groups[key]
        }
      })

      return result
    }
  },
  directives: {
    clickOutside: {
      bind(el, binding, vnode) {
        el.clickOutsideEvent = function(event) {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event)
          }
        }
        document.body.addEventListener('click', el.clickOutsideEvent)
      },
      unbind(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
      }
    }
  },
  methods: {
    toggleNotifications() {
      this.showNotifications = !this.showNotifications
    },
    closeNotifications() {
      this.showNotifications = false
    },
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu
    },
    closeUserMenu() {
      this.showUserMenu = false
    },
    navigateTo(path) {
      this.$router.push(path)
    },
    handleNotificationClick(notification) {
      // Mark as read
      notification.read = true

      // Close dropdown
      this.showNotifications = false

      // Navigate to related page
      if (notification.link) {
        this.$router.push(notification.link)
      }
    },
    markAllAsRead() {
      this.notifications.forEach(n => {
        n.read = true
      })
    },
    getNotificationIcon(type) {
      const icons = {
        isuzu_queue: '🚗',
        byd_queue: '⚡',
        document: '📄',
        warning: '⚠️',
        success: '✅',
        info: 'ℹ️'
      }
      return icons[type] || '🔔'
    },
    getNotificationIconBg(type) {
      const backgrounds = {
        isuzu_queue: 'bg-[#FEE2E2]',
        byd_queue: 'bg-[#D1FAE5]',
        document: 'bg-[#F3F4F6]',
        warning: 'bg-[#FEF3C7]',
        success: 'bg-[#D1FAE5]',
        info: 'bg-red-100'
      }
      return backgrounds[type] || 'bg-gray-100'
    },
    handleHelp() {
      // Close user menu
      this.showUserMenu = false
      // Open help modal or navigate to help page
      alert('ติดต่อฝ่ายสนับสนุน: support@testdrive.com')
    },
    async handleLogout() {
      // Close user menu
      this.showUserMenu = false

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
      } catch (error) {
        console.error('Logout error:', error)
        if (this.$toast) {
          this.$toast.error('เกิดข้อผิดพลาดในการออกจากระบบ')
        }
      }
    }
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 150ms ease-out;
}
</style>
