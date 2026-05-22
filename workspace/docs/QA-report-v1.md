# Moodmold 乡村寄养 H5 - QA 测试报告 v1

> 测试日期：2026-05-22 | 测试人员：软件测试员（生物学实验人员视角）| 版本：第一轮全面测试

---

## 一、清单验收表

逐条对照 `workspace/docs/b-sprint-kanban.md` 验收标准：

| # | 验收项 | 看板编号 | 结果 | 说明 |
|---|--------|---------|------|------|
| 1 | 全部8条路由可达，HTTP 200 | S-INF-001 | ✅ | `/`, `/bind/:tagId`, `/pet/:tagId`, `/host`, `/host/checkin`, `/host/update/:petId`, `/checkin/:tagId`, `/card/:tagId` 全部返回200 |
| 2 | 移动端 viewport 适配 | S-INF-001 | ✅ | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` 已配置 |
| 3 | HTML lang="zh-CN" | S-INF-001 | ✅ | 页面语言正确 |
| 4 | 数据模型定义 (Pet, StatusUpdate) | S-INF-001 | ✅ | TypeScript 类型完整，含 overlaidPhoto/heritageStyle 可选字段 |
| 5 | localStorage 封装 (safeGet/safeSet) | S-INF-001 | ✅ | 含 try-catch 保护、JSON 序列化 |
| 6 | 存储层空读不报错 | T-02 | ✅ | 15/15 单元测试通过 |
| 7 | 存储层写入并读取 Pet[] | T-02 | ✅ | savePet/savePets/getPetByTagId 正确 |
| 8 | 存储层 savePet 追加+覆盖 | T-02 | ✅ | 同 tagId 覆盖，不同 tagId 追加 |
| 9 | 存储层 StatusUpdate 增删查 | T-02 | ✅ | addUpdate/getUpdates/removeUpdates 正确 |
| 10 | 存储层跨 tagId 数据隔离 | T-02 | ✅ | 不同挂牌编号的更新互不干扰 |
| 11 | 绑定页 - 未绑定走完整流程 | S-B2-001 | ✅ | 品牌动效(3s) -> 表单 -> 提交过渡动画(2s) -> 跳转 |
| 12 | 绑定页 - 已绑定自动跳过 | S-B2-001 | ✅ | getPetByTagId 命中后 navigate replace |
| 13 | 绑定页 - 照片上传 (FileReader) | S-B2-001 | ✅ | FileReader → base64，含预览和移除 |
| 14 | 绑定页 - 提交过渡动画 | S-B2-001 | ✅ | "正在为宠物建立数字身份..." + spinner |
| 15 | 托管方后台 - 挂牌编号查找 | S-B1-001 | ✅ | 输入→跳转 /host/update/:petId |
| 16 | 托管方后台 - 已录入宠物列表 | S-B1-001 | ✅ | 读取 getPets() 展示，可点击进入 |
| 17 | 托管方录入页 - 挂牌编号+名字+照片 | S-B1-001 | ⚠️ | 名字可选(默认"未命名")，照片可选。看板描述"名字+照片+挂牌编号"暗示三者均为必填 |
| 18 | 托管方录入页 - 重复挂牌编号拦截 | S-B1-001 | ✅ | getPetByTagId 查重，提示"该挂牌编号已绑定宠物" |
| 19 | 托管方录入页 - 提交过渡动画 | S-B1-001 | ✅ | "正在录入宠物信息..." + spinner + 1200ms |
| 20 | 托管方更新页 - 宠物信息卡片 | S-B1-001 | ✅ | 照片+名字+挂牌编号+状态指示 |
| 21 | 托管方更新页 - 添加状态更新 | S-B1-001 | ✅ | 文字+照片，至少一项非空方可提交 |
| 22 | 托管方更新页 - 时间线倒序 | S-B1-001 | ✅ | sortedUpdates 按 timestamp 降序排列 |
| 23 | 托管方更新页 - 时间线竖线+圆点 | S-B1-001 | ✅ | CSS 时间线视觉正确 |
| 24 | 托管方更新页 - 未找到宠物处理 | S-B1-001 | ✅ | 显示"未找到宠物"+ 引导录入 |
| 25 | 宠物主查看页 - 大图+名字+寄养天数 | S-B2-002 | ✅ | hero图+信息卡片+天数计算 |
| 26 | 宠物主查看页 - 时间线倒序 | S-B2-002 | ✅ | sortedUpdates 倒序，含时间戳+文字+照片 |
| 27 | 宠物主查看页 - 最近出图 | S-B2-002 | ✅ | 取最新含 overlaidPhoto 的 StatusUpdate |
| 28 | 宠物主查看页 - 分享按钮 | S-B2-002 | ✅ | navigator.share / clipboard fallback |
| 29 | 宠物主查看页 - 未找到宠物处理 | S-B2-002 | ✅ | 显示"未找到宠物"+挂牌编号 |
| 30 | H5变装打卡页 | — | ✅ | 占位页，显示"待实现" |
| 31 | 寄养纪念卡页 | — | ✅ | 占位页，显示"待实现" |
| 32 | 首页入口 | — | ✅ | 含4个入口链接（托管方/绑定/打卡/纪念卡） |

**通过率：30/32 = 93.75%**

---

## 二、自由探索发现

### 2.1 Bug（明确缺陷）

#### B1 - 绑定页"检查中"状态显示空白页 [中等]

- **文件**：[BindPage.tsx:L50-L52](file:///Applications/test/创业/毛孩儿/鸟类训练机/程序/行为学盒项目/黑客松/workspace/frontend/src/pages/BindPage.tsx#L50-L52)
- **现象**：当 `uiState === 'checking'` 时，渲染 `<div className="min-h-screen bg-white" />`，一个全白空白页，用户看不到任何反馈
- **触发条件**：进入 `/bind/:tagId` 的瞬间，React useEffect 尚未完成 localStorage 读取
- **预期**：应显示加载指示器（spinner 或品牌 logo），而不是白屏
- **严重度**：中 — 用户可能以为页面卡死，尤其是在网络较慢或设备性能较差时

#### B2 - 绑定页 /bind/ 无 tagId 时静默白屏 [中等]

- **文件**：[BindPage.tsx:L15-L25](file:///Applications/test/创业/毛孩儿/鸟类训练机/程序/行为学盒项目/黑客松/workspace/frontend/src/pages/BindPage.tsx#L15-L25)
- **现象**：访问 `/bind/`（无挂牌编号参数）时，tagId 为 undefined，useEffect 提前 return，uiState 保持 'checking'，页面显示空白
- **触发条件**：手动输入或跳转到 `/bind/` 不带参数
- **预期**：应显示"缺少挂牌编号"提示，或引导用户扫描正确的二维码
- **严重度**：中 — 二维码生成错误或手动输入时会出现

#### B3 - 品牌动效中"连接中"文字动画未生效 [低]

- **文件**：[index.css:L14-L18](file:///Applications/test/创业/毛孩儿/鸟类训练机/程序/行为学盒项目/黑客松/workspace/frontend/src/index.css#L14-L18) vs [BindPage.tsx:L71](file:///Applications/test/创业/毛孩儿/鸟类训练机/程序/行为学盒项目/黑客松/workspace/frontend/src/pages/BindPage.tsx#L71)
- **现象**：CSS 定义了 `@keyframes connectingDots` 动画，但 BindPage 中使用的是静态文字 `<span>...</span>`，并未引用该动画
- **预期**："正在建立连接"后的三个点应该有逐点出现的动画效果
- **严重度**：低 — 视觉细节，不影响核心流程

### 2.2 功能缺失

#### F1 - 缺少"结束寄养"操作 [高]

- **位置**：HostUpdatePage
- **现象**：Pet 数据模型中定义了 `status: 'active' | 'ended'`，但整个应用中没有任何地方可以让托管方将宠物状态从 'active' 改为 'ended'
- **影响**：寄养天数会一直增长；状态指示器永远显示"寄养中"
- **竞品对比**：EthoVision/ANY-maze 的实验中，每个 session 都有明确的开始和结束时间戳
- **建议**：在 HostUpdatePage 或 HostPage 增加"结束寄养"按钮

#### F2 - 缺少"删除/移除宠物"功能 [中]

- **位置**：所有页面
- **现象**：storage.ts 中定义了 `removePet()` 和 `removeUpdates()` 函数，但 UI 中没有任何入口可以调用它们
- **影响**：录入错误的宠物后无法删除；积累的旧数据无法清理
- **建议**：在 HostUpdatePage 或 HostPage 增加删除入口（需二次确认）

#### F3 - 缺少 404 路由处理 [中]

- **位置**：[App.tsx:L12-L23](file:///Applications/test/创业/毛孩儿/鸟类训练机/程序/行为学盒项目/黑客松/workspace/frontend/src/App.tsx#L12-L23)
- **现象**：Routes 中没有 `<Route path="*" element={...} />` 通配路由，任意无效路径会显示空白
- **影响**：用户输错 URL 时看到空白页，不知道发生了什么
- **建议**：添加 404 页面或重定向到首页

#### F4 - 缺少数据导出/备份功能 [中]

- **现象**：所有数据仅存储在 localStorage 中，没有导出 CSV/JSON 的入口
- **影响**：清除浏览器缓存会丢失所有数据；无法在设备间迁移数据
- **竞品对比**：EthoVision 支持导出 CSV 格式的实验数据

#### F5 - 宠物主查看页缺少"实时刷新" [低]

- **现象**：宠物主打开页面后，如果托管方在此期间添加了新的状态更新，宠物主需要手动刷新浏览器才能看到
- **建议**：可加一个"刷新"按钮或定时轮询

#### F6 - "未找到宠物"页面缺少返回导航 [中]

- **位置**：[PetPage.tsx:L73-L84](file:///Applications/test/创业/毛孩儿/鸟类训练机/程序/行为学盒项目/黑客松/workspace/frontend/src/pages/PetPage.tsx#L73-L84)、[HostUpdatePage.tsx:L82-L115](file:///Applications/test/创业/毛孩儿/鸟类训练机/程序/行为学盒项目/黑客松/workspace/frontend/src/pages/HostUpdatePage.tsx#L82-L115)
- **现象**：PetPage 未找到宠物时，只显示提示文字，没有回到首页或绑定页的按钮（HostUpdatePage 有"返回后台"链接，处理正确）
- **影响**：用户进入错误挂牌编号后，只能通过浏览器后退，体验差

#### F7 - 无全局导航 [低]

- **现象**：应用没有顶部导航栏或底部 tab 栏，用户在不同页面间移动只能通过页面内的特定链接
- **影响**：从宠物主查看页无法快速回到首页

### 2.3 设计问题

#### D1 - 寄养天数"最少1天"可能造成误导 [低]

- **文件**：[PetPage.tsx:L7-L10](file:///Applications/test/创业/毛孩儿/鸟类训练机/程序/行为学盒项目/黑客松/workspace/frontend/src/pages/PetPage.tsx#L7-L10)
- **现象**：`Math.max(1, Math.floor(...))` 导致即使刚录入 1 秒钟，也显示"1天"
- **建议**：考虑改为显示精确到小时，或者至少标注"第1天"而非"1天"

#### D2 - 照片上传无大小限制 [中]

- **现象**：用户可以选择任意大小的图片，FileReader 将其转为 base64，单张 10MB 的照片 base64 编码后约 13MB，可能超出 localStorage 5MB 配额
- **建议**：上传前检查文件大小，超过 1MB 时压缩或警告

#### D3 - 绑定页提交按钮仅校验名字 [低]

- **文件**：[BindPage.tsx:L167](file:///Applications/test/创业/毛孩儿/鸟类训练机/程序/行为学盒项目/黑客松/workspace/frontend/src/pages/BindPage.tsx#L167)
- **现象**：`disabled={!petName.trim()}` — 照片为选填，这可能是设计决策，但与看板"上传照片+填写名字"的表述不完全一致
- **建议**：确认照片是否应为必填项

---

## 三、回归验证表

标准回归项（本次为首轮测试，非回归轮，但记录基线）：

| # | 回归项 | 结果 |
|---|--------|------|
| R1 | 首页入口链接全部可达 | ✅ |
| R2 | 绑定页 → 提交 → 宠物页完整链路 | ✅ |
| R3 | 托管方录入 → 状态更新 → 时间线 | ✅ |
| R4 | 刷新后 localStorage 数据不丢失 | ✅ |
| R5 | 移动端 viewport 响应式 | ✅ |
| R6 | 空状态/错误状态均有 UI 反馈 | ⚠️ 绑定页checking白屏(B1) |

---

## 四、盲区（本次未覆盖但应测的内容）

以下测试项因工具限制或时间原因未在本次深度覆盖，建议第二轮测试重点关注：

| # | 盲区 | 原因 | 优先级 |
|---|------|------|--------|
| 1 | **真实浏览器交互测试** | 本次主要靠代码审查+存储层模拟测试 | P0 |
| 2 | **移动端真机测试（iOS Safari / Android Chrome）** | 仅验证了 viewport meta 标签，未在真机上实际操作 | P0 |
| 3 | **跨标签页 localStorage 实时同步** | Node 模拟无法验证浏览器 storage 事件 | P0 |
| 4 | **图片上传: FileReader → base64 → 预览 → 保存完整链路** | 模拟测试仅覆盖存储层 | P1 |
| 5 | **品牌动效 3 秒过渡实际播放效果** | CSS animation 无法在 curl/Node 中测试 | P1 |
| 6 | **分享功能: navigator.share API 和 clipboard fallback** | 需要真实浏览器环境 | P1 |
| 7 | **longpress / touch 事件在移动端的表现** | 需要真机触摸测试 | P2 |
| 8 | **localStorage 配额超限时的用户提示** | 无法模拟浏览器 quota 行为 | P2 |
| 9 | **浏览器后退/前进按钮对各页面状态的破坏** | React Router replace 逻辑需要实际验证 | P1 |
| 10 | **Vercel 部署后的生产环境行为** | 仅测试了 Vite dev server | P2 |

---

## 五、体验问题

### E1 - 绑定页流程缺少"跳过/返回"出口

作为宠物主人，我扫描二维码进入绑定页后，如果品牌动效播放到一半我不想绑定了，或者我发现这不是我的宠物的挂牌编号——我没有办法取消或返回。整个流程只有一条路走到黑：等动效 → 填表单 → 提交。

**建议**：品牌动效阶段加一个"跳过"按钮（类似 App 开屏广告），表单阶段加"返回"链接。

### E2 - 宠物主查看页的信息层级不够直观

打开宠物主页后，页面从上到下依次是：大图 → 名字+天数卡片 → 出图(如有) → 时间线 → 分享按钮。

但从宠物主人的心理预期来看，我最想知道的是"我的宠物最近怎么样了"。当前设计是：如果托管方上传了"出图"，它被夹在信息卡片和时间线之间，不够突出；如果没有出图，这个区域直接消失，页面结构变化会让回头客感觉"少了东西"。

**建议**：将"最近出图"（如有）提升到更显眼的位置，比如 hero 图的 overlay 层；如果没有出图，保留区域但显示"等待托管方出图中..."的期待感文案。

---

## 六、结论

### 是否建议进入第二轮测试？

**建议进入第二轮测试，但需先修复以下阻塞项：**

| 阻塞项 | 原因 |
|--------|------|
| B1 - 绑定页检查中白屏 | 用户第一印象差，可能以为应用卡死 |
| B2 - /bind/ 无参数白屏 | 二维码容错场景，会导致用户困惑 |
| F1 - 缺少结束寄养功能 | 核心流程不完整，寄养天数无法停止计算 |

### 整体评价

Moodmold 乡村寄养 H5 应用的 **存储层设计扎实**（15/15 通过），**破坏性测试健壮**（11/11 通过），**核心流程链路完整**。8 条路由全部可达，绑定→提交→查看和托管方录入→更新→时间线两条主干流程均正确实现。

主要问题集中在 **边界 UX 处理**（空白状态无反馈、无返回出口）和 **功能完整度**（缺结束寄养、缺删除、缺导出）。这些问题不影响 Demo 演示流程，但在真实使用中会暴露。

**评分：存储层 10/10，UI 流程 7/10，UX 体验 6/10，功能完整度 7/10。综合 7.5/10。**

---

> 测试工具：curl + Node.js 存储层模拟 + 代码审查 + 浏览器预览
> 测试脚本：[qa_test.mjs](file:///Applications/test/创业/毛孩儿/鸟类训练机/程序/行为学盒项目/黑客松/workspace/frontend/qa_test.mjs)、[qa_destructive.mjs](file:///Applications/test/创业/毛孩儿/鸟类训练机/程序/行为学盒项目/黑客松/workspace/frontend/qa_destructive.mjs)
