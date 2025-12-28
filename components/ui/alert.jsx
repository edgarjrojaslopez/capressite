// components/ui/alert.jsx
import { forwardRef } from 'react';

const Alert = forwardRef(({
  className = '',
  variant = 'default',
  ...props
}, ref) => {
  const variants = {
    default: 'bg-gray-50 text-gray-900 border-gray-200',
    destructive: 'bg-red-50 text-red-900 border-red-200'
  };

  const classes = `relative w-full rounded-lg border p-4 ${variants[variant]} ${className}`;

  return (
    <div
      className={classes}
      ref={ref}
      role="alert"
      {...props}
    />
  );
});

Alert.displayName = 'Alert';

const AlertDescription = forwardRef(({
  className = '',
  ...props
}, ref) => {
  const classes = `text-sm ${className}`;

  return (
    <div
      className={classes}
      ref={ref}
      {...props}
    />
  );
});

AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertDescription };
