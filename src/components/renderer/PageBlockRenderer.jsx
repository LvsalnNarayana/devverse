// React
import React from 'react';

// External
import { Box, Stack, Typography } from '@mui/material';

// Relative
import {
  Alert,
  BasicTable,
  Carousel,
  CarouselCard,
  CodeSnippet,
  ContentCard,
  CustomAlert,
  Diagram,
  DisplayCard,
  EmptyState,
  Heatmap,
  HtmlContent,
  HowItWorksAlert,
  InfoAlert,
  KeyValueList,
  MermaidDiagram,
  MultiTabCodeSnippet,
  SectionHeader,
  StatCard,
  StepList,
  SubSection,
  Tag,
  TagList,
  VisualizationLegend,
  normalizeHeatmapBlock,
  normalizeTableBlock,
} from '../shared';
import CarouselPlaygroundBlock from '../showcase/CarouselPlaygroundBlock';
import FiltersDemoBlock from '../showcase/FiltersDemoBlock';
import ShowcaseSection from '../showcase/ShowcaseSection';
import { VariantGrid, VariantGroup } from '../showcase/VariantGroup';
import { slugify } from '../../utils/slugify';
import { RICH_HTML_SX } from '../../utils/richHtml';

/**
 * Maps declarative `pageData` blocks to shared page primitives.
 *
 * Block types: typography | contentCard | subsection | table | basicTable |
 * codeSnippet | multiTabCodeSnippet | diagram | mermaidDiagram | alert |
 * customAlert | infoAlert | howItWorks | list | patternCard | sectionHeader |
 * keyValueList | emptyState | heatmap | tag | tags | displayCard |
 * carouselCard | carousel | stepList | statsGrid | legend |
 * showcaseSection | variantGroup | variantGrid | layout |
 * carouselPlayground | filtersDemo
 */

/** @param {Record<string, unknown>} block */
function resolveBlockAnchorId(block) {
  if (typeof block.id === 'string' && block.id.trim()) {
    return block.id.trim();
  }
  if (typeof block.title === 'string' && block.title.trim()) {
    return slugify(block.title);
  }
  return undefined;
}

/** @param {Record<string, unknown>} block */
function resolveListTag(block) {
  if (block.component === 'ol') return 'ol';
  if (block.component === 'ul') return 'ul';
  const variant = block.variant;
  if (variant === 'ordered' || variant === 'ol') return 'ol';
  return 'ul';
}

/** @param {Record<string, unknown>} block */
function resolveAlertSeverity(block) {
  return block.severity ?? block.variant ?? 'info';
}

/** @param {Record<string, unknown>} block */
function resolveMermaidChart(block) {
  const chart = block.chart ?? block.mermaidCode;
  return typeof chart === 'string' ? chart : '';
}

/** @param {Record<string, unknown>} block */
function resolveMultiTabFiles(block) {
  if (Array.isArray(block.files) && block.files.length > 0) return block.files;
  if (!Array.isArray(block.tabs) || block.tabs.length === 0) return undefined;
  return block.tabs.map((tab, i) => {
    const t = /** @type {Record<string, unknown>} */ (tab);
    return {
      filename: t.filename ?? t.label ?? `tab-${i + 1}`,
      language: t.language ?? 'plaintext',
      code: t.code ?? '',
    };
  });
}

/** @param {Record<string, unknown>} block */
function resolveAlertBody(block) {
  const html = block.bodyHtml ?? block.message;
  if (typeof html === 'string' && html.trim()) {
    return <Box component="div" dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return block.children ?? null;
}

/**
 * @param {Record<string, unknown>} block
 * @param {string} key
 * @param {typeof Alert | typeof CustomAlert} AlertComponent
 */
function renderAlertBlock(block, key, AlertComponent) {
  return (
    <AlertComponent
      key={key}
      severity={resolveAlertSeverity(block)}
      variant={block.variant}
      title={block.title ?? undefined}
      dismissible={Boolean(block.dismissible)}
      onClose={block.onClose}
      action={block.action}
      sx={block.sx}
    >
      {resolveAlertBody(block)}
    </AlertComponent>
  );
}

function renderBasicTableBlock(block, key) {
  const { columns, rows } = normalizeTableBlock(block);
  return (
    <BasicTable
      key={key}
      columns={columns}
      rows={rows}
      title={block.title}
      caption={block.caption}
      dense={Boolean(block.dense)}
      striped={block.striped !== false}
      hover={block.hover !== false}
      stickyHeader={Boolean(block.stickyHeader)}
      maxHeight={block.maxHeight}
      empty={block.empty}
      tableVariant={block.tableVariant}
      onRowClick={typeof block.onRowClick === 'function' ? block.onRowClick : undefined}
      sx={block.sx}
    />
  );
}

/**
 * @param {Record<string, unknown>} block
 * @param {import('react').ReactNode[]} parts
 * @param {string} keyPrefix
 */
function pushContentCardBody(block, parts, keyPrefix) {
  if (Array.isArray(block.paragraphs) && block.paragraphs.length > 0) {
    block.paragraphs.forEach((p, i) => {
      parts.push(
        <HtmlContent
          key={`${keyPrefix}-p-${i}`}
          html={p}
          variant="body1"
          sx={{ mb: 1 }}
        />,
      );
    });
  }
  if (Array.isArray(block.listItems) && block.listItems.length > 0) {
    const ListTag = block.listComponent === 'ol' ? 'ol' : 'ul';
    parts.push(
      <Stack
        key={`${keyPrefix}-ul`}
        component={ListTag}
        sx={{ gap: 1, pl: 2.5, m: 0, ...RICH_HTML_SX, '& li + li': { mt: 0.75 } }}
      >
        {block.listItems.map((item, j) => (
          <Box
            key={j}
            component="li"
            dangerouslySetInnerHTML={{ __html: item }}
          />
        ))}
      </Stack>,
    );
  }
  if (Array.isArray(block.nestedBlocks) && block.nestedBlocks.length > 0) {
    parts.push(
      <Stack
        key={`${keyPrefix}-nested`}
        gap={2}
        sx={{ mt: parts.length ? 1 : 0 }}
      >
        {renderBlocksList(block.nestedBlocks, `${keyPrefix}-n`)}
      </Stack>,
    );
  }
}

/** @param {Record<string, unknown>} slide */
function renderCarouselSlide(slide, slideKey) {
  const slideType = slide.type ?? 'displayCard';
  if (slideType === 'carouselCard') {
    return (
      <CarouselCard
        key={slideKey}
        eyebrow={slide.eyebrow}
        title={slide.title}
        description={slide.description}
        tags={slide.tags}
        maxTags={slide.maxTags}
        to={slide.to}
        href={slide.href}
        ctaLabel={slide.ctaLabel}
      />
    );
  }
  return (
    <DisplayCard
      key={slideKey}
      data={slide.data}
      type={slide.cardType ?? slide.viewType ?? slide.type ?? 'item'}
    />
  );
}

/** @param {string} html */
function stripListItemWrapper(html) {
  if (typeof html !== 'string') return html;
  return html.replace(/^<li[^>]*>/i, '').replace(/<\/li>$/i, '').trim();
}

/** @param {Record<string, unknown>} block */
export function resolveBlockComponentId(block) {
  const id = block.component ?? block.type;
  if (id === 'ol' || id === 'ul') return 'list';
  return id;
}

/**
 * @param {Record<string, unknown>} block
 * @param {string} keySuffix
 */
export function renderBlock(block, keySuffix) {
  const k = `blk-${keySuffix}`;
  const componentId = resolveBlockComponentId(block);

  switch (componentId) {
    case 'typography': {
      const { html, variant = 'body1', color, sx } = block;
      return (
        <Box key={k}>
          <HtmlContent html={html} variant={variant} color={color} sx={sx} />
        </Box>
      );
    }
    case 'contentCard': {
      const parts = [];
      pushContentCardBody(block, parts, keySuffix);
      return (
        <ContentCard
          key={k}
          eyebrow={block.eyebrow}
          subheading={block.subheading}
          variant={block.variant ?? 'outlined'}
          accentColor={block.accentColor}
          sx={block.sx}
        >
          <Stack gap={1.5}>{parts}</Stack>
        </ContentCard>
      );
    }
    case 'subsection':
      return (
        <SubSection key={k} id={resolveBlockAnchorId(block)} title={block.title}>
          <Stack gap={2}>
            {renderBlocksList(block.blocks, `${keySuffix}-sub`)}
          </Stack>
        </SubSection>
      );
    case 'table':
    case 'basicTable':
      return renderBasicTableBlock(block, k);
    case 'codeSnippet':
      return (
        <CodeSnippet
          key={k}
          filename={block.filename ?? block.title}
          title={block.title}
          language={block.language ?? 'plaintext'}
          code={block.code ?? ''}
          showLineNumbers={Boolean(block.showLineNumbers)}
          maxHeight={block.maxHeight}
          copy={block.copy !== false}
        />
      );
    case 'multiTabCodeSnippet':
      return (
        <MultiTabCodeSnippet
          key={k}
          title={block.title}
          files={resolveMultiTabFiles(block)}
          maxHeight={block.maxHeight}
          showLineNumbers={Boolean(block.showLineNumbers)}
        />
      );
    case 'diagram':
      return (
        <Diagram
          key={k}
          title={block.title}
          description={block.description}
          caption={block.caption}
          error={block.error}
          prompt={block.prompt}
          imageSrc={block.imageSrc}
          src={block.src}
          drawioXml={block.drawioXml}
          drawioFilename={block.drawioFilename}
          nodes={block.nodes}
          edges={block.edges}
          width={block.width}
          height={block.height}
          ariaLabel={block.ariaLabel}
          maxXmlHeight={block.maxXmlHeight}
          sx={block.sx}
        />
      );
    case 'mermaidDiagram':
      return (
        <MermaidDiagram
          key={k}
          title={block.title}
          description={block.description}
          caption={block.caption}
          error={block.error}
          prompt={block.prompt}
          chart={resolveMermaidChart(block)}
          sx={block.sx}
        />
      );
    case 'alert':
      return renderAlertBlock(block, k, Alert);
    case 'customAlert':
      return renderAlertBlock(block, k, CustomAlert);
    case 'infoAlert':
      return (
        <InfoAlert
          key={k}
          severity={block.severity}
          title={block.title}
          content={block.content}
        />
      );
    case 'howItWorks':
      return (
        <HowItWorksAlert
          key={k}
          title={block.title}
          severity={block.severity}
          items={block.items ?? []}
        />
      );
    case 'list':
    case 'ol':
    case 'ul': {
      const ListTag = resolveListTag(block);
      const items = block.items ?? [];
      return (
        <Stack
          key={k}
          component={ListTag}
          sx={{ gap: 1, pl: 2.5, m: 0, ...RICH_HTML_SX, ...(block.sx ?? {}) }}
        >
          {items.map((item, i) => (
            <Box
              key={i}
              component="li"
              dangerouslySetInnerHTML={{ __html: stripListItemWrapper(item) }}
            />
          ))}
        </Stack>
      );
    }
    case 'patternCard': {
      const d = block.diagram ?? {};
      const introHtml = block.introHtml ?? block.intro;
      const nestedSnippet = block.codeSnippet;
      const promptCode =
        (nestedSnippet && typeof nestedSnippet === 'object'
          ? nestedSnippet.code
          : undefined) ??
        block.promptCode ??
        '';
      const promptFilename =
        (nestedSnippet && typeof nestedSnippet === 'object'
          ? (nestedSnippet.filename ?? nestedSnippet.title)
          : undefined) ??
        block.promptFilename ??
        'prompt.md';
      const nestedMermaid = block.mermaidDiagram;
      const mermaidChart =
        block.mermaidChart ??
        (nestedMermaid && typeof nestedMermaid === 'object'
          ? (nestedMermaid.chart ?? nestedMermaid.mermaidCode)
          : undefined);
      const mermaidTitle =
        block.mermaidTitle ??
        (nestedMermaid && typeof nestedMermaid === 'object'
          ? nestedMermaid.title
          : undefined);
      return (
        <ContentCard
          key={k}
          subheading={block.subheading}
          variant={block.variant ?? 'outlined'}
        >
          <Stack gap={2}>
            {introHtml ? (
              <HtmlContent html={introHtml} variant="body1" />
            ) : null}
            <Diagram
              title={d.title}
              description={d.description}
              caption={d.caption}
              error={d.error}
              prompt={d.prompt}
              imageSrc={d.imageSrc}
              src={d.src}
              drawioXml={d.drawioXml}
              drawioFilename={d.drawioFilename}
              nodes={d.nodes}
              edges={d.edges}
              width={d.width}
              height={d.height}
              maxXmlHeight={d.maxXmlHeight}
            />
            <Typography variant="subtitle2" color="text.secondary">
              Claude.ai prompt — architecture figure
            </Typography>
            <CodeSnippet
              filename={promptFilename}
              language={
                nestedSnippet && typeof nestedSnippet === 'object'
                  ? (nestedSnippet.language ?? 'markdown')
                  : 'markdown'
              }
              code={promptCode}
              maxHeight={block.promptMaxHeight ?? 300}
            />
            {mermaidChart ? (
              <MermaidDiagram title={mermaidTitle} chart={mermaidChart} />
            ) : null}
          </Stack>
        </ContentCard>
      );
    }
    case 'sectionHeader':
      return (
        <SectionHeader
          key={k}
          id={resolveBlockAnchorId(block)}
          eyebrow={block.eyebrow}
          title={block.title}
          description={block.description}
          level={block.level}
          align={block.align}
          divider={block.divider}
          sx={block.sx}
        />
      );
    case 'keyValueList':
      return (
        <KeyValueList
          key={k}
          items={block.items}
          monoValues={block.monoValues}
          layout={block.layout}
          columnGap={block.columnGap}
          sx={block.sx}
        />
      );
    case 'stepList':
      return (
        <StepList
          key={k}
          steps={block.steps ?? []}
          activeStepId={block.activeStepId}
          showNavigation={block.showNavigation !== false}
          sx={block.sx}
        />
      );
    case 'statsGrid': {
      const stats = block.stats ?? [];
      if (!stats.length) return null;
      const columns = block.columns ?? Math.min(stats.length, 3);
      return (
        <Box
          key={k}
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: `repeat(${columns}, 1fr)`,
            },
            gap: 1.5,
            ...(block.sx ?? {}),
          }}
        >
          {stats.map((stat) => (
            <StatCard
              key={stat.id ?? stat.label}
              label={stat.label}
              value={stat.value ?? stat.defaultValue ?? '-'}
              color={stat.color ?? 'primary'}
            />
          ))}
        </Box>
      );
    }
    case 'legend':
      return (
        <VisualizationLegend
          key={k}
          items={block.items ?? block.legend ?? []}
          sx={block.sx}
        />
      );
    case 'emptyState':
      return (
        <EmptyState
          key={k}
          title={block.title}
          description={block.description}
          action={block.action}
          sx={block.sx}
        />
      );
    case 'heatmap': {
      const heatmap = normalizeHeatmapBlock(block);
      return (
        <Heatmap
          key={k}
          title={block.title}
          caption={block.caption}
          columns={heatmap.columns}
          rows={heatmap.rows}
          scale={heatmap.scale}
          rowHeader={heatmap.rowHeader}
          showValues={heatmap.showValues}
          lowerIsBetter={heatmap.lowerIsBetter}
          showLegend={block.showLegend !== false}
          legend={block.legend}
          sx={block.sx}
        />
      );
    }
    case 'tag':
      return (
        <Tag
          key={k}
          label={block.label}
          size={block.size}
          color={block.color}
          variant={block.chipVariant ?? block.variant ?? 'soft'}
          selected={Boolean(block.selected)}
          sx={block.sx}
        />
      );
    case 'tags': {
      const raw = block.items ?? block.tags ?? block.labels ?? [];
      if (!Array.isArray(raw) || raw.length === 0) return null;
      return (
        <TagList key={k} gap={block.gap ?? 1.25} sx={block.sx}>
          {raw.map((entry, i) => {
            if (typeof entry === 'string') {
              return <Tag key={`${k}-${i}`} label={entry} />;
            }
            const t = /** @type {Record<string, unknown>} */ (entry);
            return (
              <Tag
                key={`${k}-${i}`}
                label={t.label}
                size={t.size}
                color={t.color}
                variant={t.chipVariant ?? t.variant}
                selected={Boolean(t.selected)}
              />
            );
          })}
        </TagList>
      );
    }
    case 'showcaseSection':
      return (
        <ShowcaseSection
          key={k}
          id={block.id}
          title={block.title}
          description={block.description}
        >
          {renderBlocksList(block.blocks, `${keySuffix}-sec`)}
        </ShowcaseSection>
      );
    case 'variantGroup':
      return (
        <VariantGroup key={k} label={block.label}>
          {renderBlocksList(block.blocks, `${keySuffix}-vg`)}
        </VariantGroup>
      );
    case 'variantGrid':
      return (
        <VariantGrid key={k}>
          {renderBlocksList(block.blocks, `${keySuffix}-vgrid`)}
        </VariantGrid>
      );
    case 'layout':
      return (
        <Box key={k} sx={block.sx}>
          {renderBlocksList(block.blocks, `${keySuffix}-lay`)}
        </Box>
      );
    case 'carouselPlayground':
      return (
        <CarouselPlaygroundBlock
          key={k}
          slides={block.slides}
          loop={block.loop}
          showArrows={block.showArrows}
          showDots={block.showDots}
          gap={block.gap}
        />
      );
    case 'filtersDemo':
      return <FiltersDemoBlock key={k} />;
    case 'displayCard':
      return (
        <DisplayCard
          key={k}
          data={block.data}
          type={block.cardType ?? block.viewType ?? block.type ?? 'item'}
        />
      );
    case 'carouselCard':
      return (
        <CarouselCard
          key={k}
          eyebrow={block.eyebrow}
          title={block.title}
          description={block.description}
          tags={block.tags}
          maxTags={block.maxTags}
          to={block.to}
          href={block.href}
          ctaLabel={block.ctaLabel}
          sx={block.sx}
        />
      );
    case 'carousel': {
      const slides = block.slides ?? [];
      const slidesPerView =
        typeof block.slidesPerView === 'number'
          ? { xs: 1, sm: Math.min(2, block.slidesPerView), md: block.slidesPerView }
          : block.slidesPerView;
      return (
        <Carousel
          key={k}
          loop={block.loop}
          showArrows={block.showArrows}
          showDots={block.showDots}
          slidesPerView={slidesPerView}
          slideMinWidth={block.slideMinWidth}
          gap={block.gap}
          sx={block.sx}
        >
          {slides.map((slide, i) =>
            renderCarouselSlide(slide, `${k}-slide-${i}`),
          )}
        </Carousel>
      );
    }
    default:
      return (
        <CustomAlert
          key={k}
          severity="warning"
          title={`Unknown block component: ${String(componentId)}`}
        >
          Extend <code>PageBlockRenderer</code> to support this shape.
        </CustomAlert>
      );
  }
}

/**
 * @param {Record<string, unknown> | null} prev
 * @param {Record<string, unknown>} curr
 */
function blockSpacingBefore(prev, curr) {
  if (!prev) return 0;
  const a = resolveBlockComponentId(prev);
  const b = resolveBlockComponentId(curr);
  const prevHtml = typeof prev.html === 'string' ? prev.html : '';

  if (a === 'mermaidDiagram' && b === 'codeSnippet') return 4;
  if (a === 'diagram' && b === 'codeSnippet') return 3.5;
  if (a === 'typography' && b === 'codeSnippet') {
    return prevHtml.includes('What we are doing') ? 1.5 : 3;
  }
  if (a === 'codeSnippet' && b === 'typography') {
    const currHtml = typeof curr.html === 'string' ? curr.html : '';
    if (currHtml.includes('Expected output')) return 2;
    return 2.5;
  }
  if (a === 'codeSnippet' && b === 'table') return 2;
  if (a === 'table' && b === 'codeSnippet') return 3.5;
  if (a === 'table' && b === 'typography') return 2.5;
  if (a === 'mermaidDiagram' && b === 'typography') return 2.5;
  if (a === 'codeSnippet' && b === 'mermaidDiagram') return 3.5;
  return 2.5;
}

/**
 * @param {unknown[] | undefined} blocks
 * @param {string} prefix
 */
export function renderBlocksList(blocks, prefix) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;
  return blocks.map((block, i) => {
    const prev =
      i > 0 ? /** @type {Record<string, unknown>} */ (blocks[i - 1]) : null;
    const curr = /** @type {Record<string, unknown>} */ (block);
    const mt = blockSpacingBefore(prev, curr);
    return (
      <Box key={`${prefix}-wrap-${i}`} sx={{ mt: mt ? `${mt * 8}px` : 0 }}>
        {renderBlock(curr, `${prefix}-${i}`)}
      </Box>
    );
  });
}

/**
 * @param {object} props
 * @param {Record<string, unknown>[]} [props.blocks]
 */
export default function PageBlockRenderer({ blocks = [] }) {
  return <Stack sx={{ gap: 0 }}>{renderBlocksList(blocks, 'root')}</Stack>;
}
