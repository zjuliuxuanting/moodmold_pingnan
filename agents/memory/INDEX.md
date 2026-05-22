# 记忆系统说明书

> 目标读者：Memory Manager Agent | 也供其他 Agent 参考

---

## 记忆架构总览

```
memory/
├── long-term/              🔒 长期记忆 — 几乎不变的"源代码"
│   ├── personalities/      ← 各 Agent 的系统提示词（角色定义）
│   ├── conventions.md      ← 编码规范（项目宪法）
│   └── principles.md       ← 开发哲学与核心原则
│
├── project/                📋 项目记忆 — 本项目特有的事实
│   ├── project-context.md  ← 项目背景、目标、用户画像
│   ├── tech-decisions.md   ← 技术选型及理由
│   ├── task-progress.md    ← 任务完成状态（高频更新）
│   └── known-issues.md     ← 已知问题、开放问题、技术债务
│
└── short-term/             ⚡ 短期记忆 — 会话级上下文
    ├── current-task.md     ← 正在执行的任务（单任务锁）
    ├── session-log.md      ← 会话活动摘要
    └── context-snapshot.md ← 崩溃恢复快照
```

---

## 三类记忆的读写规则

| 记忆类型 | 写入者 | 写入频率 | 读取者 | 修剪策略 |
|---------|--------|---------|--------|---------|
| **长期记忆** | 管理员 | 极少（项目启动 / 重大变更） | 所有 Agent | 不修剪，只版本化 |
| **项目记忆** | 各 Agent + Memory Manager | 每天 / 每阶段 | 所有 Agent | 定期归档旧记录 |
| **短期记忆** | 当前活跃 Agent | 每步骤 | 当前活跃 Agent | 会话结束后压缩归档 |

## Memory Manager 的工作流

### 会话开始时
1. 读取 `context-snapshot.md` 检查是否有中断恢复
2. 读取 `task-progress.md` 了解当前进度
3. 读取 `current-task.md` 恢复工作上下文

### 会话进行中
1. 每个重要决策 → 更新 `tech-decisions.md`
2. 每完成一个任务 → 更新 `task-progress.md`
3. 发现新问题 → 更新 `known-issues.md`
4. 任务切换 → 更新 `current-task.md`

### 会话结束时
1. 将 `session-log.md` 压缩为摘要
2. 更新 `context-snapshot.md` 为最新状态
3. 重置 `current-task.md`
4. 清理过期的短期记忆

## 文件大小限制

| 文件 | 最大行数 | 超限策略 |
|------|---------|---------|
| `task-progress.md` | 200 行 | 归档已完成记录到归档区 |
| `session-log.md` | 100 行 | 压缩为摘要 |
| `known-issues.md` | 150 行 | 关闭的 Issue 移到历史区 |
| `tech-decisions.md` | 100 行 | 保留近 20 条关键决策 |

## 安全约束

- 禁止在记忆文件中存储密码、Token、API Key
- 禁止在 `session-log.md` 中记录用户隐私信息
- 所有时间戳使用 ISO 8601 格式
