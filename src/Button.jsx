const Button = ({ onClick, active, children, fullWidth }) => (
  <button
    style={
      active
        ? {
            color: 'cadetblue',
            backgroundColor: '#000',
            ...(fullWidth && { width: '100%' }),
          }
        : { ...(fullWidth && { width: '100%' }) }
    }
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
