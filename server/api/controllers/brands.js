// Brands Controller - Brand management

const brands = [
  {
    id: '1',
    code: 'ISUZU',
    name: 'ISUZU',
    fullName: 'ISUZU Thailand',
    description: 'Leading pickup truck and commercial vehicle manufacturer',
    logo: '/images/brands/isuzu-logo.png',
    color: '#E31937',
    isActive: true,
    contactInfo: {
      phone: '02-123-4567',
      email: 'contact@isuzu.co.th',
      website: 'https://www.isuzu.co.th'
    },
    models: [
      'D-MAX',
      'MU-X',
      'V-CROSS',
      'D-MAX X-SERIES'
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    code: 'BYD',
    name: 'BYD',
    fullName: 'BYD Auto Thailand',
    description: 'Leading electric vehicle manufacturer',
    logo: '/images/brands/byd-logo.png',
    color: '#00A3E0',
    isActive: true,
    contactInfo: {
      phone: '02-234-5678',
      email: 'contact@byd.co.th',
      website: 'https://www.byd.co.th'
    },
    models: [
      'ATTO 3',
      'DOLPHIN',
      'SEAL',
      'YUAN PLUS'
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
]

module.exports = {
  // GET /api/brands
  getAll(ctx) {
    const activeBrands = brands.filter(b => b.isActive)

    ctx.sendJSON({
      success: true,
      data: activeBrands,
      total: activeBrands.length
    })
  },

  // GET /api/brands/:id
  getById(ctx) {
    const { id } = ctx.params

    const brand = brands.find(b => b.id === id)

    if (!brand) {
      return ctx.sendError('Brand not found', 404)
    }

    ctx.sendJSON({
      success: true,
      data: brand
    })
  },

  // GET /api/brands/code/:code
  getByCode(ctx) {
    const { code } = ctx.params

    const brand = brands.find(b => b.code.toUpperCase() === code.toUpperCase())

    if (!brand) {
      return ctx.sendError('Brand not found', 404)
    }

    ctx.sendJSON({
      success: true,
      data: brand
    })
  }
}
