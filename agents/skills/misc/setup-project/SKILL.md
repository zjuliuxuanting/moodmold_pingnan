# /setup-project — 一键项目初始化

> 类型：杂项技能 | 触发词：`/setup-project`、初始化项目、搭建脚手架

---

## 用途

按照本项目的一贯模式，快速初始化或重新建立项目文件结构。用于新成员加入或擦除后重建。

## 工作流

### 步骤 1：检查已有文件
- 扫描 `workspace/` 和 `agents/` 目录
- 报告已有文件（避免覆盖）

### 步骤 2：创建缺失目录

```
workspace/
├── docs/
│   ├── tasks/           → 任务单存放
│   ├── handoffs/        → 交接文档
│   ├── ui-ux/           → 设计稿
│   ├── meeting-notes/   → 会议记录
│   ├── sprint/          → Sprint 看板
│   └── deliverables/    → 交付物说明
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       └── utils/
└── scripts/
```

### 步骤 3：创建模板文件（仅当不存在时）

| 模板 | 路径 | 内容 |
|------|------|------|
| PRD 模板 | `workspace/docs/PRD.md` | PM Agent 的 11 章标准 PRD |
| 任务看板 | `workspace/docs/sprint/kanban.md` | 从 task-progress.md 生成 |
| .gitignore | `workspace/.gitignore` | node_modules, dist, .env |

### 步骤 4：同步记忆系统
- 确保 `agents/memory/` 下的 INDEX.md 指向正确位置
- 更新 `agents/memory/project/task-progress.md` 记录初始化事件

## 安全规则

- ❌ 绝不覆盖已有文件
- ❌ 不删除任何现有文件
- ✅ 如果全部已有 → 报告"结构完整，无需初始化"并退出
