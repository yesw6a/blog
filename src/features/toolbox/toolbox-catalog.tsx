'use client';

import { useState } from 'react';

import type { ToolCategory, ToolDefinition } from './toolbox.types';

import Link from 'next/link';
import Icon from '@/components/icon';
import * as stylex from '@stylexjs/stylex';

import { getToolHref, TOOL_CATEGORY_LABELS } from './toolbox.registry';
import { toolboxStyles as styles } from './toolbox.styles';
import { TOOL_CATEGORIES } from './toolbox.types';

type ToolboxCatalogProps = {
  tools: readonly ToolDefinition[];
};

type CategoryFilter = 'all' | ToolCategory;
type ToolViewMode = 'grid' | 'list';

const normalize = (value: string) => value.trim().toLocaleLowerCase('zh-CN');

const matchesQuery = (tool: ToolDefinition, query: string) => {
  if (!query) return true;
  return normalize(
    [tool.name, tool.description, TOOL_CATEGORY_LABELS[tool.category], ...tool.keywords].join(' '),
  ).includes(query);
};

export default function ToolboxCatalog({ tools }: ToolboxCatalogProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [viewMode, setViewMode] = useState<ToolViewMode>('grid');
  const normalizedQuery = normalize(query);
  const filteredTools = tools.filter(
    (tool) => (category === 'all' || tool.category === category) && matchesQuery(tool, normalizedQuery),
  );

  const clearFilters = () => {
    setQuery('');
    setCategory('all');
  };

  return (
    <div {...stylex.props(styles.catalog)}>
      <div {...stylex.props(styles.searchGroup)}>
        <label htmlFor="tool-search" {...stylex.props(styles.label)}>
          搜索工具
        </label>
        <div {...stylex.props(styles.searchWrap)}>
          <Icon name="search" style={styles.searchIcon} />
          <input
            id="tool-search"
            type="search"
            value={query}
            autoComplete="off"
            placeholder="输入名称、用途或关键词"
            onChange={(event) => setQuery(event.currentTarget.value)}
            {...stylex.props(styles.searchInput)}
          />
        </div>
      </div>

      <div aria-label="工具分类" {...stylex.props(styles.filters)}>
        <button
          type="button"
          aria-pressed={category === 'all'}
          onClick={() => setCategory('all')}
          {...stylex.props(styles.filterButton, category === 'all' && styles.filterButtonActive)}
        >
          全部
        </button>
        {TOOL_CATEGORIES.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
            {...stylex.props(styles.filterButton, category === item && styles.filterButtonActive)}
          >
            {TOOL_CATEGORY_LABELS[item]}
          </button>
        ))}
      </div>

      <div {...stylex.props(styles.directoryHeader)}>
        <p aria-live="polite" {...stylex.props(styles.resultCount)}>
          {filteredTools.length} 个工具
        </p>
        <div role="group" aria-label="工具展示方式" {...stylex.props(styles.viewSwitcher)}>
          <button
            type="button"
            aria-pressed={viewMode === 'grid'}
            onClick={() => setViewMode('grid')}
            {...stylex.props(styles.viewButton, viewMode === 'grid' && styles.viewButtonActive)}
          >
            <Icon name="gridView" />
            宫格
          </button>
          <button
            type="button"
            aria-pressed={viewMode === 'list'}
            onClick={() => setViewMode('list')}
            {...stylex.props(styles.viewButton, viewMode === 'list' && styles.viewButtonActive)}
          >
            <Icon name="listView" />
            列表
          </button>
        </div>
      </div>

      {filteredTools.length > 0 ? (
        <div role="list" {...stylex.props(viewMode === 'grid' ? styles.toolGrid : styles.toolList)}>
          {filteredTools.map((tool) => (
            <Link
              key={tool.slug}
              role="listitem"
              href={getToolHref(tool.slug)}
              {...stylex.props(styles.toolItem, viewMode === 'grid' ? styles.gridItem : styles.listItem)}
            >
              <span {...stylex.props(styles.iconTile)}>
                <Icon name={tool.icon} />
              </span>
              <div {...stylex.props(styles.itemContent, viewMode === 'grid' && styles.gridContent)}>
                <h2 {...stylex.props(styles.itemTitle)}>{tool.name}</h2>
                <p {...stylex.props(styles.itemDescription)}>{tool.description}</p>
              </div>
              <div {...stylex.props(styles.itemEnd, viewMode === 'grid' ? styles.gridEnd : styles.listEnd)}>
                <span {...stylex.props(styles.itemCategory, viewMode === 'list' && styles.listCategory)}>
                  {TOOL_CATEGORY_LABELS[tool.category]}
                </span>
                <span aria-hidden {...stylex.props(styles.rowArrow)}>
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div role="status" {...stylex.props(styles.emptyState)}>
          <p {...stylex.props(styles.emptyTitle)}>没有找到匹配的工具</p>
          <p {...stylex.props(styles.emptyDescription)}>可以尝试更短的关键词，或切换到其他分类。</p>
          <button type="button" onClick={clearFilters} {...stylex.props(styles.clearButton)}>
            清除筛选
          </button>
        </div>
      )}
    </div>
  );
}
