# /grill-with-docs — 带文档输出的需求访谈

> 类型：生产力技能 | 触发词：`/grill-with-docs`、需求访谈+写文档

---

## 用途

执行与 `/grill-me` 相同的盘问式需求访谈，**同时将结论写入项目文档**：
- 更新 `agents/CONTEXT.md`（项目共享术语）
- 如需架构决策 → 写入 `agents/memory/project/tech-decisions.md`
- 如需记录的新需求 → 更新 `workspace/docs/PRD.md`

## 工作流

### 阶段 1：访谈（同 grill-me）
按照 5 轮访谈框架深入了解需求。

### 阶段 2：写入文档

#### 2.1 更新 CONTEXT.md
将本次访谈中出现的**新术语、新概念、新约定**写入 `agents/CONTEXT.md`：

```markdown
## [术语名]
- **含义**：一句话定义
- **来源**：[日期] 需求访谈
- **相关文件**：workspace/docs/PRD.md
```

#### 2.2 记录技术决策
如有技术层面的约束或选择 → `agents/memory/project/tech-decisions.md`

#### 2.3 更新 PRD
如访谈中产生了新的功能需求或修改了已有需求 → 更新 `workspace/docs/PRD.md` 对应章节

#### 2.4 更新项目上下文
如有项目背景更新 → `agents/memory/project/project-context.md`

### 阶段 3：提交变更
访谈结束后的产物清单：
- `agents/CONTEXT.md` 更新
- `agents/memory/project/tech-decisions.md` 更新（如有）
- `workspace/docs/PRD.md` 更新（如有）

## 输出

与 `/grill-me` 相同的访谈摘要 + 明确的文档变更清单：

```markdown
## 本次文档变更

| 文件 | 变更类型 | 变更内容 |
|------|---------|---------|
| agents/CONTEXT.md | 新增术语 | xxx |
| workspace/docs/PRD.md | 补充需求 | xxx |
```
