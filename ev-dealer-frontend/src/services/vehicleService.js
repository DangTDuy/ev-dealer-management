import api from './api'
import { mockVehicles, mockDealers } from '../data/mockVehicles'

const vehicleService = {
  // Get all vehicles with optional filters and pagination
  getVehicles: async (params = {}) => {
    try {
      // For now, use mock data. Replace with API call when backend is ready
      // const response = await api.get('/vehicles', { params })

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      let vehicles = [...mockVehicles]

      // Apply filters
      if (params.search) {
        const searchTerm = params.search.toLowerCase()
        vehicles = vehicles.filter(vehicle =>
          vehicle.model.toLowerCase().includes(searchTerm) ||
          vehicle.type.toLowerCase().includes(searchTerm) ||
          vehicle.dealerName.toLowerCase().includes(searchTerm)
        )
      }

      if (params.type && params.type !== 'all') {
        vehicles = vehicles.filter(vehicle => vehicle.type === params.type)
      }

      if (params.dealerId) {
        vehicles = vehicles.filter(vehicle => vehicle.dealerId === params.dealerId)
      }

      if (params.minPrice) {
        vehicles = vehicles.filter(vehicle => vehicle.price >= parseInt(params.minPrice))
      }

      if (params.maxPrice) {
        vehicles = vehicles.filter(vehicle => vehicle.price <= parseInt(params.maxPrice))
      }

      // Apply pagination
      const page = parseInt(params.page) || 1
      const limit = parseInt(params.limit) || 10
      const offset = (page - 1) * limit
      const total = vehicles.length
      const paginatedVehicles = vehicles.slice(offset, offset + limit)

      return {
        vehicles: paginatedVehicles,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      throw error
    }
  },

  // Get single vehicle by ID
  getVehicleById: async (id) => {
    try {
      // For now, use mock data. Replace with API call when backend is ready
      // const response = await api.get(`/vehicles/${id}`)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))

      const vehicle = mockVehicles.find(v => v.id === parseInt(id))
      if (!vehicle) {
        throw new Error('Vehicle not found')
      }

      return vehicle
    } catch (error) {
      throw error
    }
  },

  // Create new vehicle
  createVehicle: async (vehicleData) => {
    try {
      // For now, simulate API call. Replace with real API when backend is ready
      // const response = await api.post('/vehicles', vehicleData)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))

      // Generate new ID
      const newId = Math.max(...mockVehicles.map(v => v.id)) + 1

      const newVehicle = {
        id: newId,
        ...vehicleData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // In real app, this would be handled by the backend
      console.log('Vehicle created:', newVehicle)

      return newVehicle
    } catch (error) {
      throw error
    }
  },

  // Update existing vehicle
  updateVehicle: async (id, vehicleData) => {
    try {
      // For now, simulate API call. Replace with real API when backend is ready
      // const response = await api.put(`/vehicles/${id}`, vehicleData)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))

      const existingVehicle = mockVehicles.find(v => v.id === parseInt(id))
      if (!existingVehicle) {
        throw new Error('Vehicle not found')
      }

      const updatedVehicle = {
        ...existingVehicle,
        ...vehicleData,
        updatedAt: new Date().toISOString()
      }

      // In real app, this would be handled by the backend
      console.log('Vehicle updated:', updatedVehicle)

      return updatedVehicle
    } catch (error) {
      throw error
    }
  },

  // Delete vehicle
  deleteVehicle: async (id) => {
    try {
      // For now, simulate API call. Replace with real API when backend is ready
      // const response = await api.delete(`/vehicles/${id}`)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200))

      const vehicle = mockVehicles.find(v => v.id === parseInt(id))
      if (!vehicle) {
        throw new Error('Vehicle not found')
      }

      // In real app, this would be handled by the backend
      console.log('Vehicle deleted:', id)

      return { success: true, message: 'Vehicle deleted successfully' }
    } catch (error) {
      throw error
    }
  },

  // Get vehicle types
  getVehicleTypes: async () => {
    try {
      // For now, return mock types. Replace with API call when backend is ready
      // const response = await api.get('/vehicles/types')

      return [
        { value: 'sedan', label: 'Sedan' },
        { value: 'suv', label: 'SUV' },
        { value: 'hatchback', label: 'Hatchback' },
        { value: 'coupe', label: 'Coupe' },
        { value: 'convertible', label: 'Convertible' },
        { value: 'truck', label: 'Truck' }
      ]
    } catch (error) {
      throw error
    }
  },

  // Get dealers
  getDealers: async () => {
    try {
      // For now, return mock dealers. Replace with API call when backend is ready
      // const response = await api.get('/dealers')

      return mockDealers
    } catch (error) {
      throw error
    }
  },

  // Search vehicles
  searchVehicles: async (query) => {
    try {
      // For now, use mock data. Replace with API call when backend is ready
      // const response = await api.get('/vehicles/search', { params: { q: query } })

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))

      const searchTerm = query.toLowerCase()
      const results = mockVehicles.filter(vehicle =>
        vehicle.model.toLowerCase().includes(searchTerm) ||
        vehicle.type.toLowerCase().includes(searchTerm) ||
        vehicle.description.toLowerCase().includes(searchTerm)
      )

      return results
    } catch (error) {
      throw error
    }
  }
}

export default vehicleService
