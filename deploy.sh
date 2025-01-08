#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 构建
echo "正在构建项目..."
npm run build

# 进入构建文件夹
cd dist

# 创建 .nojekyll 文件，防止 GitHub Pages 忽略以下划线开头的文件
touch .nojekyll

# 初始化 git 并提交
git init
git add -A
git commit -m 'deploy'

# 设置部署配置
git config --local http.sslVerify false
git config --local http.postBuffer 524288000

# 使用 git protocol 而不是 https
git remote add origin git@github.com:BLOOLYJ/airport.git
git push -f origin master:gh-pages

cd -

echo "部署完成！"
echo "请等待几分钟，然后访问 https://BLOOLYJ.github.io/airport" 