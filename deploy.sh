#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 读取用户名
read -p "请输入您的 GitHub 用户名: " username

# 构建
echo "正在构建项目..."
npm run build

# 进入生成的构建文件夹
cd dist

# 初始化 git
git init
git add -A
git commit -m 'deploy'

# 推送到 gh-pages 分支
echo "正在部署到 GitHub Pages..."
git push -f "https://github.com/$username/airport.git" master:gh-pages

cd -

echo "部署完成！"
echo "请访问 https://$username.github.io/airport 查看部署结果" 