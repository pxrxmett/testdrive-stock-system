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
        <!-- Notifications Dropdown (Facebook Style) -->
        <Dropdown align="right" width="w-96">
          <template #trigger="{ isOpen }">
            <button
              :class="[
                'relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors',
                isOpen && 'bg-gray-100 text-gray-700'
              ]"
            >
              <Icon name="bell" icon-class="w-6 h-6" />
              <!-- Badge Counter (Facebook style) -->
              <span
                v-if="unreadNotifications > 0"
                class="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[11px] font-bold rounded-full border-2 border-white"
              >
                {{ unreadNotifications > 9 ? '9+' : unreadNotifications }}
              </span>
            </button>
          </template>

          <!-- Notifications Header -->
          <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-base font-semibold text-gray-900">การแจ้งเตือน</h3>
            <button
              @click="navigateTo('/dashboard/settings')"
              class="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              title="ตั้งค่าการแจ้งเตือน"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          <!-- Notifications List -->
          <div class="max-h-[480px] overflow-y-auto">
            <template v-if="notifications.length > 0">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                @click="handleNotificationClick(notification)"
                :class="[
                  'px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100',
                  !notification.read && 'bg-blue-50'
                ]"
              >
                <div class="flex items-start space-x-3">
                  <!-- Icon with Background -->
                  <div
                    :class="[
                      'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                      getNotificationIconBg(notification.type)
                    ]"
                  >
                    <span class="text-lg">{{ getNotificationIcon(notification.type) }}</span>
                  </div>

                  <!-- Content -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2">
                      <p :class="['text-sm leading-snug', notification.read ? 'text-gray-700' : 'text-gray-900 font-medium']">
                        {{ notification.title }}
                      </p>
                      <!-- Unread Dot -->
                      <div
                        v-if="!notification.read"
                        class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"
                      ></div>
                    </div>
                    <p class="text-xs text-gray-600 mt-1">{{ notification.subtitle }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ notification.time }}</p>
                  </div>
                </div>
              </div>
            </template>
            <div v-else class="px-4 py-12 text-center">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="bell" icon-class="w-8 h-8 text-gray-300" />
              </div>
              <p class="text-sm font-medium text-gray-900">ไม่มีการแจ้งเตือน</p>
              <p class="text-xs text-gray-500 mt-1">คุณไม่มีการแจ้งเตือนใหม่ในขณะนี้</p>
            </div>
          </div>

          <!-- Notifications Footer -->
          <div v-if="notifications.length > 0" class="border-t border-gray-200">
            <NuxtLink
              to="/dashboard/notifications"
              class="block px-4 py-3 text-center text-sm font-medium text-blue-600 hover:bg-gray-50 transition-colors"
            >
              ดูการแจ้งเตือนทั้งหมด →
            </NuxtLink>
          </div>
        </Dropdown>

        <!-- Settings Button -->
        <button
          @click="navigateTo('/dashboard/settings')"
          class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
        >
          <Icon name="settings" icon-class="w-5 h-5" />
        </button>

        <!-- User Menu Dropdown -->
        <Dropdown align="right" width="w-56">
          <template #trigger="{ isOpen }">
            <button
              :class="[
                'flex items-center space-x-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors',
                isOpen && 'bg-gray-100 text-gray-700'
              ]"
            >
              <div class="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <span class="text-white font-semibold text-xs">{{ userInitials }}</span>
              </div>
              <span class="hidden md:block text-sm text-gray-700 font-medium">{{ userName }}</span>
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </template>

          <!-- User Info Header -->
          <div class="px-4 py-3 border-b border-gray-200">
            <p class="text-sm font-semibold text-gray-900">{{ userName }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ userEmail }}</p>
          </div>

          <!-- Menu Items -->
          <DropdownItem
            icon="user"
            label="โปรไฟล์"
            to="/dashboard/profile"
          />
          <DropdownItem
            icon="settings"
            label="ตั้งค่า"
            to="/dashboard/settings"
          />

          <DropdownDivider />

          <DropdownItem
            icon="help"
            label="ช่วยเหลือ"
            @click="handleHelp"
          />

          <DropdownDivider />

          <DropdownItem
            icon="logOut"
            label="ออกจากระบบ"
            danger
            @click="handleLogout"
          />
        </Dropdown>
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
      notifications: [
        {
          id: 1,
          type: 'isuzu_queue',
          title: 'มีคิวใหม่จาก ISUZU ที่ต้องดำเนินการ',
          subtitle: '5 รายการรอดำเนินการ',
          time: '5 นาทีที่แล้ว',
          read: false,
          link: '/dashboard/isuzu/queue'
        },
        {
          id: 2,
          type: 'byd_queue',
          title: 'การทดลองขับ BYD เสร็จสิ้นแล้ว',
          subtitle: '1 รายการเสร็จสมบูรณ์',
          time: '3 ชั่วโมงที่แล้ว',
          read: false,
          link: '/dashboard/byd/queue'
        },
        {
          id: 3,
          type: 'document',
          title: 'มีเอกสารใหม่รอการอนุมัติ',
          subtitle: '3 เอกสารจากลูกค้า',
          time: 'เมื่อวาน',
          read: true,
          link: '/dashboard/documents'
        },
        {
          id: 4,
          type: 'warning',
          title: 'สต็อกรถยนต์ใกล้หมด',
          subtitle: 'ISUZU D-MAX เหลือ 2 คัน',
          time: '2 วันที่แล้ว',
          read: true,
          link: '/dashboard/isuzu/stock'
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
    }
  },
  methods: {
    navigateTo(path) {
      this.$router.push(path)
    },
    handleNotificationClick(notification) {
      // Mark as read
      notification.read = true

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
        isuzu_queue: 'bg-red-100',
        byd_queue: 'bg-green-100',
        document: 'bg-gray-100',
        warning: 'bg-yellow-100',
        success: 'bg-green-100',
        info: 'bg-blue-100'
      }
      return backgrounds[type] || 'bg-gray-100'
    },
    handleHelp() {
      // Open help modal or navigate to help page
      alert('ติดต่อฝ่ายสนับสนุน: support@testdrive.com')
    },
    async handleLogout() {
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
