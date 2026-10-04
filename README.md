# 议敏 Amy · 乐学四步个人网站

Astro 静态网站，以最新个人介绍为内容依据，保留一页式品牌首页，配套可独立分享的文章、脱敏案例与课程页。墨绿、香槟金、暖米白，参考 Amy 人物品牌海报。

目标正式域名：https://amyxie.yiloo.cn （Cloudflare 授权及域名绑定完成前不视为已上线）。

## 本地查看

需要 Node.js 24 和 pnpm 11.25.0。

```
pnpm install
pnpm dev
```

打开 http://127.0.0.1:4321 。检查与构建：`pnpm check`、`pnpm build`。构建目录为 `dist`。

## 更新内容

- 文章：`src/content/blog/`，使用 `templates/新文章.md`。
- 案例：`src/content/cases/`，草稿和未授权内容不会公开。
- 课程：`src/content/courses/`，主题与具体活动分开管理。
- 品牌联系方式：`src/data/site.json`。

参阅 `docs/文章与公众号发布流程.md` 和 `docs/内容来源与口径.md`。`.pages.yml` 提供 Pages CMS 表单配置，仍需要连接账号；公众号由人工发布，真实链接回填网站。

## 发布

Cloudflare Pages：构建命令 `pnpm build`，产物 `dist`，Node 24。推荐连接本 GitHub 仓库的正式分支以自动部署。也可在账号授权后使用 `pnpm deploy` 手动上传。绑定 amyxie.yiloo.cn 时，先在 Pages 添加自定义域名，再处理 DNS。

原版保存在 `legacy/v1/` 和 Git 标签 `v1-github-pages`。当前改版在 `astro-cloudflare-v2` 分支，正式发布前保留现有 GitHub Pages 原版。
