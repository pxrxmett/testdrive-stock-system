// Analytics Controller - Dashboard statistics and analytics

module.exports = {
  // GET /api/analytics/dashboard
  getDashboard(ctx) {
    const stats = {
      totalVehicles: 156,
      availableVehicles: 98,
      inServiceVehicles: 35,
      maintenanceVehicles: 12,
      soldVehicles: 11,
      totalTestDrives: 245,
      pendingTestDrives: 18,
      confirmedTestDrives: 32,
      completedTestDrives: 175,
      cancelledTestDrives: 20,
      totalEvents: 23,
      activeEvents: 5,
      upcomingEvents: 8,
      completedEvents: 10,
      totalStaff: 45,
      activeStaff: 42,
      availableSales: 15,
      brands: {
        ISUZU: {
          vehicles: 89,
          testDrives: 142,
          events: 14
        },
        BYD: {
          vehicles: 67,
          testDrives: 103,
          events: 9
        }
      },
      trends: {
        testDrivesGrowth: 12.5,
        salesGrowth: 8.3,
        eventsGrowth: 15.7
      },
      recentActivity: [
        {
          id: '1',
          type: 'test_drive',
          message: 'New test drive booking for ISUZU D-MAX',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString()
        },
        {
          id: '2',
          type: 'event',
          message: 'Event "Bangkok Motor Show" started',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
        },
        {
          id: '3',
          type: 'stock',
          message: 'New vehicle added: BYD ATTO 3',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        }
      ]
    }

    ctx.sendJSON({
      success: true,
      data: stats
    })
  },

  // GET /api/analytics/vehicles/statistics
  getVehicleStatistics(ctx) {
    const stats = {
      total: 156,
      byStatus: {
        available: 98,
        inService: 35,
        maintenance: 12,
        sold: 11
      },
      byBrand: {
        ISUZU: {
          total: 89,
          available: 55,
          inService: 20,
          maintenance: 8,
          sold: 6
        },
        BYD: {
          total: 67,
          available: 43,
          inService: 15,
          maintenance: 4,
          sold: 5
        }
      },
      byModel: [
        { model: 'ISUZU D-MAX', count: 45 },
        { model: 'ISUZU MU-X', count: 32 },
        { model: 'BYD ATTO 3', count: 38 },
        { model: 'BYD DOLPHIN', count: 29 },
        { model: 'ISUZU V-CROSS', count: 12 }
      ],
      byYear: [
        { year: 2024, count: 89 },
        { year: 2023, count: 56 },
        { year: 2022, count: 11 }
      ],
      utilization: {
        averageUtilizationRate: 67.5,
        highDemandModels: ['ISUZU D-MAX', 'BYD ATTO 3'],
        lowDemandModels: ['ISUZU V-CROSS']
      },
      valueMetrics: {
        totalInventoryValue: 234500000,
        averageVehicleValue: 1503205,
        currency: 'THB'
      }
    }

    ctx.sendJSON({
      success: true,
      data: stats
    })
  },

  // GET /api/analytics/events/statistics
  getEventStatistics(ctx) {
    const stats = {
      total: 23,
      byStatus: {
        upcoming: 8,
        active: 5,
        completed: 10,
        cancelled: 0
      },
      byBrand: {
        ISUZU: {
          total: 14,
          active: 3,
          upcoming: 5,
          completed: 6
        },
        BYD: {
          total: 9,
          active: 2,
          upcoming: 3,
          completed: 4
        }
      },
      byType: [
        { type: 'Motor Show', count: 8 },
        { type: 'Test Drive Event', count: 7 },
        { type: 'Product Launch', count: 5 },
        { type: 'Roadshow', count: 3 }
      ],
      vehicleUtilization: {
        totalVehiclesInEvents: 35,
        averageVehiclesPerEvent: 7,
        mostUsedVehicles: [
          { vehicleCode: 'ISZ-001', model: 'ISUZU D-MAX', timesUsed: 12 },
          { vehicleCode: 'BYD-001', model: 'BYD ATTO 3', timesUsed: 10 }
        ]
      },
      performanceMetrics: {
        averageAttendance: 250,
        totalTestDrivesFromEvents: 89,
        conversionRate: 35.6
      },
      upcomingEvents: [
        {
          id: '1',
          name: 'Bangkok Auto Salon 2024',
          startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
          endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString(),
          brand: 'ISUZU',
          vehicleCount: 10
        },
        {
          id: '2',
          name: 'EV Expo Thailand',
          startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
          endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
          brand: 'BYD',
          vehicleCount: 8
        }
      ]
    }

    ctx.sendJSON({
      success: true,
      data: stats
    })
  },

  // GET /api/analytics/test-drives/statistics
  getTestDriveStatistics(ctx) {
    const stats = {
      total: 245,
      byStatus: {
        pending: 18,
        confirmed: 32,
        completed: 175,
        cancelled: 20
      },
      byBrand: {
        ISUZU: {
          total: 142,
          pending: 10,
          confirmed: 18,
          completed: 102,
          cancelled: 12
        },
        BYD: {
          total: 103,
          pending: 8,
          confirmed: 14,
          completed: 73,
          cancelled: 8
        }
      },
      byModel: [
        { model: 'ISUZU D-MAX', count: 78 },
        { model: 'BYD ATTO 3', count: 65 },
        { model: 'ISUZU MU-X', count: 45 },
        { model: 'BYD DOLPHIN', count: 38 },
        { model: 'ISUZU V-CROSS', count: 19 }
      ],
      byMonth: [
        { month: '2024-01', count: 18 },
        { month: '2024-02', count: 22 },
        { month: '2024-03', count: 25 },
        { month: '2024-04', count: 28 },
        { month: '2024-05', count: 31 },
        { month: '2024-06', count: 29 },
        { month: '2024-07', count: 33 },
        { month: '2024-08', count: 30 },
        { month: '2024-09', count: 29 }
      ],
      conversionMetrics: {
        completionRate: 71.4,
        cancellationRate: 8.2,
        averageConversionToSale: 42.3,
        salesFromTestDrives: 74
      },
      customerMetrics: {
        totalUniqueCustomers: 198,
        repeatCustomers: 32,
        averageRating: 4.6,
        feedbackCount: 156
      },
      staffPerformance: [
        { staffId: 'staff-1', name: 'นายสมศักดิ์ ขายดี', testDrives: 45, conversions: 21 },
        { staffId: 'staff-2', name: 'นางสาวพิมพ์ใจ บริการดี', testDrives: 38, conversions: 18 },
        { staffId: 'staff-3', name: 'นายชัยวัฒน์ ใจเย็น', testDrives: 35, conversions: 15 }
      ],
      timeSlotPopularity: {
        morning: 45,
        afternoon: 89,
        evening: 111
      }
    }

    ctx.sendJSON({
      success: true,
      data: stats
    })
  }
}
