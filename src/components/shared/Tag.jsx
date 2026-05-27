// React
import React from 'react';

// External
import { Chip } from '@mui/material';
import { alpha } from '@mui/material/styles';

// Relative
import { getTagColor } from '../../utils/getTagColor';

const SIZES = {
  xs: { height: 20, fontSize: '0.65rem', px: 0.75 },
  sm: { height: 22, fontSize: '0.7rem', px: 1 },
  md: { height: 26, fontSize: '0.75rem', px: 1 },
  lg: { height: 30, fontSize: '0.8125rem', px: 1.25 },
};

export default function Tag({
  label,
  size = 'sm',
  color,
  variant = 'soft',
  onClick,
  onDelete,
  selected = false,
  sx,
  ...rest
}) {
  if (!label) return null;
  const sizing = SIZES[size] ?? SIZES.sm;

  return (
    <Chip
      label={label}
      onClick={onClick}
      onDelete={onDelete}
      clickable={Boolean(onClick)}
      sx={[
        (theme) => {
          const c = color || getTagColor(label);
          const isDark = theme.palette.mode === 'dark';
          const baseSoft = {
            color: isDark ? alpha(c, 0.95) : c,
            backgroundColor: alpha(c, isDark ? 0.18 : 0.1),
            border: '1px solid',
            borderColor: alpha(c, isDark ? 0.4 : 0.3),
          };
          const baseOutline = {
            color: isDark ? alpha(c, 0.95) : c,
            backgroundColor: 'transparent',
            border: '1px solid',
            borderColor: alpha(c, isDark ? 0.55 : 0.45),
          };
          const baseSolid = {
            color: theme.palette.getContrastText(c),
            backgroundColor: c,
            border: '1px solid',
            borderColor: c,
          };
          const variantStyles =
            variant === 'outline' ? baseOutline : variant === 'solid' ? baseSolid : baseSoft;
          const selectedStyles = selected
            ? { color: theme.palette.getContrastText(c), backgroundColor: c, borderColor: c }
            : null;

          return {
            height: sizing.height,
            fontSize: sizing.fontSize,
            fontWeight: 600,
            m: 0,
            '& .MuiChip-label': { px: sizing.px },
            ...variantStyles,
            ...selectedStyles,
          };
        },
        ...(Array.isArray(sx) ? sx : [sx].filter(Boolean)),
      ]}
      {...rest}
    />
  );
}
