import type { FuseResultMatch, IFuseOptions } from 'fuse.js';
import type {
  SearchDocument,
  SearchDocumentScope,
  SearchHighlightRange,
  SearchTextMatch,
  SiteSearchIndexResponse,
  SiteSearchResult,
} from './search.types';

const SEARCH_INDEX_URL = '/site-search-index.json';
const EXCERPT_MIN_LENGTH = 120;
const EXCERPT_TARGET_LENGTH = 180;
const EXCERPT_HARD_LIMIT = 220;
const FALLBACK_TOKEN_PATTERN = /[\p{Script=Han}]|[\p{L}\p{M}\p{N}_]+/gu;
const SENTENCE_BOUNDARY_PATTERN = /[。！？!?；;\n]/;

let searchEnginePromise: Promise<SearchEngine> | undefined;
let searchIndexPromise: Promise<SiteSearchIndexResponse> | undefined;

type SearchEngine = {
  search: (query: string) => SearchDocumentResult[];
};

type SearchDocumentResult = {
  item: SearchDocument;
  matches?: ReadonlyArray<FuseResultMatch>;
  score?: number;
};

type SearchOptions = {
  limit?: number;
  scope?: SearchDocumentScope;
};

const segmenter =
  typeof Intl.Segmenter === 'function' ? new Intl.Segmenter('zh-CN', { granularity: 'word' }) : undefined;

const tokenize = (text: string) => {
  if (!segmenter) return text.match(FALLBACK_TOKEN_PATTERN) ?? [];

  return [...segmenter.segment(text)].filter((segment) => segment.isWordLike).map((segment) => segment.segment);
};

const fuseOptions: IFuseOptions<SearchDocument> = {
  keys: [
    { name: 'searchTitle', weight: 4 },
    { name: 'sectionTitle', weight: 3.5 },
    { name: 'keywords', weight: 3 },
    { name: 'description', weight: 2 },
    { name: 'content', weight: 1 },
  ],
  includeMatches: true,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 1,
  threshold: 0.32,
  tokenMatch: 'all',
  tokenize,
  useTokenSearch: true,
};

export const fetchSiteSearchIndex = async () => {
  if (!searchIndexPromise) {
    searchIndexPromise = fetch(SEARCH_INDEX_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`Search index request failed: ${response.status}`);
        return response.json() as Promise<SiteSearchIndexResponse>;
      })
      .catch((error) => {
        searchIndexPromise = undefined;
        throw error;
      });
  }

  return searchIndexPromise;
};

const loadSearchEngine = async () => {
  if (!searchEnginePromise) {
    searchEnginePromise = Promise.all([fetchSiteSearchIndex(), import('fuse.js')])
      .then(([index, module]) => {
        const fuse = new module.default(index.documents, fuseOptions);
        return {
          search: (query: string) => fuse.search(query),
        } satisfies SearchEngine;
      })
      .catch((error) => {
        searchEnginePromise = undefined;
        throw error;
      });
  }

  return searchEnginePromise;
};

const mergeHighlightRanges = (ranges: SearchHighlightRange[], textLength: number) => {
  const normalized = ranges
    .map(({ start, end }) => ({ start: Math.max(0, start), end: Math.min(textLength, end) }))
    .filter(({ start, end }) => start < end)
    .sort((left, right) => left.start - right.start || left.end - right.end);

  const merged: SearchHighlightRange[] = [];
  for (const range of normalized) {
    const previous = merged.at(-1);
    if (previous && range.start <= previous.end) {
      previous.end = Math.max(previous.end, range.end);
    } else {
      merged.push({ ...range });
    }
  }

  return merged;
};

const toHighlightRanges = (match: FuseResultMatch): SearchHighlightRange[] =>
  mergeHighlightRanges(
    match.indices.map(([start, end]) => ({ start, end: end + 1 })),
    match.value?.length ?? 0,
  );

const getMatches = (matches: ReadonlyArray<FuseResultMatch> | undefined, key: string) =>
  matches?.filter((match) => match.key === key && match.value) ?? [];

const getFieldHighlights = (matches: ReadonlyArray<FuseResultMatch> | undefined, key: string, value: string) =>
  mergeHighlightRanges(
    getMatches(matches, key).flatMap((match) => (match.value === value ? toHighlightRanges(match) : [])),
    value.length,
  );

const remapContainerHighlights = (
  matches: ReadonlyArray<FuseResultMatch> | undefined,
  key: string,
  container: string,
  value: string,
) => {
  const valueStart = container.indexOf(value);
  if (valueStart < 0) return [];
  const valueEnd = valueStart + value.length;

  return mergeHighlightRanges(
    getMatches(matches, key).flatMap((match) =>
      toHighlightRanges(match).flatMap((range) => {
        const start = Math.max(range.start, valueStart);
        const end = Math.min(range.end, valueEnd);
        return start < end ? [{ start: start - valueStart, end: end - valueStart }] : [];
      }),
    ),
    value.length,
  );
};

const createTextMatch = (text: string, highlights: SearchHighlightRange[] = []): SearchTextMatch => ({
  text,
  highlights: mergeHighlightRanges(highlights, text.length),
});

type TextRange = {
  start: number;
  end: number;
};

const getSentenceRanges = (text: string): TextRange[] => {
  const ranges: TextRange[] = [];
  let start = 0;

  for (let index = 0; index < text.length; index += 1) {
    if (!SENTENCE_BOUNDARY_PATTERN.test(text[index])) continue;
    ranges.push({ start, end: index + 1 });
    start = index + 1;
  }

  if (start < text.length) ranges.push({ start, end: text.length });
  return ranges.length ? ranges : [{ start: 0, end: text.length }];
};

const trimRange = (text: string, range: TextRange): TextRange => {
  let { start, end } = range;
  while (start < end && /\s/.test(text[start])) start += 1;
  while (end > start && /\s/.test(text[end - 1])) end -= 1;
  return { start, end };
};

const cropAroundMatch = (text: string, matchRange: SearchHighlightRange): TextRange => {
  const matchCenter = Math.floor((matchRange.start + matchRange.end) / 2);
  let start = Math.max(0, matchCenter - Math.floor(EXCERPT_HARD_LIMIT / 3));
  let end = Math.min(text.length, start + EXCERPT_HARD_LIMIT);
  start = Math.max(0, end - EXCERPT_HARD_LIMIT);

  const leadingBoundary = text.slice(start, matchRange.start).search(/[\s，、。！？!?；;：:]/);
  if (leadingBoundary >= 0 && leadingBoundary < 24) start += leadingBoundary + 1;

  const trailingBoundary = text.slice(matchRange.end, end).search(/[\s，、。！？!?；;：:]/);
  if (trailingBoundary >= 0 && end - (matchRange.end + trailingBoundary + 1) < 24) {
    end = matchRange.end + trailingBoundary + 1;
  }

  return trimRange(text, { start, end });
};

const selectSentenceWindow = (text: string, matchRange: SearchHighlightRange): TextRange => {
  if (text.length <= EXCERPT_TARGET_LENGTH) return trimRange(text, { start: 0, end: text.length });

  const sentences = getSentenceRanges(text);
  const sentenceIndex = Math.max(
    0,
    sentences.findIndex(({ start, end }) => matchRange.start < end && matchRange.end > start),
  );
  let first = sentenceIndex;
  let last = sentenceIndex;
  let selected = trimRange(text, sentences[sentenceIndex]);

  if (selected.end - selected.start > EXCERPT_HARD_LIMIT) return cropAroundMatch(text, matchRange);

  const canInclude = (candidate: TextRange, limit: number) => candidate.end - candidate.start <= limit;
  const includeNext = (limit: number) => {
    if (last + 1 >= sentences.length) return false;
    const candidate = trimRange(text, { start: sentences[first].start, end: sentences[last + 1].end });
    if (!canInclude(candidate, limit)) return false;
    last += 1;
    selected = candidate;
    return true;
  };
  const includePrevious = (limit: number) => {
    if (first === 0) return false;
    const candidate = trimRange(text, { start: sentences[first - 1].start, end: sentences[last].end });
    if (!canInclude(candidate, limit)) return false;
    first -= 1;
    selected = candidate;
    return true;
  };

  while (selected.end - selected.start < EXCERPT_MIN_LENGTH) {
    if (includeNext(EXCERPT_HARD_LIMIT)) continue;
    if (includePrevious(EXCERPT_HARD_LIMIT)) continue;
    break;
  }

  if (selected.end - selected.start < EXCERPT_TARGET_LENGTH) {
    if (!includeNext(EXCERPT_TARGET_LENGTH)) includePrevious(EXCERPT_TARGET_LENGTH);
  }

  return selected;
};

const createCroppedTextMatch = (source: string, sourceHighlights: SearchHighlightRange[], selectedRange: TextRange) => {
  const range = trimRange(source, selectedRange);
  if (range.start >= range.end) return undefined;

  const prefix = range.start > 0 ? '…' : '';
  const suffix = range.end < source.length ? '…' : '';
  const text = `${prefix}${source.slice(range.start, range.end)}${suffix}`;
  const highlights = sourceHighlights.flatMap(({ start, end }) => {
    const croppedStart = Math.max(start, range.start);
    const croppedEnd = Math.min(end, range.end);
    return croppedStart < croppedEnd
      ? [{ start: croppedStart - range.start + prefix.length, end: croppedEnd - range.start + prefix.length }]
      : [];
  });

  return createTextMatch(text, highlights);
};

const createMatchedExcerpt = (match: FuseResultMatch) => {
  const source = match.value?.trim();
  if (!source) return undefined;
  const sourceOffset = match.value?.indexOf(source) ?? 0;
  const highlights = toHighlightRanges(match).map(({ start, end }) => ({
    start: start - sourceOffset,
    end: end - sourceOffset,
  }));
  const focusRange = mergeHighlightRanges(highlights, source.length)[0] ?? { start: 0, end: 1 };
  return createCroppedTextMatch(source, highlights, selectSentenceWindow(source, focusRange));
};

const createFallbackExcerpt = (document: SearchDocument) => {
  const description = document.description.trim();
  if (description) return createTextMatch(description);

  const content = document.content.trim();
  if (!content) return undefined;
  const focusRange = { start: 0, end: Math.min(1, content.length) };
  return createCroppedTextMatch(content, [], selectSentenceWindow(content, focusRange));
};

const selectExcerptMatch = (matches: ReadonlyArray<FuseResultMatch> | undefined) => {
  const candidates = [...getMatches(matches, 'description'), ...getMatches(matches, 'content')];
  return candidates.sort((left, right) => {
    const fieldPriority = Number(left.key === 'content') - Number(right.key === 'content');
    if (fieldPriority !== 0) return fieldPriority;
    return (left.indices[0]?.[0] ?? 0) - (right.indices[0]?.[0] ?? 0);
  })[0];
};

const getMetadataMatches = (matches: ReadonlyArray<FuseResultMatch> | undefined) => {
  const values = new Map<string, SearchTextMatch>();
  for (const match of getMatches(matches, 'keywords')) {
    if (!match.value) continue;
    const next = createTextMatch(match.value, toHighlightRanges(match));
    const existing = values.get(next.text);
    values.set(next.text, existing ? createTextMatch(next.text, [...existing.highlights, ...next.highlights]) : next);
  }
  return [...values.values()];
};

const toSiteSearchResult = (result: SearchDocumentResult): SiteSearchResult => {
  const { item, matches } = result;
  const searchTitleMatch = getMatches(matches, 'searchTitle')[0];
  const searchTitle = searchTitleMatch?.value ?? item.searchTitle;
  const title = createTextMatch(item.title, remapContainerHighlights(matches, 'searchTitle', searchTitle, item.title));
  const sectionTitle = item.sectionTitle
    ? createTextMatch(item.sectionTitle, [
        ...getFieldHighlights(matches, 'sectionTitle', item.sectionTitle),
        ...remapContainerHighlights(matches, 'searchTitle', searchTitle, item.sectionTitle),
      ])
    : undefined;
  const excerptMatch = selectExcerptMatch(matches);
  const excerpt = excerptMatch ? createMatchedExcerpt(excerptMatch) : createFallbackExcerpt(item);
  const hasVisibleHighlights =
    title.highlights.length > 0 || Boolean(sectionTitle?.highlights.length) || Boolean(excerpt?.highlights.length);

  return {
    document: item,
    title,
    sectionTitle,
    excerpt,
    metadataMatches: hasVisibleHighlights ? [] : getMetadataMatches(matches),
    score: result.score,
  };
};

export const searchSite = async (query: string, options: SearchOptions = {}): Promise<SiteSearchResult[]> => {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return [];

  const engine = await loadSearchEngine();
  const results: SiteSearchResult[] = [];

  for (const result of engine.search(normalizedQuery)) {
    if (options.scope && result.item.scope !== options.scope) continue;
    results.push(toSiteSearchResult(result));
    if (options.limit && results.length >= options.limit) break;
  }

  return results;
};
