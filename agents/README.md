# 🧠 Moodmold Agent 协作系统 — 总入口

> 本目录是 Moodmold 乡村宠物寄养平台的 **AI Agent 大脑中心**。受 [mattpocock/skills](https://github.com/mattpocock/skills) 启发，采用"工程哲学驱动的 AI 编码实践框架"：
> - **技能系统**：可组合的 AI Agent 技能（skills/），解决四大核心问题
> - **角色系统**：Agent 角色定义（personalities/），定义"谁来做"
> - **记忆系统**：三级记忆体系（memory/），维护项目上下文

---

## 🎯 四大核心问题 & 对策

| 问题 | 对策（技能） |
|------|-------------|
| 🎯 **智能体没做你想要的事**（对齐偏差） | `/grill-me`、`/grill-with-docs` |
| 💬 **智能体过于啰嗦**（缺乏共享语言） | `CONTEXT.md` 共享术语表 |
| 🐛 **代码跑不起来**（反馈循环缺失） | `/tdd`、`/diagnose` |
| 🏚️ **代码变成"泥球"**（架构腐化） | `/to-prd`、`/zoom-out`、`/improve-architecture` |

---

## 📂 目录结构

```
agents/
├── CLAUDE.md                                  ← Agent 行为指导文件
├── CONTEXT.md                                 ← 项目共享术语表
├── README.md                                  ← 👈 你在这里
│
├── skills/                                     ← 🔧 技能系统
│   ├── engineering/                           ←   工程技能
│   │   ├── diagnose/          /diagnose       ←   系统化调试
│   │   ├── tdd/               /tdd            ←   红-绿-重构循环
│   │   ├── to-prd/            /to-prd         ←   对话→PRD
│   │   ├── to-issues/         /to-issues      ←   计划→任务拆解
│   │   ├── improve-architecture/              ←   架构改进
│   │   └── zoom-out/          /zoom-out       ←   代码全局视图
│   ├── productivity/                          ←   生产力技能
│   │   ├── grill-me/          /grill-me       ←   需求访谈
│   │   ├── grill-with-docs/   /grill-with-docs←   访谈+写文档
│   │   ├── caveman/           /caveman        ←   极简通信模式
│   │   ├── handoff/           /handoff        ←   会话交接
│   │   └── write-a-skill/     /write-a-skill  ←   创建新技能
│   └── misc/                                   ←   辅助工具
│       ├── setup-project/     /setup-project  ←   项目初始化
│       ├── git-guardrails/                    ←   Git 安全拦截
│       └── setup-pre-commit/                  ←   Pre-commit 配置
│
├── personalities/                              ← 🎭 Agent 角色定义
│   ├── pm-agent.md                             ←   产品经理
│   ├── frontend-agent.md                       ←   前端开发
│   ├── backend-agent.md                        ←   后端开发
│   ├── tester-agent.md                         ←   测试员
│   ├── project-planner.md                      ←   项目规划
│   └── memory-manager.md                       ←   记忆管理
│
└── memory/                                     ← 🧠 三级记忆体系
    ├── INDEX.md                                ←   记忆系统说明书
    ├── long-term/                              ← 🔒 长期记忆
    │   ├── agent-workflow.md                   ←   Agent 协作工作流
    │   ├── conventions.md                      ←   编码规范
    │   └── principles.md                       ←   开发哲学
    ├── project/                                ← 📋 项目记忆
    │   ├── project-context.md                  ←   项目背景
    │   ├── tech-decisions.md                   ←   技术决策
    │   ├── task-progress.md                    ←   任务进度
    │   ├── known-issues.md                     ←   已知问题
    │   └── engineer-lessons.md                 ←   软工经验
    └── short-term/                             ← ⚡ 短期记忆
        ├── current-task.md                     ←   当前任务
        ├── session-log.md                      ←   会话日志
        └── context-snapshot.md                 ←   恢复快照
```

---

## 🚀 快速启动

### 方式一：直接使用技能
AI 对话中，输入技能名触发：
```
/grill-me              → 需求访谈，深入理解目标
/diagnose              → 系统化调试 Bug
/tdd                   → 红-绿-重构测试驱动开发
/to-prd                → 将对话内容合成为 PRD
/zoom-out              → 查看代码全局视图
/caveman               → 切换到极简通信模式
/handoff               → 生成会话交接文档
```

### 方式二：启动 Agent 角色
1. 打开 `agents/personalities/[角色名].md`
2. 复制全部内容作为 System Prompt
3. 对 AI 说任务描述

### 方式三：Agent 协作流程

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
           └──────┬───────┴──────┬───────┘
                  │              │
                  ▼              ▼
           ┌────────────────────────────┐
           │  🧪 Tester Agent           │
           │  回归测试 + 深度探索        │
           │  产出：测试报告             │
           └────────────────────────────┘

  🧠 Memory Manager 全程运行在后台，维护三级记忆
```

---

## ⚠️ 重要约定

| 约定 | 说明 |
|------|------|
| Agent .md 是只读的 | 角色定义在 `personalities/`，不修改 |
| 项目记忆是活的 | `memory/project/` 由各 Agent 运行时写入 |
| 短期记忆每个会话刷新 | `memory/short-term/` 会话结束后归档、重置 |
| 产出物写入 workspace | 文档 → `workspace/docs/`，代码 → `workspace/frontend/`、`workspace/backend/` |
| 先看记忆再开工 | 每个 Agent 开工前先读 `memory/project/` 了解上下文 |
| 不确定就提问 | 用 `/grill-me` 澄清需求，禁止假设 |
| 共享术语 | 所有 Agent 使用 `CONTEXT.md` 中的统一术语 |

---

## 📖 更多

- Agent 行为指导 → [CLAUDE.md](./CLAUDE.md)
- 共享术语表 → [CONTEXT.md](./CONTEXT.md)
- Agent 协作工作流 → [memory/long-term/agent-workflow.md](./memory/long-term/agent-workflow.md)
- 记忆系统说明 → [memory/INDEX.md](./memory/INDEX.md)
- 编码规范 → [memory/long-term/conventions.md](./memory/long-term/conventions.md)
- 开发哲学 → [memory/long-term/principles.md](./memory/long-term/principles.md)
- 技术决策 → [memory/project/tech-decisions.md](./memory/project/tech-decisions.md)
