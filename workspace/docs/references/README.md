# 参考资料 / References

本目录存放产品迭代过程中使用的原始素材和参考文档，**不参与部署**。

## 文件清单

| 文件 | 来源 | 用途 | 已替代为 |
|---|---|---|---|
| `intro-source.html` | 2026-05 PM 手写产品介绍页 | 提供视觉/文案/结构参考 | `workspace/frontend/src/pages/IntroPage.tsx` + `IntroPage.css` |

## 注意

- **不要**把这个目录里的 HTML 当成线上首页源——线上 `/` 路由由 React 组件 `IntroPage.tsx` 渲染。
- 文案、结构若需变更，请同步修改 `IntroPage.tsx`；如果参考稿做了大调整，可以更新此处 HTML 作为新基线。
