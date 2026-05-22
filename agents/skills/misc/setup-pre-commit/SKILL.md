# /setup-pre-commit — 配置 Git Pre-commit Hooks

> 类型：杂项技能 | 触发词：`/setup-pre-commit`、pre-commit、提交前检查

---

## 用途

为本项目的 `workspace/frontend/` 配置 Husky + lint-staged pre-commit hooks。

## 工作流

### 步骤 1：安装依赖
```bash
cd workspace/frontend
npm install --save-dev husky lint-staged
npx husky init
```

### 步骤 2：配置 lint-staged（package.json）
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,css,md}": [
      "prettier --write"
    ]
  }
}
```

### 步骤 3：配置 pre-commit hook
在 `.husky/pre-commit` 中写入：
```bash
npx lint-staged
npx tsc --noEmit
```

### 步骤 4：验证
```bash
git add . && git commit -m "test: pre-commit check"
```
确认 hooks 正常触发。

## 规则

- ✅ 只影响 `workspace/frontend/` 下的文件
- ✅ Prettier 配置沿用项目已有的 `.prettierrc`
- ✅ 如果 TypeScript 类型检查太慢（> 5 秒），可改为仅 lint-staged
- ❌ 不修改 `agents/` 或 `workspace/docs/` 下的 Markdown 文件
