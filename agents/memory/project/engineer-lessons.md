# 软件工程师 · 跨会话记忆

> 类型：项目记忆 | 修改频率：中 | 最后更新：2026-05-22

---

## 教训

### 2026-05-22 | 大规模 Tailwind 类名替换
- 设计 tokens 映射表执行时必须注意上下文区分：`rounded-xl` 在卡片/输入框/按钮中映射不同（`rounded-card` / `rounded-input` / `rounded-pill`）
- 替换 `font-bold` → `font-serif` 时需注意：`font-bold` 与 `font-serif` 不互斥，相当于删 weight 加 family，在 Tailwind v4 @theme 中效果正确
- 原 `disabled:opacity-30` 改为 `disabled:bg-border-light` 是语义变更：从"变淡"改为"置灰底色"
- HMR 热更新即时反馈，每次编辑后都能看到编译结果
- `focus:ring-gray-900` 要一起替换为 `focus:ring-accent-primary`，否则焦点态不统一
- `bg-gradient-to-t from-gray-50` 中的 `from-gray-50` 要替换为 `from-primary-bg`（渐变也要 token 化）

## 项目状态
- Dev server 运行在 `localhost:8002`（终端 5）
- 7 个页面已完成设计 token 迁移
