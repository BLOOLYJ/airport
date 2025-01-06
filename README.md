# 航空订票系统 (Airport Booking System)

这是一个基于 Vue.js 开发的现代化航空订票系统，提供机票预订、航班查询、会员服务等功能。

## 功能特点

- 🔍 航班搜索与预订
  - 支持单程/往返航班搜索
  - 灵活的日期选择
  - 多种舱位选择（经济舱/商务舱）
  - 实时座位查询

- 🎫 特色服务
  - 在线选餐服务
  - 贵宾休息室预订
  - 行李托运服务
  - 航班动态追踪

- 💰 促销活动
  - 定期特惠机票
  - 会员专享优惠
  - 节假日特别活动
  - 积分兑换服务

- 👤 会员中心
  - 个人信息管理
  - 订单历史查询
  - 积分管理
  - 会员等级特权

## 技术栈

- 前端框架：Vue.js
- UI 组件库：Element UI
- 状态管理：Vuex
- 路由管理：Vue Router
- 构建工具：Vue CLI

## 快速开始

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/<USERNAME>/airport.git
cd airport
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run serve
```

4. 构建生产版本
```bash
npm run build
```

## 项目结构

```
airport/
├── public/                 # 静态资源
├── src/                    # 源代码
│   ├── assets/            # 资源文件
│   ├── components/        # 公共组件
│   ├── router/            # 路由配置
│   ├── store/             # Vuex 状态管理
│   ├── views/             # 页面组件
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── tests/                 # 测试文件
├── .gitignore            # Git 忽略文件
├── babel.config.js       # Babel 配置
├── package.json          # 项目配置
└── README.md             # 项目说明
```

## 主要页面

- 首页：展示热门航线、特价机票和促销活动
- 航班搜索：提供航班查询和预订功能
- 航班详情：显示航班具体信息和预订选项
- 会员中心：管理个人信息和订单
- 特色服务：提供餐食预订等增值服务
- 促销活动：展示当前优惠活动

## 部署说明

### GitHub Pages 部署

1. 修改 `vue.config.js` 中的 `publicPath`
2. 执行部署脚本
```bash
chmod +x deploy.sh
./deploy.sh
```

### Vercel 部署

1. 安装 Vercel CLI
```bash
npm install -g vercel
```

2. 部署项目
```bash
vercel login
vercel
```

### Netlify 部署

通过 Netlify 网站部署：
1. 连接 GitHub 仓库
2. 选择部署选项
3. 完成自动部署

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

## 许可证

[MIT License](LICENSE)



## 致谢

感谢所有为这个项目做出贡献的开发者！
