import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './IntroPage.css'

export default function IntroPage() {
  useEffect(() => {
    // 滚动渐入动画
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show')
          }
        })
      },
      { threshold: 0.1 },
    )
    document.querySelectorAll('.intro-page .reveal').forEach((el) => observer.observe(el))

    // 平滑滚动锚点
    const handleAnchorClick = (e: Event) => {
      const link = e.currentTarget as HTMLAnchorElement
      const href = link.getAttribute('href')
      if (!href || !href.startsWith('#')) return
      const target = document.getElementById(href.slice(1))
      if (target) {
        e.preventDefault()
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }
    const anchors = document.querySelectorAll('.intro-page a[href^="#"]')
    anchors.forEach((a) => a.addEventListener('click', handleAnchorClick))

    return () => {
      observer.disconnect()
      anchors.forEach((a) => a.removeEventListener('click', handleAnchorClick))
    }
  }, [])

  return (
    <div className="intro-page">
      {/* === 导航栏 === */}
      <nav>
        <div className="nav-inner">
          <div className="logo">Moodmold</div>
          <div className="nav-links">
            <a href="#pillars">三支点</a>
            <a href="#hardware">硬件</a>
            <a href="#villager">村民管控</a>
            <a href="#ip">数字孪生</a>
            <a href="#demo">体验</a>
            <a href="#business">商业</a>
            <Link to="/booking" className="nav-cta">立即预约 →</Link>
          </div>
        </div>
      </nav>

      {/* === ① HERO === */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <div className="tag">🌾 屏南数智乡建黑客松 2026 · 乡村振兴赛道</div>
            <h1>
              让城市宠物<br />
              在屏南乡村<br />
              被<span className="accent">温柔记得</span>
            </h1>
            <p className="hero-subtitle">
              挂牌确认身份 × 项圈感知生命 × 数字孪生看见每一天<br />
              由真实村猫「有福」作为东道主
            </p>
            <div className="hero-buttons">
              <a href="#demo" className="btn-primary">立即体验产品 →</a>
              <a href="#pillars" className="btn-secondary">查看三个支点</a>
            </div>
          </div>
          <div className="hero-visual">
            {/* 占位: 替换为 hero 主视觉图 (屏南古村 + 有福 + 项圈) */}
            {/* 已替换为 /assets/youfu/avatar-youfu.png — 有福坐在屏南古村古厝前 */}
            <div className="hero-image-placeholder">
              <img src="/assets/youfu/avatar-youfu.png" alt="屏南乡村寄养主视觉 · 有福在屏南古村" />
            </div>
            <div className="floating-card top">
              <span style={{ fontSize: 20 }}>🐱</span>
              <div>
                <div style={{ color: '#3E3A36', fontWeight: 500 }}>有福 · 村猫东道主</div>
                <div style={{ color: '#8B847C', fontSize: 11 }}>屏南龙潭村</div>
              </div>
            </div>
            <div className="floating-card bottom">
              <span style={{ fontSize: 20 }}>📡</span>
              <div>
                <div style={{ color: '#3E3A36', fontWeight: 500 }}>3D 打印智能项圈</div>
                <div style={{ color: '#8B847C', fontSize: 11 }}>GPS · 健康监测</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === ② 痛点 === */}
      <section className="pain-section">
        <div className="container">
          <div className="reveal">
            <div className="section-label">痛点 / The Problem</div>
            <h2 className="section-title">1.2 亿次携宠出游，<br />寄养却同质化严重</h2>
            <p className="section-subtitle">城市寄养价格内卷，乡村民宿淡季空置，宠主出差的情感缺位</p>
          </div>

          <div className="pain-grid">
            <div className="pain-card c1 reveal">
              <div className="num">¥80-150</div>
              <h3>城市寄养困境</h3>
              <p>价格内卷，监控摄像头千篇一律，缺乏差异化体验</p>
            </div>
            <div className="pain-card c2 reveal">
              <div className="num">40%</div>
              <h3>乡村民宿淡季痛</h3>
              <p>淡季空置率 40%，稳定客源难，缺乏数字化运营工具</p>
            </div>
            <div className="pain-card c3 reveal">
              <div className="num">38%</div>
              <h3>宠主情感缺口</h3>
              <p>38% 宠主因寄养焦虑放弃出行，"看到猫"≠"懂得猫"</p>
            </div>
          </div>

          <p className="pain-quote reveal">我们想让寄养，不止是托管，而是一段乡村陪伴的故事</p>
        </div>
      </section>

      {/* === ③ 三个支点 === */}
      <section id="pillars" className="pillars-section">
        <div className="container">
          <div className="reveal">
            <div className="section-label">寄养质量体系 / The Three Pillars</div>
            <h2 className="section-title">三个支点<br />支撑乡村寄养的全链路</h2>
            <p className="section-subtitle">不是又一个寄养平台 — 是「硬件 + 软件 + 内容」三位一体的质量体系</p>
          </div>

          <div className="pillars-grid">
            <a href="#hardware" className="pillar b2 reveal">
              <div className="pillar-tag">B2 · 宠主体验</div>
              <h3>管好寄养</h3>
              <p className="sub">硬件感知 · 服务流程 · 透明可视</p>
              <ul className="pillar-points">
                <li>智能项圈 6 大功能模块</li>
                <li>5 步全链路服务流程</li>
                <li>数字孪生日报 3 秒内推送</li>
              </ul>
              <span className="pillar-cta">查看硬件设计 →</span>
            </a>

            <a href="#villager" className="pillar b1 reveal">
              <div className="pillar-tag">B1 · 村民环境</div>
              <h3>选好村民</h3>
              <p className="sub">准入门槛 · 培训体系 · SOP 监督</p>
              <ul className="pillar-points">
                <li>4 维准入标准（空间/安全/卫生/温度）</li>
                <li>Day 0/1/7/30 四步评级</li>
                <li>平台抽检 + 宠主评分双闭环</li>
              </ul>
              <span className="pillar-cta">查看村民管控 →</span>
            </a>

            <a href="#ip" className="pillar b3 reveal">
              <div className="pillar-tag">B3 · 数字孪生宣传</div>
              <h3>讲好故事</h3>
              <p className="sub">有福 IP · 内容矩阵 · 增长飞轮</p>
              <ul className="pillar-points">
                <li>真实村猫「有福」第一人称叙事</li>
                <li>三大内容资产（通行证/日记/纪念卡）</li>
                <li>非遗挂件出图自带传播属性</li>
              </ul>
              <span className="pillar-cta">查看数字孪生 →</span>
            </a>
          </div>
        </div>
      </section>

      {/* Part 1 标识 */}
      <div className="part-marker">
        <span className="num">PART 1 · 宠主寄养服务质量保证体系</span>
      </div>

      {/* === Part 1 / 硬件设计 === */}
      <section id="hardware" className="hardware-section">
        <div className="container">
          <div className="reveal">
            <div className="section-label">硬件设计 / Hardware Design</div>
            <h2 className="section-title">基于 STM32 的<br />自研智能项圈</h2>
            <p className="section-subtitle">6 大功能模块 · 7-14 天续航 · IP67 全密封灌胶</p>
          </div>

          <div className="hw-wrap">
            <div className="hw-schematic reveal">
              <img src="/assets/hardware/schematic-wearable.png" alt="项圈主板原理图" />
              <div className="hw-schematic-caption">
                <strong>项圈主板原理图</strong>
                <span className="badge">STM32F103C8T6 · v1.0</span>
              </div>
            </div>

            <div className="hw-feature-grid reveal">
              <div className="hw-feature">
                <span className="hw-icon">📍</span>
                <h4>实时定位</h4>
                <div className="module">ATGM336H · GPS + 北斗</div>
                <p>3-5 米精度，宠主端实时查看，可配合电子围栏告警</p>
              </div>
              <div className="hw-feature">
                <span className="hw-icon">🌡️</span>
                <h4>体温监测</h4>
                <div className="module">MLX90614 · 非接触红外</div>
                <p>±0.1°C 精度，发热/低体温自动推送告警</p>
              </div>
              <div className="hw-feature">
                <span className="hw-icon">💪</span>
                <h4>活动量追踪</h4>
                <div className="module">MPU6050 · 六轴</div>
                <p>计步 / 久坐 / 跌倒识别，日报展示活跃时段</p>
              </div>
              <div className="hw-feature">
                <span className="hw-icon">🌞</span>
                <h4>环境感知</h4>
                <div className="module">光照传感器</div>
                <p>室内 / 室外自动切换，夜间低功耗休眠</p>
              </div>
              <div className="hw-feature">
                <span className="hw-icon">🎯</span>
                <h4>佩戴状态</h4>
                <div className="module">双路压力传感器</div>
                <p>差分判断松紧 / 移位，自动调位 + 安全急停</p>
              </div>
              <div className="hw-feature">
                <span className="hw-icon">💡</span>
                <h4>本地交互</h4>
                <div className="module">OLED + LED + 蜂鸣器</div>
                <p>0.96″ 状态屏，多色指示灯，寻宠响铃</p>
              </div>
            </div>
          </div>

          <div className="hw-stats reveal">
            <div className="hw-stat">
              <div className="num">≤60g</div>
              <div className="label">整机重量<br />猫 / 小型犬无负担</div>
            </div>
            <div className="hw-stat">
              <div className="num">IP67</div>
              <div className="label">全密封灌胶<br />雨天 / 水域可用</div>
            </div>
            <div className="hw-stat">
              <div className="num">7-14 天</div>
              <div className="label">400mAh 续航<br />磁吸充电</div>
            </div>
            <div className="hw-stat">
              <div className="num">BLE + WiFi</div>
              <div className="label">BLE 配对 + ESP32 上传<br />无网离线缓存</div>
            </div>
          </div>

          <div className="hw-pcb-grid reveal">
            <div className="hw-pcb">
              <img src="/assets/hardware/pcb-wearable.png" alt="项圈本体 PCB Layout" />
              <div className="hw-pcb-label"><strong>项圈本体 PCB</strong> · 含天线 / 气压传感器 / 电池座 / Type-C 充电</div>
            </div>
            <div className="hw-pcb">
              <img src="/assets/hardware/pcb-dock.png" alt="充电底座 PCB Layout" />
              <div className="hw-pcb-label"><strong>充电底座 PCB</strong> · 磁吸对位 / 协议握手 / 状态同步</div>
            </div>
          </div>

          <div className="hw-slogan reveal">
            "挂牌确认身份，项圈感知生命。"
            <span className="small">挂牌让宠主知道宠物寄养在哪，项圈让宠主看见宠物的每一刻 — 是否健康、是否开心。</span>
          </div>
        </div>
      </section>

      {/* === Part 1 / 服务流程 === */}
      <section id="flow" className="flow-section">
        <div className="container">
          <div className="reveal">
            <div className="section-label">服务流程 / Service Flow</div>
            <h2 className="section-title">从预约到接回<br />全链路透明</h2>
            <p className="section-subtitle">5 步闭环 · 每一步宠主端都能实时看见</p>
          </div>

          <div className="flow-track reveal">
            <div className="flow-step">
              <div className="step-num">1</div>
              <h4>扫码绑定</h4>
              <p>挂牌关联宠主<br />30 秒完成</p>
            </div>
            <div className="flow-step">
              <div className="step-num">2</div>
              <h4>每日打卡</h4>
              <p>托管方拍照<br />写一句话</p>
            </div>
            <div className="flow-step">
              <div className="step-num">3</div>
              <h4>数字孪生日报</h4>
              <p>AI 自动出图<br />3 秒推送宠主</p>
            </div>
            <div className="flow-step">
              <div className="step-num">4</div>
              <h4>寄养纪念卡</h4>
              <p>结束自动生成<br />可分享/打印</p>
            </div>
            <div className="flow-step">
              <div className="step-num">5</div>
              <h4>接回评价</h4>
              <p>五星好评<br />闭环 NPS</p>
            </div>
          </div>
        </div>
      </section>

      {/* Part 2 标识 */}
      <div className="part-marker alt">
        <span className="num">PART 2 · 村民寄养环境质量控制</span>
      </div>

      {/* === Part 2 / 村民管控 === */}
      <section id="villager" className="villager-section">
        <div className="container">
          <div className="reveal">
            <div className="section-label">村民管控 / Villager Quality Control</div>
            <h2 className="section-title">不是谁都能做寄养<br />我们制定标准、村民执行、宠主验证</h2>
            <p className="section-subtitle">三道门槛 — 环境准入 → 培训上岗 → 持续监督</p>
          </div>

          <div className="standard-grid reveal">
            <div className="standard-card">
              <span className="std-icon">🏠</span>
              <h4>空间</h4>
              <p>独立宠物活动区 ≥ 5 m²<br />通风采光良好</p>
            </div>
            <div className="standard-card">
              <span className="std-icon">🛡️</span>
              <h4>安全</h4>
              <p>封窗 / 围墙到位<br />无危险物、无有毒植物</p>
            </div>
            <div className="standard-card">
              <span className="std-icon">🧼</span>
              <h4>卫生</h4>
              <p>每日消毒 + 粪便清理 SOP<br />打卡可追溯</p>
            </div>
            <div className="standard-card">
              <span className="std-icon">🌡️</span>
              <h4>温度</h4>
              <p>室内 18-28°C<br />极端天气有预案</p>
            </div>
          </div>

          <div className="training-track reveal">
            <div className="training-step">
              <div className="day">DAY 0</div>
              <h4>准入审核</h4>
              <p>环境照片 + 面谈</p>
            </div>
            <div className="training-step">
              <div className="day">DAY 1</div>
              <h4>线上培训</h4>
              <p>SOP · 平台操作 · 摄影技巧</p>
            </div>
            <div className="training-step">
              <div className="day">DAY 7</div>
              <h4>试用期</h4>
              <p>接第一只宠物<br />导师远程支持</p>
            </div>
            <div className="training-step">
              <div className="day">DAY 30</div>
              <h4>正式评级</h4>
              <p>金 / 银 / 铜牌<br />宠主评分 + 平台抽检</p>
            </div>
          </div>
        </div>
      </section>

      {/* Part 3 标识 */}
      <div className="part-marker tri">
        <span className="num">PART 3 · 基于数字孪生的宣传策略</span>
      </div>

      {/* === Part 3 / 数字孪生宣传 === */}
      <section id="ip" className="ip-section">
        <div className="container">
          <div className="reveal">
            <div className="section-label">数字孪生 / Storytelling Engine</div>
            <h2 className="section-title">数字孪生不是噱头<br />是传播引擎</h2>
            <p className="section-subtitle">每天给宠主的不是通知 — 是可分享的内容</p>
          </div>

          <div className="ip-hero reveal">
            <div className="ip-avatar">
              <img src="/assets/youfu/avatar-youfu.png" alt="有福" />
            </div>
            <div className="ip-text">
              <span className="ip-role">本村猫 IP · 屏南龙潭村</span>
              <h3>这是有福</h3>
              <p>屏南龙潭村的本村猫，Moodmold 的 IP 角色 — 在每一篇宠物日记里以「第一人称」叙述城里客人在屏南的乡村生活。</p>
              <p>本地猫 = 在地性 = 真实感 = 信任背书。每一段日记 = 一次自带传播属性的乡村文旅明信片。</p>
              <p className="signature">—— 有福</p>
            </div>
          </div>

          <div className="content-matrix reveal">
            <div className="content-card">
              <div className="role">品牌入口</div>
              <h4>屏南通行证</h4>
              <p>"宠物拿到了一张<br />屏南的身份证"</p>
              <div className="channel">扫码即看 · 线下民宿展示</div>
            </div>
            <div className="content-card">
              <div className="role">社交素材</div>
              <h4>每日日记</h4>
              <p>"今天有福<br />带豆豆去了廊桥..."</p>
              <div className="channel">朋友圈 9 宫格 · 小红书</div>
            </div>
            <div className="content-card">
              <div className="role">传播终点</div>
              <h4>寄养纪念卡</h4>
              <p>"一段值得<br />珍藏的乡村回忆"</p>
              <div className="channel">可打印 · 可分享</div>
            </div>
          </div>

          <h3 className="reveal" style={{ marginTop: 60, fontFamily: "'Noto Serif SC', serif", fontSize: 20, color: '#3E3A36', fontWeight: 500 }}>
            非遗挂件 × 数字孪生出图
          </h3>
          <p className="reveal" style={{ fontSize: 14, color: '#6B6560', marginTop: 6 }}>
            宠物照片叠加屏南非遗元素 — 斗笠 / 廊桥 / 古厝戏服 / 村猫荣誉 — 每张出图都是一张可分享的屏南文旅明信片
          </p>
          <div className="heritage-grid reveal">
            <div className="heritage-item">
              <div className="h-img"><img src="/assets/decorations/stamp-pingnan-pass.png" alt="屏南通行证" /></div>
              <div className="h-name">屏南通行证</div>
              <div className="h-day">DAY 1 · 入村身份</div>
            </div>
            <div className="heritage-item">
              <div className="h-img"><img src="/assets/skins/skin-bamboo-hat.png" alt="龙潭斗笠" /></div>
              <div className="h-name">龙潭斗笠</div>
              <div className="h-day">DAY 3 · 廊桥非遗</div>
            </div>
            <div className="heritage-item">
              <div className="h-img"><img src="/assets/skins/skin-opera-collar.png" alt="古厝戏服" /></div>
              <div className="h-name">古厝戏服</div>
              <div className="h-day">DAY 5 · 古戏台</div>
            </div>
            <div className="heritage-item">
              <div className="h-img"><img src="/assets/badges/badge-villagecat.png" alt="荣誉村猫" /></div>
              <div className="h-name">荣誉村猫</div>
              <div className="h-day">DAY 7 · 寄养完成</div>
            </div>
          </div>

          <div className="flywheel reveal">
            <h4>用户参与度增长飞轮</h4>
            <div className="flywheel-chain">
              <span className="flywheel-node green">宠主寄养</span>
              <span className="flywheel-arrow">→</span>
              <span className="flywheel-node wood">收到日记</span>
              <span className="flywheel-arrow">→</span>
              <span className="flywheel-node shimmer">主动分享</span>
              <span className="flywheel-arrow">→</span>
              <span className="flywheel-node green">新宠主看见</span>
              <span className="flywheel-arrow">→</span>
              <span className="flywheel-node wood">扫码绑定</span>
              <span className="flywheel-arrow">→</span>
              <span className="flywheel-node shimmer">屏南文旅曝光</span>
            </div>
          </div>
        </div>
      </section>

      {/* === ④ Demo 嵌入 === */}
      <section id="demo" className="demo-section">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center' }}>
            <div className="section-label">产品体验 / Try It Now</div>
            <h2 className="section-title">现在就体验完整产品</h2>
            <p className="section-subtitle">右侧手机框直接交互 · 或扫码在手机上体验双端</p>
          </div>

          <div className="demo-wrap">
            {/* 手机模拟外框 + iframe */}
            <div className="phone-frame reveal">
              <div className="phone-screen">
                <iframe src="/booking" title="Moodmold Demo 实时预览" />
              </div>
            </div>

            <div className="demo-info reveal">
              <h2>双端完整产品</h2>
              <p>
                宠主端 8 页 + 民宿端 5 页<br />
                从扫码激活、数字身份生成、每日日报<br />
                到屏南纪念卡，一气呵成
              </p>

              <div className="demo-actions">
                <Link to="/booking" className="action-card">
                  <div className="action-icon">📱</div>
                  <div className="action-text" style={{ flex: 1 }}>
                    <h4>宠主端体验</h4>
                    <p>moodmold-pingnan.vercel.app/booking</p>
                  </div>
                  <div className="qr-placeholder">二维码</div>
                </Link>
                <Link to="/host" className="action-card">
                  <div className="action-icon">🏡</div>
                  <div className="action-text" style={{ flex: 1 }}>
                    <h4>民宿端体验</h4>
                    <p>moodmold-pingnan.vercel.app/host</p>
                  </div>
                  <div className="qr-placeholder">二维码</div>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* === ⑤ 在地证据 === */}
      <section id="evidence" className="evidence-section">
        <div className="container">
          <div className="reveal">
            <div className="section-label">在地证据 / Proof on the Ground</div>
            <h2 className="section-title">我们不是 PPT 创业<br />—— 屏南，我们已经在了</h2>
            <p className="section-subtitle">基于屏南龙潭村其祥居的真实合作 + 真实村猫"有福"</p>
          </div>

          <div className="evidence-wrap">
            <div className="evidence-image reveal">
              {/* 占位: 替换为王青 + 有福合影 (尚未拍摄) */}
              {/* 暂用 /assets/village/village-qixiangju.png — 其祥居院子里的有福 */}
              <img src="/assets/village/village-qixiangju.png" alt="其祥居 · 有福" />
              <div className="evidence-image-caption">
                <strong>其祥居</strong><br />
                屏南县熙岭乡龙潭村 · 王青（首批认证）
              </div>
            </div>

            <div className="quote-list">
              <div className="quote c1 reveal">
                <p className="text">"我们其祥居淡季空房率 40%，如果寄养能稳定送单，我立刻加入。"</p>
                <div className="author">王青，其祥居主</div>
              </div>
              <div className="quote c2 reveal">
                <p className="text">"有福本来就是我家的猫，多一只两只猫的工作量我完全能接受。"</p>
                <div className="author">王青</div>
              </div>
              <div className="quote c3 reveal">
                <p className="text">"我们龙潭有 200 多个回乡老村民和新村民，缺一个让大家稳定营生的副业。"</p>
                <div className="author">王青</div>
              </div>
            </div>
          </div>

          <div className="evidence-stats reveal">
            <div className="stat">
              <div className="num">5+</div>
              <div className="label">家屏南民宿已对接</div>
            </div>
            <div className="stat">
              <div className="num">3</div>
              <div className="label">家明确入驻意愿</div>
            </div>
            <div className="stat">
              <div className="num">200+</div>
              <div className="label">龙潭村可触达民宿基数</div>
            </div>
          </div>
        </div>
      </section>

      {/* === ⑥ 商业模型 === */}
      <section id="business" className="business-section">
        <div className="container">
          <div className="reveal">
            <div className="section-label">商业模型 / Business Model</div>
            <h2 className="section-title">可持续的多方共赢</h2>
            <p className="section-subtitle">单笔订单经济模型 + 屏南规模化路径</p>
          </div>

          <div className="business-flow reveal">
            <div className="flow-center">
              <div className="label">宠主支付</div>
              <div className="num">¥1,050 / 7 天</div>
            </div>

            <div className="flow-grid">
              <div className="flow-item green">
                <div className="num">¥630</div>
                <div className="label">民宿主 60%<br />淡季稳定增收</div>
              </div>
              <div className="flow-item">
                <div className="num">¥210</div>
                <div className="label">平台佣金 20%</div>
              </div>
              <div className="flow-item orange">
                <div className="num">¥210</div>
                <div className="label">硬件 + AI + 保险 + 运营</div>
              </div>
            </div>
          </div>

          <div className="scale-path">
            <div className="phase p1 reveal">
              <div className="label">PHASE 1 · 启动期</div>
              <h4>屏南龙潭</h4>
              <p><strong>5 家</strong>首批认证民宿</p>
              <p><strong>月 GMV 1.5 万</strong></p>
            </div>
            <div className="phase p2 reveal">
              <div className="label">PHASE 2 · 扩展期</div>
              <h4>屏南全县</h4>
              <p><strong>50 家</strong>民宿</p>
              <p><strong>年 GMV 180 万</strong></p>
            </div>
            <div className="phase p3 reveal">
              <div className="label">PHASE 3 · 复制期</div>
              <h4>福建乡村网络</h4>
              <p><strong>300 家</strong>民宿</p>
              <p><strong>年 GMV 1200 万</strong></p>
            </div>
          </div>

          <p
            className="reveal"
            style={{
              textAlign: 'center',
              fontFamily: "'Noto Serif SC', serif",
              fontStyle: 'italic',
              color: '#8B6F47',
              fontSize: 18,
              marginTop: 40,
              lineHeight: 1.8,
            }}
          >
            "我们不只是做寄养——<br />
            我们在搭建一个『乡村宠物友好基础设施』，<br />
            让屏南的廊桥、古厝、非遗，通过宠物的视角，被更多年轻人看见。"
          </p>
        </div>
      </section>

      {/* === ⑦ 团队 === */}
      <section className="team-section">
        <div className="container">
          <p className="team-vision reveal">
            让每一只乡村的猫，<br />
            都成为<span>一个村庄的代言人</span>
          </p>

          <div className="team-grid">
            <div className="team-card reveal">
              <div className="team-avatar">CJY</div>
              <h4>陈静怡</h4>
              <div className="team-role">PM / 设计 / 内容</div>
              <p>负责产品设计、内容叙事、整体协作<br />主导产品方向与视觉系统</p>
            </div>
            <div className="team-card reveal">
              <div className="team-avatar">DEV</div>
              <h4>技术伙伴</h4>
              <div className="team-role">全栈开发</div>
              <p>负责双端 H5 集成、数据流、部署<br />Claude Code + Vercel 工作流</p>
            </div>
          </div>

          <div className="team-partner reveal">
            <div className="partner-icon" />
            <div className="partner-text">
              <h4>在地合作伙伴 · 王青</h4>
              <p>其祥居主 · 屏南龙潭村 · 首批认证 · 有福的铲屎官</p>
            </div>
          </div>
        </div>
      </section>

      {/* === Footer === */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>Moodmold</h3>
              <p>让城市宠物在屏南乡村<br />被照顾、被记录、被讲述</p>
              <p style={{ marginTop: 16, fontSize: 13, opacity: 0.7 }}>
                屏南数智乡建黑客松 2026<br />乡村振兴 / 在地产业赛道
              </p>
            </div>
            <div className="footer-section">
              <h5>产品体验</h5>
              <Link to="/booking">宠主端 Demo</Link>
              <Link to="/host">民宿端 Demo</Link>
              <a href="#demo">体验入口</a>
            </div>
            <div className="footer-section">
              <h5>联系 / 致谢</h5>
              <a href="https://github.com/zjuliuxuanting/moodmold_pingnan" target="_blank" rel="noreferrer">GitHub 仓库</a>
              <a href="#evidence">屏南龙潭村其祥居</a>
              <a href="#evidence">屏南数智乡建黑客松组委会</a>
            </div>
          </div>
          <div className="footer-bottom">
            <div>© 2026 Moodmold · Made with 💚 in 屏南</div>
            <div>moodmold-pingnan.vercel.app</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
