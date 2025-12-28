// components/ui/label.jsx
import { forwardRef } from 'react';

const Label = forwardRef(({
  className = '',
  ...props
}, ref) => {
  const classes = `text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`;

  return (
    <label
      className={classes}
      ref={ref}
      {...props}
    />
  );
});

Label.displayName = 'Label';

export { Label };
