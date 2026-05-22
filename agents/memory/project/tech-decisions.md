# 技术决策记录

> 最后更新：2026-05-22
> 记录格式：决策日期 | 决策内容 | 决策理由 | 决策人

---

## 整体架构

| 日期 | 决策 | 理由 |
|------|------|------|
| 2026-05-22 | 前后端分离架构 | 前端独立部署，后端提供 RESTful API |
| 2026-05-22 | 前端 React + TypeScript + Vite | 生态丰富，类型安全，开发体验好 |
| 2026-05-22 | 后端 Python + FastAPI | 自动生成 API 文档，与硬件交互友好，适合训练盒场景 |

## 前端技术栈

| 决策 | 选型 | 理由 |
|------|------|------|
| 框架 | React 18+ | 生态系统最成熟 |
| 类型 | TypeScript 严格模式 | 类型安全 |
| 构建 | Vite | 开发体验快 |
| 样式 | Tailwind CSS | 原子化 CSS，快速开发 |
| 状态管理 | Zustand + TanStack Query | 轻量 + 服务端状态缓存 |
| 路由 | React Router v6 | 标准选择 |
| 组件库 | shadcn/ui (Radix UI) | 无头组件，可定制 |
| 测试 | Vitest + React Testing Library | 与 Vite 原生集成 |

## 后端技术栈

| 决策 | 选型 | 理由 |
|------|------|------|
| 语言 | Python 3.11+ | 易读、生态丰富、硬件交互友好 |
| 框架 | FastAPI | 自动 OpenAPI 文档、类型校验 |
| ORM | SQLAlchemy 2.0 + SQLModel | 成熟的 Python ORM |
| 数据库 | SQLite（开发）/ PostgreSQL（生产） | 开发轻量，生产可靠 |
| 迁移 | Alembic | 与 SQLAlchemy 集成 |
| 认证 | JWT + OAuth2 | 无状态认证 |
| 测试 | pytest + httpx | Python 标准测试工具 |

## 待决定

- [ ] 是否需要 WebSocket 实时通信（训练过程监控）
- [ ] 数据库最终用 SQLite 还是 PostgreSQL
- [ ] 是否需要用户登录系统（还是单机使用）
