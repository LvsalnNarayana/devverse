// React
import React, { useState } from 'react';

// External
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import {
  Alert as MuiAlert,
  AlertTitle,
  Box,
  Collapse,
  IconButton,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

const SEVERITY_PRESETS = {
  info: { paletteKey: 'info', icon: InfoOutlinedIcon },
  warning: { paletteKey: 'warning', icon: WarningAmberRoundedIcon },
  error: { paletteKey: 'error', icon: ErrorOutlineRoundedIcon },
  success: { paletteKey: 'success', icon: CheckCircleOutlineRoundedIcon },
  tip: { paletteKey: 'primary', icon: LightbulbOutlinedIcon },
  note: { paletteKey: 'info', icon: InfoOutlinedIcon },
};

/**
 * @param {object} props
 * @param {'info'|'warning'|'error'|'success'|'tip'|'note'} [props.severity='info']
 */
export default function Alert({
  severity = 'info',
  title,
  children,
  dismissible = false,
  onClose,
  action,
  sx,
  ...rest
}) {
  const [open, setOpen] = useState(true);
  const preset = SEVERITY_PRESETS[severity] ?? SEVERITY_PRESETS.info;
  const Icon = preset.icon;
  const muiSeverity = severity === 'tip' || severity === 'note' ? 'info' : severity;

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <Collapse in={open} unmountOnExit>
      <MuiAlert
        severity={muiSeverity}
        icon={<Icon fontSize="inherit" />}
        action={
          dismissible ? (
            <IconButton
              aria-label="close"
              size="small"
              onClick={handleClose}
              sx={{ color: 'inherit' }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          ) : (
            (action ?? null)
          )
        }
        sx={[
          (theme) => {
            const c = theme.palette[preset.paletteKey].main;
            const isDark = theme.palette.mode === 'dark';
            return {
              alignItems: title ? 'flex-start' : 'center',
              borderRadius: 2,
              border: '1px solid',
              borderColor: alpha(c, isDark ? 0.45 : 0.3),
              backgroundColor: alpha(c, isDark ? 0.12 : 0.07),
              color: theme.palette.text.primary,
              '& .MuiAlert-icon': {
                color: c,
                opacity: 1,
                fontSize: '1.4rem',
                py: 0.5,
              },
              '& .MuiAlert-message': {
                width: '100%',
                color: theme.palette.text.primary,
                py: 0.5,
              },
              '& .MuiAlert-action': { pt: 0.5, color: c },
              '& a': {
                color: c,
                textDecorationColor: alpha(c, 0.5),
                fontWeight: 600,
              },
              '& code': {
                px: 0.75,
                py: 0.25,
                borderRadius: 0.75,
                fontSize: '0.85em',
                bgcolor: alpha(c, isDark ? 0.22 : 0.12),
              },
            };
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
        {...rest}
      >
        {title ? <AlertTitle sx={{ fontWeight: 700, mb: 0.5 }}>{title}</AlertTitle> : null}
        <Box component="div">{children}</Box>
      </MuiAlert>
    </Collapse>
  );
}
