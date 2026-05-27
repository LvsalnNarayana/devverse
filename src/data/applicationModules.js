// External
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AppsIcon from '@mui/icons-material/Apps';
import BuildIcon from '@mui/icons-material/Build';
import ExtensionIcon from '@mui/icons-material/Extension';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';

export const applicationModules = [
  {
    icon: PlayCircleOutlinedIcon,
    label: 'DSA Visualizer',
    description:
      'Step through sorting, searching, graph, and tree algorithms with animated state changes, complexity breakdowns, and runnable code side-by-side.',
    tags: ['Sorting', 'Graphs', 'Trees', 'DP'],
    href: '/dsa',
    colorKey: 'primary',
  },
  {
    icon: AccountTreeIcon,
    label: 'Case Studies',
    description:
      'Long-form articles and real-world system breakdowns — URL shorteners, rate limiters, caches, and notification pipelines with architecture diagrams and trade-offs.',
    tags: ['Articles', 'Case Studies', 'Architecture', 'Scalability'],
    href: '/case-studies',
    colorKey: 'success',
  },
  {
    icon: AppsIcon,
    label: 'Projects',
    description:
      'Hands-on builds with full data models, tech stack rationale, and source code — from small experiments to production-style apps you can fork and extend.',
    tags: ['Full-Stack', 'Frontend', 'Backend', 'APIs'],
    href: '/projects',
    colorKey: 'warning',
  },
  {
    icon: MenuBookIcon,
    label: 'Reference Library',
    description:
      'Searchable quick-reference for Java, Spring Boot, React, SQL, Redis, Kafka, and system design patterns — the cheat sheets you actually open.',
    tags: ['Java', 'React', 'SQL', 'Kafka'],
    href: '/references',
    colorKey: 'info',
  },
  {
    icon: BuildIcon,
    label: 'Developer Tools',
    description:
      'Productivity boosters and utilities — regex testers, JSON formatters, base64 encoders, color pickers, and API testing tools all in one place.',
    tags: ['Utilities', 'Formatters', 'Converters', 'Testers'],
    href: '/tools',
    colorKey: 'secondary',
  },
  {
    icon: ExtensionIcon,
    label: 'Prebuilt Modules',
    description:
      'Production-ready code snippets and templates — authentication flows, payment integrations, email services, and common backend patterns you can drop into your projects.',
    tags: ['Auth', 'Payments', 'Templates', 'Boilerplate'],
    href: '/modules',
    colorKey: 'error',
  },
];
