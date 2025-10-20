/**
 * Test Drive Scheduling Form
 * TODO: Implement form with:
 * - Customer selection
 * - Vehicle selection
 * - Date and time picker
 * - Duration
 * - Notes
 * - Schedule button
 */

const TestDriveForm = () => {
  return (
    <div className="test-drive-form-page">
      <h1>Schedule Test Drive</h1>
      <form>
        <select>
          <option>Select Customer</option>
        </select>
        <select>
          <option>Select Vehicle</option>
        </select>
        <input type="date" placeholder="Date" />
        <input type="time" placeholder="Time" />
        <select>
          <option>Duration</option>
          <option>30 minutes</option>
          <option>1 hour</option>
          <option>2 hours</option>
        </select>
        <textarea placeholder="Notes"></textarea>
        <button type="submit">Schedule</button>
      </form>
    </div>
  )
}

export default TestDriveForm

