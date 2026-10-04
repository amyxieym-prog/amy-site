import { getCollection } from 'astro:content';

export const formatDate = (date: Date | string) => new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(date)).replaceAll('/', '.');
export async function publishedBlog() {
  return (await getCollection('blog', entry => !entry.data.draft && entry.data.publishDate.getTime() <= Date.now()))
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime() || a.id.localeCompare(b.id));
}
export async function publishedCases() {
  return (await getCollection('cases', entry => !entry.data.draft && entry.data.publicApproved && entry.data.publishDate.getTime() <= Date.now())).sort((a, b) => a.data.order - b.data.order);
}
export async function publishedCourses() {
  return (await getCollection('courses', entry => !entry.data.draft && entry.data.publishDate.getTime() <= Date.now()));
}
