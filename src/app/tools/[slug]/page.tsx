import type { ToolSlug } from '@/features/toolbox/toolbox.registry';
import type { Metadata } from 'next';
import type { ComponentType } from 'react';

import nextDynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import ToolPageShell from '@/features/toolbox/tool-page-shell';
import { getToolBySlug, getToolHref, TOOL_DEFINITIONS } from '@/features/toolbox/toolbox.registry';

type ToolPageProps = {
  params: Promise<{ slug: string }>;
};

const TOOL_COMPONENTS: Record<ToolSlug, ComponentType> = {
  json: nextDynamic(() => import('@/features/toolbox/tools/json-tool')),
  timestamp: nextDynamic(() => import('@/features/toolbox/tools/timestamp-tool')),
  'url-codec': nextDynamic(() => import('@/features/toolbox/tools/url-codec-tool')),
  base64: nextDynamic(() => import('@/features/toolbox/tools/base64-tool')),
  'text-inspector': nextDynamic(() => import('@/features/toolbox/tools/text-inspector-tool')),
  'color-contrast': nextDynamic(() => import('@/features/toolbox/tools/color-contrast-tool')),
  'ai-image-studio': nextDynamic(() => import('@/features/toolbox/tools/scene-meld-desktop-tool')),
};

export const dynamicParams = false;

export const generateStaticParams = () => TOOL_DEFINITIONS.map(({ slug }) => ({ slug }));

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  return {
    title: tool.name,
    description: tool.description,
    keywords: [...tool.keywords],
    alternates: { canonical: getToolHref(tool.slug) },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();
  const ToolComponent = TOOL_COMPONENTS[tool.slug];

  return (
    <ToolPageShell tool={tool}>
      <ToolComponent />
    </ToolPageShell>
  );
}
