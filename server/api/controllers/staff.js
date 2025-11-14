// Staff Controller - Staff management
// Handles brand-scoped and admin cross-brand endpoints

// Mock staff database
const staff = [
  {
    id: 'staff-1',
    staffCode: 'ISZ-S001',
    brandCode: 'ISUZU',
    firstName: 'สมศักดิ์',
    lastName: 'ขายดี',
    fullName: 'นายสมศักดิ์ ขายดี',
    email: 'somsakk@isuzu.com',
    phone: '0812345678',
    role: 'sales',
    position: 'Sales Manager',
    department: 'Sales',
    isActive: true,
    lineUserId: 'U1111111111abcdef',
    avatar: null,
    hireDate: '2023-01-15',
    performance: {
      totalTestDrives: 45,
      completedTestDrives: 40,
      totalSales: 21,
      rating: 4.8
    },
    createdAt: '2023-01-15T10:00:00.000Z',
    updatedAt: '2024-09-01T10:00:00.000Z'
  },
  {
    id: 'staff-2',
    staffCode: 'ISZ-S002',
    brandCode: 'ISUZU',
    firstName: 'พิมพ์ใจ',
    lastName: 'บริการดี',
    fullName: 'นางสาวพิมพ์ใจ บริการดี',
    email: 'pimjai@isuzu.com',
    phone: '0823456789',
    role: 'sales',
    position: 'Sales Executive',
    department: 'Sales',
    isActive: true,
    lineUserId: null,
    avatar: null,
    hireDate: '2023-03-20',
    performance: {
      totalTestDrives: 38,
      completedTestDrives: 35,
      totalSales: 18,
      rating: 4.7
    },
    createdAt: '2023-03-20T10:00:00.000Z',
    updatedAt: '2024-09-01T10:00:00.000Z'
  },
  {
    id: 'staff-3',
    staffCode: 'BYD-S001',
    brandCode: 'BYD',
    firstName: 'ชัยวัฒน์',
    lastName: 'ใจเย็น',
    fullName: 'นายชัยวัฒน์ ใจเย็น',
    email: 'chaiwat@byd.com',
    phone: '0834567890',
    role: 'sales',
    position: 'Sales Executive',
    department: 'Sales',
    isActive: true,
    lineUserId: null,
    avatar: null,
    hireDate: '2023-06-01',
    performance: {
      totalTestDrives: 35,
      completedTestDrives: 32,
      totalSales: 15,
      rating: 4.6
    },
    createdAt: '2023-06-01T10:00:00.000Z',
    updatedAt: '2024-09-01T10:00:00.000Z'
  },
  {
    id: 'staff-4',
    staffCode: 'BYD-S002',
    brandCode: 'BYD',
    firstName: 'อรุณี',
    lastName: 'สดใส',
    fullName: 'นางสาวอรุณี สดใส',
    email: 'arunee@byd.com',
    phone: '0845678901',
    role: 'customer_service',
    position: 'Customer Service',
    department: 'Customer Service',
    isActive: true,
    lineUserId: null,
    avatar: null,
    hireDate: '2023-07-15',
    performance: {
      totalTestDrives: 0,
      completedTestDrives: 0,
      totalSales: 0,
      rating: 4.5
    },
    createdAt: '2023-07-15T10:00:00.000Z',
    updatedAt: '2024-09-01T10:00:00.000Z'
  }
]

let nextId = 5

module.exports = {
  // ========================================
  // BRAND-SCOPED STAFF ENDPOINTS
  // ========================================

  // POST /api/:brandCode/staff
  create(ctx) {
    const { brandCode } = ctx.params
    const data = ctx.body

    if (!data.firstName || !data.lastName || !data.email || !data.phone) {
      return ctx.sendError('First name, last name, email, and phone are required', 400)
    }

    // Check if email already exists
    if (staff.find(s => s.email === data.email)) {
      return ctx.sendError('Email already exists', 400)
    }

    const brandUpper = brandCode.toUpperCase()
    const staffCount = staff.filter(s => s.brandCode === brandUpper).length + 1

    const newStaff = {
      id: `staff-${nextId++}`,
      staffCode: `${brandUpper}-S${String(staffCount).padStart(3, '0')}`,
      brandCode: brandUpper,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: data.fullName || `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      role: data.role || 'sales',
      position: data.position || '',
      department: data.department || 'Sales',
      isActive: data.isActive !== undefined ? data.isActive : true,
      lineUserId: null,
      avatar: data.avatar || null,
      hireDate: data.hireDate || new Date().toISOString().split('T')[0],
      performance: {
        totalTestDrives: 0,
        completedTestDrives: 0,
        totalSales: 0,
        rating: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    staff.push(newStaff)

    ctx.sendJSON({
      success: true,
      message: 'Staff created successfully',
      data: newStaff
    }, 201)
  },

  // GET /api/:brandCode/staff
  getAll(ctx) {
    const { brandCode } = ctx.params
    const { role, isActive, search } = ctx.query

    let filtered = staff.filter(s => s.brandCode.toUpperCase() === brandCode.toUpperCase())

    if (role) {
      filtered = filtered.filter(s => s.role === role)
    }

    if (isActive !== undefined) {
      const activeFilter = isActive === 'true'
      filtered = filtered.filter(s => s.isActive === activeFilter)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(s =>
        s.fullName.toLowerCase().includes(searchLower) ||
        s.email.toLowerCase().includes(searchLower) ||
        s.phone.includes(search) ||
        s.staffCode.toLowerCase().includes(searchLower)
      )
    }

    ctx.sendJSON({
      success: true,
      data: filtered,
      total: filtered.length
    })
  },

  // GET /api/:brandCode/staff/:id
  getById(ctx) {
    const { brandCode, id } = ctx.params

    const staffMember = staff.find(s =>
      (s.id === id || s.staffCode === id) &&
      s.brandCode.toUpperCase() === brandCode.toUpperCase()
    )

    if (!staffMember) {
      return ctx.sendError('Staff not found', 404)
    }

    ctx.sendJSON({
      success: true,
      data: staffMember
    })
  },

  // PATCH /api/:brandCode/staff/:id
  update(ctx) {
    const { brandCode, id } = ctx.params
    const updates = ctx.body

    const staffIndex = staff.findIndex(s =>
      (s.id === id || s.staffCode === id) &&
      s.brandCode.toUpperCase() === brandCode.toUpperCase()
    )

    if (staffIndex === -1) {
      return ctx.sendError('Staff not found', 404)
    }

    const staffMember = staff[staffIndex]

    // Update allowed fields
    const allowedFields = [
      'firstName', 'lastName', 'fullName', 'email', 'phone',
      'role', 'position', 'department', 'isActive', 'avatar', 'hireDate'
    ]

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        staffMember[field] = updates[field]
      }
    }

    // Update fullName if firstName or lastName changed
    if (updates.firstName || updates.lastName) {
      staffMember.fullName = `${staffMember.firstName} ${staffMember.lastName}`
    }

    staffMember.updatedAt = new Date().toISOString()

    staff[staffIndex] = staffMember

    ctx.sendJSON({
      success: true,
      message: 'Staff updated successfully',
      data: staffMember
    })
  },

  // DELETE /api/:brandCode/staff/:id
  deleteStaff(ctx) {
    const { brandCode, id } = ctx.params

    const staffIndex = staff.findIndex(s =>
      (s.id === id || s.staffCode === id) &&
      s.brandCode.toUpperCase() === brandCode.toUpperCase()
    )

    if (staffIndex === -1) {
      return ctx.sendError('Staff not found', 404)
    }

    // Instead of deleting, mark as inactive
    staff[staffIndex].isActive = false
    staff[staffIndex].updatedAt = new Date().toISOString()

    ctx.sendJSON({
      success: true,
      message: 'Staff deactivated successfully',
      data: staff[staffIndex]
    })
  },

  // GET /api/:brandCode/staff/available-sales
  getAvailableSales(ctx) {
    const { brandCode } = ctx.params

    const availableSales = staff.filter(s =>
      s.brandCode.toUpperCase() === brandCode.toUpperCase() &&
      s.role === 'sales' &&
      s.isActive === true
    )

    ctx.sendJSON({
      success: true,
      data: availableSales,
      total: availableSales.length
    })
  },

  // ========================================
  // ADMIN CROSS-BRAND STAFF ENDPOINTS
  // ========================================

  // GET /api/admin/staff/all
  adminGetAll(ctx) {
    const { brandCode, role, isActive, search, page = 1, limit = 50 } = ctx.query

    let filtered = [...staff]

    if (brandCode) {
      filtered = filtered.filter(s => s.brandCode.toUpperCase() === brandCode.toUpperCase())
    }

    if (role) {
      filtered = filtered.filter(s => s.role === role)
    }

    if (isActive !== undefined) {
      const activeFilter = isActive === 'true'
      filtered = filtered.filter(s => s.isActive === activeFilter)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(s =>
        s.fullName.toLowerCase().includes(searchLower) ||
        s.email.toLowerCase().includes(searchLower) ||
        s.phone.includes(search) ||
        s.staffCode.toLowerCase().includes(searchLower)
      )
    }

    // Pagination
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const startIndex = (pageNum - 1) * limitNum
    const endIndex = startIndex + limitNum

    const paginated = filtered.slice(startIndex, endIndex)

    ctx.sendJSON({
      success: true,
      data: paginated,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limitNum)
      }
    })
  },

  // GET /api/admin/staff/summary
  adminGetSummary(ctx) {
    const summary = {
      total: staff.length,
      active: staff.filter(s => s.isActive).length,
      inactive: staff.filter(s => !s.isActive).length,
      byBrand: {},
      byRole: {}
    }

    staff.forEach(s => {
      // By brand
      if (!summary.byBrand[s.brandCode]) {
        summary.byBrand[s.brandCode] = {
          total: 0,
          active: 0,
          inactive: 0
        }
      }
      summary.byBrand[s.brandCode].total++
      if (s.isActive) {
        summary.byBrand[s.brandCode].active++
      } else {
        summary.byBrand[s.brandCode].inactive++
      }

      // By role
      if (!summary.byRole[s.role]) {
        summary.byRole[s.role] = 0
      }
      summary.byRole[s.role]++
    })

    ctx.sendJSON({
      success: true,
      data: summary
    })
  },

  // GET /api/admin/staff/performance
  adminGetPerformance(ctx) {
    const { brandCode, sortBy = 'totalSales' } = ctx.query

    let filtered = [...staff]

    if (brandCode) {
      filtered = filtered.filter(s => s.brandCode.toUpperCase() === brandCode.toUpperCase())
    }

    // Only include sales staff
    filtered = filtered.filter(s => s.role === 'sales' && s.isActive)

    // Sort by performance metric
    filtered.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.performance.rating - a.performance.rating
      }
      if (sortBy === 'completedTestDrives') {
        return b.performance.completedTestDrives - a.performance.completedTestDrives
      }
      return b.performance.totalSales - a.performance.totalSales
    })

    const performanceData = filtered.map(s => ({
      id: s.id,
      staffCode: s.staffCode,
      fullName: s.fullName,
      brandCode: s.brandCode,
      role: s.role,
      position: s.position,
      performance: s.performance
    }))

    ctx.sendJSON({
      success: true,
      data: performanceData,
      total: performanceData.length
    })
  },

  // GET /api/admin/staff/:id
  adminGetById(ctx) {
    const { id } = ctx.params

    const staffMember = staff.find(s => s.id === id || s.staffCode === id)

    if (!staffMember) {
      return ctx.sendError('Staff not found', 404)
    }

    ctx.sendJSON({
      success: true,
      data: staffMember
    })
  }
}
