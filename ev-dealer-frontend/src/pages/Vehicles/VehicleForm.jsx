/**
 * Vehicle Form (Add/Edit)
 * TODO: Implement form with:
 * - Model name
 * - Type selection
 * - Price
 * - Battery capacity
 * - Range
 * - Color variants
 * - Image upload
 * - Stock quantity
 * - Dealer assignment
 */

const VehicleForm = () => {
  return (
    <div className="vehicle-form-page">
      <h1>Add New Vehicle</h1>
      <form>
        <input type="text" placeholder="Model Name" />
        <select>
          <option>Select Type</option>
          <option>Sedan</option>
          <option>SUV</option>
        </select>
        <input type="number" placeholder="Price" />
        <input type="number" placeholder="Battery Capacity (kWh)" />
        <input type="number" placeholder="Range (miles)" />
        <input type="file" multiple />
        <button type="submit">Save Vehicle</button>
      </form>
    </div>
  )
}

export default VehicleForm

