// Users Controller - User profile and settings management
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'stock-management-secret-key-change-in-production'

// Mock user settings database
const userSettings = {}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

function getUserFromRequest(ctx) {
  const authHeader = ctx.req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  return verifyToken(token)
}

module.exports = {
  // GET /api/users/profile
  getProfile(ctx) {
    const user = getUserFromRequest(ctx)

    if (!user) {
      return ctx.sendError('Unauthorized', 401)
    }

    // Return user profile
    ctx.sendJSON({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        brandCode: user.brandCode,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        pictureUrl: user.pictureUrl || null
      }
    })
  },

  // PATCH /api/users/profile
  updateProfile(ctx) {
    const user = getUserFromRequest(ctx)

    if (!user) {
      return ctx.sendError('Unauthorized', 401)
    }

    const updates = ctx.body

    // Validate and update profile fields
    const allowedFields = ['firstName', 'lastName', 'phoneNumber', 'email']
    const updatedFields = {}

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updatedFields[field] = updates[field]
      }
    }

    ctx.sendJSON({
      success: true,
      message: 'Profile updated successfully',
      data: {
        ...user,
        ...updatedFields
      }
    })
  },

  // GET /api/users/settings
  getSettings(ctx) {
    const user = getUserFromRequest(ctx)

    if (!user) {
      return ctx.sendError('Unauthorized', 401)
    }

    const settings = userSettings[user.id] || {
      notifications: {
        email: true,
        line: true,
        testDriveReminder: true,
        eventReminder: true,
        stockAlert: true
      },
      system: {
        language: 'th',
        theme: 'light',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h'
      }
    }

    ctx.sendJSON({
      success: true,
      data: settings
    })
  },

  // PATCH /api/users/settings/notifications
  updateNotificationSettings(ctx) {
    const user = getUserFromRequest(ctx)

    if (!user) {
      return ctx.sendError('Unauthorized', 401)
    }

    const { email, line, testDriveReminder, eventReminder, stockAlert } = ctx.body

    if (!userSettings[user.id]) {
      userSettings[user.id] = {
        notifications: {},
        system: {}
      }
    }

    userSettings[user.id].notifications = {
      email: email !== undefined ? email : true,
      line: line !== undefined ? line : true,
      testDriveReminder: testDriveReminder !== undefined ? testDriveReminder : true,
      eventReminder: eventReminder !== undefined ? eventReminder : true,
      stockAlert: stockAlert !== undefined ? stockAlert : true
    }

    ctx.sendJSON({
      success: true,
      message: 'Notification settings updated successfully',
      data: userSettings[user.id].notifications
    })
  },

  // PATCH /api/users/settings/system
  updateSystemSettings(ctx) {
    const user = getUserFromRequest(ctx)

    if (!user) {
      return ctx.sendError('Unauthorized', 401)
    }

    const { language, theme, dateFormat, timeFormat } = ctx.body

    if (!userSettings[user.id]) {
      userSettings[user.id] = {
        notifications: {},
        system: {}
      }
    }

    userSettings[user.id].system = {
      language: language || 'th',
      theme: theme || 'light',
      dateFormat: dateFormat || 'DD/MM/YYYY',
      timeFormat: timeFormat || '24h'
    }

    ctx.sendJSON({
      success: true,
      message: 'System settings updated successfully',
      data: userSettings[user.id].system
    })
  }
}
