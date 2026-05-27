// React
import React, { useMemo, useState } from 'react';

// External
import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

// Relative
import CodeSnippet from './CodeSnippet';
import CodeSnippetActions from './CodeSnippetActions';

export default function MultiTabCodeSnippet({
  title,
  files = [],
  maxHeight = 420,
  showLineNumbers = false,
  copy = true,
  defaultTab = 0,
  sx,
}) {
  const tabs = useMemo(() => {
    if (!Array.isArray(files) || files.length === 0) return [];
    return files.map((file, i) => ({
      key: file.key ?? file.filename ?? `tab-${i}`,
      filename: file.filename ?? file.label ?? `tab-${i + 1}`,
      language: file.language ?? 'plaintext',
      code: file.code ?? '',
    }));
  }, [files]);

  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, Math.min(defaultTab, Math.max(0, tabs.length - 1))),
  );

  if (tabs.length === 0) {
    return (
      <CodeSnippet
        title={title}
        code=""
        maxHeight={maxHeight}
        showLineNumbers={showLineNumbers}
        copy={copy}
      />
    );
  }

  const isMulti = tabs.length > 1;
  const active = tabs[Math.min(activeIndex, tabs.length - 1)];

  if (!isMulti) {
    return (
      <Box sx={sx}>
        {title ? (
          <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            {title}
          </Typography>
        ) : null}
        <CodeSnippet
          filename={active.filename}
          language={active.language}
          code={active.code}
          maxHeight={maxHeight}
          showLineNumbers={showLineNumbers}
          copy={copy}
        />
      </Box>
    );
  }

  return (
    <Box sx={[{ my: 0 }, ...(Array.isArray(sx) ? sx : [sx].filter(Boolean))]}>
      {title ? (
        <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          {title}
        </Typography>
      ) : null}

      <Box
        sx={(theme) => ({
          borderRadius: 2,
          border: '1px solid',
          borderColor: theme.palette.divider,
          overflow: 'hidden',
          backgroundColor:
            theme.palette.mode === 'dark' ? alpha('#000', 0.35) : theme.palette.background.paper,
        })}
      >
        <Stack
          sx={(theme) => ({
            flexDirection: 'row',
            alignItems: 'stretch',
            borderBottom: '1px solid',
            borderColor: theme.palette.divider,
            backgroundColor:
              theme.palette.mode === 'dark'
                ? alpha('#fff', 0.04)
                : alpha(theme.palette.text.primary, 0.03),
            minHeight: 40,
          })}
        >
          <Tabs
            value={activeIndex}
            onChange={(_e, value) => setActiveIndex(value)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              flex: 1,
              minWidth: 0,
              minHeight: 40,
              '& .MuiTabs-flexContainer': {
                alignItems: 'center',
                height: 40,
              },
              '& .MuiTabs-indicator': { height: 2 },
              '& .MuiTab-root': {
                minHeight: 40,
                height: 40,
                py: 0,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                color: 'text.secondary',
                '&.Mui-selected': { color: 'primary.main' },
              },
            }}
          >
            {tabs.map((tab) => (
              <Tab key={tab.key} label={tab.filename} />
            ))}
          </Tabs>

          <CodeSnippetActions language={active.language} code={active.code} copy={copy} />
        </Stack>

        <CodeSnippet
          bodyOnly
          code={active.code}
          language={active.language}
          copy={false}
          showLineNumbers={showLineNumbers}
          maxHeight={maxHeight}
        />
      </Box>
    </Box>
  );
}
