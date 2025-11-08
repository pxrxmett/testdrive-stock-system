<template>
  <div class="print-document">
    <!-- Header with Isuzu Logo -->
    <div class="print-section text-center mb-8">
      <div class="flex items-center justify-center mb-4">
        <div class="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
          <span class="text-white text-3xl font-bold">ISUZU</span>
        </div>
      </div>
      <h1 class="text-3xl font-bold text-gray-900 mb-2">ใบขออนุญาตทดลองขับรถยนต์</h1>
      <h2 class="text-lg text-gray-700">Test Drive Application Form</h2>
      <p class="text-sm text-gray-600 mt-2">เลขที่เอกสาร: TD-{{ testDrive.id }}-{{ formatDate(testDrive.created_at, 'short') }}</p>
      <p class="text-xs text-gray-500">วันที่ออกเอกสาร: {{ formatDate(testDrive.created_at) }}</p>
    </div>

    <!-- Customer Information (Full) -->
    <div class="print-section mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 bg-red-600 text-white px-4 py-2 rounded">ข้อมูลผู้ขอใช้บริการ</h3>
      <div class="grid grid-cols-2 gap-4 px-4">
        <div>
          <p class="text-sm text-gray-600">ชื่อ-นามสกุล</p>
          <p class="text-base font-medium">{{ testDrive.customer_name }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">เลขบัตรประชาชน</p>
          <p class="text-base font-medium">{{ testDrive.customer_id_card || '-' }}</p>
        </div>
        <div class="col-span-2">
          <p class="text-sm text-gray-600">ที่อยู่</p>
          <p class="text-base font-medium">{{ testDrive.customer_address || '-' }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">เบอร์โทรศัพท์</p>
          <p class="text-base font-medium">{{ testDrive.customer_phone }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">เลขที่ใบขับขี่</p>
          <p class="text-base font-medium">{{ testDrive.customer_license_number || '-' }}</p>
        </div>
      </div>
    </div>

    <!-- License Image -->
    <div v-if="testDrive.license_image" class="print-section mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 bg-red-600 text-white px-4 py-2 rounded">รูปใบขับขี่</h3>
      <div class="px-4 text-center">
        <img :src="testDrive.license_image" alt="ใบขับขี่" class="max-w-md mx-auto border-2 border-gray-300 rounded" />
      </div>
    </div>

    <!-- Vehicle Information (Full) -->
    <div class="print-section mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 bg-red-600 text-white px-4 py-2 rounded">ข้อมูลรถยนต์ที่ทดลองขับ</h3>
      <div class="grid grid-cols-3 gap-4 px-4">
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
        <div>
          <p class="text-sm text-gray-600">หมายเลข VIN</p>
          <p class="text-base font-medium font-mono">{{ testDrive.vehicle_vin || '-' }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">เลขไมล์</p>
          <p class="text-base font-medium">{{ testDrive.vehicle_mileage ? testDrive.vehicle_mileage.toLocaleString() + ' km' : '-' }}</p>
        </div>
      </div>
    </div>

    <!-- Test Drive Schedule -->
    <div class="print-section mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 bg-red-600 text-white px-4 py-2 rounded">กำหนดการยืม-คืนรถ</h3>
      <div class="grid grid-cols-2 gap-4 px-4">
        <div>
          <p class="text-sm text-gray-600">วันที่-เวลา รับรถ</p>
          <p class="text-base font-medium">{{ formatDateTime(testDrive.start_time) }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">วันที่-เวลา คืนรถ (โดยประมาณ)</p>
          <p class="text-base font-medium">{{ formatDateTime(testDrive.expected_end_time) }}</p>
        </div>
      </div>
    </div>

    <!-- Terms and Conditions -->
    <div class="print-section mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 bg-red-600 text-white px-4 py-2 rounded">เงื่อนไขและข้อกำหนด</h3>
      <div class="text-sm text-gray-700 space-y-2 px-4 leading-relaxed">
        <div class="space-y-1">
          <p class="font-medium">1. ผู้ขอใช้บริการตกลงและรับทราบว่า:</p>
          <div class="ml-4 space-y-1">
            <p>• รถยนต์ที่ยืมเป็นทรัพย์สินของบริษัทฯ และใช้เพื่อวัตถุประสงค์ในการทดลองขับเท่านั้น</p>
            <p>• ผู้ขอใช้บริการต้องมีใบอนุญาตขับขี่ที่ถูกต้องและยังไม่หมดอายุ</p>
            <p>• ห้ามนำรถไปใช้ในกิจการที่ผิดกฎหมาย แข่งรถ หรือขับในสภาพเมาสุรา</p>
            <p>• ห้ามนำรถออกนอกเขตจังหวัดที่กำหนดโดยไม่ได้รับอนุญาต</p>
          </div>
        </div>

        <div class="space-y-1">
          <p class="font-medium">2. ความรับผิดชอบ:</p>
          <div class="ml-4 space-y-1">
            <p>• ผู้ขอใช้บริการจะรับผิดชอบค่าเสียหายที่เกิดขึ้นกับรถยนต์ระหว่างการทดลองขับทั้งหมด</p>
            <p>• กรณีเกิดอุบัติเหตุ ผู้ขอใช้บริการต้องแจ้งบริษัทฯ ทันทีและดำเนินการตามกฎหมาย</p>
            <p>• ค่าปรับกรณีคืนรถล่าช้า: 500 บาท/ชั่วโมง</p>
          </div>
        </div>

        <div class="space-y-1">
          <p class="font-medium">3. การคืนรถ:</p>
          <div class="ml-4 space-y-1">
            <p>• คืนรถในสภาพเดิม สะอาด ถังน้ำมันเต็มเหมือนตอนรับรถ</p>
            <p>• หากเกินกำหนด 2 ชั่วโมง บริษัทฯ ขอสงวนสิทธิ์ในการดำเนินคดีตามกฎหมาย</p>
          </div>
        </div>

        <p class="font-medium mt-4">ข้าพเจ้าได้อ่านและเข้าใจเงื่อนไขข้างต้นแล้ว และยอมรับที่จะปฏิบัติตามทุกประการ</p>
      </div>
    </div>

    <!-- Notes -->
    <div v-if="testDrive.notes" class="print-section mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 bg-red-600 text-white px-4 py-2 rounded">หมายเหตุเพิ่มเติม</h3>
      <div class="px-4">
        <p class="text-sm text-gray-700">{{ testDrive.notes }}</p>
      </div>
    </div>

    <!-- Signatures (3 columns) -->
    <div class="print-section page-break">
      <h3 class="text-lg font-semibold text-gray-900 mb-6 bg-red-600 text-white px-4 py-2 rounded">ลายเซ็นผู้เกี่ยวข้อง</h3>
      <div class="grid grid-cols-3 gap-8 px-4">
        <!-- Customer Signature -->
        <div class="text-center">
          <p class="text-sm font-medium text-gray-700 mb-3">ผู้ขอใช้บริการ</p>
          <div v-if="testDrive.signature_data" class="signature-box mx-auto">
            <img :src="testDrive.signature_data" alt="ลายเซ็นลูกค้า" class="w-full h-full object-contain" />
          </div>
          <div v-else class="signature-box mx-auto border-2 border-dashed border-gray-300 flex items-center justify-center">
            <p class="text-xs text-gray-400">ยังไม่ได้ลงนาม</p>
          </div>
          <p class="text-sm mt-3 border-t-2 border-gray-400 pt-2 font-medium">{{ testDrive.customer_name }}</p>
          <p class="text-xs text-gray-500">{{ formatDateTime(testDrive.signed_at) }}</p>
        </div>

        <!-- Sales Signature -->
        <div class="text-center">
          <p class="text-sm font-medium text-gray-700 mb-3">พนักงานขาย</p>
          <div v-if="testDrive.sales_signature" class="signature-box mx-auto">
            <img :src="testDrive.sales_signature" alt="ลายเซ็นเซลล์" class="w-full h-full object-contain" />
          </div>
          <div v-else class="signature-box mx-auto border-2 border-dashed border-gray-300 flex items-center justify-center">
            <p class="text-xs text-gray-400">ยังไม่ได้ลงนาม</p>
          </div>
          <p class="text-sm mt-3 border-t-2 border-gray-400 pt-2 font-medium">(..........................)</p>
          <p class="text-xs text-gray-500">พนักงานขาย</p>
        </div>

        <!-- Manager Signature -->
        <div class="text-center">
          <p class="text-sm font-medium text-gray-700 mb-3">ผู้จัดการ</p>
          <div v-if="testDrive.manager_signature" class="signature-box mx-auto">
            <img :src="testDrive.manager_signature" alt="ลายเซ็นผู้จัดการ" class="w-full h-full object-contain" />
          </div>
          <div v-else class="signature-box mx-auto border-2 border-dashed border-gray-300 flex items-center justify-center">
            <p class="text-xs text-gray-400">ยังไม่ได้ลงนาม</p>
          </div>
          <p class="text-sm mt-3 border-t-2 border-gray-400 pt-2 font-medium">(..........................)</p>
          <p class="text-xs text-gray-500">ผู้จัดการ</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="print-section mt-12 pt-6 border-t-2 border-gray-300">
      <div class="grid grid-cols-2 gap-4 text-xs text-gray-600">
        <div>
          <p class="font-medium mb-1">บริษัท อีซูซุ เซลส์ (ไทยแลนด์) จำกัด</p>
          <p>โทร. 02-XXX-XXXX</p>
          <p>เว็บไซต์: www.isuzu.co.th</p>
        </div>
        <div class="text-right">
          <p class="font-medium mb-1">สำหรับเจ้าหน้าที่</p>
          <p>เอกสารฉบับนี้มีผลผูกพันตามกฎหมาย</p>
          <p>กรุณาเก็บรักษาไว้เป็นหลักฐาน</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FullDocument',
  props: {
    testDrive: {
      type: Object,
      required: true
    }
  },
  methods: {
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
  width: 200px;
  height: 100px;
  border: 1px solid #000;
}

@media print {
  .signature-box {
    page-break-inside: avoid;
  }

  .page-break {
    page-break-before: always;
  }
}
</style>
