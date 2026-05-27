// React
import React, { useState } from 'react';

// External
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material';

// Relative
import { getCodeLangLabel, normalizeCodeLang } from './codeSnippetLang';

/**
 * Language label, vertical divider, and copy button — single row, vertically centered.
 *
 * @param {object} props
 * @param {string} props.language
 * @param {string} props.code
 * @param {boolean} [props.copy=true]
 */
export default function CodeSnippetActions({ language, code, copy = true }) {
  const langLabel = getCodeLangLabel(normalizeCodeLang(language));
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code ?? '');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  if (!copy) return null;

  return (
    <Stack
      sx={{
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 0,
        height: 40,
        px: 1.25,
        gap: 0.75,
      }}
    >
      <Typography
        variant="caption"
        component="span"
        sx={{
          color: 'text.secondary',
          fontWeight: 600,
          fontSize: '0.7rem',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        {langLabel}
      </Typography>
      <Divider
        orientation="vertical"
        flexItem
        sx={{ alignSelf: 'center', height: 18, borderColor: 'divider' }}
      />
      <Tooltip title={copied ? 'Copied!' : 'Copy code'} placement="top">
        <IconButton
          size="small"
          onClick={handleCopy}
          aria-label="Copy code"
          sx={{
            p: 0.5,
            color: copied ? 'success.main' : 'text.secondary',
            '&:hover': { color: 'primary.main' },
          }}
        >
          {copied ? (
            <CheckRoundedIcon fontSize="small" />
          ) : (
            <ContentCopyRoundedIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
