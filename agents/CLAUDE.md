# CLAUDE.md — Agent 行为指导

> 类型：长期记忆 | 修改频率：低 | 最后更新：2026-05-22

---

这是 Moodmold 乡村宠物寄养平台项目的 Agent 行为指导文件。所有在此项目中工作的 AI Agent 都应遵循此文件。

## 项目背景速览

Moodmold 是一个**纯前端 H5 单页应用**，实现乡村宠物寄养的数字孪生平台。核心差异化是"数字孪生 + 透明监控 + 情绪价值出片"。

- **技术栈**：React 18 + TypeScript + Vite + Tailwind CSS v4 + React Router v7
- **部署**：Vercel（计划），当前本地 8002 端口
- **3 天 MVP**：不做后端、不调 AI、用 localStorage + 静态 JSON 模拟数据

## 你的工作方式

### 首先，始终做到这 3 件事
1. **读取上下文**：每项新任务前，先读 `agents/memory/project/project-context.md` 和 `agents/memory/project/task-progress.md`
2. **遵循规范**：编码规范在 `agents/memory/long-term/conventions.md`，开发哲学在 `agents/memory/long-term/principles.md`
3. **使用共享语言**：项目术语定义在 `agents/CONTEXT.md`，请用相同的术语沟通

### 禁止行为
- ❌ 跳过文档直接写代码（先写文档，再写代码）
- ❌ 假设模糊需求（不确定就提问，用 `/grill-me`）
- ❌ 在无关领域做"顺手优化"（保持专注，做完再重构）
- ❌ 编造数据（没有数据就标注"需要调研"）
- ❌ 硬编码敏感信息（密码、Token、API Key 走环境变量）
- ❌ 使用 `any` 类型（TypeScript 严格模式）

### 代码质量
- 代码用英文，文档和注释用中文
- 每次编辑后检查 TypeScript 编译（`npx tsc --noEmit`）
- 每次编辑后确认构建成功（`npm run build`）
- React 组件：memo + useCallback 用于性能关键路径
- Tailwind 类名：使用 Design Token 而非硬编码颜色/字体

### Git 安全
- 永远不要自动执行 `git push`，必须先向用户确认
- 永远不要自动执行 `git reset --hard`

## 技能系统

你有一组可用技能，通过输入 `技能名` 触发：

### 工程技能（写出好代码）
- `/diagnose` — 系统化调试（复现 → 最小化 → 假设 → 插桩 → 修复 → 回归）
- `/tdd` — 红-绿-重构测试驱动开发循环
- `/to-prd` — 将对话合成为 PRD
- `/to-issues` — 将计划拆分为可认领的任务
- `/improve-architecture` — 扫描并改进代码架构
- `/zoom-out` — 提供代码库全局视图

### 生产力技能（高效协作）
- `/grill-me` — 盘问式需求访谈
- `/grill-with-docs` — 带文档输出的需求访谈
- `/caveman` — 极简通信模式
- `/handoff` — 生成会话交接文档
- `/write-a-skill` — 创建新技能

### 杂项技能（辅助工具）
- `/setup-project` — 一键初始化项目结构
- `/git-guardrails` — Git 危险操作拦截
- `/setup-pre-commit` — 配置 Pre-commit Hooks

## 文件路径约定

| 类型 | 位置 |
|------|------|
| 前端页面 | `workspace/frontend/src/pages/` |
| 前端组件 | `workspace/frontend/src/components/` |
| 工具函数 | `workspace/frontend/src/utils/` |
| 自定义 Hooks | `workspace/frontend/src/hooks/` |
| 设计资源 | `workspace/docs/ui-ux/` |
| PRD 文档 | `workspace/docs/PRD.md` |
| 任务单 | `workspace/docs/tasks/` |
| Agent 技能 | `agents/skills/` |
| Agent 角色 | `agents/personalities/` |
| 项目记忆 | `agents/memory/project/` |
