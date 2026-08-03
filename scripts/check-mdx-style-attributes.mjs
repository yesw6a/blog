import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import matter from 'gray-matter';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

const projectRoot = process.cwd();
const articlesDirectory = path.join(projectRoot, 'content', 'articles');
const stringStyleAttribute = /\bstyle\s*=\s*(?:"[^"\r\n]*"|'[^'\r\n]*')/gi;
const mdxParser = unified().use(remarkParse).use(remarkMdx).use(remarkGfm);

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
const styleViolations = [];
const syntaxViolations = [];

for (const file of files) {
  const source = readFileSync(file, 'utf8');
  const relativeFile = path.relative(projectRoot, file).split(path.sep).join('/');
  const lines = source.split(/\r?\n/);

  for (const [index, line] of lines.entries()) {
    stringStyleAttribute.lastIndex = 0;

    for (const match of line.matchAll(stringStyleAttribute)) {
      styleViolations.push({
        file: relativeFile,
        line: index + 1,
        attribute: match[0],
      });
    }
  }

  let lineOffset = 0;

  try {
    const parsed = matter(source);
    const contentStart = source.indexOf(parsed.content);
    lineOffset = contentStart > 0 ? source.slice(0, contentStart).split(/\r?\n/).length - 1 : 0;

    mdxParser.parse(parsed.content);
  } catch (error) {
    const bodyLine = Number.isInteger(error?.line) ? error.line : error?.position?.start?.line;
    const column = Number.isInteger(error?.column) ? error.column : error?.position?.start?.column;

    syntaxViolations.push({
      file: relativeFile,
      line: Number.isInteger(bodyLine) ? bodyLine + lineOffset : undefined,
      column: Number.isInteger(column) ? column : undefined,
      reason: error?.reason ?? error?.message ?? String(error),
    });
  }
}

if (styleViolations.length > 0) {
  console.error('Unsupported string-valued style attributes found in article MDX:');

  for (const violation of styleViolations) {
    console.error(`${violation.file}:${violation.line}: ${violation.attribute}`);
  }

  console.error(
    'Use Markdown semantics, a registered MDX component, or React object syntax for exceptional inline styles.',
  );
}

if (syntaxViolations.length > 0) {
  console.error('Invalid article MDX syntax found:');

  for (const violation of syntaxViolations) {
    const location = [violation.file, violation.line, violation.column].filter(Boolean).join(':');
    console.error(`${location}: ${violation.reason}`);
  }
}

if (styleViolations.length > 0 || syntaxViolations.length > 0) {
  process.exitCode = 1;
} else {
  console.log(`Content check passed: ${files.length} article MDX files parsed and scanned.`);
}
