# 个人网站（GitHub Pages）

此仓库为静态个人网站，可通过 GitHub Pages 自动部署。

## 本地开发
- 使用 Python 简易服务器：`python -m http.server 8000`
- 访问：`http://localhost:8000/`

## 部署到 GitHub Pages（Actions）
1. 推送到 GitHub 仓库的 `main` 分支
2. 在仓库设置启用 Pages（Build and deployment 选择 GitHub Actions）
3. Actions 工作流会自动部署，完成后页面地址会显示在部署记录中

## 自定义域名
- 在仓库根目录添加 `CNAME` 文件，内容为你的域名（如 `www.example.com`）
- 在域名服务商添加 `CNAME` 解析到 `username.github.io`

