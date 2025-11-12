/**
 * Brand Utilities
 * Helper functions for multi-brand architecture
 */

import { BRANDS, getBrand } from '~/config/brands'

/**
 * Brand to Database ID mapping
 */
export const BRAND_IDS = {
  isuzu: 1,
  byd: 2
}

/**
 * Get brand database ID from brand code
 * @param {string} brandCode - Brand code (isuzu, byd)
 * @returns {number|null} Brand database ID
 */
export function getBrandId(brandCode) {
  if (!brandCode) return null
  const code = brandCode.toLowerCase()
  return BRAND_IDS[code] || null
}

/**
 * Get brand code from database ID
 * @param {number} brandId - Brand database ID
 * @returns {string|null} Brand code
 */
export function getBrandCode(brandId) {
  const entry = Object.entries(BRAND_IDS).find(([_, id]) => id === brandId)
  return entry ? entry[0] : null
}

/**
 * Generate brand-specific API path
 * @param {string} brandCode - Brand code (isuzu, byd)
 * @param {string} resource - Resource name (staff, stock, test-drives, events)
 * @returns {string} API path
 */
export function getBrandPath(brandCode, resource) {
  if (!brandCode || !resource) {
    throw new Error('brandCode and resource are required')
  }
  const code = brandCode.toLowerCase()
  return `/${code}/${resource}`
}

/**
 * Generate admin cross-brand API path
 * @param {string} resource - Resource name (staff, stock, test-drives, events)
 * @param {string} subPath - Optional sub-path
 * @returns {string} API path
 */
export function getAdminPath(resource, subPath = 'all') {
  if (!resource) {
    throw new Error('resource is required')
  }
  return `/admin/${resource}/${subPath}`
}

/**
 * Validate brand code
 * @param {string} brandCode - Brand code to validate
 * @returns {boolean} True if valid
 */
export function isValidBrandCode(brandCode) {
  if (!brandCode) return false
  const code = brandCode.toLowerCase()
  return Object.keys(BRAND_IDS).includes(code)
}

/**
 * Get brand display name
 * @param {string} brandCode - Brand code
 * @returns {string} Brand display name
 */
export function getBrandDisplayName(brandCode) {
  const brand = getBrand(brandCode)
  return brand?.name || brandCode?.toUpperCase() || 'Unknown'
}

/**
 * Get all available brand codes
 * @returns {string[]} Array of brand codes
 */
export function getAllBrandCodes() {
  return Object.keys(BRAND_IDS)
}

/**
 * Get brand colors for styling
 * @param {string} brandCode - Brand code
 * @returns {object} Color object
 */
export function getBrandColors(brandCode) {
  const brand = getBrand(brandCode)
  return brand?.colors || {
    primary: '#6B7280',
    secondary: '#1a1a1a',
    light: '#F3F4F6',
    gradient: 'from-gray-600 to-gray-700'
  }
}

/**
 * Format staff data from API response
 * Handles field name changes: staffCode → employeeCode, etc.
 * @param {object} staff - Staff object from API
 * @returns {object} Formatted staff object
 */
export function formatStaffFromAPI(staff) {
  if (!staff) return null

  return {
    id: Number(staff.id), // Ensure number type
    employeeCode: staff.employeeCode || staff.employee_code || staff.staffCode || '',
    fullName: staff.fullName || staff.full_name || '',
    fullNameEn: staff.fullNameEn || staff.full_name_en || '',
    email: staff.email || '',
    phone: staff.phone || '',
    role: staff.role || 'sales',
    status: staff.status || 'active',
    avatar: staff.avatar || null,
    brandId: Number(staff.brandId || staff.brand_id || 0),
    brandCode: staff.brandCode || staff.brand_code || getBrandCode(staff.brandId || staff.brand_id) || '',
    createdAt: staff.createdAt || staff.created_at || null,
    updatedAt: staff.updatedAt || staff.updated_at || null
  }
}

/**
 * Format staff data for API request
 * Excludes brandId (comes from URL path)
 * @param {object} staff - Staff object to format
 * @returns {object} Formatted staff object for API
 */
export function formatStaffForAPI(staff) {
  if (!staff) return null

  const data = {
    employeeCode: staff.employeeCode,
    fullName: staff.fullName,
    email: staff.email,
    phone: staff.phone,
    role: staff.role || 'sales',
    status: staff.status || 'active'
  }

  // Add optional fields if present
  if (staff.fullNameEn) data.fullNameEn = staff.fullNameEn
  if (staff.avatar) data.avatar = staff.avatar

  // NEVER include brandId - it comes from URL path
  return data
}

/**
 * Get brand badge classes for Tailwind
 * @param {string} brandCode - Brand code
 * @returns {string} Tailwind classes
 */
export function getBrandBadgeClasses(brandCode) {
  const code = brandCode?.toLowerCase()

  const classes = {
    isuzu: 'bg-red-100 text-red-700 border-red-200',
    byd: 'bg-blue-100 text-blue-700 border-blue-200'
  }

  return classes[code] || 'bg-gray-100 text-gray-700 border-gray-200'
}

/**
 * Get status badge classes
 * @param {string} status - Status value
 * @returns {string} Tailwind classes
 */
export function getStatusBadgeClasses(status) {
  const classes = {
    active: 'bg-green-100 text-green-700 border-green-200',
    inactive: 'bg-gray-100 text-gray-700 border-gray-200',
    on_leave: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  }

  return classes[status] || 'bg-gray-100 text-gray-700 border-gray-200'
}

/**
 * Get role display name
 * @param {string} role - Role code
 * @returns {string} Display name
 */
export function getRoleDisplayName(role) {
  const names = {
    admin: 'ผู้ดูแลระบบ',
    manager: 'ผู้จัดการ',
    sales: 'พนักงานขาย'
  }

  return names[role] || role
}

/**
 * Get status display name
 * @param {string} status - Status code
 * @returns {string} Display name
 */
export function getStatusDisplayName(status) {
  const names = {
    active: 'ใช้งานอยู่',
    inactive: 'ไม่ใช้งาน',
    on_leave: 'ลาพัก'
  }

  return names[status] || status
}

export default {
  BRAND_IDS,
  getBrandId,
  getBrandCode,
  getBrandPath,
  getAdminPath,
  isValidBrandCode,
  getBrandDisplayName,
  getAllBrandCodes,
  getBrandColors,
  formatStaffFromAPI,
  formatStaffForAPI,
  getBrandBadgeClasses,
  getStatusBadgeClasses,
  getRoleDisplayName,
  getStatusDisplayName
}
