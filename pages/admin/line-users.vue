<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="mb-6">
        <div class="flex items-center space-x-3 mb-2">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <span class="text-2xl">👥</span>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">จัดการผู้ใช้ LINE</h1>
            <p class="text-gray-600">เชื่อมโยงบัญชี LINE กับพนักงานในระบบ</p>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button
              @click="activeTab = 'pending'"
              :class="[
                'px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <span class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>รอเชื่อมโยง</span>
                <span v-if="pendingUsers.length > 0" class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                  {{ pendingUsers.length }}
                </span>
              </span>
            </button>
            <button
              @click="activeTab = 'linked'"
              :class="[
                'px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'linked'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <span class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>เชื่อมโยงแล้ว</span>
                <span v-if="linkedUsers.length > 0" class="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                  {{ linkedUsers.length }}
                </span>
              </span>
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Pending Users Tab -->
          <div v-if="activeTab === 'pending'">
            <div v-if="loading" class="text-center py-12">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p class="mt-2 text-gray-600">กำลังโหลด...</p>
            </div>

            <div v-else-if="pendingUsers.length === 0" class="text-center py-12">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p class="text-gray-500 font-medium">ไม่มีผู้ใช้รอเชื่อมโยง</p>
              <p class="text-sm text-gray-400 mt-1">ผู้ใช้ LINE ที่ยังไม่ได้เชื่อมโยงกับพนักงานจะแสดงที่นี่</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="user in pendingUsers"
                :key="user.id"
                class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div class="flex items-start space-x-3">
                  <img
                    :src="user.pictureUrl || '/default-avatar.png'"
                    :alt="user.displayName"
                    class="w-12 h-12 rounded-full"
                  />
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-gray-900 truncate">{{ user.displayName }}</h3>
                    <p class="text-xs text-gray-500 truncate">LINE ID: {{ user.lineUserId }}</p>
                    <p class="text-xs text-gray-400 mt-1">
                      เพิ่มเมื่อ: {{ formatDate(user.createdAt) }}
                    </p>
                  </div>
                </div>
                <div class="mt-4">
                  <button
                    @click="openLinkModal(user)"
                    class="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    เชื่อมโยงพนักงาน
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Linked Users Tab -->
          <div v-if="activeTab === 'linked'">
            <div v-if="loading" class="text-center py-12">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p class="mt-2 text-gray-600">กำลังโหลด...</p>
            </div>

            <div v-else-if="linkedUsers.length === 0" class="text-center py-12">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <p class="text-gray-500 font-medium">ยังไม่มีการเชื่อมโยง</p>
              <p class="text-sm text-gray-400 mt-1">ผู้ใช้ที่เชื่อมโยงกับพนักงานแล้วจะแสดงที่นี่</p>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ผู้ใช้ LINE
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      พนักงาน
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      วันที่เชื่อมโยง
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      สถานะ
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="user in linkedUsers" :key="user.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <img
                          :src="user.pictureUrl || '/default-avatar.png'"
                          :alt="user.displayName"
                          class="w-10 h-10 rounded-full"
                        />
                        <div class="ml-3">
                          <div class="text-sm font-medium text-gray-900">{{ user.displayName }}</div>
                          <div class="text-xs text-gray-500">{{ user.lineUserId }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ user.staffName }}</div>
                      <div class="text-xs text-gray-500">{{ user.staffRole }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(user.linkedAt) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        เชื่อมโยงแล้ว
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        @click="unlinkUser(user)"
                        class="text-red-600 hover:text-red-900"
                      >
                        ยกเลิกการเชื่อมโยง
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Link User Modal -->
    <div
      v-if="showLinkModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeLinkModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-gray-900">เชื่อมโยงพนักงาน</h3>
            <button @click="closeLinkModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="selectedUser" class="mb-6">
            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <img
                :src="selectedUser.pictureUrl || '/default-avatar.png'"
                :alt="selectedUser.displayName"
                class="w-12 h-12 rounded-full"
              />
              <div>
                <p class="font-semibold text-gray-900">{{ selectedUser.displayName }}</p>
                <p class="text-xs text-gray-500">{{ selectedUser.lineUserId }}</p>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              เลือกพนักงาน
            </label>
            <select
              v-model="selectedStaffId"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- เลือกพนักงาน --</option>
              <option v-for="staff in staffList" :key="staff.id" :value="staff.id">
                {{ staff.name }} - {{ staff.role }}
              </option>
            </select>
          </div>

          <div class="flex space-x-3">
            <button
              @click="closeLinkModal"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              @click="linkUser"
              :disabled="!selectedStaffId || linking"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {{ linking ? 'กำลังเชื่อมโยง...' : 'เชื่อมโยง' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LineUsersAdminPage',
  layout: 'dashboard',
  middleware: false, // Temporarily disabled for testing - change to 'admin' in production
  data() {
    return {
      activeTab: 'pending',
      loading: false,
      linking: false,
      showLinkModal: false,
      selectedUser: null,
      selectedStaffId: '',
      pendingUsers: [],
      linkedUsers: [],
      staffList: []
    }
  },
  head() {
    return {
      title: 'จัดการผู้ใช้ LINE - Admin Dashboard'
    }
  },
  mounted() {
    this.fetchData()
    this.fetchStaffList()
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        // Fetch pending users
        const pendingResponse = await this.$axios.get('/api/line-users/pending')
        this.pendingUsers = pendingResponse.data || []

        // Fetch linked users
        const linkedResponse = await this.$axios.get('/api/line-users/linked')
        this.linkedUsers = linkedResponse.data || []
      } catch (error) {
        console.error('Error fetching LINE users:', error)
        this.$toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล')
      } finally {
        this.loading = false
      }
    },
    async fetchStaffList() {
      try {
        const response = await this.$axios.get('/api/staff')
        this.staffList = response.data || []
      } catch (error) {
        console.error('Error fetching staff list:', error)
      }
    },
    openLinkModal(user) {
      this.selectedUser = user
      this.selectedStaffId = ''
      this.showLinkModal = true
    },
    closeLinkModal() {
      this.showLinkModal = false
      this.selectedUser = null
      this.selectedStaffId = ''
    },
    async linkUser() {
      if (!this.selectedStaffId) {
        this.$toast.error('กรุณาเลือกพนักงาน')
        return
      }

      this.linking = true
      try {
        await this.$axios.post(`/api/line-users/${this.selectedUser.id}/link`, {
          staffId: this.selectedStaffId
        })

        this.$toast.success('เชื่อมโยงสำเร็จ')
        this.closeLinkModal()
        await this.fetchData()
      } catch (error) {
        console.error('Error linking user:', error)
        this.$toast.error('เกิดข้อผิดพลาดในการเชื่อมโยง')
      } finally {
        this.linking = false
      }
    },
    async unlinkUser(user) {
      if (!confirm(`คุณต้องการยกเลิกการเชื่อมโยงของ ${user.displayName} หรือไม่?`)) {
        return
      }

      try {
        await this.$axios.post(`/api/line-users/${user.id}/unlink`)
        this.$toast.success('ยกเลิกการเชื่อมโยงสำเร็จ')
        await this.fetchData()
      } catch (error) {
        console.error('Error unlinking user:', error)
        this.$toast.error('เกิดข้อผิดพลาดในการยกเลิกการเชื่อมโยง')
      }
    },
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>
