// Auth Controller - Authentication endpoints
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'stock-management-secret-key-change-in-production'
const JWT_EXPIRES_IN = '24h'
const REFRESH_TOKEN_EXPIRES_IN = '7d'

// Mock users database
const users = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // In production, this should be hashed
    email: 'admin@stockmanagement.com',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    phoneNumber: '0812345678',
    brandCode: null // Admin can access all brands
  },
  {
    id: '2',
    username: 'isuzu_manager',
    password: 'isuzu123',
    email: 'manager@isuzu.com',
    role: 'manager',
    firstName: 'ISUZU',
    lastName: 'Manager',
    phoneNumber: '0823456789',
    brandCode: 'ISUZU'
  },
  {
    id: '3',
    username: 'byd_manager',
    password: 'byd123',
    email: 'manager@byd.com',
    role: 'manager',
    firstName: 'BYD',
    lastName: 'Manager',
    phoneNumber: '0834567890',
    brandCode: 'BYD'
  },
  {
    id: '4',
    username: 'sales1',
    password: 'sales123',
    email: 'sales1@stockmanagement.com',
    role: 'sales',
    firstName: 'Sales',
    lastName: 'Person 1',
    phoneNumber: '0845678901',
    brandCode: 'ISUZU'
  }
]

// Refresh tokens storage (in production, use Redis or database)
const refreshTokens = new Set()

function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    brandCode: user.brandCode
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

function generateRefreshToken(user) {
  const payload = {
    id: user.id,
    type: 'refresh'
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN })
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

module.exports = {
  // POST /api/auth/login
  login(ctx) {
    const { username, password } = ctx.body

    if (!username || !password) {
      return ctx.sendError('Username and password are required', 400)
    }

    const user = users.find(u => u.username === username && u.password === password)

    if (!user) {
      return ctx.sendError('Invalid username or password', 401)
    }

    const token = generateToken(user)
    const refreshToken = generateRefreshToken(user)
    refreshTokens.add(refreshToken)

    const { password: _, ...userWithoutPassword } = user

    ctx.sendJSON({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token,
        refreshToken,
        expiresIn: JWT_EXPIRES_IN
      }
    })
  },

  // POST /api/auth/line-login
  lineLogin(ctx) {
    const { lineUserId, displayName, pictureUrl, email } = ctx.body

    if (!lineUserId) {
      return ctx.sendError('LINE user ID is required', 400)
    }

    // Find or create user from LINE
    let user = users.find(u => u.lineUserId === lineUserId)

    if (!user) {
      // Create new user from LINE
      user = {
        id: `line-${Date.now()}`,
        lineUserId,
        username: lineUserId,
        email: email || `${lineUserId}@line.local`,
        role: 'user',
        firstName: displayName || 'LINE User',
        lastName: '',
        phoneNumber: '',
        pictureUrl,
        brandCode: null,
        password: null // LINE users don't have password
      }
      users.push(user)
    }

    const token = generateToken(user)
    const refreshToken = generateRefreshToken(user)
    refreshTokens.add(refreshToken)

    const { password: _, ...userWithoutPassword } = user

    ctx.sendJSON({
      success: true,
      message: 'LINE login successful',
      data: {
        user: userWithoutPassword,
        token,
        refreshToken,
        expiresIn: JWT_EXPIRES_IN
      }
    })
  },

  // GET /api/auth/me
  getMe(ctx) {
    const authHeader = ctx.req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ctx.sendError('No token provided', 401)
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return ctx.sendError('Invalid or expired token', 401)
    }

    const user = users.find(u => u.id === decoded.id)

    if (!user) {
      return ctx.sendError('User not found', 404)
    }

    const { password: _, ...userWithoutPassword } = user

    ctx.sendJSON({
      success: true,
      data: userWithoutPassword
    })
  },

  // POST /api/auth/refresh-token
  refreshToken(ctx) {
    const { refreshToken } = ctx.body

    if (!refreshToken) {
      return ctx.sendError('Refresh token is required', 400)
    }

    if (!refreshTokens.has(refreshToken)) {
      return ctx.sendError('Invalid refresh token', 401)
    }

    const decoded = verifyToken(refreshToken)

    if (!decoded || decoded.type !== 'refresh') {
      refreshTokens.delete(refreshToken)
      return ctx.sendError('Invalid refresh token', 401)
    }

    const user = users.find(u => u.id === decoded.id)

    if (!user) {
      refreshTokens.delete(refreshToken)
      return ctx.sendError('User not found', 404)
    }

    // Generate new tokens
    const newToken = generateToken(user)
    const newRefreshToken = generateRefreshToken(user)

    // Remove old refresh token and add new one
    refreshTokens.delete(refreshToken)
    refreshTokens.add(newRefreshToken)

    ctx.sendJSON({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
        expiresIn: JWT_EXPIRES_IN
      }
    })
  },

  // POST /api/auth/change-password
  changePassword(ctx) {
    const authHeader = ctx.req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ctx.sendError('No token provided', 401)
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return ctx.sendError('Invalid or expired token', 401)
    }

    const { currentPassword, newPassword } = ctx.body

    if (!currentPassword || !newPassword) {
      return ctx.sendError('Current password and new password are required', 400)
    }

    if (newPassword.length < 6) {
      return ctx.sendError('New password must be at least 6 characters long', 400)
    }

    const user = users.find(u => u.id === decoded.id)

    if (!user) {
      return ctx.sendError('User not found', 404)
    }

    if (user.password !== currentPassword) {
      return ctx.sendError('Current password is incorrect', 401)
    }

    // Update password
    user.password = newPassword

    ctx.sendJSON({
      success: true,
      message: 'Password changed successfully'
    })
  }
}
