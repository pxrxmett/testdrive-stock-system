/**
 * Brand Configuration
 * กำหนดค่าสำหรับแบรนด์ต่างๆ ที่ Dealer จัดจำหน่าย
 */

export const BRANDS = {
  ISUZU: {
    id: 'isuzu',
    code: 'ISUZU',              // API path code (uppercase required by backend)
    dbId: 1,                     // Database brand_id
    name: 'ISUZU',
    fullName: 'ISUZU รถยนต์',
    type: 'commercial_vehicle',
    description: 'รถกระบะและรถบรรทุก',

    // Brand Colors
    colors: {
      primary: '#E31E24',      // ISUZU Red
      secondary: '#1a1a1a',    // Black
      light: '#FEE5E6',        // Light Red
      gradient: 'from-red-600 to-red-700'
    },

    // Icons
    icons: {
      main: '🚗',
      queue: '🚗',
      stock: '📦',
      document: '📄',
      staff: '👥'
    },

    // Menu Configuration
    menu: {
      queue: {
        label: 'คิวทดลองขับ ISUZU',
        path: '/dashboard/isuzu/queue',
        icon: 'queue'
      },
      stock: {
        label: 'สต็อครถยนต์ ISUZU',
        path: '/dashboard/isuzu/stock',
        icon: 'stock'
      },
      documents: {
        label: 'เอกสาร ISUZU',
        path: '/dashboard/isuzu/documents',
        icon: 'document'
      },
      staff: {
        label: 'พนักงาน ISUZU',
        path: '/dashboard/isuzu/staff',
        icon: 'users'
      }
    },

    // Vehicle Types for this brand
    vehicleTypes: [
      { value: 'pickup', label: 'รถกระบะ' },
      { value: 'truck', label: 'รถบรรทุก' },
      { value: 'ppv', label: 'รถ PPV' }
    ]
  },

  BYD: {
    id: 'byd',
    code: 'BYD',                 // API path code (uppercase required by backend)
    dbId: 2,                     // Database brand_id
    name: 'BYD',
    fullName: 'BYD รถยนต์ไฟฟ้า',
    type: 'electric_vehicle',
    description: 'รถยนต์ไฟฟ้า',

    // Brand Colors
    colors: {
      primary: '#00A651',      // BYD Green
      secondary: '#0066CC',    // BYD Blue
      light: '#E5F5EC',        // Light Green
      gradient: 'from-green-600 to-green-700'
    },

    // Icons
    icons: {
      main: '⚡',
      queue: '⚡',
      stock: '🔋',
      document: '📄',
      staff: '👥'
    },

    // Menu Configuration
    menu: {
      queue: {
        label: 'คิวทดลองขับ BYD',
        path: '/dashboard/byd/queue',
        icon: 'queue'
      },
      stock: {
        label: 'สต็อครถไฟฟ้า BYD',
        path: '/dashboard/byd/stock',
        icon: 'stock'
      },
      documents: {
        label: 'เอกสาร BYD',
        path: '/dashboard/byd/documents',
        icon: 'document'
      },
      staff: {
        label: 'พนักงาน BYD',
        path: '/dashboard/byd/staff',
        icon: 'users'
      }
    },

    // Vehicle Types for this brand
    vehicleTypes: [
      { value: 'sedan', label: 'รถเก๋ง' },
      { value: 'suv', label: 'รถ SUV' },
      { value: 'ev', label: 'รถไฟฟ้า' }
    ]
  }
}

// Helper Functions
export const getBrand = (brandId) => {
  return BRANDS[brandId?.toUpperCase()] || null
}

export const getBrandColor = (brandId, type = 'primary') => {
  const brand = getBrand(brandId)
  return brand?.colors?.[type] || '#6B7280'
}

export const getBrandIcon = (brandId, type = 'main') => {
  const brand = getBrand(brandId)
  return brand?.icons?.[type] || '🏢'
}

export const getAllBrands = () => {
  return Object.values(BRANDS)
}

export const getBrandMenuItems = (brandId) => {
  const brand = getBrand(brandId)
  return brand?.menu || {}
}

// Default export
export default BRANDS
