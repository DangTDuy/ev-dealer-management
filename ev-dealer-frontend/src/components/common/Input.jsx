/**
 * Input Component
 * TODO: Implement input with label, error message, validation
 */

const Input = ({ label, error, type = 'text', ...props }) => {
  return (
    <div className="input-group">
      {label && <label>{label}</label>}
      <input type={type} {...props} />
      {error && <span className="error">{error}</span>}
    </div>
  )
}

export default Input

