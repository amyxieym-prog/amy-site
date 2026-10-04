# 议敏 Amy · 乐学四步个人网站

Astro 静态网站，以最新个人介绍为内容依据，保留一页式品牌首页，配套可独立分享的文章、脱敏案例与课程页。墨绿、香槟金、暖米白，参考 Amy 人物品牌海报。

正式地址：https://amyxie.yiloo.cn 。已部署 Cloudflare Pages 并绑定子域名，HTTPS 验证通过。

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

Cloudflare Pages：构建命令 `pnpm build`，产物 `dist`，Node 24。本仓库 main 分支通过 GitHub Actions 检查、构建并自动上传 Cloudflare Pages。专用 Pages Write 凭证已加密存储于仓库 Secrets，有效期一年。也可使用 `pnpm deploy` 手动上传。绑定 amyxie.yiloo.cn 时，先在 Pages 添加自定义域名，再处理 DNS。

原版保存在 `legacy/v1/` 和 Git 标签 `v1-github-pages`。Astro 正式版本使用 main 分支，改版分支 astro-cloudflare-v2 保留。现有 GitHub Pages 原版作为历史版本。
