// components/ui/card.jsx
import { forwardRef } from 'react';

const Card = forwardRef(({
  className = '',
  ...props
}, ref) => {
  const classes = `rounded-lg border bg-white text-gray-950 shadow-sm ${className}`;

  return (
    <div
      className={classes}
      ref={ref}
      {...props}
    />
  );
});

Card.displayName = 'Card';

const CardHeader = forwardRef(({
  className = '',
  ...props
}, ref) => {
  const classes = `flex flex-col space-y-1.5 p-6 ${className}`;

  return (
    <div
      className={classes}
      ref={ref}
      {...props}
    />
  );
});

CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef(({
  className = '',
  ...props
}, ref) => {
  const classes = `text-2xl font-semibold leading-none tracking-tight ${className}`;

  return (
    <h3
      className={classes}
      ref={ref}
      {...props}
    />
  );
});

CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef(({
  className = '',
  ...props
}, ref) => {
  const classes = `text-sm text-gray-500 ${className}`;

  return (
    <p
      className={classes}
      ref={ref}
      {...props}
    />
  );
});

CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef(({
  className = '',
  ...props
}, ref) => {
  const classes = `p-6 pt-0 ${className}`;

  return (
    <div
      className={classes}
      ref={ref}
      {...props}
    />
  );
});

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef(({
  className = '',
  ...props
}, ref) => {
  const classes = `flex items-center p-6 pt-0 ${className}`;

  return (
    <div
      className={classes}
      ref={ref}
      {...props}
    />
  );
});

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
