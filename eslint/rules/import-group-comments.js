/** @typedef {'react' | 'builtin' | 'external' | 'internal' | 'relative' | 'style'} ImportGroup */

const GROUP_LABELS = {
  react: 'React',
  builtin: 'Builtin',
  external: 'External',
  internal: 'Internal',
  relative: 'Relative',
  style: 'Styles',
};

/**
 * @param {string} source
 * @returns {ImportGroup}
 */
function classifyImportSource(source) {
  if (typeof source !== 'string') {
    return 'external';
  }

  if (source.startsWith('node:')) {
    return 'builtin';
  }

  if (/^react(-dom)?(\/|$)/.test(source) || /^react-router(-dom)?(\/|$)/.test(source)) {
    return 'react';
  }

  if (source.startsWith('@/')) {
    return 'internal';
  }

  if (/\.(css|scss|sass|less)(\?.*)?$/.test(source)) {
    return 'style';
  }

  if (source.startsWith('.')) {
    return 'relative';
  }

  return 'external';
}

/**
 * @param {import('eslint').SourceCode} sourceCode
 * @param {import('estree').Node} node
 * @param {string} label
 */
function hasCategoryComment(sourceCode, node, label) {
  const comments = sourceCode.getCommentsBefore(node);

  return comments.some((comment) => comment.type === 'Line' && comment.value.trim() === label);
}

/** @param {ImportGroup} group */
function getGroupLabel(group) {
  return GROUP_LABELS[group] ?? 'External';
}

export default {
  meta: {
    type: 'layout',
    fixable: 'code',
    docs: {
      description: 'Require category comments (e.g. // React) above each import group',
    },
    messages: {
      missing: 'Import group "{{group}}" must be preceded by a category comment: `// {{label}}`.',
    },
    schema: [],
  },
  create(context) {
    const { sourceCode } = context;

    return {
      Program(program) {
        const imports = program.body.filter((node) => node.type === 'ImportDeclaration');

        if (imports.length === 0) {
          return;
        }

        /** @type {ImportGroup | null} */
        let previousGroup = null;

        imports.forEach((importNode) => {
          const group = classifyImportSource(importNode.source?.value);
          const label = getGroupLabel(group);

          if (group !== previousGroup) {
            if (!hasCategoryComment(sourceCode, importNode, label)) {
              const priorGroup = previousGroup;

              context.report({
                node: importNode,
                messageId: 'missing',
                data: { group, label },
                fix(fixer) {
                  const prefix = priorGroup === null ? '' : '\n';
                  return fixer.insertTextBefore(importNode, `${prefix}// ${label}\n`);
                },
              });
            }

            previousGroup = group;
          }
        });
      },
    };
  },
};
