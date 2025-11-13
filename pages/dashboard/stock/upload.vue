<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button
          @click="$router.back()"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">อัพโหลดไฟล์รถยนต์</h1>
          <p class="text-sm text-gray-600">นำเข้าข้อมูลรถยนต์จากไฟล์ Excel</p>
        </div>
      </div>
    </div>

    <!-- Download Template Section -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-start space-x-3">
        <svg class="w-5 h-5 text-[#D52B1E] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <div class="flex-1">
          <h3 class="text-sm font-medium text-blue-800">ดาวน์โหลดเทมเพลต</h3>
          <p class="text-xs text-blue-700 mt-1">ดาวน์โหลดไฟล์ตัวอย่างเพื่อให้แน่ใจว่าข้อมูลของคุณอยู่ในรูปแบบที่ถูกต้อง</p>
          <button
            @click="downloadTemplate"
            class="mt-2 inline-flex items-center space-x-2 px-3 py-1.5 bg-[#D52B1E] text-white rounded text-sm hover:bg-[#B91C1C] transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span>ดาวน์โหลดเทมเพลต Excel</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Upload Section -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h2 class="text-lg font-bold text-gray-900 mb-4">อัพโหลดไฟล์</h2>

      <div class="space-y-4">
        <!-- File Input -->
        <div class="flex items-center justify-center w-full">
          <label
            class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
            :class="{ 'border-[#D52B1E] bg-blue-50': isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleFileDrop"
          >
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg class="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              <p class="mb-2 text-sm text-gray-500">
                <span class="font-semibold">คลิกเพื่ออัพโหลด</span> หรือลากไฟล์มาวาง
              </p>
              <p class="text-xs text-gray-500">รองรับไฟล์ .xlsx, .xls, .csv</p>
              <p v-if="selectedFile" class="mt-2 text-sm font-medium text-[#D52B1E]">
                {{ selectedFile.name }}
              </p>
            </div>
            <input
              ref="fileInput"
              type="file"
              class="hidden"
              accept=".xlsx,.xls,.csv"
              @change="handleFileSelect"
            >
          </label>
        </div>

        <!-- Parse Button -->
        <div v-if="selectedFile" class="flex justify-end">
          <button
            @click="parseFile"
            :disabled="parsing"
            class="px-4 py-2 bg-[#D52B1E] hover:bg-[#B91C1C] text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <svg v-if="parsing" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ parsing ? 'กำลังอ่านไฟล์...' : 'อ่านไฟล์' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Preview Table -->
    <div v-if="parsedData.length > 0" class="bg-white rounded-lg border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-lg font-bold text-gray-900">ตัวอย่างข้อมูล</h2>
          <p class="text-sm text-gray-600">พบข้อมูล {{ parsedData.length }} รายการ</p>
        </div>
        <button
          @click="clearData"
          class="text-sm text-[#D52B1E] hover:text-red-700"
        >
          ล้างข้อมูล
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">รุ่นรถ</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ทะเบียน <span class="text-red-500">*</span>
                <span class="text-xs normal-case text-gray-400 block mt-1">แก้ไขได้ถ้าไฟล์ไม่มี</span>
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">สี</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ปี</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ราคา</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">หมายเหตุ</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(row, index) in parsedData" :key="index" :class="{ 'bg-red-50': row.error }">
              <td class="px-4 py-3 text-sm">{{ row.model || '-' }}</td>
              <td class="px-4 py-3 text-sm font-medium">
                <input
                  v-model="row.plateNumber"
                  type="text"
                  class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#D52B1E] focus:border-[#D52B1E]"
                  :class="{ 'border-red-500 bg-red-50': !row.plateNumber || row.plateNumber.trim() === '' }"
                  placeholder="กรอกทะเบียน"
                >
              </td>
              <td class="px-4 py-3 text-sm">{{ row.color || '-' }}</td>
              <td class="px-4 py-3 text-sm">{{ row.year || '-' }}</td>
              <td class="px-4 py-3 text-sm">{{ row.price ? row.price.toLocaleString() : '-' }}</td>
              <td class="px-4 py-3 text-sm">{{ row.status || '-' }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ row.notes || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Upload Button -->
      <div class="mt-4 flex justify-end">
        <button
          @click="uploadData"
          :disabled="uploading"
          class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          <svg v-if="uploading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ uploading ? 'กำลังอัพโหลด...' : 'อัพโหลดทั้งหมด' }}</span>
        </button>
      </div>
    </div>

    <!-- Upload Result -->
    <div v-if="uploadResult" class="bg-white rounded-lg border border-gray-200 p-6">
      <h2 class="text-lg font-bold text-gray-900 mb-4">ผลการอัพโหลด</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="text-sm text-green-600 mb-1">นำเข้าสำเร็จ</div>
          <div class="text-2xl font-bold text-green-900">{{ uploadResult.imported || 0 }}</div>
        </div>

        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="text-sm text-[#D52B1E] mb-1">ล้มเหลว</div>
          <div class="text-2xl font-bold text-red-900">{{ uploadResult.failed || 0 }}</div>
        </div>
      </div>

      <div class="mt-4 flex space-x-3">
        <button
          @click="$router.push('/dashboard/stock')"
          class="px-4 py-2 bg-[#D52B1E] hover:bg-[#B91C1C] text-white rounded-lg font-medium transition-colors"
        >
          ดูรายการรถ
        </button>
        <button
          @click="resetForm"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          อัพโหลดไฟล์ใหม่
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'

export default {
  name: 'BulkUploadVehicles',
  layout: 'dashboard',
  data() {
    return {
      selectedFile: null,
      isDragging: false,
      parsing: false,
      uploading: false,
      parsedData: [],
      uploadResult: null
    }
  },
  methods: {
    downloadTemplate() {
      // Create template data
      const templateData = [
        {
          'รุ่นรถ': 'D-Max',
          'ทะเบียน': '1กก 1234',
          'สี': 'ขาว',
          'ปี': 2024,
          'ราคา': 850000,
          'สถานะ': 'available',
          'หมายเหตุ': 'รถใหม่'
        },
        {
          'รุ่นรถ': 'MU-X',
          'ทะเบียน': '2กข 5678',
          'สี': 'เงิน',
          'ปี': 2024,
          'ราคา': 1200000,
          'สถานะ': 'available',
          'หมายเหตุ': ''
        }
      ]

      // Create workbook and worksheet
      const ws = XLSX.utils.json_to_sheet(templateData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Vehicles')

      // Generate Excel file
      XLSX.writeFile(wb, 'vehicle_template.xlsx')
    },

    handleFileSelect(event) {
      const file = event.target.files[0]
      if (file) {
        this.selectedFile = file
      }
    },

    handleFileDrop(event) {
      this.isDragging = false
      const file = event.dataTransfer.files[0]
      if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv'))) {
        this.selectedFile = file
      } else {
        this.$toast?.error('กรุณาเลือกไฟล์ .xlsx, .xls หรือ .csv')
      }
    },

    async parseFile() {
      if (!this.selectedFile) return

      this.parsing = true

      try {
        const data = await this.readFile(this.selectedFile)
        const workbook = XLSX.read(data, { type: 'binary' })

        // Get first worksheet
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        // Map Thai column names to English
        this.parsedData = jsonData.map(row => ({
          model: row['รุ่นรถ'] || row['model'],
          plateNumber: row['ทะเบียน'] || row['plateNumber'] || row['plate_number'],
          color: row['สี'] || row['color'],
          year: row['ปี'] || row['year'],
          price: row['ราคา'] || row['price'],
          status: row['สถานะ'] || row['status'] || 'available',
          notes: row['หมายเหตุ'] || row['notes'] || ''
        }))

        this.$toast?.success(`อ่านไฟล์สำเร็จ พบข้อมูล ${this.parsedData.length} รายการ`)
      } catch (error) {
        console.error('Error parsing file:', error)
        this.$toast?.error('ไม่สามารถอ่านไฟล์ได้')
      } finally {
        this.parsing = false
      }
    },

    readFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = reject
        reader.readAsBinaryString(file)
      })
    },

    async uploadData() {
      if (this.parsedData.length === 0) return

      this.uploading = true
      let imported = 0
      let failed = 0
      const errors = []

      try {
        console.log('📤 Starting bulk upload of', this.parsedData.length, 'vehicles')

        // Upload vehicles one by one since bulk endpoint doesn't exist
        for (let i = 0; i < this.parsedData.length; i++) {
          const row = this.parsedData[i]

          try {
            const vehicleData = {
              model: row.model,
              plate_number: row.plateNumber,
              color: row.color || null,
              year: row.year || null,
              price: row.price || null,
              status: row.status || 'available',
              notes: row.notes || null
            }

            console.log(`📤 Uploading vehicle ${i + 1}/${this.parsedData.length}:`, vehicleData)

            // Use correct API endpoint: POST /api/stock
            await this.$api.stock.create(vehicleData)
            imported++
          } catch (error) {
            failed++
            const errorMsg = error.response?.data?.message || error.message
            errors.push(`แถวที่ ${i + 1}: ${errorMsg}`)
            console.error(`❌ Failed to upload vehicle ${i + 1}:`, error.response?.data || error.message)
          }
        }

        this.uploadResult = { imported, failed }

        if (imported > 0) {
          this.$toast?.success(`นำเข้าข้อมูลสำเร็จ ${imported} รายการ`)
        }

        if (failed > 0) {
          console.warn('❌ Upload errors:', errors)
          this.$toast?.error(`อัพโหลดล้มเหลว ${failed} รายการ - ตรวจสอบ console`)
        }
      } catch (error) {
        console.error('❌ Error uploading vehicles:', error)

        const errorMessage = error.response?.data?.message
          || error.response?.data?.error
          || error.message
          || 'ไม่สามารถอัพโหลดข้อมูลได้'

        this.$toast?.error(`เกิดข้อผิดพลาด: ${errorMessage}`)
      } finally {
        this.uploading = false
      }
    },

    clearData() {
      this.parsedData = []
      this.selectedFile = null
      this.$refs.fileInput.value = ''
    },

    resetForm() {
      this.selectedFile = null
      this.parsedData = []
      this.uploadResult = null
      this.$refs.fileInput.value = ''
    }
  }
}
</script>
