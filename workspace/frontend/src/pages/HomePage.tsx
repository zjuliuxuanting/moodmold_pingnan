import { useNavigate } from 'react-router-dom';
import { useState, useRef, useCallback } from 'react';

const devLinks = [
  { label: '托管方入口', path: '/host', desc: '录入宠物 / 更新状态 / 时间线' },
  { label: '录入新宠物', path: '/host/checkin', desc: '托管方扫码录入' },
  { label: '绑定测试', path: '/bind/test-001', desc: '模拟扫码绑定宠物' },
  { label: '查看宠物', path: '/pet/test-001', desc: '宠物主查看时间线' },
  { label: '状态更新', path: '/host/update/test-001', desc: '给宠物添加状态' },
  { label: 'H5 打卡', path: '/checkin/test-001', desc: '景点变装打卡' },
  { label: '纪念卡', path: '/card/test-001', desc: '寄养结束纪念卡' },
  { label: '日记列表', path: '/diary/test-001', desc: '有福日记列表' },
  { label: '屏南收藏', path: '/collection/test-001', desc: '宠物收藏' },
];

const benefitCards = [
  {
    iconColor: 'bg-accent-primary',
    title: '每日有福日记',
    desc: '村猫视角的真实陪伴记录',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="18" height="13" rx="2"/>
        <path d="M3 8l9 6 9-6"/>
      </svg>
    ),
  },
  {
    iconColor: 'bg-accent-wood',
    title: '屏南旅行纪念卡',
    desc: '寄养结束的数字纪念品',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="10" width="17" height="10.5" rx="1.5"/>
        <path d="M2.5 7h19v3h-19z"/>
        <path d="M12 7v13.5"/>
        <path d="M12 7s-2-3.5-4-3.5S6 6 8 7"/>
        <path d="M12 7s2-3.5 4-3.5S18 6 16 7"/>
      </svg>
    ),
  },
  {
    iconColor: 'bg-accent-shimmer',
    title: '非遗变装解锁',
    desc: '廊桥斗笠、古厝戏服、村猫荣誉卡',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="9" r="5.5"/>
        <path d="M12 14.5l-2 7 2-1.5 2 1.5-2-7"/>
        <path d="M10 9l1.5 1.5L14 7.5"/>
      </svg>
    ),
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [showDev, setShowDev] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSecretClick = useCallback(() => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      setShowDev((v) => !v);
      return;
    }
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 800);
  }, []);

  return (
    <div className="w-full h-full flex flex-col relative bg-primary-bg">
      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto pb-[140px]" style={{ scrollbarWidth: 'none' }}>
        {/* Top nav */}
        <nav className="h-14 px-6 flex items-center justify-between bg-transparent">
          <div className="font-[family-name:var(--font-serif)] text-xl font-medium text-accent-wood tracking-[0.02em]">
            Moodmold
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-primary align-middle mx-1 mb-0.5" />
          </div>
          <div
            className="w-8 h-8 rounded-full bg-accent-cream border border-border-light flex items-center justify-center text-text-tertiary font-[family-name:var(--font-serif)] text-[13px] font-medium cursor-pointer"
            title="用户头像"
          >
            客
          </div>
        </nav>

        {/* Hero */}
        <header
          className="h-[320px] flex flex-col items-center justify-center px-6 relative"
          style={{
            background: 'linear-gradient(180deg, #E8EFEB 0%, #F5F1EA 100%)',
          }}
        >
          {/* subtle paper grain */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 18% 22%, rgba(107,142,127,0.07) 0%, transparent 40%), radial-gradient(circle at 82% 78%, rgba(139,111,71,0.06) 0%, transparent 40%)',
            }}
          />

          <div className="relative w-[128px] h-[128px]">
            {/* YF-001 tag */}
            <span className="absolute -top-1.5 -left-2.5 h-6 px-3 bg-accent-wood text-white rounded-pill font-[family-name:var(--font-en-sans)] text-xs font-semibold tracking-[0.08em] flex items-center shadow-[0_2px_8px_rgba(139,111,71,0.25)]">
              YF-001
            </span>
            {/* Photo circle */}
            <div
              className="w-[128px] h-[128px] rounded-full border-[1.5px] border-accent-wood flex items-center justify-center text-center shadow-[0_4px_20px_rgba(139,111,71,0.18)]"
              style={{
                background: 'radial-gradient(circle at 36% 32%, #f0d9b8 0%, #d6a877 45%, #a3784c 100%)',
              }}
            >
              <div className="font-[family-name:var(--font-serif)] text-[13px] text-white/90 tracking-[0.06em] leading-[1.4]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                <span className="block text-[32px] font-semibold mb-1 tracking-[0.1em]">有福</span>
                照片占位
              </div>
            </div>
          </div>

          <h1 className="font-[family-name:var(--font-serif)] text-[28px] font-bold text-text-primary mt-6 leading-[1.3] tracking-[0.01em]">
            你好,我是有福
          </h1>
          <div className="font-[family-name:var(--font-sans)] text-sm text-text-secondary mt-2 leading-[1.5]">
            屏南龙潭村<span className="text-text-tertiary mx-1.5">·</span>首席体验官
          </div>

          {/* ornament */}
          <div className="flex justify-center items-center gap-2.5 mt-4 text-accent-wood opacity-65">
            <span className="w-6 h-px bg-current" />
            <span className="font-[family-name:var(--font-en-serif)] italic text-[13px] whitespace-nowrap">in 屏南</span>
            <span className="w-6 h-px bg-current" />
          </div>
        </header>

        {/* Intro */}
        <section className="px-6 pt-8 pb-0">
          <h2 className="font-[family-name:var(--font-serif)] text-xl font-medium text-text-primary mb-4 leading-[1.4]">
            把你的猫,寄养到我们村里
          </h2>
          <p className="font-[family-name:var(--font-sans)] text-base leading-[1.7] text-text-secondary">
            屏南海拔 <span className="text-accent-wood font-medium">800 米</span>的古村,<br/>
            廊桥下、古厝旁——<br/>
            这里有山泉水、有阳光、<br/>
            有一只名叫有福的村猫,<br/>
            已经在等待你的客人。
          </p>
        </section>

        {/* Benefits */}
        <section className="px-6 pt-8 flex flex-col gap-4">
          {benefitCards.map((b) => (
            <article
              key={b.title}
              className="h-[88px] bg-card-bg rounded-card px-5 flex items-center gap-4 shadow-base cursor-pointer active:scale-[0.99] active:shadow-soft transition-transform transition-shadow duration-200"
            >
              <div className={`w-12 h-12 rounded-full ${b.iconColor} flex items-center justify-center flex-shrink-0 text-white`}>
                {b.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-[family-name:var(--font-serif)] text-base font-medium text-text-primary leading-[1.4]">
                  {b.title}
                </div>
                <div className="font-[family-name:var(--font-sans)] text-[13px] text-text-secondary mt-1 leading-[1.5]">
                  {b.desc}
                </div>
              </div>
              <svg className="flex-shrink-0 text-text-tertiary" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 6l6 6-6 6"/>
              </svg>
            </article>
          ))}
        </section>

        {/* Bottom spacer */}
        <div className="h-14" />
      </div>

      {/* Fixed CTA */}
      <div className="absolute left-0 right-0 bottom-0 h-[120px] pt-4 pb-6 px-6 bg-primary-bg flex flex-col items-center gap-2.5 z-20">
        {/* fade gradient above CTA */}
        <div
          className="absolute left-0 right-0 -top-6 h-6 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(245,241,234,0) 0%, var(--color-primary-bg) 100%)' }}
        />
        <div className="font-[family-name:var(--font-sans)] text-xs text-text-tertiary tracking-[0.02em]">
          首批 50 家认证民宿
          <span className="inline-block w-1 h-1 rounded-full bg-accent-primary align-middle mx-2 mb-0.5" style={{ animation: 'dot-pulse 2s ease-in-out infinite' }} />
          7 x 24 在线
        </div>
        <button
          type="button"
          onClick={() => navigate('/stay')}
          className="w-full h-[52px] rounded-pill bg-accent-primary text-white font-[family-name:var(--font-sans)] text-base font-medium shadow-[0_6px_20px_rgba(107,142,127,0.28)] active:translate-y-px active:scale-[0.99] transition-transform"
        >
          立即预约寄养
        </button>
      </div>

      {/* Hidden dev trigger — triple-click the tiny dot */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: '6px', zIndex: 30 }}>
        <button
          type="button"
          onClick={handleSecretClick}
          className="w-6 h-6 rounded-full flex items-center justify-center text-text-tertiary opacity-20 active:opacity-40 transition-opacity select-none"
          aria-label="开发者模式"
        >
          <span className="text-[8px] leading-none">·</span>
        </button>
      </div>

      {/* Dev links panel */}
      {showDev && (
        <div className="absolute left-0 right-0 bottom-0 z-[35] animate-brand-fade">
          <div className="mx-4 mb-3 bg-white border border-border-light rounded-card px-4 py-3 flex flex-wrap gap-2 shadow-lift">
            {devLinks.map((link) => (
              <button
                key={link.path}
                type="button"
                onClick={() => navigate(link.path)}
                className="px-3 py-1.5 rounded-pill bg-accent-soft text-accent-primary font-[family-name:var(--font-sans)] text-xs font-medium active:scale-95 transition-transform"
                title={link.desc}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
