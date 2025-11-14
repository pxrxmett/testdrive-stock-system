// Stock Controller - Vehicle/Stock management
// Handles non-scoped, brand-scoped, and admin cross-brand endpoints

// Mock vehicles database
const vehicles = [
  {
    id: '1',
    vehicleCode: 'ISZ-001',
    brandCode: 'ISUZU',
    model: 'D-MAX',
    variant: 'Hi-Lander 3.0 Ddi Blue Power',
    year: 2024,
    color: 'White',
    licensePlate: 'กข-1234',
    chassisNumber: 'MRLSK28G0J0000001',
    engineNumber: '4JJ1-0000001',
    status: 'available',
    purchasePrice: 1200000,
    sellingPrice: 1350000,
    mileage: 1500,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    notes: '',
    images: ['/images/vehicles/isz-001-1.jpg'],
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z'
  },
  {
    id: '2',
    vehicleCode: 'BYD-001',
    brandCode: 'BYD',
    model: 'ATTO 3',
    variant: 'Extended Range',
    year: 2024,
    color: 'Blue',
    licensePlate: 'คค-5678',
    chassisNumber: 'LGXCE2A10P0000001',
    engineNumber: 'ELECTRIC-001',
    status: 'available',
    purchasePrice: 1100000,
    sellingPrice: 1190000,
    mileage: 800,
    fuelType: 'Electric',
    transmission: 'Automatic',
    batteryCapacity: '60.48 kWh',
    range: 420,
    notes: '',
    images: ['/images/vehicles/byd-001-1.jpg'],
    createdAt: '2024-02-10T10:00:00.000Z',
    updatedAt: '2024-02-10T10:00:00.000Z'
  }
]

let nextId = 3

module.exports = {
  // ========================================
  // NON-SCOPED STOCK ENDPOINTS
  // ========================================

  // POST /api/stock
  create(ctx) {
    const data = ctx.body

    if (!data.vehicleCode || !data.brandCode || !data.model) {
      return ctx.sendError('Vehicle code, brand code, and model are required', 400)
    }

    // Check if vehicle code already exists
    if (vehicles.find(v => v.vehicleCode === data.vehicleCode)) {
      return ctx.sendError('Vehicle code already exists', 400)
    }

    const newVehicle = {
      id: String(nextId++),
      vehicleCode: data.vehicleCode,
      brandCode: data.brandCode.toUpperCase(),
      model: data.model,
      variant: data.variant || '',
      year: data.year || new Date().getFullYear(),
      color: data.color || '',
      licensePlate: data.licensePlate || '',
      chassisNumber: data.chassisNumber || '',
      engineNumber: data.engineNumber || '',
      status: data.status || 'available',
      purchasePrice: data.purchasePrice || 0,
      sellingPrice: data.sellingPrice || 0,
      mileage: data.mileage || 0,
      fuelType: data.fuelType || '',
      transmission: data.transmission || '',
      batteryCapacity: data.batteryCapacity || null,
      range: data.range || null,
      notes: data.notes || '',
      images: data.images || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    vehicles.push(newVehicle)

    ctx.sendJSON({
      success: true,
      message: 'Vehicle created successfully',
      data: newVehicle
    }, 201)
  },

  // GET /api/stock
  getAll(ctx) {
    ctx.sendJSON({
      success: true,
      data: vehicles,
      total: vehicles.length
    })
  },

  // GET /api/stock/vehicles
  getVehicles(ctx) {
    const { status, brandCode, model, search, page = 1, limit = 50 } = ctx.query

    let filtered = [...vehicles]

    if (status) {
      filtered = filtered.filter(v => v.status === status)
    }

    if (brandCode) {
      filtered = filtered.filter(v => v.brandCode.toUpperCase() === brandCode.toUpperCase())
    }

    if (model) {
      filtered = filtered.filter(v => v.model.toLowerCase().includes(model.toLowerCase()))
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(v =>
        v.vehicleCode.toLowerCase().includes(searchLower) ||
        v.model.toLowerCase().includes(searchLower) ||
        v.licensePlate.toLowerCase().includes(searchLower)
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

  // GET /api/stock/:id
  getById(ctx) {
    const { id } = ctx.params

    const vehicle = vehicles.find(v => v.id === id || v.vehicleCode === id)

    if (!vehicle) {
      return ctx.sendError('Vehicle not found', 404)
    }

    ctx.sendJSON({
      success: true,
      data: vehicle
    })
  },

  // PATCH /api/stock/:id
  update(ctx) {
    const { id } = ctx.params
    const updates = ctx.body

    const vehicleIndex = vehicles.findIndex(v => v.id === id || v.vehicleCode === id)

    if (vehicleIndex === -1) {
      return ctx.sendError('Vehicle not found', 404)
    }

    const vehicle = vehicles[vehicleIndex]

    // Update allowed fields
    const allowedFields = [
      'model', 'variant', 'year', 'color', 'licensePlate', 'chassisNumber',
      'engineNumber', 'status', 'purchasePrice', 'sellingPrice', 'mileage',
      'fuelType', 'transmission', 'batteryCapacity', 'range', 'notes', 'images'
    ]

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        vehicle[field] = updates[field]
      }
    }

    vehicle.updatedAt = new Date().toISOString()

    vehicles[vehicleIndex] = vehicle

    ctx.sendJSON({
      success: true,
      message: 'Vehicle updated successfully',
      data: vehicle
    })
  },

  // PATCH /api/stock/vehicles/:id/status
  updateStatus(ctx) {
    const { id } = ctx.params
    const { status } = ctx.body

    if (!status) {
      return ctx.sendError('Status is required', 400)
    }

    const validStatuses = ['available', 'inService', 'maintenance', 'sold', 'reserved']
    if (!validStatuses.includes(status)) {
      return ctx.sendError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400)
    }

    const vehicleIndex = vehicles.findIndex(v => v.id === id || v.vehicleCode === id)

    if (vehicleIndex === -1) {
      return ctx.sendError('Vehicle not found', 404)
    }

    vehicles[vehicleIndex].status = status
    vehicles[vehicleIndex].updatedAt = new Date().toISOString()

    ctx.sendJSON({
      success: true,
      message: 'Vehicle status updated successfully',
      data: vehicles[vehicleIndex]
    })
  },

  // DELETE /api/stock/vehicles/:id
  deleteVehicle(ctx) {
    const { id } = ctx.params

    const vehicleIndex = vehicles.findIndex(v => v.id === id || v.vehicleCode === id)

    if (vehicleIndex === -1) {
      return ctx.sendError('Vehicle not found', 404)
    }

    const deletedVehicle = vehicles.splice(vehicleIndex, 1)[0]

    ctx.sendJSON({
      success: true,
      message: 'Vehicle deleted successfully',
      data: deletedVehicle
    })
  },

  // POST /api/stock/upload
  upload(ctx) {
    const { vehicles: uploadedVehicles } = ctx.body

    if (!uploadedVehicles || !Array.isArray(uploadedVehicles)) {
      return ctx.sendError('Vehicles array is required', 400)
    }

    const results = {
      success: [],
      failed: []
    }

    for (const data of uploadedVehicles) {
      try {
        if (!data.vehicleCode || !data.brandCode || !data.model) {
          results.failed.push({
            data,
            error: 'Missing required fields'
          })
          continue
        }

        // Check if vehicle code already exists
        if (vehicles.find(v => v.vehicleCode === data.vehicleCode)) {
          results.failed.push({
            data,
            error: 'Vehicle code already exists'
          })
          continue
        }

        const newVehicle = {
          id: String(nextId++),
          vehicleCode: data.vehicleCode,
          brandCode: data.brandCode.toUpperCase(),
          model: data.model,
          variant: data.variant || '',
          year: data.year || new Date().getFullYear(),
          color: data.color || '',
          licensePlate: data.licensePlate || '',
          chassisNumber: data.chassisNumber || '',
          engineNumber: data.engineNumber || '',
          status: data.status || 'available',
          purchasePrice: data.purchasePrice || 0,
          sellingPrice: data.sellingPrice || 0,
          mileage: data.mileage || 0,
          fuelType: data.fuelType || '',
          transmission: data.transmission || '',
          batteryCapacity: data.batteryCapacity || null,
          range: data.range || null,
          notes: data.notes || '',
          images: data.images || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        vehicles.push(newVehicle)
        results.success.push(newVehicle)

      } catch (error) {
        results.failed.push({
          data,
          error: error.message
        })
      }
    }

    ctx.sendJSON({
      success: true,
      message: `Uploaded ${results.success.length} vehicles successfully, ${results.failed.length} failed`,
      data: results
    })
  },

  // ========================================
  // BRAND-SCOPED STOCK ENDPOINTS
  // ========================================

  // POST /api/:brandCode/stock
  createBrandScoped(ctx) {
    const { brandCode } = ctx.params
    const data = { ...ctx.body, brandCode: brandCode.toUpperCase() }

    // Reuse the create logic
    ctx.body = data
    return this.create(ctx)
  },

  // GET /api/:brandCode/stock
  getAllBrandScoped(ctx) {
    const { brandCode } = ctx.params

    const brandVehicles = vehicles.filter(v => v.brandCode.toUpperCase() === brandCode.toUpperCase())

    ctx.sendJSON({
      success: true,
      data: brandVehicles,
      total: brandVehicles.length
    })
  },

  // GET /api/:brandCode/stock/vehicles
  getVehiclesBrandScoped(ctx) {
    const { brandCode } = ctx.params

    // Add brandCode to query and reuse getVehicles
    ctx.query.brandCode = brandCode
    return this.getVehicles(ctx)
  },

  // GET /api/:brandCode/stock/:id
  getByIdBrandScoped(ctx) {
    const { brandCode, id } = ctx.params

    const vehicle = vehicles.find(v =>
      (v.id === id || v.vehicleCode === id) &&
      v.brandCode.toUpperCase() === brandCode.toUpperCase()
    )

    if (!vehicle) {
      return ctx.sendError('Vehicle not found', 404)
    }

    ctx.sendJSON({
      success: true,
      data: vehicle
    })
  },

  // PATCH /api/:brandCode/stock/:id
  updateBrandScoped(ctx) {
    const { brandCode, id } = ctx.params

    // Check if vehicle belongs to this brand
    const vehicle = vehicles.find(v =>
      (v.id === id || v.vehicleCode === id) &&
      v.brandCode.toUpperCase() === brandCode.toUpperCase()
    )

    if (!vehicle) {
      return ctx.sendError('Vehicle not found', 404)
    }

    // Reuse update logic
    ctx.params.id = id
    return this.update(ctx)
  },

  // PATCH /api/:brandCode/stock/vehicles/:id/status
  updateStatusBrandScoped(ctx) {
    const { brandCode, id } = ctx.params

    // Check if vehicle belongs to this brand
    const vehicle = vehicles.find(v =>
      (v.id === id || v.vehicleCode === id) &&
      v.brandCode.toUpperCase() === brandCode.toUpperCase()
    )

    if (!vehicle) {
      return ctx.sendError('Vehicle not found', 404)
    }

    // Reuse updateStatus logic
    ctx.params.id = id
    return this.updateStatus(ctx)
  },

  // DELETE /api/:brandCode/stock/vehicles/:id
  deleteVehicleBrandScoped(ctx) {
    const { brandCode, id } = ctx.params

    // Check if vehicle belongs to this brand
    const vehicle = vehicles.find(v =>
      (v.id === id || v.vehicleCode === id) &&
      v.brandCode.toUpperCase() === brandCode.toUpperCase()
    )

    if (!vehicle) {
      return ctx.sendError('Vehicle not found', 404)
    }

    // Reuse deleteVehicle logic
    ctx.params.id = id
    return this.deleteVehicle(ctx)
  },

  // POST /api/:brandCode/stock/upload
  uploadBrandScoped(ctx) {
    const { brandCode } = ctx.params
    const { vehicles: uploadedVehicles } = ctx.body

    if (!uploadedVehicles || !Array.isArray(uploadedVehicles)) {
      return ctx.sendError('Vehicles array is required', 400)
    }

    // Add brandCode to all vehicles
    const vehiclesWithBrand = uploadedVehicles.map(v => ({
      ...v,
      brandCode: brandCode.toUpperCase()
    }))

    ctx.body = { vehicles: vehiclesWithBrand }
    return this.upload(ctx)
  },

  // ========================================
  // ADMIN CROSS-BRAND STOCK ENDPOINTS
  // ========================================

  // GET /api/admin/stock/all
  adminGetAll(ctx) {
    const { page = 1, limit = 50 } = ctx.query

    // Pagination
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const startIndex = (pageNum - 1) * limitNum
    const endIndex = startIndex + limitNum

    const paginated = vehicles.slice(startIndex, endIndex)

    ctx.sendJSON({
      success: true,
      data: paginated,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: vehicles.length,
        totalPages: Math.ceil(vehicles.length / limitNum)
      }
    })
  },

  // GET /api/admin/stock/summary
  adminGetSummary(ctx) {
    const summary = {
      total: vehicles.length,
      byBrand: {},
      byStatus: {}
    }

    vehicles.forEach(v => {
      // By brand
      if (!summary.byBrand[v.brandCode]) {
        summary.byBrand[v.brandCode] = {
          total: 0,
          byStatus: {}
        }
      }
      summary.byBrand[v.brandCode].total++

      if (!summary.byBrand[v.brandCode].byStatus[v.status]) {
        summary.byBrand[v.brandCode].byStatus[v.status] = 0
      }
      summary.byBrand[v.brandCode].byStatus[v.status]++

      // Overall by status
      if (!summary.byStatus[v.status]) {
        summary.byStatus[v.status] = 0
      }
      summary.byStatus[v.status]++
    })

    ctx.sendJSON({
      success: true,
      data: summary
    })
  },

  // GET /api/admin/stock/search
  adminSearch(ctx) {
    const { q, brandCode, status, model } = ctx.query

    let filtered = [...vehicles]

    if (q) {
      const searchLower = q.toLowerCase()
      filtered = filtered.filter(v =>
        v.vehicleCode.toLowerCase().includes(searchLower) ||
        v.model.toLowerCase().includes(searchLower) ||
        v.licensePlate.toLowerCase().includes(searchLower) ||
        v.chassisNumber.toLowerCase().includes(searchLower)
      )
    }

    if (brandCode) {
      filtered = filtered.filter(v => v.brandCode.toUpperCase() === brandCode.toUpperCase())
    }

    if (status) {
      filtered = filtered.filter(v => v.status === status)
    }

    if (model) {
      filtered = filtered.filter(v => v.model.toLowerCase().includes(model.toLowerCase()))
    }

    ctx.sendJSON({
      success: true,
      data: filtered,
      total: filtered.length
    })
  },

  // GET /api/admin/stock/:id
  adminGetById(ctx) {
    const { id } = ctx.params

    const vehicle = vehicles.find(v => v.id === id || v.vehicleCode === id)

    if (!vehicle) {
      return ctx.sendError('Vehicle not found', 404)
    }

    ctx.sendJSON({
      success: true,
      data: vehicle
    })
  },

  // GET /api/admin/stock/analytics/by-brand
  adminGetAnalyticsByBrand(ctx) {
    const analytics = {}

    vehicles.forEach(v => {
      if (!analytics[v.brandCode]) {
        analytics[v.brandCode] = {
          brandCode: v.brandCode,
          totalVehicles: 0,
          totalValue: 0,
          averageValue: 0,
          byStatus: {
            available: 0,
            inService: 0,
            maintenance: 0,
            sold: 0,
            reserved: 0
          },
          models: {}
        }
      }

      analytics[v.brandCode].totalVehicles++
      analytics[v.brandCode].totalValue += v.sellingPrice || 0
      analytics[v.brandCode].byStatus[v.status] = (analytics[v.brandCode].byStatus[v.status] || 0) + 1

      if (!analytics[v.brandCode].models[v.model]) {
        analytics[v.brandCode].models[v.model] = 0
      }
      analytics[v.brandCode].models[v.model]++
    })

    // Calculate averages
    Object.keys(analytics).forEach(brand => {
      analytics[brand].averageValue = analytics[brand].totalVehicles > 0
        ? Math.round(analytics[brand].totalValue / analytics[brand].totalVehicles)
        : 0
    })

    ctx.sendJSON({
      success: true,
      data: Object.values(analytics)
    })
  }
}
