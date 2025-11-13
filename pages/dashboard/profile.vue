<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">โปรไฟล์</h1>
        <p class="text-gray-600">จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชี</p>
      </div>
    </div>

    <!-- Profile Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Card -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <!-- Avatar -->
          <div class="flex flex-col items-center">
            <div class="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {{ userInitials }}
            </div>
            <h2 class="mt-4 text-xl font-bold text-gray-900">{{ user.name || 'ไม่ระบุชื่อ' }}</h2>
            <p class="text-sm text-gray-500">{{ user.email || 'ไม่ระบุอีเมล' }}</p>
            <span class="mt-2 px-3 py-1 rounded-full text-xs font-medium" :class="roleClasses">
              {{ roleLabel }}
            </span>
          </div>

          <!-- Stats -->
          <div class="mt-6 pt-6 border-t border-gray-200 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">สถานะ</span>
              <span class="flex items-center space-x-1">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="text-sm font-medium text-gray-900">ออนไลน์</span>
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">เข้าร่วมเมื่อ</span>
              <span class="text-sm font-medium text-gray-900">{{ joinedDate }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">เข้าสู่ระบบล่าสุด</span>
              <span class="text-sm font-medium text-gray-900">{{ lastLogin }}</span>
            </div>
          </div>

          <!-- Action Button -->
          <button
            @click="handleEditAvatar"
            class="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            เปลี่ยนรูปโปรไฟล์
          </button>
        </div>
      </div>

      <!-- Profile Information -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Personal Information -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-gray-900">ข้อมูลส่วนตัว</h3>
            <button
              @click="toggleEdit"
              class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              :class="isEditing ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'"
            >
              {{ isEditing ? 'ยกเลิก' : 'แก้ไข' }}
            </button>
          </div>

          <form @submit.prevent="handleSave" class="space-y-4">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
              <input
                v-model="formData.name"
                type="text"
                :disabled="!isEditing"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="กรอกชื่อ-นามสกุล"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
              <input
                v-model="formData.email"
                type="email"
                :disabled="!isEditing"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="กรอกอีเมล"
              />
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
              <input
                v-model="formData.phone"
                type="tel"
                :disabled="!isEditing"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="กรอกเบอร์โทรศัพท์"
              />
            </div>

            <!-- Department -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">แผนก</label>
              <input
                v-model="formData.department"
                type="text"
                :disabled="!isEditing"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="กรอกแผนก"
              />
            </div>

            <!-- Save Button -->
            <div v-if="isEditing" class="pt-4">
              <button
                type="submit"
                class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                บันทึกข้อมูล
              </button>
            </div>
          </form>
        </div>

        <!-- Security Settings -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-6">การรักษาความปลอดภัย</h3>

          <div class="space-y-4">
            <!-- Change Password -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 class="text-sm font-medium text-gray-900">เปลี่ยนรหัสผ่าน</h4>
                <p class="text-xs text-gray-500 mt-1">เปลี่ยนรหัสผ่านเพื่อความปลอดภัย</p>
              </div>
              <button
                @click="handleChangePassword"
                class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                เปลี่ยน
              </button>
            </div>

            <!-- Two-Factor Authentication -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 class="text-sm font-medium text-gray-900">การยืนยันตัวตนแบบสองขั้นตอน</h4>
                <p class="text-xs text-gray-500 mt-1">เพิ่มความปลอดภัยให้กับบัญชี</p>
              </div>
              <button
                @click="handleToggle2FA"
                class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                :class="twoFactorEnabled ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'"
              >
                {{ twoFactorEnabled ? 'ปิดใช้งาน' : 'เปิดใช้งาน' }}
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
  name: 'ProfilePage',
  layout: 'dashboard',
  data() {
    return {
      isEditing: false,
      twoFactorEnabled: false,
      user: {
        name: 'Admin User',
        email: 'admin@testdrive.com',
        phone: '081-234-5678',
        department: 'IT Department',
        role: 'admin',
        joinedDate: '2024-01-01',
        lastLogin: '2024-01-15'
      },
      formData: {
        name: '',
        email: '',
        phone: '',
        department: ''
      }
    }
  },
  computed: {
    userInitials() {
      if (!this.user.name) return 'U'
      const names = this.user.name.split(' ')
      if (names.length >= 2) {
        return names[0][0] + names[1][0]
      }
      return this.user.name.substring(0, 2).toUpperCase()
    },
    roleLabel() {
      const roles = {
        admin: 'ผู้ดูแลระบบ',
        manager: 'ผู้จัดการ',
        staff: 'พนักงาน',
        user: 'ผู้ใช้งาน'
      }
      return roles[this.user.role] || 'ผู้ใช้งาน'
    },
    roleClasses() {
      const classes = {
        admin: 'bg-purple-100 text-purple-700',
        manager: 'bg-blue-100 text-blue-700',
        staff: 'bg-green-100 text-green-700',
        user: 'bg-gray-100 text-gray-700'
      }
      return classes[this.user.role] || classes.user
    },
    joinedDate() {
      if (!this.user.joinedDate) return '-'
      return new Date(this.user.joinedDate).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    lastLogin() {
      if (!this.user.lastLogin) return '-'
      return new Date(this.user.lastLogin).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  },
  mounted() {
    this.loadUserData()
  },
  methods: {
    loadUserData() {
      // Load from store or API
      const storeUser = this.$store?.getters['auth/user']
      if (storeUser) {
        this.user = { ...this.user, ...storeUser }
      }

      // Initialize form data
      this.formData = {
        name: this.user.name,
        email: this.user.email,
        phone: this.user.phone,
        department: this.user.department
      }
    },
    toggleEdit() {
      this.isEditing = !this.isEditing
      if (!this.isEditing) {
        // Reset form data
        this.formData = {
          name: this.user.name,
          email: this.user.email,
          phone: this.user.phone,
          department: this.user.department
        }
      }
    },
    async handleSave() {
      try {
        // TODO: Call API to update user data
        console.log('Saving user data:', this.formData)

        // Update local user data
        this.user = { ...this.user, ...this.formData }

        // Update store if available
        if (this.$store?.commit) {
          this.$store.commit('auth/setUser', this.user)
        }

        this.isEditing = false

        // Show success message
        if (this.$toast) {
          this.$toast.success('บันทึกข้อมูลเรียบร้อยแล้ว')
        } else {
          alert('บันทึกข้อมูลเรียบร้อยแล้ว')
        }
      } catch (error) {
        console.error('Error saving user data:', error)
        if (this.$toast) {
          this.$toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
        } else {
          alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
        }
      }
    },
    handleEditAvatar() {
      // TODO: Implement avatar upload
      console.log('Edit avatar clicked')
      if (this.$toast) {
        this.$toast.info('ฟีเจอร์นี้กำลังพัฒนา')
      } else {
        alert('ฟีเจอร์นี้กำลังพัฒนา')
      }
    },
    handleChangePassword() {
      // TODO: Implement password change
      console.log('Change password clicked')
      if (this.$toast) {
        this.$toast.info('ฟีเจอร์นี้กำลังพัฒนา')
      } else {
        alert('ฟีเจอร์นี้กำลังพัฒนา')
      }
    },
    handleToggle2FA() {
      this.twoFactorEnabled = !this.twoFactorEnabled
      const message = this.twoFactorEnabled
        ? 'เปิดใช้งานการยืนยันตัวตนแบบสองขั้นตอนแล้ว'
        : 'ปิดใช้งานการยืนยันตัวตนแบบสองขั้นตอนแล้ว'

      if (this.$toast) {
        this.$toast.success(message)
      } else {
        alert(message)
      }
    }
  }
}
</script>
