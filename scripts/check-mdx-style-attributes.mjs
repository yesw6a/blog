import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const projectRoot = process.cwd();
const articlesDirectory = path.join(projectRoot, 'content', 'articles');
const stringStyleAttribute = /\bstyle\s*=\s*(?:"[^"\r\n]*"|'[^'\r\n]*')/gi;

function listMdxFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return listMdxFiles(entryPath);
    }

    return entry.isFile() && entry.name.endsWith('.mdx') ? [entryPath] : [];
  });
}

const files = listMdxFiles(articlesDirectory).sort();
const violations = [];

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);

  for (const [index, line] of lines.entries()) {
    stringStyleAttribute.lastIndex = 0;

    for (const match of line.matchAll(stringStyleAttribute)) {
      violations.push({
        file: path.relative(projectRoot, file).split(path.sep).join('/'),
        line: index + 1,
        attribute: match[0],
      });
    }
  }
}

if (violations.length > 0) {
  console.error('Unsupported string-valued style attributes found in article MDX:');

  for (const violation of violations) {
    console.error(`${violation.file}:${violation.line}: ${violation.attribute}`);
  }

  console.error(
    'Use Markdown semantics, a registered MDX component, or React object syntax for exceptional inline styles.',
  );
  process.exitCode = 1;
} else {
  console.log(`Content check passed: ${files.length} article MDX files scanned.`);
}
