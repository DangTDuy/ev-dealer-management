/**
 * Reusable Button Component
 * TODO: Implement button with variants (primary, secondary, danger, etc.)
 */

const Button = ({ children, onClick, variant = 'primary', ...props }) => {
  return (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  )
}

export default Button

