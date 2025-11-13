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
        <!-- Notifications Dropdown -->
        <Dropdown align="right" width="w-80">
          <template #trigger="{ isOpen }">
            <button
              :class="[
                'p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded relative transition-colors',
                isOpen && 'bg-gray-100 text-gray-700'
              ]"
            >
              <Icon name="bell" icon-class="w-5 h-5" />
              <div v-if="unreadNotifications > 0" class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>
          </template>

          <!-- Notifications Header -->
          <div class="px-4 py-3 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold text-gray-900">การแจ้งเตือน</h3>
              <span v-if="unreadNotifications > 0" class="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                {{ unreadNotifications }}
              </span>
            </div>
          </div>

          <!-- Notifications List -->
          <div class="max-h-96 overflow-y-auto">
            <template v-if="notifications.length > 0">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                @click="handleNotificationClick(notification)"
                class="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
              >
                <div class="flex items-start space-x-3">
                  <div
                    :class="[
                      'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                      notification.read ? 'bg-gray-300' : 'bg-blue-500'
                    ]"
                  ></div>
                  <div class="flex-1 min-w-0">
                    <p :class="['text-sm', notification.read ? 'text-gray-600' : 'text-gray-900 font-medium']">
                      {{ notification.title }}
                    </p>
                    <p class="text-xs text-gray-500 mt-1">{{ notification.time }}</p>
                  </div>
                </div>
              </div>
            </template>
            <div v-else class="px-4 py-8 text-center">
              <Icon name="bell" icon-class="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p class="text-sm text-gray-500">ไม่มีการแจ้งเตือน</p>
            </div>
          </div>

          <!-- Notifications Footer -->
          <div v-if="notifications.length > 0" class="px-4 py-2 border-t border-gray-200 bg-gray-50">
            <button
              @click="markAllAsRead"
              class="w-full text-center text-xs font-medium text-blue-600 hover:text-blue-700 py-1"
            >
              ทำเครื่องหมายว่าอ่านทั้งหมด
            </button>
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
          title: 'มีคิวใหม่จาก ISUZU ที่ต้องดำเนินการ',
          time: '5 นาทีที่แล้ว',
          read: false
        },
        {
          id: 2,
          title: 'การทดลองขับ BYD ของวันนี้เสร็จสิ้นแล้ว',
          time: '1 ชั่วโมงที่แล้ว',
          read: false
        },
        {
          id: 3,
          title: 'มีเอกสารใหม่รอการอนุมัติ',
          time: '3 ชั่วโมงที่แล้ว',
          read: true
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

      // Navigate based on notification type (implement routing logic)
      console.log('Notification clicked:', notification)
    },
    markAllAsRead() {
      this.notifications.forEach(n => {
        n.read = true
      })
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
