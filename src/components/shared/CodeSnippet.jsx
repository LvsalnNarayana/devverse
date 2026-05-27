// React
import React, { useEffect, useRef } from 'react';

// External
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { Box, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';

// Relative
import CodeSnippetActions from './CodeSnippetActions';
import { getCodeSnippetSurfaceSx } from './codeSnippetTheme';
import { normalizeCodeLang } from './codeSnippetLang';

/**
 * @param {object} props
 * @param {boolean} [props.bodyOnly]  Code body only (toolbar rendered elsewhere).
 */
export default function CodeSnippet({
  code = '',
  language = 'plaintext',
  filename,
  title,
  showLineNumbers = false,
  copy = true,
  maxHeight = 420,
  bodyOnly = false,
  showFilename = true,
  sx,
}) {
  const codeRef = useRef(null);
  const lang = normalizeCodeLang(language);
  const headerLabel = showFilename ? filename || title : null;

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, lang]);

  const codeBody = (
    <pre className={`language-${lang}${showLineNumbers ? ' line-numbers' : ''}`}>
      <code ref={codeRef} className={`language-${lang}`}>
        {code ?? ''}
      </code>
    </pre>
  );

  if (bodyOnly) {
    return (
      <Box
        sx={[
          (theme) => getCodeSnippetSurfaceSx(theme, { maxHeight, embedded: true }),
          ...(Array.isArray(sx) ? sx : [sx].filter(Boolean)),
        ]}
      >
        {codeBody}
      </Box>
    );
  }

  return (
    <Box
      sx={[
        (theme) => getCodeSnippetSurfaceSx(theme, { maxHeight, embedded: false }),
        ...(Array.isArray(sx) ? sx : [sx].filter(Boolean)),
      ]}
    >
      <Stack
        sx={(theme) => ({
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 40,
          borderBottom: '1px solid',
          borderColor: theme.palette.divider,
          backgroundColor:
            theme.palette.mode === 'dark'
              ? alpha('#fff', 0.04)
              : alpha(theme.palette.text.primary, 0.04),
        })}
      >
        <Stack
          sx={{
            alignItems: 'center',
            flexDirection: 'row',
            gap: 0.75,
            minWidth: 0,
            flex: 1,
            px: 1.5,
            height: 40,
          }}
        >
          {headerLabel ? (
            <>
              <InsertDriveFileOutlinedIcon
                sx={{ fontSize: 18, color: 'text.secondary', flexShrink: 0 }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={headerLabel}
              >
                {headerLabel}
              </Typography>
            </>
          ) : null}
        </Stack>
        <CodeSnippetActions language={lang} code={code} copy={copy} />
      </Stack>
      {codeBody}
    </Box>
  );
}
