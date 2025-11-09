<template>
  <div class="print-document">
    <!-- Header with Isuzu Logo -->
    <div class="print-section text-center mb-8">
      <div class="flex items-center justify-center mb-4">
        <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
          <span class="text-white text-2xl font-bold">ISUZU</span>
        </div>
      </div>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">ใบยินยอม PDPA</h1>
      <h2 class="text-lg text-gray-700">การเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคล</h2>
      <p class="text-sm font-mono font-medium text-gray-700 mt-2 bg-gray-100 inline-block px-4 py-1 rounded">เลขที่เอกสาร: {{ getDocumentNumber() }}</p>
    </div>

    <!-- Customer Information -->
    <div class="print-section mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-red-600 pb-2">ข้อมูลลูกค้า</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-600">ชื่อ-นามสกุล</p>
          <p class="text-base font-medium">{{ testDrive.customer_name }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">เบอร์โทรศัพท์</p>
          <p class="text-base font-medium">{{ testDrive.customer_phone }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">เลขที่ใบขับขี่</p>
          <p class="text-base font-medium">{{ testDrive.customer_license_number || '-' }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">วันที่ทดลองขับ</p>
          <p class="text-base font-medium">{{ formatDate(testDrive.start_time) }}</p>
        </div>
      </div>
    </div>

    <!-- Vehicle Information -->
    <div class="print-section mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-red-600 pb-2">ข้อมูลรถที่ทดลองขับ</h3>
      <div class="grid grid-cols-3 gap-4">
        <div>
          <p class="text-sm text-gray-600">รุ่น</p>
          <p class="text-base font-medium">{{ testDrive.vehicle?.model || '-' }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">ประเภท</p>
          <p class="text-base font-medium">{{ testDrive.vehicle?.type || '-' }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">สี</p>
          <p class="text-base font-medium">{{ testDrive.vehicle?.color || '-' }}</p>
        </div>
      </div>
    </div>

    <!-- Schedule -->
    <div class="print-section mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-red-600 pb-2">วันที่และเวลา</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-600">เวลาเริ่มต้น</p>
          <p class="text-base font-medium">{{ formatDateTime(testDrive.start_time) }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">เวลาสิ้นสุดโดยประมาณ</p>
          <p class="text-base font-medium">{{ formatDateTime(testDrive.expected_end_time) }}</p>
        </div>
      </div>
    </div>

    <!-- PDPA Text -->
    <div class="print-section mb-6 border-2 border-gray-300 rounded-lg p-4">
      <h3 class="text-base font-semibold text-gray-900 mb-3">ข้อความยินยอม PDPA</h3>
      <div class="text-sm text-gray-700 space-y-2 leading-relaxed">
        <p>ข้าพเจ้าได้รับทราบและเข้าใจนโยบายความเป็นส่วนตัวของ บริษัท อีซูซุ เซลส์ (ไทยแลนด์) จำกัด และข้าพเจ้ายินยอมให้บริษัทฯ เก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้า ดังต่อไปนี้:</p>

        <div class="ml-4 space-y-1">
          <p>1. ข้อมูลส่วนตัว เช่น ชื่อ-นามสกุล เบอร์โทรศัพท์ ที่อยู่</p>
          <p>2. เลขที่ใบอนุญาตขับขี่และรูปถ่ายใบอนุญาต</p>
          <p>3. ข้อมูลการทดลองขับรถยนต์ วันที่ เวลา และรุ่นรถที่สนใจ</p>
          <p>4. ลายเซ็นอิเล็กทรอนิกส์ของข้าพเจ้า</p>
        </div>

        <p>เพื่อวัตถุประสงค์ในการ:</p>
        <div class="ml-4 space-y-1">
          <p>• ดำเนินการให้บริการทดลองขับรถยนต์</p>
          <p>• ติดต่อสื่อสารเกี่ยวกับการให้บริการ</p>
          <p>• ปฏิบัติตามกฎหมายที่เกี่ยวข้อง</p>
          <p>• วิเคราะห์และพัฒนาการให้บริการ</p>
        </div>

        <p>ข้าพเจ้ารับทราบว่าข้าพเจ้ามีสิทธิ์ในการเข้าถึง แก้ไข ลบ หรือคัดค้านการประมวลผลข้อมูลส่วนบุคคลของข้าพเจ้าได้ตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล</p>
      </div>
    </div>

    <!-- PDPA Consent Status -->
    <div class="print-section mb-6">
      <div v-if="testDrive.pdpa_consent" class="flex items-center space-x-2 text-green-700">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <span class="font-medium">ยินยอมเมื่อ: {{ formatDateTime(testDrive.pdpa_consented_at) }}</span>
      </div>
      <div v-else class="flex items-center space-x-2 text-red-700">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <span class="font-medium">ยังไม่ได้ยินยอม PDPA</span>
      </div>
    </div>

    <!-- Signature -->
    <div class="print-section">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-red-600 pb-2">ลายเซ็นลูกค้า</h3>

      <div v-if="testDrive.signature_data" class="signature-display">
        <div class="signature-box">
          <img :src="testDrive.signature_data" alt="ลายเซ็นลูกค้า" class="w-full h-full object-contain" />
        </div>
        <p class="text-sm text-gray-600 mt-2">ลงนามเมื่อ: {{ formatDateTime(testDrive.signed_at) }}</p>
        <div class="mt-4 text-center">
          <p class="text-base font-medium border-t-2 border-gray-400 pt-2 inline-block min-w-64">
            {{ testDrive.customer_name }}
          </p>
          <p class="text-sm text-gray-600 mt-1">ผู้ขอใช้บริการ</p>
        </div>
      </div>

      <div v-else class="signature-placeholder">
        <div class="signature-box border-2 border-dashed border-gray-300 flex items-center justify-center">
          <p class="text-gray-400">ยังไม่ได้ลงนาม</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="print-section mt-8 pt-6 border-t border-gray-300">
      <p class="text-xs text-gray-500 text-center">
        บริษัท อีซูซุ เซลส์ (ไทยแลนด์) จำกัด | โทร. 02-XXX-XXXX | เว็บไซต์: www.isuzu.co.th
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PdpaSignature',
  props: {
    testDrive: {
      type: Object,
      required: true
    }
  },
  methods: {
    getDocumentNumber() {
      // Generate document number: TD-YYYYMMDD-XXXX
      const datetime = this.testDrive.start_time || this.testDrive.startTime || this.testDrive.scheduled_start || this.testDrive.created_at
      if (!datetime) return `TD-${this.testDrive.id}`

      const date = new Date(datetime)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const sequence = String(this.testDrive.id).padStart(4, '0')

      return `TD-${year}${month}${day}-${sequence}`
    },
    formatDate(date, format = 'full') {
      if (!date) return '-'
      const d = new Date(date)
      if (format === 'short') {
        return d.toISOString().slice(0, 10).replace(/-/g, '')
      }
      return d.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    formatDateTime(datetime) {
      if (!datetime) return '-'
      const d = new Date(datetime)
      return d.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.signature-box {
  width: 300px;
  height: 150px;
  border: 1px solid #000;
  margin: 0 auto;
}

.signature-display {
  text-align: center;
}

@media print {
  .signature-box {
    page-break-inside: avoid;
  }
}
</style>
