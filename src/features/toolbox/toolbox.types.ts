import type { IconName } from '@/components/icon';

export const TOOL_CATEGORIES = ['writing', 'data', 'time', 'visual'] as const;

export type ToolCategory = (typeof TOOL_CATEGORIES)[number];

export type ToolDefinition = {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  keywords: readonly string[];
  icon: IconName;
};
