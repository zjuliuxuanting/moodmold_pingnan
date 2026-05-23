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
            <a href="#solution">解决方案</a>
            <a href="#demo">体验产品</a>
            <a href="#evidence">在地证据</a>
            <a href="#business">商业模型</a>
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
              不是简单的寄养，是一段被讲述的乡村陪伴<br />
              由真实村猫"有福"作为东道主
            </p>
            <div className="hero-buttons">
              <a href="#demo" className="btn-primary">立即体验产品 →</a>
              <a href="#video" className="btn-secondary">观看 90 秒演示</a>
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
              <span style={{ fontSize: 20 }}>🪵</span>
              <div>
                <div style={{ color: '#3E3A36', fontWeight: 500 }}>手作木刻通行证</div>
                <div style={{ color: '#8B847C', fontSize: 11 }}>屏南非遗工艺</div>
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

      {/* === ③ 解决方案 + 项圈 === */}
      <section id="solution">
        <div className="container">
          <div className="reveal">
            <div className="section-label">解决方案 / The Solution</div>
            <h2 className="section-title">屏南乡村寄养<br />× 数字孪生 × 真实村猫 IP</h2>
            <p className="section-subtitle">让每一只城市宠物，在屏南拥有一段被讲述的乡村时光</p>
          </div>

          <div className="solution-grid">
            <div className="solution-card reveal">
              <div className="solution-icon c1">🏡</div>
              <h3>在地民宿合作</h3>
              <ul>
                <li>屏南龙潭村首批认证民宿</li>
                <li>《寄养环境标准 V2.0》</li>
                <li>民宿主获 60% 寄养费</li>
              </ul>
            </div>
            <div className="solution-card reveal">
              <div className="solution-icon c2">✉️</div>
              <h3>数字孪生情感连接</h3>
              <ul>
                <li>民宿主拍照 5 分钟搞定</li>
                <li>AI 自动生成「有福」傲娇日记</li>
                <li>日报 + 不定时闪闪时刻</li>
              </ul>
            </div>
            <div className="solution-card featured reveal">
              <div className="solution-icon c3">🪵</div>
              <h3>手作木刻通行证</h3>
              <ul>
                <li>屏南本地激光切割工艺</li>
                <li>V1.0 无电子模块, 扫码激活</li>
                <li>承载宠物的物理数字身份</li>
              </ul>
            </div>
          </div>

          <div className="solution-note reveal">
            "我们故意没做芯片。<br />
            乡村寄养的核心不是 GPS 追踪，是情感连接。<br />
            把硬件成本省下来，all-in 在 AI 内容生成 + 在地民宿合作。"
          </div>
        </div>
      </section>

      {/* === ④ Demo 嵌入 === */}
      <section id="demo" className="demo-section">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center' }}>
            <div className="section-label">产品体验 / Try It Now</div>
            <h2 className="section-title">现在就体验完整产品</h2>
            <p className="section-subtitle">扫码体验 · iframe 直接交互 · 或观看 90 秒演示视频</p>
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

          {/* 视频区 */}
          {/* 完成后替换为: <video controls poster="/assets/video-cover.jpg"><source src="/assets/demo-video.mp4" type="video/mp4" /></video> */}
          <div
            id="video"
            className="video-container reveal"
            onClick={() => alert('演示视频即将上线 · 待录制完成后填入链接')}
          >
            <div className="placeholder">
              <div className="video-play" />
              <div className="video-title">90 秒产品演示视频</div>
              <div className="video-subtitle">即将上线 · 含有福日记完整流程</div>
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
              <a href="#video">演示视频</a>
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
