// React
import React from 'react';

// Relative
import Alert from './Alert';

export default function CustomAlert({
  severity,
  variant,
  title,
  children,
  dismissible = false,
  onClose,
  action,
  sx,
  ...rest
}) {
  const resolvedSeverity = severity ?? variant ?? 'info';
  return (
    <Alert
      severity={resolvedSeverity}
      title={title}
      dismissible={dismissible}
      onClose={onClose}
      action={action}
      sx={sx}
      {...rest}
    >
      {children}
    </Alert>
  );
}
