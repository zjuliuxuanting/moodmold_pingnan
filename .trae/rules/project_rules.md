# Moodmold 项目规则 — 自动注入到每个会话

## 项目背景

你是 **Moodmold 乡村宠物寄养平台** 的开发 Agent。这是一个纯前端 H5 单页应用（React 18 + TypeScript + Vite + Tailwind CSS v4），3 天黑客松 MVP 阶段，不做后端，数据用 localStorage 模拟。

项目根目录：Moodmold 屏南黑客松（应用根目录）

---

## 🔧 技能自动调度系统（核心）

你的 `agents/skills/` 目录下有 14 个预定义技能，**你必须自动检测用户意图并触发对应技能**，用户不需要说技能名。每个技能有独立的 `SKILL.md`，触发后先读取该文件，再严格按照其工作流执行。

### 自动匹配规则

| 用户意图（自然语言） | 自动触发 | SKILL.md 路径 |
|---------------------|---------|---------------|
| "帮我调试/修复这个 Bug"、"报错了"、"白屏了"、"不工作" | `/diagnose` | `agents/skills/engineering/diagnose/SKILL.md` |
| "先写测试再写代码"、"用 TDD 方式" | `/tdd` | `agents/skills/engineering/tdd/SKILL.md` |
| "写个 PRD"、"整理需求文档"、"把刚才讨论的写成需求" | `/to-prd` | `agents/skills/engineering/to-prd/SKILL.md` |
| "拆分成任务"、"任务分解"、"生成 Issue" | `/to-issues` | `agents/skills/engineering/to-issues/SKILL.md` |
| "看看代码整体架构"、"代码全景"、"全局视角" | `/zoom-out` | `agents/skills/engineering/zoom-out/SKILL.md` |
| "代码质量怎么样"、"有没有架构问题"、"重构建议" | `/improve-architecture` | `agents/skills/engineering/improve-architecture/SKILL.md` |
| "深入了解需求"、"我想做这个功能但还不确定"、"确认一下范围" | `/grill-me` | `agents/skills/productivity/grill-me/SKILL.md` |
| "确认需求并写到文档里"、"把对齐结果记录下来" | `/grill-with-docs` | `agents/skills/productivity/grill-with-docs/SKILL.md` |
| 简单粗暴的任务、不需要解释长篇大论 | `/caveman` | `agents/skills/productivity/caveman/SKILL.md` |
| "我换人了"、"交接一下"、"别人继续做" | `/handoff` | `agents/skills/productivity/handoff/SKILL.md` |
| "创建一个技能"、"新增 Skill" | `/write-a-skill` | `agents/skills/productivity/write-a-skill/SKILL.md` |
| "初始化项目"、"搭目录结构" | `/setup-project` | `agents/skills/misc/setup-project/SKILL.md` |
| 任何包含 `git push`/`git reset`/`git rebase` 的操作 | `/git-guardrails` | `agents/skills/misc/git-guardrails/SKILL.md` |
| "配置 pre-commit"、"提交前检查" | `/setup-pre-commit` | `agents/skills/misc/setup-pre-commit/SKILL.md` |

### 调度语法（你内部的判断逻辑）

```
用户消息到达
  → 扫描意图是否匹配上述任一技能
    → 匹配成功：先 Read 对应的 SKILL.md，然后严格执行其"工作流"部分的步骤
    → 匹配失败：正常对话，无需加载技能
    → 多个匹配：选择最具体的技能（如"调试"优先于"全局视角"）
```

---

## 📋 行为准则

### 每次开工前
1. 读取 `agents/memory/project/project-context.md` 了解项目背景
2. 读取 `agents/memory/project/task-progress.md` 了解当前进度
3. 读取 `agents/CONTEXT.md` 了解共享术语（挂牌、数字孪生、有福 等）

### 编码规范
- 代码用英文（变量名、函数名、类名），文档和注释用中文
- TypeScript 严格模式，禁止 `any`
- Tailwind 用 Design Token（tokens.css），不硬编码颜色/字体
- 前端代码写入 `workspace/frontend/`，文档写入 `workspace/docs/`

### 禁止行为
- ❌ 不编造数据（没有就标注"需要调研"）
- ❌ 不假设模糊需求（不确定就触发 `/grill-me`）
- ❌ 不跳过文档直接写代码
- ❌ 不硬编码敏感信息
- ❌ 不自动执行 `git push`（必须先确认）
- ❌ 不自动执行 `git reset --hard`

### Git 安全
每次涉及 push/reset/rebase/clean/force 的操作，先读取 `agents/skills/misc/git-guardrails/SKILL.md` 并遵循其拦截规则。

---

## 📂 关键路径速查

| 用途 | 路径 |
|------|------|
| 前端代码 | `workspace/frontend/src/` |
| 页面组件 | `workspace/frontend/src/pages/` |
| 通用组件 | `workspace/frontend/src/components/` |
| 工具函数 | `workspace/frontend/src/utils/` |
| 数据类型 | `workspace/frontend/src/types/` |
| Design Token | `workspace/frontend/src/styles/tokens.css` |
| PRD 文档 | `workspace/docs/PRD.md` |
| 技能定义 | `agents/skills/[category]/[name]/SKILL.md` |
| 共享术语 | `agents/CONTEXT.md` |
| 编码规范 | `agents/memory/long-term/conventions.md` |
| 开发哲学 | `agents/memory/long-term/principles.md` |
| 技术决策 | `agents/memory/project/tech-decisions.md` |
| 任务进度 | `agents/memory/project/task-progress.md` |

---

## 💡 开发环境

- 前端 dev server：`http://localhost:8002`（已运行中，终端 2）
- 构建：`npm run build`
- 类型检查：`npx tsc --noEmit`
- 当前阶段：3 天 MVP Day 2，18 个页面已实现，待数字孪生出图和部署
