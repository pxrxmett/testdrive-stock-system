<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">ตั้งค่าระบบ</h1>
        <p class="text-gray-600">จัดการการตั้งค่าและข้อมูลส่วนตัว</p>
      </div>
      <button
        v-if="hasChanges"
        @click="saveAllSettings"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
      >
        บันทึกการเปลี่ยนแปล
      </button>
    </div>

    <!-- Settings Tabs -->
    <div class="bg-white rounded-lg border border-gray-200">
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8 px-6" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="currentTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              currentTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Profile Settings -->
      <div v-if="currentTab === 'profile'" class="p-6 space-y-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">ข้อมูลส่วนตัว</h3>

          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {{ userInitial }}
              </div>
              <div>
                <button class="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  เปลี่ยนรูปโปรไฟล์
                </button>
                <p class="text-xs text-gray-500 mt-1">รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 2MB</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">ชื่อ</label>
                <input
                  v-model="profileForm.firstName"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="กรอกชื่อ"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">นามสกุล</label>
                <input
                  v-model="profileForm.lastName"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="กรอกนามสกุล"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">ชื่อเล่น</label>
                <input
                  v-model="profileForm.nickname"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="กรอกชื่อเล่น"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
                <input
                  v-model="profileForm.email"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="example@company.com"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">เบอร์โทรศัพท์</label>
                <input
                  v-model="profileForm.phone"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0812345678"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">ตำแหน่ง</label>
                <input
                  v-model="profileForm.position"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="เช่น พนักงานขาย"
                >
              </div>
            </div>

            <div class="flex justify-end">
              <button
                @click="saveProfile"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                บันทึกข้อมูล
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div v-if="currentTab === 'security'" class="p-6 space-y-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">ความปลอดภัย</h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">รหัสผ่านปัจจุบัน</label>
              <input
                v-model="securityForm.currentPassword"
                type="password"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="กรอกรหัสผ่านปัจจุบัน"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">รหัสผ่านใหม่</label>
              <input
                v-model="securityForm.newPassword"
                type="password"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="กรอกรหัสผ่านใหม่"
              >
              <p class="text-xs text-gray-500 mt-1">รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ยืนยันรหัสผ่านใหม่</label>
              <input
                v-model="securityForm.confirmPassword"
                type="password"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ยืนยันรหัสผ่านใหม่"
              >
            </div>

            <div class="flex justify-end">
              <button
                @click="changePassword"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                เปลี่ยนรหัสผ่าน
              </button>
            </div>
          </div>
        </div>

        <!-- Two-Factor Authentication -->
        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">การยืนยันตัวตนแบบสองชั้น</h3>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-900 font-medium">เปิดใช้งาน 2FA</p>
              <p class="text-xs text-gray-500">เพิ่มความปลอดภัยด้วยการยืนยันตัวตนแบบสองชั้น</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input v-model="securityForm.twoFactorEnabled" type="checkbox" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Notifications Settings -->
      <div v-if="currentTab === 'notifications'" class="p-6 space-y-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">การแจ้งเตือน</h3>

          <div class="space-y-4">
            <div class="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p class="text-sm font-medium text-gray-900">การแจ้งเตือนทางอีเมล</p>
                <p class="text-xs text-gray-500">รับการแจ้งเตือนผ่านอีเมล</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input v-model="notificationForm.email" type="checkbox" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div class="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p class="text-sm font-medium text-gray-900">การแจ้งเตือนทาง LINE</p>
                <p class="text-xs text-gray-500">รับการแจ้งเตือนผ่าน LINE</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input v-model="notificationForm.line" type="checkbox" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div class="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p class="text-sm font-medium text-gray-900">แจ้งเตือนคิวใหม่</p>
                <p class="text-xs text-gray-500">รับการแจ้งเตือนเมื่อมีคิวใหม่</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input v-model="notificationForm.newQueue" type="checkbox" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div class="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p class="text-sm font-medium text-gray-900">แจ้งเตือนการเปลี่ยนสถานะคิว</p>
                <p class="text-xs text-gray-500">รับการแจ้งเตือนเมื่อสถานะคิวเปลี่ยนแปลง</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input v-model="notificationForm.queueStatus" type="checkbox" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div class="flex items-center justify-between py-3">
              <div>
                <p class="text-sm font-medium text-gray-900">แจ้งเตือนอีเวนต์</p>
                <p class="text-xs text-gray-500">รับการแจ้งเตือนเกี่ยวกับอีเวนต์</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input v-model="notificationForm.events" type="checkbox" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div class="flex justify-end pt-4">
              <button
                @click="saveNotifications"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                บันทึกการตั้งค่า
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- System Settings -->
      <div v-if="currentTab === 'system'" class="p-6 space-y-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">การตั้งค่าระบบ</h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ภาษา</label>
              <select
                v-model="systemForm.language"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="th">ภาษาไทย</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">โซนเวลา</label>
              <select
                v-model="systemForm.timezone"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Asia/Bangkok">เอเชีย/กรุงเทพ (GMT+7)</option>
                <option value="Asia/Tokyo">เอเชีย/โตเกียว (GMT+9)</option>
                <option value="UTC">UTC (GMT+0)</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">รูปแบบวันที่</label>
              <select
                v-model="systemForm.dateFormat"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div class="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p class="text-sm font-medium text-gray-900">โหมดมืด</p>
                <p class="text-xs text-gray-500">เปลี่ยนเป็นธีมสีเข้ม</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input v-model="systemForm.darkMode" type="checkbox" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div class="flex justify-end pt-4">
              <button
                @click="saveSystem"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                บันทึกการตั้งค่า
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
  name: 'SettingsPage',
  layout: 'dashboard',
  data() {
    return {
      currentTab: 'profile',
      hasChanges: false,
      tabs: [
        { id: 'profile', name: 'ข้อมูลส่วนตัว' },
        { id: 'security', name: 'ความปลอดภัย' },
        { id: 'notifications', name: 'การแจ้งเตือน' },
        { id: 'system', name: 'ระบบ' }
      ],
      profileForm: {
        firstName: '',
        lastName: '',
        nickname: '',
        email: '',
        phone: '',
        position: ''
      },
      securityForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: false
      },
      notificationForm: {
        email: true,
        line: false,
        newQueue: true,
        queueStatus: true,
        events: true
      },
      systemForm: {
        language: 'th',
        timezone: 'Asia/Bangkok',
        dateFormat: 'DD/MM/YYYY',
        darkMode: false
      }
    }
  },
  computed: {
    userInitial() {
      if (this.profileForm.nickname) {
        return this.profileForm.nickname.charAt(0).toUpperCase()
      }
      if (this.profileForm.firstName) {
        return this.profileForm.firstName.charAt(0).toUpperCase()
      }
      return 'U'
    }
  },
  async mounted() {
    await this.loadSettings()
  },
  methods: {
    async loadSettings() {
      try {
        // Load user profile from auth store or API
        const user = this.$store?.state?.auth?.user
        if (user) {
          this.profileForm = {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            nickname: user.nickname || '',
            email: user.email || '',
            phone: user.phone || '',
            position: user.position || user.role || ''
          }
        }

        // Load saved settings from localStorage
        const savedNotifications = localStorage.getItem('notification-settings')
        if (savedNotifications) {
          this.notificationForm = JSON.parse(savedNotifications)
        }

        const savedSystem = localStorage.getItem('system-settings')
        if (savedSystem) {
          this.systemForm = JSON.parse(savedSystem)
        }
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    },

    async saveProfile() {
      try {
        // TODO: Call API to update profile
        // await this.$api._axios.$patch('/users/me', this.profileForm)

        this.$toast?.success('บันทึกข้อมูลเรียบร้อย')
        this.hasChanges = false
      } catch (error) {
        console.error('Error saving profile:', error)
        this.$toast?.error('ไม่สามารถบันทึกข้อมูลได้')
      }
    },

    async changePassword() {
      if (this.securityForm.newPassword !== this.securityForm.confirmPassword) {
        this.$toast?.error('รหัสผ่านใหม่ไม่ตรงกัน')
        return
      }

      if (this.securityForm.newPassword.length < 8) {
        this.$toast?.error('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')
        return
      }

      try {
        // TODO: Call API to change password
        // await this.$api._axios.$post('/auth/change-password', {
        //   currentPassword: this.securityForm.currentPassword,
        //   newPassword: this.securityForm.newPassword
        // })

        this.$toast?.success('เปลี่ยนรหัสผ่านเรียบร้อย')
        this.securityForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          twoFactorEnabled: this.securityForm.twoFactorEnabled
        }
      } catch (error) {
        console.error('Error changing password:', error)
        this.$toast?.error('ไม่สามารถเปลี่ยนรหัสผ่านได้')
      }
    },

    async saveNotifications() {
      try {
        localStorage.setItem('notification-settings', JSON.stringify(this.notificationForm))
        // TODO: Call API to save notification preferences
        this.$toast?.success('บันทึกการตั้งค่าการแจ้งเตือนเรียบร้อย')
        this.hasChanges = false
      } catch (error) {
        console.error('Error saving notifications:', error)
        this.$toast?.error('ไม่สามารถบันทึกการตั้งค่าได้')
      }
    },

    async saveSystem() {
      try {
        localStorage.setItem('system-settings', JSON.stringify(this.systemForm))
        // TODO: Apply system settings (language, timezone, etc.)
        this.$toast?.success('บันทึกการตั้งค่าระบบเรียบร้อย')
        this.hasChanges = false
      } catch (error) {
        console.error('Error saving system settings:', error)
        this.$toast?.error('ไม่สามารถบันทึกการตั้งค่าได้')
      }
    },

    async saveAllSettings() {
      await this.saveProfile()
      await this.saveNotifications()
      await this.saveSystem()
    }
  }
}
</script>
