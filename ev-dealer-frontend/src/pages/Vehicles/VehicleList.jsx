/**
 * Vehicle List Page
 * TODO: Implement vehicle list with:
 * - Search bar
 * - Filters (type, price range, dealer, stock status)
 * - Table with columns: Image, Model, Type, Price, Stock, Dealer, Actions
 * - Pagination
 * - Add New Vehicle button
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([])
  const navigate = useNavigate()

  return (
    <div className="vehicle-list-page">
      <div className="page-header">
        <h1>Vehicles</h1>
        <button onClick={() => navigate('/vehicles/new')}>Add New Vehicle</button>
      </div>

      {/* Search and Filters */}
      <div className="filters">
        <input type="search" placeholder="Search vehicles..." />
        <select>
          <option>All Types</option>
          <option>Sedan</option>
          <option>SUV</option>
        </select>
        <select>
          <option>All Dealers</option>
        </select>
      </div>

      {/* Vehicle Table */}
      <div className="vehicle-table">
        {/* TODO: Add Table component */}
        <p>Vehicle list will be displayed here</p>
      </div>
    </div>
  )
}

export default VehicleList

