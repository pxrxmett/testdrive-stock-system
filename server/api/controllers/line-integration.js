// LINE Integration Controller - LINE user and staff linking

// Import staff data (in production, this would be from database)
let pendingUsers = [
  {
    id: '1',
    lineUserId: 'U1234567890abcdef',
    displayName: 'สมชาย ใจดี',
    pictureUrl: 'https://via.placeholder.com/150',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    lineUserId: 'U2234567890abcdef',
    displayName: 'สมหญิง รักงาน',
    pictureUrl: 'https://via.placeholder.com/150',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    lineUserId: 'U3234567890abcdef',
    displayName: 'ประเสริฐ มีชัย',
    pictureUrl: 'https://via.placeholder.com/150',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
]

let linkedUsers = [
  {
    id: '101',
    lineUserId: 'U1111111111abcdef',
    displayName: 'วิชัย สุขสำราญ',
    pictureUrl: 'https://via.placeholder.com/150',
    staffId: 'staff-1',
    staffName: 'นายสมศักดิ์ ขายดี',
    staffRole: 'Sales Manager',
    linkedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  }
]

// Mock staff list (this would normally come from staff controller)
const staffList = [
  { id: 'staff-1', name: 'นายสมศักดิ์ ขายดี', role: 'Sales Manager', brandCode: 'ISUZU' },
  { id: 'staff-2', name: 'นางสาวพิมพ์ใจ บริการดี', role: 'Sales Executive', brandCode: 'ISUZU' },
  { id: 'staff-3', name: 'นายชัยวัฒน์ ใจเย็น', role: 'Sales Executive', brandCode: 'BYD' },
  { id: 'staff-4', name: 'นางสาวอรุณี สดใส', role: 'Customer Service', brandCode: 'BYD' }
]

let nextId = 4

module.exports = {
  // POST /api/line-integration/check
  check(ctx) {
    const { lineUserId } = ctx.body

    if (!lineUserId) {
      return ctx.sendError('LINE user ID is required', 400)
    }

    // Check if user is already linked
    const linkedUser = linkedUsers.find(u => u.lineUserId === lineUserId)

    if (linkedUser) {
      return ctx.sendJSON({
        success: true,
        isRegistered: true,
        data: linkedUser
      })
    }

    // Check if user is pending
    const pendingUser = pendingUsers.find(u => u.lineUserId === lineUserId)

    if (pendingUser) {
      return ctx.sendJSON({
        success: true,
        isRegistered: false,
        isPending: true,
        data: pendingUser
      })
    }

    // User not found
    ctx.sendJSON({
      success: true,
      isRegistered: false,
      isPending: false,
      data: null
    })
  },

  // POST /api/line-integration/link
  link(ctx) {
    const { lineUserId, lineAccessToken, staffId } = ctx.body

    if (!lineUserId || !staffId) {
      return ctx.sendError('LINE user ID and staff ID are required', 400)
    }

    // In production, verify the LINE access token here
    // For now, we'll just proceed with the linking

    // Find staff
    const staff = staffList.find(s => s.id === staffId)

    if (!staff) {
      return ctx.sendError('Staff not found', 404)
    }

    // Check if staff is already linked
    const existingLink = linkedUsers.find(u => u.staffId === staffId)

    if (existingLink) {
      return ctx.sendError('Staff already linked to another LINE account', 400)
    }

    // Find pending user or create new
    let user = pendingUsers.find(u => u.lineUserId === lineUserId)

    if (user) {
      // Remove from pending
      pendingUsers = pendingUsers.filter(u => u.lineUserId !== lineUserId)
    } else {
      user = {
        id: String(nextId++),
        lineUserId,
        displayName: 'LINE User',
        pictureUrl: null,
        createdAt: new Date().toISOString()
      }
    }

    // Add to linked users
    const linkedUser = {
      ...user,
      staffId,
      staffName: staff.name,
      staffRole: staff.role,
      linkedAt: new Date().toISOString()
    }

    linkedUsers.push(linkedUser)

    ctx.sendJSON({
      success: true,
      message: 'LINE account linked successfully',
      data: linkedUser
    })
  },

  // POST /api/line-integration/link-simple
  linkSimple(ctx) {
    const { lineUserId, displayName, pictureUrl, staffCode } = ctx.body

    if (!lineUserId || !staffCode) {
      return ctx.sendError('LINE user ID and staff code are required', 400)
    }

    // Find staff by code
    const staff = staffList.find(s => s.id === staffCode)

    if (!staff) {
      return ctx.sendError('Invalid staff code', 404)
    }

    // Check if staff is already linked
    const existingLink = linkedUsers.find(u => u.staffId === staffCode)

    if (existingLink) {
      return ctx.sendError('Staff already linked to another LINE account', 400)
    }

    // Check if LINE user is already linked
    const existingLineUser = linkedUsers.find(u => u.lineUserId === lineUserId)

    if (existingLineUser) {
      return ctx.sendError('LINE account already linked to another staff', 400)
    }

    // Remove from pending if exists
    pendingUsers = pendingUsers.filter(u => u.lineUserId !== lineUserId)

    // Add to linked users
    const linkedUser = {
      id: String(nextId++),
      lineUserId,
      displayName: displayName || 'LINE User',
      pictureUrl: pictureUrl || null,
      staffId: staffCode,
      staffName: staff.name,
      staffRole: staff.role,
      linkedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }

    linkedUsers.push(linkedUser)

    ctx.sendJSON({
      success: true,
      message: 'LINE account linked successfully',
      data: linkedUser
    })
  },

  // GET /api/line-integration/staff/:id
  getStaff(ctx) {
    const { id } = ctx.params

    const staff = staffList.find(s => s.id === id)

    if (!staff) {
      return ctx.sendError('Staff not found', 404)
    }

    // Check if staff is linked to LINE
    const lineLink = linkedUsers.find(u => u.staffId === id)

    ctx.sendJSON({
      success: true,
      data: {
        ...staff,
        lineIntegration: lineLink ? {
          lineUserId: lineLink.lineUserId,
          displayName: lineLink.displayName,
          linkedAt: lineLink.linkedAt
        } : null
      }
    })
  },

  // GET /api/line-integration/pending-users
  getPendingUsers(ctx) {
    ctx.sendJSON({
      success: true,
      data: pendingUsers,
      total: pendingUsers.length
    })
  },

  // GET /api/line-integration/linked-users
  getLinkedUsers(ctx) {
    ctx.sendJSON({
      success: true,
      data: linkedUsers,
      total: linkedUsers.length
    })
  },

  // POST /api/line-integration/admin-link
  adminLink(ctx) {
    const { lineUserId, staffId } = ctx.body

    if (!lineUserId || !staffId) {
      return ctx.sendError('LINE user ID and staff ID are required', 400)
    }

    // Find pending user
    const userIndex = pendingUsers.findIndex(u => u.lineUserId === lineUserId)

    if (userIndex === -1) {
      return ctx.sendError('Pending user not found', 404)
    }

    // Find staff
    const staff = staffList.find(s => s.id === staffId)

    if (!staff) {
      return ctx.sendError('Staff not found', 404)
    }

    // Check if staff is already linked
    const existingLink = linkedUsers.find(u => u.staffId === staffId)

    if (existingLink) {
      return ctx.sendError('Staff already linked to another LINE account', 400)
    }

    // Move from pending to linked
    const user = pendingUsers[userIndex]
    pendingUsers.splice(userIndex, 1)

    const linkedUser = {
      ...user,
      staffId,
      staffName: staff.name,
      staffRole: staff.role,
      linkedAt: new Date().toISOString()
    }

    linkedUsers.push(linkedUser)

    ctx.sendJSON({
      success: true,
      message: 'User linked successfully',
      data: linkedUser
    })
  },

  // DELETE /api/line-integration/unlink/:lineUserId
  unlink(ctx) {
    const { lineUserId } = ctx.params

    // Find linked user
    const userIndex = linkedUsers.findIndex(u => u.lineUserId === lineUserId)

    if (userIndex === -1) {
      return ctx.sendError('Linked user not found', 404)
    }

    // Move from linked to pending
    const user = linkedUsers[userIndex]
    linkedUsers.splice(userIndex, 1)

    const pendingUser = {
      id: user.id,
      lineUserId: user.lineUserId,
      displayName: user.displayName,
      pictureUrl: user.pictureUrl,
      createdAt: user.createdAt
    }

    pendingUsers.push(pendingUser)

    ctx.sendJSON({
      success: true,
      message: 'User unlinked successfully',
      data: pendingUser
    })
  }
}
