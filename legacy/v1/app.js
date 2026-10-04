import { validateContent, safeUrl, visibleCourses } from './content-model.js';

const $ = (selector) => document.querySelector(selector);
const menu = $('.menu-toggle');
const nav = $('#main-nav');
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? '关闭导航' : '打开导航'); nav.classList.toggle('open', open); });
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', '打开导航'); nav.classList.remove('open'); }));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { menu.click(); menu.focus(); } });

const dimensions = {
  E: ['SUPPORTIVE ENVIRONMENT', '先让真话，有地方说。', '孩子说“不会”“累了”时，能否先被听见？情绪与鼓励构成成长环境，让真实的困难有机会被看见。', '谈起学习时，孩子敢说出哪一步不会吗？'],
  S: ['LEARNING STRATEGIES', '让努力，找到可以落地的方法。', '先看看任务是否清楚、方法是否适合。学习策略关注怎样理解、练习、检查与调整，让投入变得具体。', '孩子能说清这次练习想解决什么问题吗？'],
  I: ['INTERNAL MOTIVATION', '让行动，逐步成为自己的选择。', '看见孩子愿意认领什么、为什么愿意尝试。通过真实的选择与行动反馈，理解内驱力如何在具体情境中出现。', '这件学习任务里，哪一步是孩子自己愿意做的？'],
  R: ['RESILIENCE', '遇到困难，还能重新开始。', '心理韧性关注面对挫折时的恢复与再尝试。把困难说具体，留下一次可以继续的机会，观察孩子怎样回到学习中。', '一次不顺之后，孩子能否表达困难并尝试下一步？']
};
const tabs = [...document.querySelectorAll('[data-rise]')];
function selectDimension(key, focus = false) { const data = dimensions[key]; tabs.forEach(tab => { const selected = tab.dataset.rise === key; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; if (selected && focus) tab.focus(); }); $('#rise-panel').setAttribute('aria-labelledby', `tab-${key}`); ['#rise-kicker', '#rise-detail-title', '#rise-description', '#rise-question'].forEach((id, i) => $(id).textContent = data[i]); }
tabs.forEach((tab, index) => { tab.addEventListener('click', () => selectDimension(tab.dataset.rise)); tab.addEventListener('keydown', event => { let next; if (event.key === 'ArrowRight') next = (index + 1) % tabs.length; if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length; if (event.key === 'Home') next = 0; if (event.key === 'End') next = tabs.length - 1; if (next !== undefined) { event.preventDefault(); selectDimension(tabs[next].dataset.rise, true); } }); });

const dialog = $('#content-dialog');
let returnFocus;
function node(tag, text, className) { const element = document.createElement(tag); if (text !== undefined) element.textContent = text; if (className) element.className = className; return element; }
function openDialog(kicker, title, children) { returnFocus = document.activeElement; $('#dialog-kicker').textContent = kicker; $('#dialog-title').textContent = title; $('#dialog-body').replaceChildren(...children); dialog.showModal(); document.body.style.overflow = 'hidden'; $('#dialog-close').focus(); }
$('#dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { document.body.style.overflow = ''; returnFocus?.focus(); });
function detailNodes(item) { return [...item.sections.flatMap(section => [node('h3', section.title), node('p', section.text)]), node('p', item.boundary || item.note, 'detail-boundary')]; }
let toastTimer;
function toast(text) { $('#toast').textContent = text; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3600); }
async function copyText(text, fallbackTitle) { try { await navigator.clipboard.writeText(text); toast('已复制，可以粘贴使用。'); } catch { openDialog('复制内容', fallbackTitle, [node('p', text), node('p', '请选中上面的文字，手动复制。')]); } }
const checklist = ['孩子最近遇到的一个具体学习场景。', '当时孩子说了什么、做了什么。', '你怎样回应，之后发生了什么。', '已经尝试过什么，观察到哪些变化。', '你最希望这次沟通厘清的一件事。'];
$('#prepare-button').addEventListener('click', () => { const list = node('ol'); checklist.forEach(text => list.append(node('li', text))); const copy = node('button', '复制沟通清单 ↗', 'button button-outline'); copy.addEventListener('click', () => copyText(checklist.map((text, i) => `${i + 1}. ${text}`).join('\n'), '沟通清单')); openDialog('从具体场景开始', '带着这些观察，开始一次沟通。', [node('p', '这份清单仅帮助你准备沟通，不收集或提交任何信息。无需提供孩子的真实姓名、学校或其他敏感信息。'), list, copy]); });

function renderCases(content) { $('#case-list').replaceChildren(...content.cases.map(item => { const card = node('article', undefined, 'case-card'); const title = node('h3'); const lines = item.title.split('\n'); lines.forEach((line, index) => { if (index) title.append(document.createElement('br')); title.append(document.createTextNode(line)); }); const button = node('button', '阅读案例复盘'); button.append(node('span', '↗')); button.setAttribute('aria-label', `阅读案例：${lines.join('')}`); button.addEventListener('click', () => openDialog(item.label, lines.join(''), detailNodes(item))); card.append(node('p', item.label, 'eyebrow'), title, node('p', item.summary), node('div', item.result, 'case-result'), button); return card; })); $('#case-note').textContent = content.casesNote; }
function renderArticles(content) { $('#article-list').replaceChildren(...content.articles.map((item, index) => { const row = node('button', undefined, 'article-row'); const text = node('div'); text.append(node('h3', item.title), node('p', item.summary)); row.append(node('span', String(index + 1).padStart(2, '0'), 'article-number'), text, node('span', item.category, 'article-meta'), node('span', '↗')); row.addEventListener('click', () => openDialog(item.category, item.title, detailNodes(item))); return row; })); }
function renderCourses(content) { $('#schedule-date').textContent = `信息更新 / ${content.updatedAt.replaceAll('-', '.')}`; const courses = visibleCourses(content.courses); if (!courses.length) { const empty = node('div', undefined, 'schedule-empty'); const text = node('div'); text.append(node('h4', '新的安排，确认后在这里相见。'), node('p', '当前暂无已公布的课期。可通过微信了解课程与后续开放信息。')); const link = node('a', '联系 Amy ↗', 'text-link'); link.href = '#contact'; empty.append(node('span', '↗', 'schedule-symbol'), text, link); $('#schedule-list').replaceChildren(empty); return; }
  $('#schedule-list').replaceChildren(...courses.map(item => { const row = node('article', undefined, 'schedule-row'); const time = node('div', item.startAt ? new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', month: '2-digit', day: '2-digit' }).format(new Date(item.startAt)) : '随时', 'schedule-time'); time.append(node('small', item.format)); const text = node('div'); const heading = node('h4', item.title); heading.append(node('span', item.displayStatus, 'schedule-status')); text.append(heading, node('p', `${item.audience} · ${item.description}`)); const url = safeUrl(item.registrationUrl); const link = node('a', url && item.canRegister ? '了解与报名 ↗' : '联系了解 ↗', 'text-link'); link.href = url && item.canRegister ? url : '#contact'; if (url && item.canRegister) { link.target = '_blank'; link.rel = 'noopener noreferrer'; } row.append(time, text, link); return row; })); }
function renderContact(contact) { if (contact.wechat) { $('#contact-note').textContent = '添加微信时，可以简要说明你希望了解的课程或学习场景。'; const channel = node('div', undefined, 'contact-channel'); const copy = node('button', '复制微信号'); copy.addEventListener('click', () => copyText(contact.wechat, 'Amy 的微信')); channel.append(node('span', '微信'), node('strong', contact.wechat), copy); $('#contact-actions').prepend(channel); } const url = safeUrl(contact.bookingUrl); if (url) { const link = node('a', '预约沟通 ↗', 'button button-gold'); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; $('#contact-actions').append(link); } }
$('#year').textContent = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Shanghai', year: 'numeric' }).format(new Date());
try {
  const response = await fetch('content/site.json', { cache: 'no-cache' }); if (!response.ok) throw new Error('Content unavailable'); const content = validateContent(await response.json());
  renderCases(content); renderArticles(content); renderCourses(content); renderContact(content.contact);
  $('#curriculum-button').addEventListener('click', () => { const list = node('ol', undefined, 'lesson-list'); content.curriculum.forEach(title => list.append(node('li', title))); openDialog('RISE / 家长学习', '课程主题一览', [node('p', '以下为课程内容母稿中的主题地图，用于了解方向。具体开放主题、组合、形式与费用，以正式课程安排为准。'), list]); });
} catch (error) {
  console.error('Website content could not load:', error.message);
  $('#schedule-list').append(node('p', '课程信息暂时无法加载，请稍后刷新。', 'section-footnote'));
  $('#case-list').append(node('p', '案例内容暂时无法加载，请稍后刷新。', 'section-footnote'));
  $('#article-list').append(node('p', '笔记内容暂时无法加载，请稍后刷新。', 'section-footnote'));
  $('#curriculum-button').disabled = true;
  $('#curriculum-button').textContent = '主题信息暂不可用';
}
