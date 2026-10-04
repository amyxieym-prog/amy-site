import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const safeLink = z.string().refine(value => !value || /^https:\/\//.test(value), '链接需使用 HTTPS');
const common = {
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  publishDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  draft: z.boolean().default(true),
  featured: z.boolean().default(false),
};
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({ ...common,
    author: z.string().default('议敏 Amy'),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    wechatUrl: safeLink.optional(),
    wechatPublishDate: z.coerce.date().optional(),
    syncStatus: z.enum(['website-only', 'wechat-only', 'synced', 'needs-review']).default('website-only'),
    note: z.string().optional(),
  }),
});
const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({ ...common,
    result: z.string(),
    boundary: z.string(),
    publicApproved: z.boolean().default(false),
    order: z.number().default(99),
  }),
});
const zonedTime = z.string().refine(value => !value || (/T\d{2}:\d{2}(:\d{2})?([+-]\d{2}:\d{2}|Z)$/.test(value) && Number.isFinite(Date.parse(value))), '时间需要有效日期与明确时区');
const courses = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/courses' }),
  schema: z.object({ ...common,
    audience: z.string(),
    format: z.string(),
    status: z.enum(['theme', 'upcoming', 'open', 'closed', 'ongoing', 'ended', 'evergreen']).default('theme'),
    startAt: zonedTime.optional(),
    endAt: zonedTime.optional(),
    registrationDeadline: zonedTime.optional(),
    priceNote: z.string().optional(),
    location: z.string().optional(),
    registrationUrl: safeLink.optional(),
  }).refine(data => ['theme', 'evergreen'].includes(data.status) || !!(data.startAt && data.endAt), '活动需要开始与结束时间')
    .refine(data => !data.startAt || !data.endAt || Date.parse(data.endAt) >= Date.parse(data.startAt), '结束时间不能早于开始时间'),
});
export const collections = { blog, cases, courses };
