/**
 * Renders architecture/diagrams/*.mmd to SVG via @mermaid-js/mermaid-cli (mmdc).
 * Usage: npm run docs:diagrams
 */
import { execSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const diagramsDir = join(__dirname, '../architecture/diagrams');

const files = readdirSync(diagramsDir).filter((name) => name.endsWith('.mmd'));

for (const file of files) {
  const input = join(diagramsDir, file);
  const output = join(diagramsDir, file.replace(/\.mmd$/, '.svg'));
  execSync(`npx mmdc -i "${input}" -o "${output}" -b transparent`, {
    stdio: 'inherit',
  });
}
