<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">จัดการพนักงานทั้งหมด</h1>
          <p class="text-sm text-gray-600 mt-1">ดูและจัดการพนักงานจากทุกแบรนด์</p>
        </div>
        <NuxtLink
          to="/admin/staff/create"
          class="px-4 py-2.5 bg-gradient-to-r from-[#D52B1E] to-[#B91C1C] text-white text-sm font-medium rounded-lg hover:from-[#B91C1C] hover:to-[#991B1B] transition-all duration-150 shadow-sm hover:shadow-md"
        >
          + เพิ่มพนักงาน
        </NuxtLink>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <BrandFilter v-model="filters.brandCode" @change="loadStaff" />

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
            <select
              v-model="filters.status"
              @change="loadStaff"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E]"
            >
              <option value="">ทั้งหมด</option>
              <option value="active">ใช้งานอยู่</option>
              <option value="inactive">ไม่ใช้งาน</option>
              <option value="on_leave">ลาพัก</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ตำแหน่ง</label>
            <select
              v-model="filters.role"
              @change="loadStaff"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E]"
            >
              <option value="">ทั้งหมด</option>
              <option value="admin">ผู้ดูแลระบบ</option>
              <option value="manager">ผู้จัดการ</option>
              <option value="sales">พนักงานขาย</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ค้นหา</label>
            <input
              v-model="filters.search"
              @input="debouncedSearch"
              type="text"
              placeholder="ชื่อ, รหัส, อีเมล..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E]"
            >
          </div>
        </div>
      </div>

      <!-- Staff List -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <!-- Loading State -->
        <LoadingSkeleton
          v-if="loading"
          variant="table"
          :count="5"
        />

        <!-- Empty State -->
        <EmptyState
          v-else-if="!loading && staff.length === 0"
          title="ไม่พบพนักงาน"
          description="ลองปรับเปลี่ยนตัวกรองหรือเพิ่มพนักงานใหม่เข้าสู่ระบบ"
          actionLabel="เพิ่มพนักงาน"
          actionVariant="primary"
          @action="() => $router.push('/admin/staff/create')"
        >
          <template #icon>
            <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
              <svg class="w-8 h-8 text-[#D52B1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </template>
        </EmptyState>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">รหัส</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">ชื่อ-นามสกุล</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">แบรนด์</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">ตำแหน่ง</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">ติดต่อ</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">สถานะ</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">จัดการ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="member in staff"
                :key="member.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-6 py-4">
                  <span class="text-sm font-medium text-gray-900">{{ member.employeeCode }}</span>
                </td>
                <td class="px-6 py-4">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ member.fullName }}</div>
                    <div v-if="member.fullNameEn" class="text-xs text-gray-500">{{ member.fullNameEn }}</div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <BrandBadge :brand-code="member.brandCode" size="sm" />
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-gray-600">{{ getRoleDisplayName(member.role) }}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ member.phone }}</div>
                  <div class="text-xs text-gray-500">{{ member.email }}</div>
                </td>
                <td class="px-6 py-4">
                  <span :class="getStatusBadgeClasses(member.status)" class="px-2.5 py-1 text-xs font-semibold rounded-full border">
                    {{ getStatusDisplayName(member.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right space-x-2">
                  <NuxtLink
                    :to="`/admin/staff/${member.id}/edit`"
                    class="text-sm font-medium text-[#D52B1E] hover:text-[#991B1B] transition-colors duration-150"
                  >
                    แก้ไข
                  </NuxtLink>
                  <button
                    @click="confirmDelete(member)"
                    class="text-sm font-medium text-[#D52B1E] hover:text-red-800 transition-colors duration-150"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div class="text-sm text-gray-600">
            แสดง {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, totalRecords) }} จาก {{ totalRecords }} รายการ
          </div>
          <div class="flex space-x-2">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ก่อนหน้า
            </button>
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="changePage(page)"
              :class="page === currentPage ? 'bg-[#D52B1E] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
              class="px-3 py-1 rounded border border-gray-300 text-sm"
            >
              {{ page }}
            </button>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatStaffFromAPI, getRoleDisplayName, getStatusDisplayName, getStatusBadgeClasses } from '~/utils/brand'

export default {
  name: 'AdminStaffListPage',
  layout: 'dashboard',
  middleware: false, // TODO: Add admin middleware
  data() {
    return {
      staff: [],
      loading: false,
      filters: {
        brandCode: '',
        status: '',
        role: '',
        search: ''
      },
      currentPage: 1,
      pageSize: 20,
      totalRecords: 0,
      totalPages: 0,
      searchTimeout: null
    }
  },
  computed: {
    visiblePages() {
      const pages = []
      const maxVisible = 5
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2))
      let end = Math.min(this.totalPages, start + maxVisible - 1)

      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    }
  },
  mounted() {
    this.loadStaff()
  },
  methods: {
    getRoleDisplayName,
    getStatusDisplayName,
    getStatusBadgeClasses,

    async loadStaff() {
      this.loading = true
      try {
        const params = {
          page: this.currentPage,
          limit: this.pageSize
        }

        // Add filters
        if (this.filters.brandCode) params.brandCode = this.filters.brandCode
        if (this.filters.status) params.status = this.filters.status
        if (this.filters.role) params.role = this.filters.role
        if (this.filters.search) params.search = this.filters.search

        const response = await this.$api.staffs.admin.getAll(params)

        // Format staff data
        this.staff = (response.data || response).map(formatStaffFromAPI)
        this.totalRecords = response.total || this.staff.length
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize)

      } catch (error) {
        console.error('Error loading staff:', error)
        this.$toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูลพนักงาน')
        this.staff = []
      } finally {
        this.loading = false
      }
    },

    debouncedSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1
        this.loadStaff()
      }, 500)
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.loadStaff()
      }
    },

    async confirmDelete(member) {
      if (!confirm(`ต้องการลบพนักงาน ${member.fullName} (${member.employeeCode}) หรือไม่?`)) {
        return
      }

      try {
        await this.$api.staffs.delete(member.brandCode, member.id)
        this.$toast.success('ลบพนักงานเรียบร้อยแล้ว')
        await this.loadStaff()
      } catch (error) {
        console.error('Error deleting staff:', error)
        this.$toast.error('เกิดข้อผิดพลาดในการลบพนักงาน')
      }
    }
  },
  head() {
    return {
      title: 'จัดการพนักงานทั้งหมด - Admin Dashboard'
    }
  }
}
</script>
