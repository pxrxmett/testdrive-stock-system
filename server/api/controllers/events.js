// Events Controller - Event management
// Handles non-scoped, brand-scoped, and admin cross-brand endpoints

// Mock events database
const events = [
  {
    id: '1',
    eventCode: 'EVT-2024-001',
    brandCode: 'ISUZU',
    name: 'Bangkok Motor Show 2024',
    description: 'Annual motor show showcasing ISUZU vehicles',
    type: 'Motor Show',
    location: 'Bangkok International Trade & Exhibition Centre',
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 13).toISOString(),
    status: 'upcoming',
    assignedVehicles: ['ISZ-001'],
    expectedAttendance: 5000,
    actualAttendance: null,
    budget: 500000,
    notes: '',
    createdBy: 'admin',
    createdAt: '2024-08-01T10:00:00.000Z',
    updatedAt: '2024-08-01T10:00:00.000Z'
  },
  {
    id: '2',
    eventCode: 'EVT-2024-002',
    brandCode: 'BYD',
    name: 'EV Expo Thailand',
    description: 'Electric vehicle exhibition',
    type: 'Product Launch',
    location: 'BITEC Bangna',
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18).toISOString(),
    status: 'upcoming',
    assignedVehicles: ['BYD-001'],
    expectedAttendance: 3000,
    actualAttendance: null,
    budget: 300000,
    notes: '',
    createdBy: 'admin',
    createdAt: '2024-08-05T10:00:00.000Z',
    updatedAt: '2024-08-05T10:00:00.000Z'
  }
]

// Mock event vehicles assignment
const eventVehicles = [
  {
    eventId: '1',
    vehicleId: 'ISZ-001',
    vehicleCode: 'ISZ-001',
    vehicleModel: 'D-MAX',
    assignedAt: '2024-08-01T11:00:00.000Z',
    status: 'assigned'
  },
  {
    eventId: '2',
    vehicleId: 'BYD-001',
    vehicleCode: 'BYD-001',
    vehicleModel: 'ATTO 3',
    assignedAt: '2024-08-05T11:00:00.000Z',
    status: 'assigned'
  }
]

let nextId = 3

function generateEventCode() {
  const year = new Date().getFullYear()
  const count = events.length + 1
  return `EVT-${year}-${String(count).padStart(3, '0')}`
}

module.exports = {
  // ========================================
  // NON-SCOPED EVENT ENDPOINTS
  // ========================================

  // POST /api/events
  create(ctx) {
    const data = ctx.body

    if (!data.name || !data.startDate || !data.endDate) {
      return ctx.sendError('Name, start date, and end date are required', 400)
    }

    const newEvent = {
      id: String(nextId++),
      eventCode: generateEventCode(),
      brandCode: data.brandCode?.toUpperCase() || null,
      name: data.name,
      description: data.description || '',
      type: data.type || 'General',
      location: data.location || '',
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status || 'upcoming',
      assignedVehicles: [],
      expectedAttendance: data.expectedAttendance || 0,
      actualAttendance: data.actualAttendance || null,
      budget: data.budget || 0,
      notes: data.notes || '',
      createdBy: data.createdBy || 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    events.push(newEvent)

    ctx.sendJSON({
      success: true,
      message: 'Event created successfully',
      data: newEvent
    }, 201)
  },

  // GET /api/events
  getAll(ctx) {
    const { status, brandCode, type, search, startDate, endDate, page = 1, limit = 50 } = ctx.query

    let filtered = [...events]

    if (status) {
      filtered = filtered.filter(e => e.status === status)
    }

    if (brandCode) {
      filtered = filtered.filter(e => e.brandCode?.toUpperCase() === brandCode.toUpperCase())
    }

    if (type) {
      filtered = filtered.filter(e => e.type === type)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(searchLower) ||
        e.eventCode.toLowerCase().includes(searchLower) ||
        e.location.toLowerCase().includes(searchLower)
      )
    }

    if (startDate) {
      filtered = filtered.filter(e => e.startDate >= startDate)
    }

    if (endDate) {
      filtered = filtered.filter(e => e.endDate <= endDate)
    }

    // Sort by start date ascending
    filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))

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

  // GET /api/events/calendar/view
  getCalendarView(ctx) {
    const { start, end, brandCode } = ctx.query

    let filtered = [...events]

    if (brandCode) {
      filtered = filtered.filter(e => e.brandCode?.toUpperCase() === brandCode.toUpperCase())
    }

    if (start && end) {
      filtered = filtered.filter(e => {
        const eventStart = new Date(e.startDate)
        const eventEnd = new Date(e.endDate)
        const rangeStart = new Date(start)
        const rangeEnd = new Date(end)

        return (eventStart >= rangeStart && eventStart <= rangeEnd) ||
               (eventEnd >= rangeStart && eventEnd <= rangeEnd) ||
               (eventStart <= rangeStart && eventEnd >= rangeEnd)
      })
    }

    // Format for calendar
    const calendarEvents = filtered.map(e => ({
      id: e.id,
      title: e.name,
      start: e.startDate,
      end: e.endDate,
      brandCode: e.brandCode,
      type: e.type,
      status: e.status,
      location: e.location,
      vehicleCount: e.assignedVehicles.length
    }))

    ctx.sendJSON({
      success: true,
      data: calendarEvents,
      total: calendarEvents.length
    })
  },

  // GET /api/events/:id
  getById(ctx) {
    const { id } = ctx.params

    const event = events.find(e => e.id === id || e.eventCode === id)

    if (!event) {
      return ctx.sendError('Event not found', 404)
    }

    // Get assigned vehicles details
    const assignedVehicles = eventVehicles.filter(ev => ev.eventId === event.id)

    ctx.sendJSON({
      success: true,
      data: {
        ...event,
        vehiclesDetails: assignedVehicles
      }
    })
  },

  // PATCH /api/events/:id
  update(ctx) {
    const { id } = ctx.params
    const updates = ctx.body

    const eventIndex = events.findIndex(e => e.id === id || e.eventCode === id)

    if (eventIndex === -1) {
      return ctx.sendError('Event not found', 404)
    }

    const event = events[eventIndex]

    // Update allowed fields
    const allowedFields = [
      'name', 'description', 'type', 'location', 'startDate', 'endDate',
      'status', 'expectedAttendance', 'actualAttendance', 'budget', 'notes'
    ]

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        event[field] = updates[field]
      }
    }

    event.updatedAt = new Date().toISOString()

    events[eventIndex] = event

    ctx.sendJSON({
      success: true,
      message: 'Event updated successfully',
      data: event
    })
  },

  // DELETE /api/events/:id
  deleteEvent(ctx) {
    const { id } = ctx.params

    const eventIndex = events.findIndex(e => e.id === id || e.eventCode === id)

    if (eventIndex === -1) {
      return ctx.sendError('Event not found', 404)
    }

    const deletedEvent = events.splice(eventIndex, 1)[0]

    // Remove all vehicle assignments
    const eventId = deletedEvent.id
    const assignedCount = eventVehicles.filter(ev => ev.eventId === eventId).length
    eventVehicles.splice(0, eventVehicles.length, ...eventVehicles.filter(ev => ev.eventId !== eventId))

    ctx.sendJSON({
      success: true,
      message: `Event deleted successfully. ${assignedCount} vehicle assignments removed.`,
      data: deletedEvent
    })
  },

  // POST /api/events/:id/vehicles
  assignVehicle(ctx) {
    const { id } = ctx.params
    const { vehicleId, vehicleCode, vehicleModel } = ctx.body

    if (!vehicleId && !vehicleCode) {
      return ctx.sendError('Vehicle ID or vehicle code is required', 400)
    }

    const event = events.find(e => e.id === id || e.eventCode === id)

    if (!event) {
      return ctx.sendError('Event not found', 404)
    }

    const vehicle = vehicleCode || vehicleId

    // Check if vehicle is already assigned to this event
    const existingAssignment = eventVehicles.find(ev =>
      ev.eventId === event.id && (ev.vehicleId === vehicle || ev.vehicleCode === vehicle)
    )

    if (existingAssignment) {
      return ctx.sendError('Vehicle already assigned to this event', 400)
    }

    const assignment = {
      eventId: event.id,
      vehicleId: vehicleId || vehicleCode,
      vehicleCode: vehicleCode || vehicleId,
      vehicleModel: vehicleModel || '',
      assignedAt: new Date().toISOString(),
      status: 'assigned'
    }

    eventVehicles.push(assignment)

    // Update event's assignedVehicles array
    if (!event.assignedVehicles.includes(assignment.vehicleCode)) {
      event.assignedVehicles.push(assignment.vehicleCode)
    }

    ctx.sendJSON({
      success: true,
      message: 'Vehicle assigned to event successfully',
      data: assignment
    })
  },

  // GET /api/events/:id/vehicles
  getEventVehicles(ctx) {
    const { id } = ctx.params

    const event = events.find(e => e.id === id || e.eventCode === id)

    if (!event) {
      return ctx.sendError('Event not found', 404)
    }

    const assignedVehicles = eventVehicles.filter(ev => ev.eventId === event.id)

    ctx.sendJSON({
      success: true,
      data: assignedVehicles,
      total: assignedVehicles.length
    })
  },

  // POST /api/events/:id/vehicles/batch
  assignMultipleVehicles(ctx) {
    const { id } = ctx.params
    const { vehicles } = ctx.body

    if (!vehicles || !Array.isArray(vehicles) || vehicles.length === 0) {
      return ctx.sendError('Vehicles array is required', 400)
    }

    const event = events.find(e => e.id === id || e.eventCode === id)

    if (!event) {
      return ctx.sendError('Event not found', 404)
    }

    const results = {
      success: [],
      failed: []
    }

    for (const vehicle of vehicles) {
      try {
        const vehicleRef = vehicle.vehicleCode || vehicle.vehicleId

        if (!vehicleRef) {
          results.failed.push({
            vehicle,
            error: 'Vehicle ID or code is required'
          })
          continue
        }

        // Check if already assigned
        const existingAssignment = eventVehicles.find(ev =>
          ev.eventId === event.id && (ev.vehicleId === vehicleRef || ev.vehicleCode === vehicleRef)
        )

        if (existingAssignment) {
          results.failed.push({
            vehicle,
            error: 'Already assigned to this event'
          })
          continue
        }

        const assignment = {
          eventId: event.id,
          vehicleId: vehicle.vehicleId || vehicleRef,
          vehicleCode: vehicle.vehicleCode || vehicleRef,
          vehicleModel: vehicle.vehicleModel || '',
          assignedAt: new Date().toISOString(),
          status: 'assigned'
        }

        eventVehicles.push(assignment)

        if (!event.assignedVehicles.includes(assignment.vehicleCode)) {
          event.assignedVehicles.push(assignment.vehicleCode)
        }

        results.success.push(assignment)

      } catch (error) {
        results.failed.push({
          vehicle,
          error: error.message
        })
      }
    }

    ctx.sendJSON({
      success: true,
      message: `Assigned ${results.success.length} vehicles successfully, ${results.failed.length} failed`,
      data: results
    })
  },

  // DELETE /api/events/:id/vehicles/:vehicleId
  unassignVehicle(ctx) {
    const { id, vehicleId } = ctx.params

    const event = events.find(e => e.id === id || e.eventCode === id)

    if (!event) {
      return ctx.sendError('Event not found', 404)
    }

    const assignmentIndex = eventVehicles.findIndex(ev =>
      ev.eventId === event.id && (ev.vehicleId === vehicleId || ev.vehicleCode === vehicleId)
    )

    if (assignmentIndex === -1) {
      return ctx.sendError('Vehicle assignment not found', 404)
    }

    const removedAssignment = eventVehicles.splice(assignmentIndex, 1)[0]

    // Remove from event's assignedVehicles array
    event.assignedVehicles = event.assignedVehicles.filter(v => v !== removedAssignment.vehicleCode)

    ctx.sendJSON({
      success: true,
      message: 'Vehicle unassigned from event successfully',
      data: removedAssignment
    })
  },

  // PATCH /api/events/:id/status
  updateStatus(ctx) {
    const { id } = ctx.params
    const { status } = ctx.body

    if (!status) {
      return ctx.sendError('Status is required', 400)
    }

    const validStatuses = ['upcoming', 'active', 'completed', 'cancelled']
    if (!validStatuses.includes(status)) {
      return ctx.sendError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400)
    }

    const eventIndex = events.findIndex(e => e.id === id || e.eventCode === id)

    if (eventIndex === -1) {
      return ctx.sendError('Event not found', 404)
    }

    events[eventIndex].status = status
    events[eventIndex].updatedAt = new Date().toISOString()

    ctx.sendJSON({
      success: true,
      message: 'Event status updated successfully',
      data: events[eventIndex]
    })
  },

  // ========================================
  // BRAND-SCOPED EVENT ENDPOINTS
  // ========================================

  // POST /api/:brandCode/events
  createBrandScoped(ctx) {
    const { brandCode } = ctx.params
    const data = { ...ctx.body, brandCode: brandCode.toUpperCase() }

    ctx.body = data
    return this.create(ctx)
  },

  // GET /api/:brandCode/events
  getAllBrandScoped(ctx) {
    const { brandCode } = ctx.params

    ctx.query.brandCode = brandCode
    return this.getAll(ctx)
  },

  // GET /api/:brandCode/events/calendar/view
  getCalendarViewBrandScoped(ctx) {
    const { brandCode } = ctx.params

    ctx.query.brandCode = brandCode
    return this.getCalendarView(ctx)
  },

  // GET /api/:brandCode/events/:id
  getByIdBrandScoped(ctx) {
    const { brandCode, id } = ctx.params

    const event = events.find(e =>
      (e.id === id || e.eventCode === id) &&
      e.brandCode?.toUpperCase() === brandCode.toUpperCase()
    )

    if (!event) {
      return ctx.sendError('Event not found', 404)
    }

    // Get assigned vehicles details
    const assignedVehicles = eventVehicles.filter(ev => ev.eventId === event.id)

    ctx.sendJSON({
      success: true,
      data: {
        ...event,
        vehiclesDetails: assignedVehicles
      }
    })
  },

  // PATCH /api/:brandCode/events/:id
  updateBrandScoped(ctx) {
    const { brandCode, id } = ctx.params

    const event = events.find(e =>
      (e.id === id || e.eventCode === id) &&
      e.brandCode?.toUpperCase() === brandCode.toUpperCase()
    )

    if (!event) {
      return ctx.sendError('Event not found', 404)
    }

    ctx.params.id = id
    return this.update(ctx)
  },

  // DELETE /api/:brandCode/events/:id
  deleteEventBrandScoped(ctx) {
    const { brandCode, id } = ctx.params

    const event = events.find(e =>
      (e.id === id || e.eventCode === id) &&
      e.brandCode?.toUpperCase() === brandCode.toUpperCase()
    )

    if (!event) {
      return ctx.sendError('Event not found', 404)
    }

    ctx.params.id = id
    return this.deleteEvent(ctx)
  },

  // POST /api/:brandCode/events/:id/vehicles
  assignVehicleBrandScoped(ctx) {
    const { brandCode, id } = ctx.params

    const event = events.find(e =>
      (e.id === id || e.eventCode === id) &&
      e.brandCode?.toUpperCase() === brandCode.toUpperCase()
    )

    if (!event) {
      return ctx.sendError('Event not found', 404)
    }

    ctx.params.id = id
    return this.assignVehicle(ctx)
  },

  // GET /api/:brandCode/events/:id/vehicles
  getEventVehiclesBrandScoped(ctx) {
    const { brandCode, id } = ctx.params

    const event = events.find(e =>
      (e.id === id || e.eventCode === id) &&
      e.brandCode?.toUpperCase() === brandCode.toUpperCase()
    )

    if (!event) {
      return ctx.sendError('Event not found', 404)
    }

    ctx.params.id = id
    return this.getEventVehicles(ctx)
  },

  // POST /api/:brandCode/events/:id/vehicles/batch
  assignMultipleVehiclesBrandScoped(ctx) {
    const { brandCode, id } = ctx.params

    const event = events.find(e =>
      (e.id === id || e.eventCode === id) &&
      e.brandCode?.toUpperCase() === brandCode.toUpperCase()
    )

    if (!event) {
      return ctx.sendError('Event not found', 404)
    }

    ctx.params.id = id
    return this.assignMultipleVehicles(ctx)
  },

  // DELETE /api/:brandCode/events/:id/vehicles/:vehicleId
  unassignVehicleBrandScoped(ctx) {
    const { brandCode, id } = ctx.params

    const event = events.find(e =>
      (e.id === id || e.eventCode === id) &&
      e.brandCode?.toUpperCase() === brandCode.toUpperCase()
    )

    if (!event) {
      return ctx.sendError('Event not found', 404)
    }

    ctx.params.id = id
    return this.unassignVehicle(ctx)
  },

  // PATCH /api/:brandCode/events/:id/status
  updateStatusBrandScoped(ctx) {
    const { brandCode, id } = ctx.params

    const event = events.find(e =>
      (e.id === id || e.eventCode === id) &&
      e.brandCode?.toUpperCase() === brandCode.toUpperCase()
    )

    if (!event) {
      return ctx.sendError('Event not found', 404)
    }

    ctx.params.id = id
    return this.updateStatus(ctx)
  },

  // ========================================
  // ADMIN CROSS-BRAND EVENT ENDPOINTS
  // ========================================

  // POST /api/admin/events
  adminCreate(ctx) {
    return this.create(ctx)
  },

  // GET /api/admin/events/all
  adminGetAll(ctx) {
    return this.getAll(ctx)
  },

  // GET /api/admin/events/calendar/view
  adminGetCalendarView(ctx) {
    return this.getCalendarView(ctx)
  },

  // GET /api/admin/events/:id
  adminGetById(ctx) {
    const { id } = ctx.params

    const event = events.find(e => e.id === id || e.eventCode === id)

    if (!event) {
      return ctx.sendError('Event not found', 404)
    }

    // Get assigned vehicles details
    const assignedVehicles = eventVehicles.filter(ev => ev.eventId === event.id)

    ctx.sendJSON({
      success: true,
      data: {
        ...event,
        vehiclesDetails: assignedVehicles
      }
    })
  },

  // PATCH /api/admin/events/:id
  adminUpdate(ctx) {
    return this.update(ctx)
  },

  // DELETE /api/admin/events/:id
  adminDelete(ctx) {
    return this.deleteEvent(ctx)
  }
}
