/**
 * Create Quote Page
 * TODO: Implement quote creation form with:
 * - Customer selection/creation
 * - Vehicle selection
 * - Quantity
 * - Price adjustment
 * - Discount
 * - Payment type (Full, Installment, Lease)
 * - Notes
 * - Generate quote button
 */

const QuoteCreate = () => {
  return (
    <div className="quote-create-page">
      <h1>Create New Quote</h1>
      <form>
        <div className="form-section">
          <h3>Customer Information</h3>
          <select>
            <option>Select Customer</option>
          </select>
          <button type="button">+ New Customer</button>
        </div>

        <div className="form-section">
          <h3>Vehicle Selection</h3>
          <select>
            <option>Select Vehicle</option>
          </select>
          <input type="number" placeholder="Quantity" defaultValue="1" />
        </div>

        <div className="form-section">
          <h3>Pricing</h3>
          <input type="number" placeholder="Base Price" />
          <input type="number" placeholder="Discount %" />
          <select>
            <option>Payment Type</option>
            <option>Full Payment</option>
            <option>Installment</option>
            <option>Lease</option>
          </select>
        </div>

        <textarea placeholder="Notes"></textarea>
        <button type="submit">Generate Quote</button>
      </form>
    </div>
  )
}

export default QuoteCreate

