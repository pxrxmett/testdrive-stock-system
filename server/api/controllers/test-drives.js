// Test Drives Controller - Test drive/queue management
// Handles non-scoped, brand-scoped, and admin cross-brand endpoints

// Mock test drives database
const testDrives = [
  {
    id: '1',
    queueNumber: 'TD-2024-001',
    brandCode: 'ISUZU',
    customerName: 'สมชาย ใจดี',
    customerPhone: '0812345678',
    customerEmail: 'somchai@email.com',
    customerIdCard: '1234567890123',
    vehicleCode: 'ISZ-001',
    vehicleModel: 'D-MAX',
    testDriveDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    testDriveTime: '14:00',
    duration: 60,
    status: 'confirmed',
    staffId: 'staff-1',
    staffName: 'นายสมศักดิ์ ขายดี',
    notes: 'ต้องการทดลองขับในเส้นทางที่มีทางลาดชัน',
    pdpaConsent: true,
    pdpaConsentAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    signature: null,
    signatureAt: null,
    createdAt: '2024-09-01T10:00:00.000Z',
    updatedAt: '2024-09-01T14:30:00.000Z'
  },
  {
    id: '2',
    queueNumber: 'TD-2024-002',
    brandCode: 'BYD',
    customerName: 'สมหญิง รักงาน',
    customerPhone: '0823456789',
    customerEmail: 'somying@email.com',
    customerIdCard: '2345678901234',
    vehicleCode: 'BYD-001',
    vehicleModel: 'ATTO 3',
    testDriveDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1).toISOString(),
    testDriveTime: '10:00',
    duration: 45,
    status: 'pending',
    staffId: null,
    staffName: null,
    notes: '',
    pdpaConsent: false,
    pdpaConsentAt: null,
    signature: null,
    signatureAt: null,
    createdAt: '2024-09-02T09:00:00.000Z',
    updatedAt: '2024-09-02T09:00:00.000Z'
  }
]

let nextId = 3

function generateQueueNumber() {
  const year = new Date().getFullYear()
  const count = testDrives.length + 1
  return `TD-${year}-${String(count).padStart(3, '0')}`
}

module.exports = {
  // ========================================
  // NON-SCOPED TEST DRIVE ENDPOINTS
  // ========================================

  // POST /api/test-drives
  create(ctx) {
    const data = ctx.body

    if (!data.customerName || !data.customerPhone || !data.vehicleCode || !data.testDriveDate) {
      return ctx.sendError('Customer name, phone, vehicle code, and test drive date are required', 400)
    }

    const newTestDrive = {
      id: String(nextId++),
      queueNumber: generateQueueNumber(),
      brandCode: data.brandCode?.toUpperCase() || null,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || '',
      customerIdCard: data.customerIdCard || '',
      vehicleCode: data.vehicleCode,
      vehicleModel: data.vehicleModel || '',
      testDriveDate: data.testDriveDate,
      testDriveTime: data.testDriveTime || '09:00',
      duration: data.duration || 60,
      status: data.status || 'pending',
      staffId: data.staffId || null,
      staffName: data.staffName || null,
      notes: data.notes || '',
      pdpaConsent: data.pdpaConsent || false,
      pdpaConsentAt: data.pdpaConsent ? new Date().toISOString() : null,
      signature: null,
      signatureAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    testDrives.push(newTestDrive)

    ctx.sendJSON({
      success: true,
      message: 'Test drive booking created successfully',
      data: newTestDrive
    }, 201)
  },

  // GET /api/test-drives
  getAll(ctx) {
    const { status, brandCode, staffId, date, search, page = 1, limit = 50 } = ctx.query

    let filtered = [...testDrives]

    if (status) {
      filtered = filtered.filter(td => td.status === status)
    }

    if (brandCode) {
      filtered = filtered.filter(td => td.brandCode?.toUpperCase() === brandCode.toUpperCase())
    }

    if (staffId) {
      filtered = filtered.filter(td => td.staffId === staffId)
    }

    if (date) {
      filtered = filtered.filter(td => td.testDriveDate.startsWith(date))
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(td =>
        td.queueNumber.toLowerCase().includes(searchLower) ||
        td.customerName.toLowerCase().includes(searchLower) ||
        td.customerPhone.includes(search) ||
        td.vehicleCode.toLowerCase().includes(searchLower)
      )
    }

    // Sort by date descending
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

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

  // GET /api/test-drives/:id
  getById(ctx) {
    const { id } = ctx.params

    const testDrive = testDrives.find(td => td.id === id || td.queueNumber === id)

    if (!testDrive) {
      return ctx.sendError('Test drive not found', 404)
    }

    ctx.sendJSON({
      success: true,
      data: testDrive
    })
  },

  // PATCH /api/test-drives/:id
  update(ctx) {
    const { id } = ctx.params
    const updates = ctx.body

    const testDriveIndex = testDrives.findIndex(td => td.id === id || td.queueNumber === id)

    if (testDriveIndex === -1) {
      return ctx.sendError('Test drive not found', 404)
    }

    const testDrive = testDrives[testDriveIndex]

    // Update allowed fields
    const allowedFields = [
      'customerName', 'customerPhone', 'customerEmail', 'customerIdCard',
      'vehicleCode', 'vehicleModel', 'testDriveDate', 'testDriveTime',
      'duration', 'status', 'staffId', 'staffName', 'notes'
    ]

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        testDrive[field] = updates[field]
      }
    }

    testDrive.updatedAt = new Date().toISOString()

    testDrives[testDriveIndex] = testDrive

    ctx.sendJSON({
      success: true,
      message: 'Test drive updated successfully',
      data: testDrive
    })
  },

  // DELETE /api/test-drives/:id
  deleteTestDrive(ctx) {
    const { id } = ctx.params

    const testDriveIndex = testDrives.findIndex(td => td.id === id || td.queueNumber === id)

    if (testDriveIndex === -1) {
      return ctx.sendError('Test drive not found', 404)
    }

    // Instead of deleting, mark as cancelled
    testDrives[testDriveIndex].status = 'cancelled'
    testDrives[testDriveIndex].updatedAt = new Date().toISOString()

    ctx.sendJSON({
      success: true,
      message: 'Test drive cancelled successfully',
      data: testDrives[testDriveIndex]
    })
  },

  // POST /api/test-drives/:id/pdpa-consent
  pdpaConsent(ctx) {
    const { id } = ctx.params
    const { consent } = ctx.body

    if (consent === undefined) {
      return ctx.sendError('Consent value is required', 400)
    }

    const testDriveIndex = testDrives.findIndex(td => td.id === id || td.queueNumber === id)

    if (testDriveIndex === -1) {
      return ctx.sendError('Test drive not found', 404)
    }

    testDrives[testDriveIndex].pdpaConsent = consent
    testDrives[testDriveIndex].pdpaConsentAt = consent ? new Date().toISOString() : null
    testDrives[testDriveIndex].updatedAt = new Date().toISOString()

    ctx.sendJSON({
      success: true,
      message: `PDPA consent ${consent ? 'accepted' : 'revoked'} successfully`,
      data: testDrives[testDriveIndex]
    })
  },

  // POST /api/test-drives/:id/signature
  submitSignature(ctx) {
    const { id } = ctx.params
    const { signature } = ctx.body

    if (!signature) {
      return ctx.sendError('Signature is required', 400)
    }

    const testDriveIndex = testDrives.findIndex(td => td.id === id || td.queueNumber === id)

    if (testDriveIndex === -1) {
      return ctx.sendError('Test drive not found', 404)
    }

    testDrives[testDriveIndex].signature = signature
    testDrives[testDriveIndex].signatureAt = new Date().toISOString()
    testDrives[testDriveIndex].updatedAt = new Date().toISOString()

    ctx.sendJSON({
      success: true,
      message: 'Signature submitted successfully',
      data: testDrives[testDriveIndex]
    })
  },

  // ========================================
  // BRAND-SCOPED TEST DRIVE ENDPOINTS
  // ========================================

  // POST /api/:brandCode/test-drives
  createBrandScoped(ctx) {
    const { brandCode } = ctx.params
    const data = { ...ctx.body, brandCode: brandCode.toUpperCase() }

    ctx.body = data
    return this.create(ctx)
  },

  // GET /api/:brandCode/test-drives
  getAllBrandScoped(ctx) {
    const { brandCode } = ctx.params

    ctx.query.brandCode = brandCode
    return this.getAll(ctx)
  },

  // GET /api/:brandCode/test-drives/:id
  getByIdBrandScoped(ctx) {
    const { brandCode, id } = ctx.params

    const testDrive = testDrives.find(td =>
      (td.id === id || td.queueNumber === id) &&
      td.brandCode?.toUpperCase() === brandCode.toUpperCase()
    )

    if (!testDrive) {
      return ctx.sendError('Test drive not found', 404)
    }

    ctx.sendJSON({
      success: true,
      data: testDrive
    })
  },

  // PATCH /api/:brandCode/test-drives/:id
  updateBrandScoped(ctx) {
    const { brandCode, id } = ctx.params

    const testDrive = testDrives.find(td =>
      (td.id === id || td.queueNumber === id) &&
      td.brandCode?.toUpperCase() === brandCode.toUpperCase()
    )

    if (!testDrive) {
      return ctx.sendError('Test drive not found', 404)
    }

    ctx.params.id = id
    return this.update(ctx)
  },

  // DELETE /api/:brandCode/test-drives/:id
  deleteTestDriveBrandScoped(ctx) {
    const { brandCode, id } = ctx.params

    const testDrive = testDrives.find(td =>
      (td.id === id || td.queueNumber === id) &&
      td.brandCode?.toUpperCase() === brandCode.toUpperCase()
    )

    if (!testDrive) {
      return ctx.sendError('Test drive not found', 404)
    }

    ctx.params.id = id
    return this.deleteTestDrive(ctx)
  },

  // POST /api/:brandCode/test-drives/:id/pdpa-consent
  pdpaConsentBrandScoped(ctx) {
    const { brandCode, id } = ctx.params

    const testDrive = testDrives.find(td =>
      (td.id === id || td.queueNumber === id) &&
      td.brandCode?.toUpperCase() === brandCode.toUpperCase()
    )

    if (!testDrive) {
      return ctx.sendError('Test drive not found', 404)
    }

    ctx.params.id = id
    return this.pdpaConsent(ctx)
  },

  // POST /api/:brandCode/test-drives/:id/signature
  submitSignatureBrandScoped(ctx) {
    const { brandCode, id } = ctx.params

    const testDrive = testDrives.find(td =>
      (td.id === id || td.queueNumber === id) &&
      td.brandCode?.toUpperCase() === brandCode.toUpperCase()
    )

    if (!testDrive) {
      return ctx.sendError('Test drive not found', 404)
    }

    ctx.params.id = id
    return this.submitSignature(ctx)
  },

  // ========================================
  // ADMIN CROSS-BRAND TEST DRIVE ENDPOINTS
  // ========================================

  // GET /api/admin/test-drives/all
  adminGetAll(ctx) {
    return this.getAll(ctx)
  },

  // GET /api/admin/test-drives/export
  adminExport(ctx) {
    const { startDate, endDate, brandCode, status } = ctx.query

    let filtered = [...testDrives]

    if (startDate) {
      filtered = filtered.filter(td => td.testDriveDate >= startDate)
    }

    if (endDate) {
      filtered = filtered.filter(td => td.testDriveDate <= endDate)
    }

    if (brandCode) {
      filtered = filtered.filter(td => td.brandCode?.toUpperCase() === brandCode.toUpperCase())
    }

    if (status) {
      filtered = filtered.filter(td => td.status === status)
    }

    // Prepare CSV data
    const csvHeaders = [
      'Queue Number', 'Brand', 'Customer Name', 'Customer Phone', 'Customer Email',
      'Vehicle Code', 'Vehicle Model', 'Test Drive Date', 'Test Drive Time',
      'Status', 'Staff Name', 'Created At'
    ]

    const csvRows = filtered.map(td => [
      td.queueNumber,
      td.brandCode || '',
      td.customerName,
      td.customerPhone,
      td.customerEmail || '',
      td.vehicleCode,
      td.vehicleModel || '',
      td.testDriveDate,
      td.testDriveTime,
      td.status,
      td.staffName || '',
      td.createdAt
    ])

    ctx.sendJSON({
      success: true,
      data: {
        headers: csvHeaders,
        rows: csvRows,
        total: filtered.length
      },
      message: 'Export data generated successfully'
    })
  },

  // GET /api/admin/test-drives/:id
  adminGetById(ctx) {
    const { id } = ctx.params

    const testDrive = testDrives.find(td => td.id === id || td.queueNumber === id)

    if (!testDrive) {
      return ctx.sendError('Test drive not found', 404)
    }

    ctx.sendJSON({
      success: true,
      data: testDrive
    })
  }
}
