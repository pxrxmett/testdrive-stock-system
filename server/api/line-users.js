// Mock API endpoints for LINE Users Management
// These are development endpoints - replace with real backend implementation

const express = require('express')
const app = express()

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

// Middleware
app.use(express.json())

// Get pending users
app.get('/api/line-users/pending', (req, res) => {
  console.log('📥 GET /api/line-users/pending')
  res.json(pendingUsers)
})

// Get linked users
app.get('/api/line-users/linked', (req, res) => {
  console.log('📥 GET /api/line-users/linked')
  res.json(linkedUsers)
})

// Get staff list
app.get('/api/staff', (req, res) => {
  console.log('📥 GET /api/staff')
  res.json(staffList)
})

// Link user to staff
app.post('/api/line-users/:id/link', (req, res) => {
  const { id } = req.params
  const { staffId } = req.body

  console.log(`📥 POST /api/line-users/${id}/link`, { staffId })

  // Find pending user
  const userIndex = pendingUsers.findIndex(u => u.id === id)
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' })
  }

  // Find staff
  const staff = staffList.find(s => s.id === staffId)
  if (!staff) {
    return res.status(404).json({ error: 'Staff not found' })
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

  res.json({
    success: true,
    message: 'User linked successfully',
    data: linkedUser
  })
})

// Unlink user
app.post('/api/line-users/:id/unlink', (req, res) => {
  const { id } = req.params

  console.log(`📥 POST /api/line-users/${id}/unlink`)

  // Find linked user
  const userIndex = linkedUsers.findIndex(u => u.id === id)
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' })
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

  res.json({
    success: true,
    message: 'User unlinked successfully',
    data: pendingUser
  })
})

module.exports = app
