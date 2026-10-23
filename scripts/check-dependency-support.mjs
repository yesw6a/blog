import { readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const projectRoot = process.cwd();
const warningWindowDays = 90;
const millisecondsPerDay = 24 * 60 * 60 * 1000;

// Each Next.js major version is supported by the Next.js team for 2 years from
// its release date (https://nextjs.org/support-policy). OpenNext refuses to build
// unsupported majors, so keep this table in sync when a new major ships.
const nextReleaseDates = {
  13: '2022-10-26',
  14: '2023-10-26',
  15: '2024-10-21',
  16: '2025-10-21',
};

function readDeclaredVersion(packageJson) {
  return packageJson.dependencies?.next ?? '';
}

function readInstalledVersion() {
  try {
    const manifestPath = path.join(projectRoot, 'node_modules', 'next', 'package.json');
    return JSON.parse(readFileSync(manifestPath, 'utf8')).version;
  } catch {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    return readDeclaredVersion(JSON.parse(readFileSync(packageJsonPath, 'utf8')));
  }
}

function resolveMajor(version) {
  const match = /^(\d+)/.exec(version);
  return match ? Number(match[1]) : undefined;
}

function resolveSupportEnd(releaseDate) {
  const end = new Date(`${releaseDate}T00:00:00Z`);
  end.setUTCFullYear(end.getUTCFullYear() + 2);
  return end;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function main() {
  const version = readInstalledVersion();
  const major = resolveMajor(version);

  if (!major) {
    console.error(`Unable to determine the Next.js major version from "${version}".`);
    return 1;
  }

  const releaseDate = nextReleaseDates[major];

  if (!releaseDate) {
    console.error(
      `No release date recorded for Next.js ${major}.`,
      'Add it to nextReleaseDates in scripts/check-dependency-support.mjs,',
      'otherwise the support window cannot be checked.',
    );
    return 1;
  }

  const supportEnd = resolveSupportEnd(releaseDate);
  const daysLeft = Math.ceil((supportEnd.getTime() - Date.now()) / millisecondsPerDay);

  if (daysLeft <= 0) {
    console.error(
      `Next.js ${version} (major ${major}) is no longer supported.`,
      `Support ended on ${formatDate(supportEnd)}.`,
      'Upgrade to a supported major version before it blocks the Cloudflare build.',
    );
    return 1;
  }

  if (daysLeft < warningWindowDays) {
    console.error(
      `Next.js ${version} (major ${major}) loses support in ${daysLeft} day(s) on ${formatDate(supportEnd)}.`,
      `Plan the upgrade now: below ${warningWindowDays} days remaining is treated as a failure.`,
    );
    return 1;
  }

  console.log(
    `Next.js ${version} (major ${major}) is supported until ${formatDate(supportEnd)} (${daysLeft} day(s) left).`,
  );
  return 0;
}

process.exit(main());
