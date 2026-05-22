# Moodmold 屏南黑客松

> Claude Code 项目记忆。与团队共享，提交到 git。

## 项目是什么

**Moodmold 乡村寄养** — 城市宠物主通过挂牌 + H5 平台，实时查看宠物在乡村的「数字孪生日记」。

- **阶段**：3 天黑客松 MVP（纯前端 H5，无后端）
- **技术栈**：React 18 + TypeScript + Vite + Tailwind CSS + localStorage
- **仓库**：https://github.com/zjuliuxuanting/moodmold_pingnan

## 目录结构

```
agents/                    # Agent 协作系统（人设 + 三级记忆）
  memory/
    long-term/             # 角色定义、编码规范、原则
    project/               # 项目上下文、进度、技术决策（高频更新）
    short-term/            # 当前任务、会话日志（会话级）
workspace/
  docs/                    # PRD、交付物、会议记录
  frontend/                # 前端代码（待搭建）
  backend/                 # 预留，MVP 不做
.claude/                   # Claude Code 配置（子代理、权限、技能）
```

## 开工前必读

1. `agents/memory/project/project-context.md` — 产品定位与用户
2. `agents/memory/project/task-progress.md` — 当前任务与进度
3. `agents/memory/project/tech-decisions.md` — 技术选型（MVP 纯前端）
4. `agents/memory/long-term/conventions.md` — 编码与路径约定

## 关键文档

| 文档 | 路径 |
|------|------|
| 作战手册 v0.1 | `workspace/docs/meeting-notes/v0.1-moodmold-original.md` |
| 产品战略 v0.3 | `workspace/docs/meeting-notes/v0.3-product-strategy.md` |
| 交付物说明书 | `workspace/docs/deliverables/deliverable-specification-v1.md` |
| 项目执行文档 v4 | `workspace/docs/deliverables/项目执行文档v4.md` |

## Agent 协作

本项目用 **6 个子代理**，定义在 `.claude/agents/`。用法示例：

- `使用 pm-agent 根据当前需求写 PRD`
- `使用 frontend-agent 搭建 Vite 项目并实现宠物主页`
- `使用 tester-agent 验收 B2 沟通家长模块`

角色完整提示词在 `agents/memory/long-term/personalities/`。子代理会自动引用这些文件。

协作流程见 `agents/README.md`。

## 开发约定

- **文档与提交信息用中文**；代码标识符用英文
- **产出物写入 `workspace/`**：文档 → `workspace/docs/`，代码 → `workspace/frontend/`
- **禁止**在记忆文件或代码中写入 API Key、Token、密码
- **MVP 不做**：后端 API、数据库、用户登录、真实 AI 出图（用预设资产叠加）
- 修改 `agents/memory/project/` 后简要说明更新了哪些文件

## 前端命令（`workspace/frontend/` 创建后）

```bash
cd workspace/frontend
npm install
npm run dev      # 本地开发
npm run build    # 生产构建
```

## 常用技能

在 Claude Code 中输入 `/` 可调用：

| 技能 | 用途 |
|------|------|
| `/pm` | 产品经理：PRD、需求澄清 |
| `/frontend` | 前端开发 |
| `/backend` | 后端开发（MVP 阶段仅文档/API 设计） |
| `/test` | 测试验收 |
| `/plan` | 任务拆解与里程碑 |
| `/memory` | 更新项目记忆 |
