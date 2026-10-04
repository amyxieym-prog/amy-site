const menu = document.querySelector<HTMLButtonElement>('.menu-toggle');
const nav = document.querySelector<HTMLElement>('#main-nav');
function closeMenu() { menu?.setAttribute('aria-expanded', 'false'); menu?.setAttribute('aria-label', '打开导航'); nav?.classList.remove('open'); }
menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? '关闭导航' : '打开导航'); nav?.classList.toggle('open', open); });
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav?.classList.contains('open')) { closeMenu(); menu?.focus(); } });

const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-rise]')];
function selectRise(key: string, focus = false) { tabs.forEach(tab => { const selected = tab.dataset.rise === key; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; if (selected && focus) tab.focus(); }); document.querySelectorAll('.rise-panel').forEach(panel => { const active = panel.id === `panel-${key}`; panel.classList.toggle('is-active', active); panel.setAttribute('aria-hidden', String(!active)); }); }
tabs.forEach((tab, index) => { tab.addEventListener('click', () => selectRise(tab.dataset.rise!)); tab.addEventListener('keydown', event => { const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End']; if (!keys.includes(event.key)) return; event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length; selectRise(tabs[next].dataset.rise!, true); }); });
if (tabs.length) selectRise('R');
let toastTimer: ReturnType<typeof setTimeout>;
function toast(message: string) { const element = document.querySelector<HTMLElement>('#toast'); if (!element) return; element.textContent = message; element.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => element.classList.remove('visible'), 3500); }
async function copy(value: string) { try { await navigator.clipboard.writeText(value); toast('已复制，可以粘贴使用。'); } catch { toast(`请手动复制：${value}`); } }
document.querySelectorAll<HTMLElement>('[data-copy]').forEach(button => button.addEventListener('click', () => copy(button.dataset.copy!)));
const dialog = document.querySelector<HTMLDialogElement>('#prepare-dialog');
let priorFocus: HTMLElement | null = null;
document.querySelectorAll('[data-prepare]').forEach(button => button.addEventListener('click', () => { priorFocus = document.activeElement as HTMLElement; dialog?.showModal(); document.body.style.overflow = 'hidden'; }));
document.querySelector('[data-close-dialog]')?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('close', () => { document.body.style.overflow = ''; priorFocus?.focus(); });
dialog?.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
document.querySelector('[data-copy-checklist]')?.addEventListener('click', () => copy([...document.querySelectorAll('#prepare-dialog li')].map((item, i) => `${i + 1}. ${item.textContent}`).join('\n')));
const filters = [...document.querySelectorAll<HTMLButtonElement>('[data-filter]')];
filters.forEach(button => button.addEventListener('click', () => { const category = button.dataset.filter; filters.forEach(item => { item.setAttribute('aria-pressed', String(item === button)); item.classList.toggle('is-active', item === button); }); let count = 0; document.querySelectorAll<HTMLElement>('[data-category]').forEach(card => { card.hidden = category !== 'all' && card.dataset.category !== category; if (!card.hidden) count++; }); const result = document.querySelector('#filter-status'); if (result) result.textContent = `显示 ${count} 篇文章`; }));

// Re-evaluate event status in the visitor's browser so a static build never
// keeps a finished event open for registration.
document.querySelectorAll<HTMLElement>('[data-course-status]').forEach(element => {
  const status = element.dataset.courseStatus;
  if (['theme', 'evergreen'].includes(status || '')) return;
  const start = Date.parse(element.dataset.start || ''); const end = Date.parse(element.dataset.end || ''); const deadline = Date.parse(element.dataset.deadline || '');
  const now = Date.now(); const isEnded = status === 'ended' || end <= now;
  const registration = element.querySelector<HTMLAnchorElement>('[data-registration]');
  const badge = element.querySelector('[data-status-label]');
  if (isEnded && element.dataset.schedule === 'true') { element.hidden = true; }
  if (badge) { if (isEnded) badge.textContent = '已结束'; else if (start <= now && status !== 'closed') badge.textContent = '进行中'; else if (deadline <= now && status === 'open') badge.textContent = '报名截止'; }
  if (registration && (isEnded || start <= now || deadline <= now || !['open', 'evergreen'].includes(status || ''))) { registration.href = '/#contact'; registration.textContent = '联系了解 ↗'; registration.removeAttribute('target'); }
});
const schedule = document.querySelector('#schedule-list');
const empty = document.querySelector<HTMLElement>('#schedule-empty');
if (schedule && empty) empty.hidden = [...schedule.querySelectorAll<HTMLElement>('[data-schedule]')].some(item => !item.hidden);
