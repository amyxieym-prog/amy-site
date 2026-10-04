import { validateContent } from './content-model.js';
const $ = id => document.getElementById(id);
const key = 'amy-site-content-draft-v1';
function message(text) { $('message').textContent = text; }
function read() { return validateContent(JSON.parse($('json').value)); }
function write(data) { $('json').value = JSON.stringify(data, null, 2); $('wechat').value = data.contact.wechat; $('booking').value = data.contact.bookingUrl; $('updated').value = data.updatedAt; }
function action(fn) { return async () => { try { await fn(); } catch(error) { message(`未完成：${error.message}`); } }; }
async function load() { const response = await fetch('content/site.json', { cache: 'no-cache' }); if (!response.ok) throw new Error('无法读取项目内容'); write(validateContent(await response.json())); message('已读取项目内容。'); }
$('load-current').onclick = action(load);
$('load-draft').onclick = action(() => { const draft = localStorage.getItem(key); if (!draft) throw new Error('这个浏览器还没有保存草稿'); write(validateContent(JSON.parse(draft))); message('已恢复本地草稿，尚未发布。'); });
$('save-draft').onclick = action(() => { localStorage.setItem(key, JSON.stringify(read())); message('草稿已保存在本浏览器，尚未发布。'); });
$('import-file').onchange = action(async () => { const file = $('import-file').files[0]; if (file) { write(validateContent(JSON.parse((await file.text()).replace(/^\uFEFF/, '')))); message('已导入文件，尚未发布。'); } });
$('apply-contact').onclick = action(() => { const data = read(); data.contact = { wechat: $('wechat').value.trim(), bookingUrl: $('booking').value.trim() }; data.updatedAt = $('updated').value; write(validateContent(data)); message('联系方式已写入编辑内容，尚未导出或发布。'); });
const withZone = value => value ? `${value}:00+08:00` : '';
$('add-course').onclick = action(() => { const data = read(); const id = $('course-id').value.trim(); if (!/^[a-z0-9-]+$/.test(id)) throw new Error('编号请使用小写字母、数字和短横线'); data.courses.push({ id, title: $('course-title').value.trim(), audience: $('audience').value.trim(), description: $('description').value.trim(), format: $('format').value.trim(), status: $('status').value, startAt: withZone($('start').value), endAt: withZone($('end').value), registrationDeadline: withZone($('deadline').value), registrationUrl: $('registration').value.trim() }); write(validateContent(data)); message('课程已加入编辑内容，尚未导出或发布。'); });
$('export').onclick = action(() => { const data = read(); const blob = new Blob([JSON.stringify(data, null, 2) + '\n'], { type: 'application/json;charset=utf-8' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'site.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); message('内容检查通过，已导出 site.json。替换项目 content/site.json 后运行检查并推送，才会发布。'); });
action(load)();
