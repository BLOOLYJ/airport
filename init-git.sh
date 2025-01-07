#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 初始化 git
git init

# 添加所有文件到暂存区
git add .

# 提交更改
git commit -m "initial commit"

# 添加远程仓库（需要替换 USERNAME）
read -p "请输入您的 GitHub 用户名: " username
git remote add origin "https://github.com/$username/airport.git"

# 推送到远程仓库
git push -u origin master

echo "初始化完成！" 