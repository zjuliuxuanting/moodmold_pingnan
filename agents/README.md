# 🧠 Agent 协作系统 — 总入口

> 本目录是黑客松项目的 **AI Agent 大脑中心**。每个 Agent 有自己的"人设"系统提示词，所有 Agent 共用一套三级记忆体系。

---

## 🎭 如何进入你的身份

当你要以某个角色工作时，**复制对应 Agent 文件的全部内容**，作为你的系统提示词（System Prompt），填入 AI 对话的开头。你的 AI 就会以该角色的身份、规范、工作流来执行任务。

所有 Agent 角色文件位于：**[memory/long-term/personalities/](./memory/long-term/personalities/)**

| 角色 | 文件 | 一句话定位 |
|------|------|-----------|
| 📋 **产品经理** | [pm-agent.md](./memory/long-term/personalities/pm-agent.md) | 理解需求 → 写 PRD → 排优先级 |
| 🎨 **前端开发** | [frontend-agent.md](./memory/long-term/personalities/frontend-agent.md) | React + TS + Vite，组件化开发 |
| ⚙️ **后端开发** | [backend-agent.md](./memory/long-term/personalities/backend-agent.md) | Python + FastAPI，API + 数据库 |
| 🧪 **测试员** | [tester-agent.md](./memory/long-term/personalities/tester-agent.md) | 以实验人员视角验收质量 |
| 📐 **项目规划** | [project-planner.md](./memory/long-term/personalities/project-planner.md) | PRD → 可执行步骤计划 |
| 🧠 **记忆管理** | [memory-manager.md](./memory/long-term/personalities/memory-manager.md) | 长期记忆的存储、检索、修剪 |

---

## 🔄 Agent 协作流程

```
                    ┌──────────────┐
                    │  用户 / 你   │
                    └──────┬───────┘
                           │ 提需求
                           ▼
               ┌───────────────────────┐
               │  📋 PM Agent          │
               │  产出：PRD.md          │
               └───────────┬───────────┘
                           │ PRD 交付
              ┌────────────┼────────────┐
              ▼            ▼            ▼
     ┌────────────┐ ┌────────────┐ ┌────────────┐
     │ 📐 Planner │ │ ⚙️ Backend │ │ 🎨 Frontend│
     │ 任务拆解    │ │ API + 数据库│ │ UI + 组件  │
     └─────┬──────┘ └─────┬──────┘ └─────┬──────┘
           │              │              │
           │    api-spec  │              │
           │◄─────────────┼──────────────►
           │              │   对齐接口    │
           └──────┬───────┴──────┬───────┘
                  │              │
                  ▼              ▼
           ┌────────────────────────────┐
           │  🧪 Tester Agent           │
           │  回归测试 + 深度探索        │
           │  产出：测试报告             │
           └────────────────────────────┘

  🧠 Memory Manager 全程运行在后台，维护三级记忆：
     🔒 长期记忆 — 角色定义、编码规范、核心原则
     📋 项目记忆 — 技术决策、任务进度、已知问题
     ⚡ 短期记忆 — 当前任务、会话日志、恢复快照
```

---

## 📂 目录结构

```
agents/
├── README.md                                  ← 👈 你在这里
│
├── memory/                                     ← 🧠 三级记忆体系
│   ├── INDEX.md                                ←   记忆系统说明书（给 Memory Manager 看）
│   │
│   ├── long-term/                              ← 🔒 长期记忆
│   │   ├── personalities/                      ←   各 Agent 的系统提示词（角色定义）
│   │   ├── conventions.md                      ←   编码规范（项目宪法）
│   │   └── principles.md                       ←   开发哲学与核心原则
│   │
│   ├── project/                                ← 📋 项目记忆
│   │   ├── project-context.md                  ←   项目背景、目标、用户画像
│   │   ├── tech-decisions.md                   ←   技术选型及理由
│   │   ├── task-progress.md                    ←   任务完成状态（高频更新）
│   │   └── known-issues.md                     ←   已知问题 & 技术债务
│   │
│   └── short-term/                             ← ⚡ 短期记忆
│       ├── current-task.md                     ←   正在执行的任务
│       ├── session-log.md                      ←   当前会话摘要
│       └── context-snapshot.md                 ←   崩溃恢复快照
│
└── workspace/...                                ← 🏗️ 详见 workspace/ 目录
```

---

## 🚀 快速启动示例

### 第 1 步：让 PM Agent 写 PRD

1. 打开 [pm-agent.md](./memory/long-term/personalities/pm-agent.md)
2. 复制全部内容作为 System Prompt
3. 对 AI 说：*"请为行为学训练盒上位机软件编写 PRD"*
4. PM Agent 产出 → `workspace/docs/PRD.md`
5. Memory Manager 自动更新 → `memory/project/task-progress.md`

### 第 2 步：让 Backend Agent 设计 API

1. 打开 [backend-agent.md](./memory/long-term/personalities/backend-agent.md)
2. 复制全部内容作为 System Prompt
3. 对 AI 说：*"根据 workspace/docs/PRD.md，设计 API 接口并写入 workspace/docs/api-spec.md"*

### 第 3 步：并行开发

- Frontend Agent 读 `api-spec.md` → 开发前端组件
- Backend Agent 读 `PRD.md` → 开发 API 和数据库

### 第 4 步：测试验收

- Tester Agent 读 `PRD.md` + `api-spec.md` → 回归 + 探索测试 → 输出测试报告

---

## ⚠️ 重要约定

| 约定 | 说明 |
|------|------|
| Agent .md 是只读的 | 角色定义在 `memory/long-term/personalities/`，不修改 |
| 项目记忆是活的 | `memory/project/` 由 Memory Manager 和各 Agent 运行时写入 |
| 短期记忆每个会话刷新 | `memory/short-term/` 会话结束后归档、重置 |
| 产出物写入 workspace | 文档 → `workspace/docs/`，代码 → `workspace/frontend/`、`workspace/backend/` |
| 先看记忆再开工 | 每个 Agent 开工前先读 `memory/project/` 了解上下文 |

---

## 📖 更多

- 记忆系统详细说明 → [memory/INDEX.md](./memory/INDEX.md)
- 开发哲学与核心原则 → [memory/long-term/principles.md](./memory/long-term/principles.md)
- 技术选型记录 → [memory/project/tech-decisions.md](./memory/project/tech-decisions.md)
