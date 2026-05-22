# /to-issues — 计划拆分为任务

> 类型：工程技能 | 触发词：`/to-issues`、拆分任务、任务分解

---

## 用途

将 PRD 或实施计划拆分为可独立认领的开发任务清单，写入 `workspace/docs/tasks/` 目录。

## 工作流

### 步骤 1：读取 PRD
- 读取 `workspace/docs/PRD.md` 的功能需求章节
- 理解每个 P0/P1/P2 功能的验收标准

### 步骤 2：按模块拆分
每个任务必须：
- 明确属于哪个支柱（B1 管理寄养 / B2 沟通家长 / B3 宣传业务）
- 明确负责角色（前端 / 后端 / 设计）
- 列出依赖的前置任务
- 标注预估复杂度

### 步骤 3：排序与依赖
- 先做基础设施（框架搭建、数据模型）
- 再做核心流程（P0 功能）
- 最后做增强功能（P1/P2）
- 标注哪些任务可以并行

### 步骤 4：写入任务文件
每个模块生成独立的 Markdown 任务单 → `workspace/docs/tasks/T-XX-[模块名].md`

## 任务单模板

```markdown
# T-XX：[任务名]

| 字段 | 值 |
|------|-----|
| 所属支柱 | B1/B2/B3 |
| 负责角色 | 前端/后端/设计 |
| 预估复杂度 | 低/中/高 |
| 依赖 | T-XX, T-YY（无则写"无"） |
| 状态 | 🔴 未开始 |

## 验收标准

- [ ] 标准 1
- [ ] 标准 2

## 涉及文件

- `workspace/frontend/src/pages/xxx.tsx`
- `workspace/frontend/src/components/xxx.tsx`

## 完成定义

- [ ] 代码实现完成
- [ ] 类型检查通过
- [ ] 构建成功
- [ ] 功能验收通过
```

## 输出位置

`workspace/docs/tasks/` 目录

## 同步更新

- 更新 `agents/memory/project/task-progress.md` 加入新任务
- 在 `workspace/docs/sprint/` 下生成任务看板（如需要）
