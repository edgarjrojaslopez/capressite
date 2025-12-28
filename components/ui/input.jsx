// components/ui/input.jsx
import { forwardRef } from 'react';

const Input = forwardRef(({
  className = '',
  type = 'text',
  ...props
}, ref) => {
  const classes = `flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`;

  return (
    <input
      type={type}
      className={classes}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
