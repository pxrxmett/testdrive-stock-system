<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <svg class="animate-spin h-12 w-12 text-[#D52B1E] mx-auto mb-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">กำลังโหลดเอกสาร...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="testDrive" class="no-print">
      <!-- Header -->
      <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <button
                @click="$router.back()"
                class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 class="text-xl font-semibold text-gray-900">เอกสารทดลองขับ</h1>
                <p class="text-sm text-gray-600">{{ testDrive.customer_name || testDrive.customerName || 'ไม่ระบุชื่อ' }}</p>
              </div>
            </div>

            <div class="flex items-center space-x-3">
              <button
                v-if="currentTab === 'pdpa'"
                @click="printPdpa"
                class="flex items-center space-x-2 px-4 py-2 bg-[#D52B1E] text-white rounded-lg hover:bg-[#B91C1C] transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                </svg>
                <span>พิมพ์ PDPA Signature</span>
              </button>
              <button
                v-if="currentTab === 'full'"
                @click="printFullDocument"
                class="flex items-center space-x-2 px-4 py-2 bg-[#D52B1E] text-white rounded-lg hover:bg-[#B91C1C] transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                </svg>
                <span>พิมพ์ฟอร์มเต็ม</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="px-6">
          <nav class="flex space-x-8" aria-label="Tabs">
            <button
              @click="currentTab = 'pdpa'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                currentTab === 'pdpa'
                  ? 'border-red-500 text-[#D52B1E]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              PDPA Signature
            </button>
            <button
              @click="currentTab = 'full'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                currentTab === 'full'
                  ? 'border-red-500 text-[#D52B1E]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Full Document
            </button>
          </nav>
        </div>
      </header>

      <!-- Tab Content -->
      <main class="px-6 py-6">
        <!-- PDPA Tab -->
        <div v-if="currentTab === 'pdpa'" id="pdpa-document" class="bg-white rounded-lg border border-gray-200 p-8 max-w-4xl mx-auto">
          <PdpaSignature :testDrive="testDrive" />
        </div>

        <!-- Full Document Tab -->
        <div v-if="currentTab === 'full'" id="full-document" class="bg-white rounded-lg border border-gray-200 p-8 max-w-4xl mx-auto">
          <FullDocument :testDrive="testDrive" />
        </div>
      </main>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center py-12">
      <div class="text-center">
        <svg class="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">เกิดข้อผิดพลาด</h3>
        <p class="text-gray-600">{{ error }}</p>
        <button @click="loadTestDrive" class="mt-4 px-4 py-2 bg-[#D52B1E] text-white rounded-lg hover:bg-[#B91C1C]">
          ลองอีกครั้ง
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import PdpaSignature from '~/components/documents/PdpaSignature.vue'
import FullDocument from '~/components/documents/FullDocument.vue'

export default {
  name: 'TestDriveDetail',
  layout: 'dashboard',
  components: {
    PdpaSignature,
    FullDocument
  },
  data() {
    return {
      testDrive: null,
      loading: false,
      error: null,
      currentTab: 'pdpa'
    }
  },
  methods: {
    async loadTestDrive() {
      this.loading = true
      this.error = null

      try {
        const id = this.$route.params.id
        this.testDrive = await this.$api.testDrives.getById(id)
      } catch (error) {
        console.error('Error loading test drive:', error)
        this.error = error.response?.data?.message || 'ไม่สามารถโหลดข้อมูลได้'
        this.$toast?.error(this.error)
      } finally {
        this.loading = false
      }
    },

    printPdpa() {
      window.print()
    },

    printFullDocument() {
      window.print()
    }
  },

  async mounted() {
    await this.loadTestDrive()

    // Auto-print if query parameter is set
    if (this.$route.query.print === 'true') {
      // Wait for component to render
      await this.$nextTick()
      setTimeout(() => {
        window.print()
      }, 500)
    }
  },

  head() {
    return {
      title: `เอกสารทดลองขับ - ${this.testDrive?.customer_name || this.testDrive?.customerName || 'ISUZU'}`
    }
  }
}
</script>

<style>
@media print {
  @page {
    size: A4;
    margin: 1cm;
  }

  /* Hide everything except the document */
  body * {
    visibility: hidden;
  }

  /* Show only the active document */
  #pdpa-document,
  #pdpa-document *,
  #full-document,
  #full-document * {
    visibility: visible;
  }

  #pdpa-document,
  #full-document {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    border: none;
    border-radius: 0;
    padding: 0;
    margin: 0;
  }

  .no-print {
    display: none !important;
  }

  .print-section {
    page-break-inside: avoid;
  }

  .page-break {
    page-break-before: always;
  }
}
</style>
