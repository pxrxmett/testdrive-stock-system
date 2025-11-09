// Mock API endpoints for LINE Users Management
// These are development endpoints - replace with real backend implementation

// Mock data
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

const staffList = [
  { id: 'staff-1', name: 'นายสมศักดิ์ ขายดี', role: 'Sales Manager' },
  { id: 'staff-2', name: 'นางสาวพิมพ์ใจ บริการดี', role: 'Sales Executive' },
  { id: 'staff-3', name: 'นายชัยวัฒน์ ใจเย็น', role: 'Sales Executive' },
  { id: 'staff-4', name: 'นางสาวอรุณี สดใส', role: 'Customer Service' }
]

// Helper to parse request body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (e) {
        resolve({})
      }
    })
    req.on('error', reject)
  })
}

// Helper to send JSON response
function sendJSON(res, data, statusCode = 200) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

// Main middleware handler
module.exports = async function (req, res, next) {
  const url = req.url
  const method = req.method

  console.log(`📥 ${method} ${url}`)

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (method === 'OPTIONS') {
    res.statusCode = 200
    res.end()
    return
  }

  // Get pending users
  if (url === '/api/line-users/pending' && method === 'GET') {
    return sendJSON(res, pendingUsers)
  }

  // Get linked users
  if (url === '/api/line-users/linked' && method === 'GET') {
    return sendJSON(res, linkedUsers)
  }

  // Get staff list
  if (url === '/api/staff' && method === 'GET') {
    return sendJSON(res, staffList)
  }

  // Link user to staff
  if (url.match(/^\/api\/line-users\/[^/]+\/link$/) && method === 'POST') {
    const id = url.split('/')[3]
    const body = await parseBody(req)
    const { staffId } = body

    // Find pending user
    const userIndex = pendingUsers.findIndex(u => u.id === id)
    if (userIndex === -1) {
      return sendJSON(res, { error: 'User not found' }, 404)
    }

    // Find staff
    const staff = staffList.find(s => s.id === staffId)
    if (!staff) {
      return sendJSON(res, { error: 'Staff not found' }, 404)
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

    return sendJSON(res, {
      success: true,
      message: 'User linked successfully',
      data: linkedUser
    })
  }

  // Unlink user
  if (url.match(/^\/api\/line-users\/[^/]+\/unlink$/) && method === 'POST') {
    const id = url.split('/')[3]

    // Find linked user
    const userIndex = linkedUsers.findIndex(u => u.id === id)
    if (userIndex === -1) {
      return sendJSON(res, { error: 'User not found' }, 404)
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

    return sendJSON(res, {
      success: true,
      message: 'User unlinked successfully',
      data: pendingUser
    })
  }

  // If no route matched, pass to next middleware
  next()
}
