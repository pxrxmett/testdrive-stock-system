<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">จัดการผู้ใช้ LINE</h1>
        <p class="text-sm text-gray-600 mt-1">เชื่อมโยงบัญชี LINE กับพนักงานในระบบ</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-3xl font-bold text-gray-900">{{ pendingUsers.length }}</p>
              <p class="text-sm text-gray-600 mt-1">รอเชื่อมโยง</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-3xl font-bold text-gray-900">{{ linkedUsers.length }}</p>
              <p class="text-sm text-gray-600 mt-1">เชื่อมโยงแล้ว</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-[#D52B1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <p class="text-3xl font-bold text-gray-900">{{ pendingUsers.length + linkedUsers.length }}</p>
              <p class="text-sm text-gray-600 mt-1">ทั้งหมด</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="border-b border-gray-200 px-6">
          <nav class="flex -mb-px space-x-8">
            <button
              @click="activeTab = 'pending'"
              :class="[
                'py-4 text-sm font-medium border-b-2 transition-all duration-150',
                activeTab === 'pending'
                  ? 'border-red-600 text-[#D52B1E]'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              ]"
            >
              <span class="flex items-center space-x-2">
                <span>รอเชื่อมโยง</span>
                <span v-if="pendingUsers.length > 0" class="px-2 py-0.5 bg-red-100 text-[#D52B1E] text-xs font-semibold rounded-full">
                  {{ pendingUsers.length }}
                </span>
              </span>
            </button>
            <button
              @click="activeTab = 'linked'"
              :class="[
                'py-4 text-sm font-medium border-b-2 transition-all duration-150',
                activeTab === 'linked'
                  ? 'border-red-600 text-[#D52B1E]'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              ]"
            >
              <span class="flex items-center space-x-2">
                <span>เชื่อมโยงแล้ว</span>
                <span v-if="linkedUsers.length > 0" class="px-2 py-0.5 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
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
            <!-- Loading State -->
            <LoadingSkeleton
              v-if="loading"
              variant="card"
              :count="3"
              grid
              :cols="3"
            />

            <!-- Empty State -->
            <EmptyState
              v-else-if="!loading && pendingUsers.length === 0"
              title="ไม่มีผู้ใช้รอเชื่อมโยง"
              description="ผู้ใช้ LINE ที่ยังไม่ได้เชื่อมโยงกับพนักงานจะแสดงที่นี่ เมื่อมีผู้ใช้ใหม่เพิ่มเข้ามา"
            >
              <template #icon>
                <div class="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full">
                  <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </template>
            </EmptyState>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="user in pendingUsers"
                :key="user.id"
                class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:scale-101 transition-all duration-150"
              >
                <div class="flex flex-col items-center text-center">
                  <img
                    :src="user.pictureUrl || '/default-avatar.png'"
                    :alt="user.displayName"
                    class="w-16 h-16 rounded-full mb-4"
                  />
                  <h3 class="font-semibold text-gray-900 mb-1">{{ user.displayName }}</h3>
                  <p class="text-xs text-gray-500 mb-2">LINE ID: {{ user.lineUserId }}</p>
                  <p class="text-xs text-gray-400">
                    เพิ่มเมื่อ: {{ formatDate(user.createdAt) }}
                  </p>
                </div>
                <div class="mt-6">
                  <button
                    @click="openLinkModal(user)"
                    class="w-full px-4 py-2.5 bg-gradient-to-r from-[#D52B1E] to-[#B91C1C] text-white text-sm font-medium rounded-lg hover:from-[#B91C1C] hover:to-[#991B1B] transition-all duration-150 shadow-sm hover:shadow-md"
                  >
                    เชื่อมโยงพนักงาน
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Linked Users Tab -->
          <div v-if="activeTab === 'linked'">
            <!-- Loading State -->
            <LoadingSkeleton
              v-if="loading"
              variant="table"
              :count="5"
            />

            <!-- Empty State -->
            <EmptyState
              v-else-if="!loading && linkedUsers.length === 0"
              title="ยังไม่มีการเชื่อมโยง"
              description="ผู้ใช้ LINE ที่เชื่อมโยงกับพนักงานแล้วจะแสดงในตารางนี้ เริ่มต้นโดยเชื่อมโยงผู้ใช้จากแท็บรอเชื่อมโยง"
            >
              <template #icon>
                <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                  <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
              </template>
            </EmptyState>

            <div v-else class="overflow-x-auto -mx-6">
              <table class="min-w-full">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      ผู้ใช้ LINE
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      พนักงาน
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      วันที่เชื่อมโยง
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      สถานะ
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="user in linkedUsers" :key="user.id" class="hover:bg-gray-50 transition-colors duration-150">
                    <td class="px-6 py-4">
                      <div class="flex items-center space-x-3">
                        <img
                          :src="user.pictureUrl || '/default-avatar.png'"
                          :alt="user.displayName"
                          class="w-12 h-12 rounded-full"
                        />
                        <div>
                          <div class="text-sm font-medium text-gray-900">{{ user.displayName }}</div>
                          <div class="text-xs text-gray-500">{{ user.lineUserId }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm font-medium text-gray-900">{{ user.staffName }}</div>
                      <div class="text-xs text-gray-500">{{ user.staffRole }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-600">{{ formatDate(user.linkedAt) }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <span class="px-2.5 py-1 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-700">
                        เชื่อมโยงแล้ว
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button
                        @click="unlinkUser(user)"
                        class="text-sm font-medium text-[#D52B1E] hover:text-red-800 transition-colors duration-150"
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
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeLinkModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-xl w-full mx-4 animate-fadeIn">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">เชื่อมโยงพนักงาน</h3>
            <button
              @click="closeLinkModal"
              class="text-gray-400 hover:text-gray-600 transition-colors duration-150 p-1 rounded-lg hover:bg-gray-100"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="selectedUser" class="mb-6">
            <p class="text-sm font-medium text-gray-700 mb-3">ผู้ใช้ LINE</p>
            <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <img
                :src="selectedUser.pictureUrl || '/default-avatar.png'"
                :alt="selectedUser.displayName"
                class="w-14 h-14 rounded-full"
              />
              <div>
                <p class="font-semibold text-gray-900">{{ selectedUser.displayName }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ selectedUser.lineUserId }}</p>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              เลือกพนักงาน
            </label>
            <select
              v-model="selectedStaffId"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E] transition-all duration-150"
            >
              <option value="">-- เลือกพนักงาน --</option>
              <option v-for="staff in staffList" :key="staff.id" :value="staff.id">
                {{ staff.name }} - {{ staff.role }}
              </option>
            </select>
          </div>

          <div v-if="selectedStaffId" class="mb-6">
            <p class="text-sm font-medium text-gray-700 mb-3">ตัวอย่างพนักงานที่เลือก</p>
            <div class="p-4 bg-green-50 rounded-lg border border-green-200">
              <p class="text-sm font-medium text-gray-900">
                {{ staffList.find(s => s.id === selectedStaffId)?.name }}
              </p>
              <p class="text-xs text-gray-600 mt-1">
                {{ staffList.find(s => s.id === selectedStaffId)?.role }}
              </p>
            </div>
          </div>

          <div class="flex space-x-3">
            <button
              @click="closeLinkModal"
              class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-150"
            >
              ยกเลิก
            </button>
            <button
              @click="linkUser"
              :disabled="!selectedStaffId || linking"
              class="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#D52B1E] to-[#B91C1C] text-white font-medium rounded-lg hover:from-[#B91C1C] hover:to-[#991B1B] transition-all duration-150 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
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
        const pendingResponse = await this.$axios.get('/line-users/pending')
        this.pendingUsers = pendingResponse.data || []

        // Fetch linked users
        const linkedResponse = await this.$axios.get('/line-users/linked')
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
        const response = await this.$axios.get('/staff')
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
        await this.$axios.post(`/line-users/${this.selectedUser.id}/link`, {
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
        await this.$axios.post(`/line-users/${user.id}/unlink`)
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
