# 议敏 Amy · RISE 个人网站

以 RISE 为专业主线的一页式个人网站。深墨绿与暖米白视觉，真实肖像，响应式排版，包含四维理论交互、脱敏案例、课程主题、可更新课期、个人观点和微信联系。

仓库：https://github.com/amyxieym-prog/amy-site

GitHub Pages 地址（部署成功后）：https://amyxieym-prog.github.io/amy-site/

## 本地查看

安装 Node.js 20 或更新版本，无需安装依赖。

```sh
npm run dev
```

打开 `http://127.0.0.1:4173`。内容工作台：`http://127.0.0.1:4173/editor.html`。

## 更新内容

全部动态内容位于 `content/site.json`。可直接修改，或用本地工作台填写联系方式和真实课期、编辑案例与文章，再导出 `site.json` 替换该文件。

工作台仅保存浏览器本地草稿和导出文件，**没有在线数据库、账户或自动发布功能**，不进入公开网站部署。后续需要在线后台时，可在此内容结构上接入具备身份认证的内容服务。

更新后：

```sh
npm run check
npm run build
git add content/site.json
git commit -m "Update website content"
git push
```

推送 main 后 GitHub Actions 自动检查、构建并部署。首次需在仓库 Settings → Pages 将 Source 设为 GitHub Actions。部署目录是 `dist/`，不包含本地工作台、文档或 QA。

## 课程时间与状态

日期时间必须包含时区，例如 `2026-10-20T19:30:00+08:00`。状态支持 `upcoming`、`open`、`closed`、`ongoing`、`ended`、`evergreen`。已结束课程自动退出近期列表；到报名截止时间自动改为报名截止；活动开始后改为进行中，不再显示报名按钮。无公布课期时显示真实的空状态。

课程只展示真实确认的安排，不把课程母稿当成在售套餐。需要价格、地点或参与条件时，写入课程 description，并链接正式报名页。

## 内容边界

RISE 使用 2026-09-23 确认口径：E → S → I → R → 成绩。案例已按 Amy 在本次网站任务中的明确授权脱敏，不公开姓名、学校、家庭身份、地域、具体分数、原始转写与内部评估分值。网站不发布内部知识库，不承诺统一效果。详细原则见 `docs/content-policy.md`。

## 项目结构

- `index.html` / `styles.css` / `app.js`：网站页面、视觉与交互
- `content/site.json`：课程、案例、笔记、联系方式
- `content-model.js`：内容校验、课程状态转换、链接限制
- `editor.html` / `editor.js`：仅本地的内容工作台
- `scripts/`：本地预览、检查与构建
- `.github/workflows/pages.yml`：GitHub Pages 自动发布

无外部字体、第三方跟踪或远程图片依赖。
