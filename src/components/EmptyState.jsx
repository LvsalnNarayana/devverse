import { Box, Button, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';
import { Link as RouterLink } from 'react-router-dom';

/**
 * EmptyState — friendly placeholder for empty lists, missing data, or
 * "no results" screens. Centralizes what was previously inline-repeated
 * across the listing pages.
 *
 * @param {object} props
 * @param {React.ComponentType} [props.icon=SearchOffRoundedIcon]
 * @param {string} [props.title='Nothing here yet']
 * @param {React.ReactNode} [props.description]
 * @param {{ label: string, onClick?: () => void, to?: string, href?: string }} [props.action]
 * @param {React.ReactNode} [props.children]   Extra content rendered below the action.
 * @param {object} [props.sx]
 */
export default function EmptyState({
  icon: Icon = SearchOffRoundedIcon,
  title = 'Nothing here yet',
  description,
  action,
  children,
  sx,
}) {
  let actionEl = null;
  if (action) {
    const props = {
      variant: 'outlined',
      size: 'small',
      children: action.label,
    };
    if (action.to) {
      actionEl = <Button component={RouterLink} to={action.to} {...props} />;
    } else if (action.href) {
      actionEl = (
        <Button
          component="a"
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        />
      );
    } else {
      actionEl = <Button onClick={action.onClick} {...props} />;
    }
  }

  return (
    <Stack
      sx={[
        (theme) => ({
          alignItems: 'center',
          textAlign: 'center',
          gap: 1.5,
          py: { xs: 5, md: 7 },
          px: 2,
          borderRadius: 2,
          border: '1px dashed',
          borderColor: theme.palette.divider,
          backgroundColor: alpha(theme.palette.text.primary, 0.02),
        }),
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <Box
        sx={(theme) => ({
          width: 56,
          height: 56,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          color: theme.palette.primary.main,
          mb: 0.5,
        })}
      >
        <Icon sx={{ fontSize: 28 }} />
      </Box>
      <Typography variant="h6" fontWeight={700}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
          {description}
        </Typography>
      )}
      {actionEl && <Box sx={{ mt: 1 }}>{actionEl}</Box>}
      {children}
    </Stack>
  );
}
