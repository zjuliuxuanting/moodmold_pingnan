# Claude Code 配置

本目录为 [Claude Code](https://code.claude.com/) 项目配置，与 `CLAUDE.md` 一起生效。

## 结构

| 路径 | 说明 |
|------|------|
| `settings.json` | 团队共享权限（git/npm/读写，禁止 .env） |
| `settings.local.json` | 个人覆盖（不提交，见 `.example`） |
| `agents/*.md` | 6 个子代理，对接 `agents/memory/long-term/personalities/` |
| `skills/*/SKILL.md` | 斜杠命令：`/pm` `/frontend` `/test` 等 |

## 快速开始

```bash
cd "/Users/chenjingyi/Documents/moodmold冲冲冲"
claude
```

首次进入项目会提示信任目录，选择允许即可。

## 常用操作

- `/agents` — 查看、编辑子代理
- `/pm` — 产品经理模式
- `/frontend` — 前端开发模式
- `使用 pm-agent 写 PRD` — 直接委派子代理

## 文档

- [Claude Code 设置](https://code.claude.com/docs/en/settings)
- [子代理](https://code.claude.com/docs/en/sub-agents)
- [项目记忆 CLAUDE.md](https://code.claude.com/docs/en/memory)
