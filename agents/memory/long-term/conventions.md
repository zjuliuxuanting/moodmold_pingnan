# 编码规范 & 协作约定

> 最后更新：2026-05-22

---

## 通用约定

1. **中文优先**：文档、注释、提交信息使用中文
2. **代码用英文**：变量名、函数名、类名使用英文
3. **TypeScript 严格模式**：禁止 `any` 类型
4. **不写注释**：代码应该自解释，除非逻辑复杂必须说明

## 文件路径约定

```
workspace/
├── docs/                    # 所有文档
│   ├── PRD.md              #   产品需求文档（PM 产出）
│   ├── ui-ux/              #   视觉 & 交互设计
│   ├── meeting-notes/      #   会议记录
│   └── planning/           #   整体规划（路线图、里程碑等）
├── frontend/               # 前端代码
│   └── src/
│       ├── components/     #   通用组件
│       ├── pages/          #   页面组件
│       ├── hooks/          #   自定义 Hooks
│       └── utils/          #   工具函数
└── scripts/                # 部署、工具脚本
```

## Git 约定（后续启用）

- 分支命名：`feature/xxx`, `bugfix/xxx`, `docs/xxx`
- 提交信息：`[类型] 简短描述`
  - 类型：feat, fix, docs, refactor, test, chore

## 协作约定

1. **数据模型先行**：先定义 TypeScript 类型和数据模型，再实现 UI
2. **文档驱动**：先写文档，再写代码
3. **测试驱动（推荐）**：先写测试，再写实现
4. **Agent 间通信**：通过 `workspace/docs/` 下的文件传递信息
5. **遇到不确定**：按以下优先级查找信息：
   - ① `memory/project/` — 项目背景、技术决策、任务进度
   - ② `memory/long-term/` — 编码规范、核心原则
   - ③ `memory/short-term/` — 当前会话上下文
   - 仍无记录 → 提问
