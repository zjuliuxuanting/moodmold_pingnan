# Agent 相互调用工作流

> 类型：长期记忆 | 修改频率：极低 | 最后更新：2026-05-22
> 说明：定义 PM / 软件工程师 / 测试员三个智能体之间通过 Task 工具相互调用的完整协议。

---

## 三个核心 Agent

| 英文标识名 | 中文角色 | Task sub_agent_type | 一句话定位 |
|-----------|---------|---------------------|-----------|
| `pm-agent` | 产品经理 | `software-pm` | 需求 → PRD → 优先级排序，向软工下达任务单 |
| `software-engineer` | 软件工程师 | `software-dev` | 拿到 PRD → 代码实现 → 版本交付 |
| `qa-tester` | 测试员 | `software-tester` | 以真实用户视角验收，出测试报告 |

---

## 调用机制

每个 Agent 在执行过程中，可以通过 **Task 工具** 启动另一个 Agent 作为子任务。被调用的 Agent 会：
1. 先读 `agents/memory/long-term/conventions.md` + `principles.md`（长期记忆）
2. 再读 `agents/memory/project/` 下的项目背景、技术决策、任务进度（项目记忆）
3. 执行具体任务并返回结果

### Task 工具调用格式

```
子Agent类型: software-pm / software-dev / software-tester
description: 简短描述（3-5字）
query: 具体任务描述（≤30字），必须包含交付物路径
response_language: zh
```

---

## 工作流一：PM → 软件工程师（下达开发任务）

### 触发条件
- PM 完成 PRD 后，需要工程师开始实现
- PM 收到工程师反馈"需求不清晰"，需补充规格后重新委派
- 用户直接对 PM 说"开始开发吧"

### 调用方式
PM Agent 使用 Task 工具：

```
sub_agent_type: software-dev
description: 开发[功能模块名称]
query: 根据 workspace/docs/PRD.md 的[第X章/功能Y]，实现对应的前端代码。先读 agents/memory/project/ 了解项目背景和技术决策，然后将代码写入 workspace/frontend/src/ 对应目录。完成后返回实现了哪些文件。
```

### 并行调用（无依赖的任务可同时发起）
PM 可以同时启动多个 `software-dev` 子任务，只要它们不修改同一文件：

```
# 同时发两个 Task（不同功能模块，无文件冲突）
Task 1: sub_agent_type=software-dev, query=实现托管方后台录入宠物页面...
Task 2: sub_agent_type=software-dev, query=实现宠物主查看页面...
```

### PM 期望的返回内容
工程师子任务完成后必须返回：
1. 创建/修改了哪些文件（完整路径列表）
2. 每个文件的功能概述（一句话）
3. 如有阻塞问题，明确说明

---

## 工作流二：软件工程师 → PM（反馈与澄清）

### 触发条件
- 工程师发现 PRD 中某功能描述不清晰，无法直接实现
- 工程师发现 PRD 与现有技术约束冲突（如：PRD 要求的功能需要后端，但项目决定不做后端）
- 工程师完成一个里程碑后，需要 PM 确认下一步优先级

### 调用方式
软件工程师 Agent 使用 Task 工具：

```
sub_agent_type: software-pm
description: 澄清需求[具体疑问点]
query: 我在实现 [功能X] 时发现 [矛盾/模糊点描述]。请查看 workspace/docs/PRD.md 的相关章节，给出明确决策。如果需要修改 PRD，直接更新文件。返回决策结论。
```

### 并行规则
- 工程师可以同时向 PM 提多个澄清问题（不同功能模块）
- 但在 PM 返回决策前，工程师应暂停相关模块开发，先开发无争议模块

---

## 工作流三：软件工程师 → 测试员（交付验收）

### 触发条件
- 工程师完成一个功能模块
- 工程师完成全部开发任务
- 工程师修复了一个 Bug

### 调用方式
软件工程师 Agent 使用 Task 工具：

```
sub_agent_type: software-tester
description: 验收[功能模块名称]
query: 我已实现 [功能模块X] 的代码，文件在 [路径列表]。请先读 workspace/docs/PRD.md 中该功能的验收标准，然后以真实用户视角执行回归测试+深度探索。输出测试报告到 workspace/docs/QA-report-[模块名].md。
```

### 并行调用
工程师完成多个独立模块后，可以同时派发多个测试任务：

```
# 同时发两个 Task（不同模块测试互不干扰）
Task 1: sub_agent_type=software-tester, query=验收托管方后台...
Task 2: sub_agent_type=software-tester, query=验收宠物主查看页...
```

---

## 工作流四：测试员 → PM（上报需求缺失）

### 触发条件
- 测试员在深度探索中发现功能缺失（不是 Bug，而是缺少用户需要的功能）
- 测试员发现 PRD 中的验收标准与实际用户场景有差距

### 调用方式
测试员 Agent 使用 Task 工具：

```
sub_agent_type: software-pm
description: 功能缺失报告
query: 测试发现 [场景X] 无法完成，原因是缺少 [功能Y]。请评估是否需要在 PRD 中补充此功能。先读 workspace/docs/PRD.md 和 agents/memory/project/known-issues.md。如需新增需求，更新 PRD 并回复结论。
```

---

## 工作流五：测试员 → 软件工程师（Bug 流转）

### 触发条件
- 测试员在回归测试或深度探索中发现 Bug
- Bug 严重程度为"严重"或"阻塞"

### 调用方式
测试员 Agent 使用 Task 工具：

```
sub_agent_type: software-dev
description: 修复Bug[Bug编号]
query: 测试报告 [QA-report-xxx.md] 中发现 Bug-[N]：[一句话描述]。复现步骤见报告。请在 [指定文件路径] 中修复。修复后返回修改了哪些文件。
```

### 串行规则
- 同一模块的 Bug 修复和重新测试必须串行（修复完 → 测试员再测）
- 不同模块的 Bug 可以并行修复

---

## 工作流六：PM → 测试员（发布前全量验证）

### 触发条件
- 所有功能开发完成
- PM 需要判断"这个版本能发布/演示吗"

### 调用方式
PM Agent 使用 Task 工具：

```
sub_agent_type: software-tester
description: 全量回归+探索测试
query: 全部功能开发完毕。请先读 workspace/docs/PRD.md 全部验收标准，对 workspace/frontend/ 全部代码执行全量回归测试 + 深度探索。输出完整测试报告到 workspace/docs/QA-report-v[N].md。必须给出"是否建议发布"的结论。
```

---

## 完整项目生命周期示例

```
时间线（3天MVP）：

Day 1 ──────────────────────────────────────────────────────
  用户 → PM: "开始写 PRD"
  PM 自主工作，输出 workspace/docs/PRD.md
  
  PM → 工程师 (Task): "实现项目脚手架"
  └─ 工程师读 memory/ → 搭 Vite + React 骨架 → 返回文件清单
  
Day 2 ──────────────────────────────────────────────────────
  PM → 工程师 x3 (并行Task): 
  ├─ "实现托管方后台"
  ├─ "实现宠物主查看页"  
  └─ "实现纪念卡生成"
  
  工程师 → PM (Task): "数字孪生出图的交互方式需要你确认"
  └─ PM 决策 → 更新 PRD → 工程师继续
  
  工程师x3 完成 →
  工程师 → 测试员 (Task): "验收托管方后台"
  └─ 测试员读 PRD → 回归 → 探索 → 输出 QA-report
  
  测试员 → 工程师 (Task): "BUG-01 阻塞级：录入宠物后白屏"
  └─ 工程师修复 → 返回 → 测试员重新验证

Day 3 ──────────────────────────────────────────────────────
  PM → 测试员 (Task): "全量验证，判断能不能演示"
  └─ 测试员读 PRD → 全量回归 → 深度探索 → QA-report-v2
  
  测试员 → PM (Task): "报告：2个一般Bug不阻塞，建议发布"
  PM 决策 → ✅ 可以演示
```

---

## 调用图（速查）

```
         ┌──────────────┐
         │   用户 / 你   │
         └──────┬───────┘
                │ 启动
                ▼
      ┌─────────────────┐
      │    PM Agent      │
      │  software-pm     │
      └───┬───────┬─────┘
          │       │                   
   下达任务│       │全量验证             
          │       │                   
          ▼       ▼                   
  ┌─────────────┐ ┌──────────────┐    
  │ 软件工程师   │ │   测试员      │    
  │ software-dev│ │software-tester│   
  └──┬─────┬────┘ └──┬──────┬────┘    
     │     │         │      │         
  交付验收 需求澄清  Bug流转 需求缺失   
     │     │         │      │         
     ▼     ▼         ▼      ▼         
  ┌─────────────┐ ┌──────────────┐    
  │   测试员     │ │   PM Agent   │    
  │software-tester│ │software-pm  │    
  └─────────────┘ └──────────────┘    
```

---

## 并发与串行规则

| 场景 | 规则 | 原因 |
|------|------|------|
| PM 同时派发多个独立功能给工程师 | ✅ 可并行 | 不同模块，无文件冲突 |
| 工程师同时给多个模块派发测试 | ✅ 可并行 | 不同模块测试互不干扰 |
| 同一模块的开发和测试 | ❌ 必须串行 | 先开发完才能测试 |
| 同一模块的 Bug 修复和复测 | ❌ 必须串行 | 先修好才能再测 |
| PM 同时收到多个澄清请求 | ✅ 可并行处理 | 不同问题独立决策 |
| 测试员同时报告多个 Bug | ✅ 可并行 | 每个 Bug 是独立 Task |

---

## 交付物交接协议

每个 Agent 交付产出物后，必须在会话结束时：
1. 更新 `agents/memory/project/task-progress.md` 中的对应任务状态
2. 如发现新问题，写入 `agents/memory/project/known-issues.md`
3. 如做出新的技术决策，写入 `agents/memory/project/tech-decisions.md`

## 紧急升级路径

| 情况 | 动作 |
|------|------|
| 两个 Agent 对需求理解不一致 | 双方各自通过 Task 调用 PM 裁决，PM 更新 PRD |
| 发现"不该做"的功能被实现了 | 工程师直接停手，通过 Task 通知 PM |
| 测试员发现阻塞级 Bug | 直接通过 Task 调用工程师修复，同时抄送 PM |
| 任何 Agent 发现 PRD 有原则性错误 | 直接通过 Task 调用 PM，附上原因 |
