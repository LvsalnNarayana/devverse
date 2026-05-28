// React
import React from 'react';

// External
import { Typography } from '@mui/material';

// Relative
import { containsHtmlMarkup, RICH_HTML_SX } from '../../utils/richHtml';

/**
 * Renders a string as plain text or HTML (when JSON includes tags like `<code>`).
 *
 * @param {object} props
 * @param {unknown} props.content
 * @param {import('@mui/material').TypographyProps['variant']} [props.variant]
 * @param {import('@mui/material').TypographyProps['component']} [props.component]
 * @param {import('@mui/material').TypographyProps['color']} [props.color]
 * @param {number} [props.fontWeight]
 * @param {import('@mui/material').SxProps} [props.sx]
 */
export default function RichText({
  content,
  variant = 'body2',
  component = 'span',
  color,
  fontWeight,
  sx,
}) {
  if (content == null || content === '') {
    return null;
  }

  const text = String(content);

  if (!containsHtmlMarkup(text)) {
    return (
      <Typography
        variant={variant}
        component={component}
        color={color}
        fontWeight={fontWeight}
        sx={sx}
      >
        {text}
      </Typography>
    );
  }

  return (
    <Typography
      variant={variant}
      component={component}
      color={color}
      fontWeight={fontWeight}
      sx={[RICH_HTML_SX, ...(Array.isArray(sx) ? sx : [sx].filter(Boolean))]}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
}
