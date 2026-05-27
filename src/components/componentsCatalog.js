/**
 * Registry of UI components and `/components` showcase sections.
 * Each entry has a stable `id` (kebab-case) and human-readable `title`.
 */

/** JSON page content for the components showcase (`public/configs/components/showcase.json`). */
export const COMPONENTS_SHOWCASE_CONTENT_PATH = '/configs/components/showcase.json';

/** @typedef {{ id: string, title: string, group?: string }} ShowcaseSectionEntry */

/** @typedef {{ id: string, title: string, blockType?: string, showcaseSectionId?: string }} ComponentEntry */

/** Anchor sections on the components showcase page (`/components`). */
/** @type {ShowcaseSectionEntry[]} */
export const COMPONENTS_SHOWCASE_SECTIONS = [
  { id: 'overview', title: 'Overview', group: 'Start' },
  { id: 'typography', title: 'Typography & HtmlContent', group: 'Foundation' },
  { id: 'section-header', title: 'SectionHeader', group: 'Foundation' },
  { id: 'content-card', title: 'ContentCard', group: 'Foundation' },
  { id: 'alerts', title: 'Alerts', group: 'Feedback' },
  { id: 'lists', title: 'Lists', group: 'Content' },
  { id: 'tags', title: 'Tags', group: 'Content' },
  { id: 'code', title: 'Code snippets', group: 'Media' },
  { id: 'diagrams', title: 'Diagrams', group: 'Media' },
  { id: 'tables', title: 'BasicTable', group: 'Data' },
  { id: 'stats', title: 'StatCard & stats grid', group: 'Data' },
  { id: 'heatmap', title: 'Heatmap', group: 'Data' },
  { id: 'key-value', title: 'KeyValueList', group: 'Data' },
  { id: 'steps', title: 'StepList', group: 'Flow' },
  { id: 'legend', title: 'VisualizationLegend', group: 'Data' },
  { id: 'empty-state', title: 'EmptyState', group: 'Flow' },
  { id: 'display-card', title: 'DisplayCard', group: 'Cards' },
  { id: 'carousel-card', title: 'CarouselCard', group: 'Cards' },
  { id: 'carousel', title: 'Carousel', group: 'Cards' },
  { id: 'pattern-card', title: 'PatternCard (composite block)', group: 'Cards' },
  { id: 'filters', title: 'Filters', group: 'Listing' },
];

/** Shared UI primitives (PageBlockRenderer + `src/components/shared`). */
/** @type {ComponentEntry[]} */
export const SHARED_UI_COMPONENTS = [
  { id: 'alert', title: 'Alert', blockType: 'alert', showcaseSectionId: 'alerts' },
  { id: 'custom-alert', title: 'CustomAlert', blockType: 'customAlert', showcaseSectionId: 'alerts' },
  { id: 'info-alert', title: 'InfoAlert', blockType: 'infoAlert', showcaseSectionId: 'alerts' },
  {
    id: 'how-it-works-alert',
    title: 'HowItWorksAlert',
    blockType: 'howItWorks',
    showcaseSectionId: 'alerts',
  },
  { id: 'typography', title: 'Typography', blockType: 'typography', showcaseSectionId: 'typography' },
  { id: 'html-content', title: 'HtmlContent', showcaseSectionId: 'typography' },
  { id: 'section-header', title: 'SectionHeader', blockType: 'sectionHeader', showcaseSectionId: 'section-header' },
  { id: 'content-card', title: 'ContentCard', blockType: 'contentCard', showcaseSectionId: 'content-card' },
  { id: 'subsection', title: 'SubSection', blockType: 'subsection' },
  { id: 'list', title: 'HTML list (ul/ol)', blockType: 'list', showcaseSectionId: 'lists' },
  { id: 'tag', title: 'Tag', blockType: 'tag', showcaseSectionId: 'tags' },
  { id: 'tag-list', title: 'TagList', blockType: 'tags', showcaseSectionId: 'tags' },
  { id: 'code-snippet', title: 'CodeSnippet', blockType: 'codeSnippet', showcaseSectionId: 'code' },
  {
    id: 'multi-tab-code-snippet',
    title: 'MultiTabCodeSnippet',
    blockType: 'multiTabCodeSnippet',
    showcaseSectionId: 'code',
  },
  { id: 'diagram', title: 'Diagram', blockType: 'diagram', showcaseSectionId: 'diagrams' },
  { id: 'mermaid-diagram', title: 'MermaidDiagram', blockType: 'mermaidDiagram', showcaseSectionId: 'diagrams' },
  { id: 'basic-table', title: 'BasicTable', blockType: 'basicTable', showcaseSectionId: 'tables' },
  { id: 'stat-card', title: 'StatCard', blockType: 'statsGrid', showcaseSectionId: 'stats' },
  { id: 'heatmap', title: 'Heatmap', blockType: 'heatmap', showcaseSectionId: 'heatmap' },
  { id: 'key-value-list', title: 'KeyValueList', blockType: 'keyValueList', showcaseSectionId: 'key-value' },
  { id: 'step-list', title: 'StepList', blockType: 'stepList', showcaseSectionId: 'steps' },
  {
    id: 'visualization-legend',
    title: 'VisualizationLegend',
    blockType: 'legend',
    showcaseSectionId: 'legend',
  },
  { id: 'empty-state', title: 'EmptyState', blockType: 'emptyState', showcaseSectionId: 'empty-state' },
  { id: 'display-card', title: 'DisplayCard', blockType: 'displayCard', showcaseSectionId: 'display-card' },
  { id: 'carousel-card', title: 'CarouselCard', blockType: 'carouselCard', showcaseSectionId: 'carousel-card' },
  { id: 'carousel', title: 'Carousel', blockType: 'carousel', showcaseSectionId: 'carousel' },
  { id: 'pattern-card', title: 'PatternCard', blockType: 'patternCard', showcaseSectionId: 'pattern-card' },
  { id: 'filters', title: 'Filters', showcaseSectionId: 'filters' },
  { id: 'page-block-renderer', title: 'PageBlockRenderer' },
  { id: 'page-content', title: 'PageContent' },
];

export const SHOWCASE_GROUPS = [
  ...new Set(COMPONENTS_SHOWCASE_SECTIONS.map((s) => s.group).filter(Boolean)),
];
