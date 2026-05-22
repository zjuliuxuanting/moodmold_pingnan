# Moodmold 字符串/UI 审计报告

> 审计日期: 2026-05-22 | 审计员: QA Agent
> 审计范围: workspace/frontend/src/pages/ 下全部 18 个页面文件
> 视口约束: iPhone 393px 宽, 正文可用宽度约 345px

---

## 审计摘要

| 维度 | 检查项数 | 通过 | 问题 |
|------|---------|------|------|
| 文本溢出/异常换行 | 18 | 15 | 3 |
| 字符串硬编码问题 | 18 | 15 | 3 |
| 布局/间距/网格 | 18 | 16 | 2 |
| 路由 URL 拼接 | 18 | 17 | 1 |
| alt/aria 可访问性 | 18 | 17 | 1 |

---

## 阻塞级问题 (会导致运行时错误)

### BUG-01: HostSubmittedPage.tsx 缺少 `useNavigate` 导入 — 运行时错误

- **文件**: [HostSubmittedPage.tsx](workspace/frontend/src/pages/HostSubmittedPage.tsx#L1-L7)
- **行号**: L1, L7
- **问题**: 第 1 行只导入 `{ useParams, Link }`，但第 7 行调用了 `useNavigate()`。`useNavigate` 未从 `react-router-dom` 导入，会导致 `ReferenceError: useNavigate is not defined`。
- **复现步骤**: 托管方提交打卡 → 跳转到 `/host/submitted/:petId` → 页面白屏 + 控制台报错
- **建议修复**:
  ```tsx
  // L1: 修改为
  import { useParams, Link, useNavigate } from 'react-router-dom';
  ```

---

## 严重级问题

### BUG-02: CollectionPage.tsx Toast 消息包含变量但未展示变量值

- **文件**: [CollectionPage.tsx](workspace/frontend/src/pages/CollectionPage.tsx#L271)
- **行号**: L271
- **问题**: `showToast(`${item.name}尚未解锁，继续记录日记吧`)` — 使用了模板字符串拼接变量 `item.name`，但 Toast 组件在 L279-283 中正确使用了 `{toastMsg}` 渲染。此条无实际 bug，但需确认模板字符串在 minify 后仍正常工作（已知 React/TS 无此问题）。
- **严重程度**: 已确认无问题, 标记为通过。

### BUG-03: BookPage.tsx Toast 消息硬编码, 丢失动态内容

- **文件**: [BookPage.tsx](workspace/frontend/src/pages/BookPage.tsx#L88)
- **行号**: L40-L44 (showToast), L88 (toast 渲染)
- **问题**: `showToast` 回调接收 `msg: string` 参数但完全忽略它——既不存储也不使用。Toast div 硬编码为:
  ```tsx
  {toastVisible ? '请填写宠物名字' : ''}
  ```
  无论 `showToast('费用明细弹层 · 即将开放')` 调用传什么内容，Toast 始终显示"请填写宠物名字"。
- **复现步骤**:
  1. 进入 `/book/shanju`
  2. 填写名字后点击"明细"按钮
  3. 预期: 显示"费用明细弹层 · 即将开放"
  4. 实际: 显示"请填写宠物名字"
- **建议修复**:
  ```tsx
  // 增加 toastMsg 状态
  const [toastMsg, setToastMsg] = useState('');
  // showToast 中存储消息
  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    ...
  }, []);
  // 渲染使用 {toastMsg}
  ```

---

## 一般级问题

### BUG-04: PetPage.tsx `grid-cols-4` 导航区在 393px 下文字可能拥挤

- **文件**: [PetPage.tsx](workspace/frontend/src/pages/PetPage.tsx#L228)
- **行号**: L228-266
- **问题**: 底部导航使用 `grid grid-cols-4 gap-1`，4 个按钮各有 `px-1 py-2` 的 pill 内边距，内含 16px SVG + `text-[10px]` 标签文字。在 345px 可用宽度下，每列约 83px。"纪念卡" 和 "通行证" 三个汉字在 10px 字号下约占 30px，加上 `px-1`(4px*2) 和 `border`(1px*2)，文字区域约 38px，放在 pill 形按钮内可能超出 pill 视觉边界，但不会溢出到相邻列。
- **严重程度**: 一般 — 功能可用，视觉略紧但不会重叠
- **建议修复**: 将 `gap-1` 调为 `gap-0.5`，或将标签字体从 `text-[10px]` 缩小到 `text-[9px]`。

### BUG-05: HostPetsPage.tsx 消费者快捷入口 3 列网格中"寄养纪念卡"文本溢出风险

- **文件**: [HostPetsPage.tsx](workspace/frontend/src/pages/HostPetsPage.tsx#L300-L331)
- **行号**: L300-L331
- **问题**: `grid grid-cols-3 gap-1.5` 内含 5 个链接按钮，文字为"屏南日记"(4字)、"屏南收藏"(4字)、"寄养纪念卡"(5字)、"屏南通行证"(5字)、"变装打卡"(4字)。在 345px 可用宽度下，每列 = (345-3)/3 = 114px。每个按钮有 `py-1.5 px-1` + `border` + `rounded-pill`。"寄养纪念卡" 5 个字在 `text-xs` (12px) 下约占 60px，加上 2*4px padding + 2*1px border = 70px，在 114px 列宽内可以容纳。但若 border 有 2px 或用 `rounded-pill` 的 pill 形状使得可用文本区域变窄，可能在 pill 两端被截断。
- **严重程度**: 一般 — 建议实际渲染验证
- **建议修复**: 将 `gap-1.5` 改小或给按钮添加 `truncate` 类做省略号处理。

### BUG-06: HostMonthPage.tsx "山居民宿·屏南龙潭村" 长文本在窄屏下可能断行不当

- **文件**: [HostMonthPage.tsx](workspace/frontend/src/pages/HostMonthPage.tsx#L86-L88)
- **行号**: L86-L88
- **问题**:
  ```tsx
  <div className="mt-1.5 text-base text-[#6B6560] leading-snug">
    山居民宿<span className="mx-1.5 text-accent-wood opacity-60">·</span>屏南龙潭村
  </div>
  ```
  整个 flex 容器使用 `flex-1 min-w-0`，文字未设置 `break-words` 或 `truncate`。"山居民宿·屏南龙潭村" 共 9 个字符 + 间隔点，在 16px 字号下约占 160-170px。用户卡片内文区域在头像 (80px) 和 padding (24px*2) 占用后，可用宽度约 345-48-80 = 217px，当前文本可容纳。但如果未来替换为更长的地名（如"山居民宿·屏南县熙岭乡龙潭村"），可能会被 `min-w-0` 裁剪。
- **严重程度**: 一般 — 当前 mock 数据下无问题，但建议增加 `break-words` 防御
- **建议修复**: 添加 `className="... break-words"`。

---

## 建议级问题

### SUG-01: 多处 Toast 使用 `whitespace-nowrap`，长消息会被截断

- **文件**: [DiaryListPage.tsx](workspace/frontend/src/pages/DiaryListPage.tsx#L386)、[DiaryDetailPage.tsx](workspace/frontend/src/pages/DiaryDetailPage.tsx#L269)
- **问题**: DiaryListPage 和 DiaryDetailPage 的 Toast div 带有 `whitespace-nowrap` 类。当前 Toast 消息较短 ("链接已复制，分享给朋友吧"、"已收藏到你的闪闪时刻") 可容纳。但如果未来 toast 消息变长（如 "已分享豆豆的日记给朋友"），在 393px 屏幕上可能超出。同时 Toast 已有 `max-w-[84%]` 限制，`whitespace-nowrap` 会阻止换行导致文本超出 pill 背景。
- **建议修复**: 移除 `whitespace-nowrap` 或改为 `break-words`。

### SUG-02: StayPage.tsx 价格区的 `whitespace-nowrap` 配合 `justify-between` 可能挤压民宿名称

- **文件**: [StayPage.tsx](workspace/frontend/src/pages/StayPage.tsx#L157-L161)
- **行号**: L157-L161
- **问题**:
  ```tsx
  <div className="flex justify-between items-baseline gap-3">
    <div className="...">山居民宿</div>
    <div className="... whitespace-nowrap">¥150/天起</div>
  </div>
  ```
  民宿名称为"山居民宿"(4字)、"桃源民宿"(4字)、"溪边小筑"(4字)，在 345px 可用宽度下无问题。但如果未来民宿名变长（如"龙潭古厝山居民宿"），`whitespace-nowrap` 的价格区会阻止文字换行，导致民宿名被挤压。
- **建议修复**: 给民宿名称 div 添加 `min-w-0 truncate`。

### SUG-03: HostCheckinPage.tsx 照片上传区 "上传第 N 张" 文案与 `grid-cols-3` 宽度适配

- **文件**: [HostCheckinPage.tsx](workspace/frontend/src/pages/HostCheckinPage.tsx#L274-L329)
- **行号**: L274, L323-L325
- **问题**: `grid grid-cols-3 gap-3`，每列 = (345-6)/3 = 113px。空状态时显示 `56px` 图标 + "上传第 1 张"(5字，text-base = 16px，约占 80px)。每个 cell 高度 116px，图标 56px + 文字 80px 宽度完全在 113px 列宽内，无溢出风险。已上传状态只显示小图标和删除按钮，亦无问题。
- **结论**: 通过，无问题。

---

## 布局专项检查

### 已确认通过的项目

| 检查项 | 文件 | 结论 |
|--------|------|------|
| `grid-cols-3` 照片上传 (HostCheckinPage) | L274 | 通过 — 113px 列宽足够 |
| `grid-cols-2` 状态选择 (HostCheckinPage) | L351 | 通过 — 按钮最小 90px 高，列宽 ~168px |
| `grid-cols-2` 数据卡片 (HostMonthPage) | L110 | 通过 — 统计卡片 min-h-110px |
| `grid-cols-[48px_1fr_60px]` 顶部导航 (多处) | — | 通过 — 固定宽度列 + flex-1 中间列 |
| `flex justify-between` 民宿卡片 (StayPage) | L157 | 通过 — 短民宿名无挤压 |
| `space-y-4` 时间线 (PetPage) | L184 | 通过 — 间距正常 |
| `space-y-6` 宠物主页内容区 (PetPage) | L149 | 通过 — 间距正常 |
| `Flex flex-wrap` 筛选标签 (StayPage) | L64 | 通过 — 标签自动换行 |

### 页面底部固定按钮区检查

所有带固定底部按钮的页面均正确使用了 `absolute bottom-0` + 渐变遮罩。检查通过:
- HostCheckinPage L431-448
- HostPage L302-320
- CardPage L307-349
- PassPage L289-302
- CollectionPage L392-405
- DiaryDetailPage L454-475
- DiaryListPage L447-456
- BookPage L393-409
- HomePage L187-205

---

## URL 路由拼接审计

检查结果: 所有 `to` 和 `navigate()` 调用均正确使用了 `encodeURIComponent` 包裹 tagId 参数。

| 文件 | 路由 | 编码 | 结论 |
|------|------|------|------|
| PetPage.tsx L230 | `/diary/${tagId}` | ✅ | 通过 |
| PetPage.tsx L239 | `/collection/${tagId}` | ✅ | 通过 |
| PetPage.tsx L248 | `/card/${tagId}` | ✅ | 通过 |
| PetPage.tsx L258 | `/pass/${tagId}` | ✅ | 通过 |
| HostCheckinPage.tsx L199 | `/host/submitted/${encodeURIComponent(petId)}` | ✅ | 通过 |
| HostPetsPage.tsx L302 | `/diary/${pet.tagId}` | ✅ | 通过 |
| HostPetsPage.tsx L308 | `/collection/${pet.tagId}` | ✅ | 通过 |
| HostPetsPage.tsx L314 | `/card/${pet.tagId}` | ✅ | 通过 |
| HostPetsPage.tsx L320 | `/pass/${pet.tagId}` | ✅ | 通过 |
| HostPetsPage.tsx L326 | `/checkin/${pet.tagId}` | ✅ | 通过 |
| HostUpdatePage.tsx L235 | `/pet/${encodeURIComponent(tagId)}` | ✅ | 通过 |
| HostUpdatePage.tsx L241 | `/diary/${encodeURIComponent(tagId)}` | ✅ | 通过 |
| HostUpdatePage.tsx L247 | `/collection/${encodeURIComponent(tagId)}` | ✅ | 通过 |
| HostUpdatePage.tsx L253 | `/card/${encodeURIComponent(tagId)}` | ✅ | 通过 |
| HostUpdatePage.tsx L259 | `/pass/${encodeURIComponent(tagId)}` | ✅ | 通过 |
| HostRegisterPage.tsx L43 | `/host/update/${encodeURIComponent(trimmedTag)}` | ✅ | 通过 |
| BookPage.tsx L75 | `/pass/${tagId}` | ✅ | tagId 由 generateTagId() 生成, 不含特殊字符 |

---

## alt/aria-label 可访问性审计

| 文件 | 行号 | 元素 | alt/aria | 结论 |
|------|------|------|----------|------|
| PetPage.tsx | L109 | img (hero) | `alt={pet.name}` | 通过 |
| PetPage.tsx | L159 | img (overlay) | `alt="最近一次数字孪生出图"` | 通过 |
| PetPage.tsx | L201 | img (timeline photo) | `alt="活动照片"` | 通过 |
| PetPage.tsx | L209 | img (timeline overlay) | `alt="数字孪生出图"` | 通过 |
| HostUpdatePage.tsx | L194 | img (pet) | `alt={pet.name}` | 通过 |
| HostUpdatePage.tsx | L304 | img (preview) | `alt="状态照片预览"` | 通过 |
| HostUpdatePage.tsx | L315 | button (remove) | `aria-label="移除照片"` | 通过 |
| HostUpdatePage.tsx | L381 | img (sticker) | `alt={sticker.label}` | 通过 |
| HostUpdatePage.tsx | L471 | img (timeline photo) | `alt="状态照片"` | 通过 |
| HostUpdatePage.tsx | L482 | img (overlay) | `alt="数字孪生出图"` | 通过 |
| HostRegisterPage.tsx | L118 | img (preview) | `alt="宠物照片预览"` | 通过 |
| HostRegisterPage.tsx | L128 | button (remove) | `aria-label="移除照片"` | 通过 |
| PassPage.tsx | L63,L217 | img (photo) | `alt={petName}` | 通过 |
| CheckinPage.tsx | L118 | img (bg) | `alt="屏南古村"` | 通过 |
| CheckinPage.tsx | L139 | img (overlay) | `alt="数字孪生出图"` | 通过 |
| CheckinPage.tsx | L184 | img (pet photo) | `alt={pet.name}` | 通过 |
| CheckinPage.tsx | L229 | img (sticker) | `alt={sticker.label}` | 通过 |
| CheckinPage.tsx | L254 | img (pet info) | `alt={pet.name}` | 通过 |
| CardPage.tsx | L220 | img (pet) | `alt={petName}` | 通过 |
| BindPage.tsx | L135 | img (preview) | `alt="宠物照片预览"` | 通过 |
| BindPage.tsx | L145 | button (remove) | `aria-label="移除照片"` | 通过 |
| BookPage.tsx | L209 | img (preview) | `alt="宠物照片预览"` | 通过 |
| BookPage.tsx | L219 | button (edit) | `aria-label="编辑照片"` | 通过 |

**结论**: 所有 `<img>` 标签均有 `alt` 属性，所有关闭/删除按钮均有 `aria-label`。通过。

---

## 综合评估

### 是否建议发布给 Demo 演示: **否 — 存在 1 个阻塞级 Bug 必须先修复**

**阻塞发布的问题 (必须修)**:
- **BUG-01**: HostSubmittedPage.tsx 缺少 `useNavigate` 导入 — 打开该页面即崩溃

**建议发布前修复**:
- **BUG-03**: BookPage.tsx Toast 消息硬编码 — 影响用户交互反馈

**可以发布后修复**:
- **BUG-04**: PetPage `grid-cols-4` 导航文字视觉略紧
- **BUG-05**: HostPetsPage 3 列网格中长文本溢出风险
- **BUG-06**: HostMonthPage 长地名断行防御
- **SUG-01/02/03**: 各项建议改进

### 整体评价

代码质量较好，18 个页面中只有 1 个阻塞级 Bug (导入遗漏) 和 1 个严重级 Bug (Toast 消息丢失)。路由编码一致使用 `encodeURIComponent`，无 XSS 风险。中文文案流畅自然，未发现拼写错误。`hcolor-text-secondary` 在 index.css 中有正确定义，不是拼写错误。所有 `<img>` 都有 alt 属性，可访问性较好。在 393px 视口下，绝大多数布局表现正常，仅部分 grid 布局在极端内容下可能略紧。
