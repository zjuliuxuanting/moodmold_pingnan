# /git-guardrails — Git 危险操作拦截

> 类型：杂项技能 | 触发词：`/git-guardrails`、Git 安全、保护 Git

---

## 用途

在执行任何 Git 命令前（尤其是 push、reset、rebase），强制确认，防止误操作。

## 拦截规则

### 🔴 需要二次确认的命令（必须"yes"确认后才执行）

| 命令 | 原因 |
|------|------|
| `git push` / `git push --force` | 不可逆，影响远程仓库 |
| `git reset --hard [commit]` | 不可逆，丢失本地修改 |
| `git clean -fd` | 不可逆，删除未跟踪文件 |
| `git rebase` | 可能产生冲突 |
| `git branch -D [branch]` | 删除分支不可逆 |
| `git merge --squash` | 丢失提交历史 |

### 🟡 提示但自动允许
| 命令 | 提示 |
|------|------|
| `git commit -a` | "将提交所有修改，确认？（回车继续）" |
| `git stash drop` | "确认删除此 stash？（回车继续）" |

### 🟢 直接允许
- `git status`
- `git log`
- `git diff`
- `git branch`（查看）
- `git add`（暂存）
- `git commit`（不带 -a）

## 工作流

1. 拦截到危险命令
2. 显示："⚠️ 即将执行：`[命令]`。这个操作可能：[后果说明]。输入 `yes` 确认执行，其他任何输入取消。"
3. 等待用户确认
4. 如确认 → 执行；如取消 → 报告"已取消"

## 规则

- ❌ 不要帮用户决定"这是安全的"——永远让用户确认
- ❌ 不要在初始化脚本等自动化场景中拦截（检查 `--no-guard` 标记）
- ✅ 解释清楚"为什么危险"
