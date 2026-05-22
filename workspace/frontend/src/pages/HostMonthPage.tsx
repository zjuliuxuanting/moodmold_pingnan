import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function HostMonthPage() {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* Toast */}
      {toast && (
        <div className="absolute left-1/2 top-[110px] -translate-x-1/2 -translate-y-3 z-50 bg-[rgba(62,58,54,0.92)] text-white px-5 py-3.5 rounded-pill text-base tracking-wider shadow-lift animate-text-fade-up pointer-events-none">
          {toast}
        </div>
      )}

      {/* Scrollable content */}
      <div
        className="flex-1 overflow-y-auto pb-[132px]"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Top nav 64px */}
        <nav className="h-16 px-4 grid grid-cols-[48px_1fr_48px] items-center gap-2">
          <Link
            to="/host"
            className="w-12 h-12 rounded-full flex items-center justify-center text-text-primary hover:bg-[rgba(62,58,54,0.06)] transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </Link>
          <div className="text-center text-[20px] font-semibold text-text-primary tracking-wider">
            我的本月
          </div>
          <button
            type="button"
            onClick={() => showToast('更多设置')}
            className="w-12 h-12 rounded-full flex items-center justify-center text-text-primary hover:bg-[rgba(62,58,54,0.06)] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <circle cx="5" cy="12" r="1.6" />
              <circle cx="12" cy="12" r="1.6" />
              <circle cx="19" cy="12" r="1.6" />
            </svg>
          </button>
        </nav>

        {/* User card - 180px */}
        <section
          className="mx-6 mt-2 h-[180px] rounded-card relative overflow-hidden flex items-center gap-[18px] px-6"
          style={{
            background: 'linear-gradient(135deg, #DDE7E0 0%, #E8EFEB 35%, #F5EFE6 70%, #EFE0CD 100%)',
            boxShadow: 'var(--shadow-base)',
          }}
        >
          {/* Paper noise SVG */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.07]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.45  0 0 0 0 0.36  0 0 0 0 0.22  0 0 0 0.4 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
              mixBlendMode: 'multiply',
            }}
          />

          {/* Avatar */}
          <div className="relative z-[1] w-20 h-20 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0 text-white text-[28px] font-semibold tracking-wider"
            style={{
              background: 'linear-gradient(140deg, #C8A77F 0%, #8B6F47 100%)',
              boxShadow: '0 4px 14px rgba(62,58,54,0.16)',
              textShadow: '0 1px 2px rgba(0,0,0,0.15)',
            }}
          >
            王
          </div>

          {/* Meta */}
          <div className="relative z-[1] flex-1 min-w-0">
            <div className="text-2xl font-semibold text-text-primary leading-tight tracking-wider">
              王建国
            </div>
            <div className="mt-1.5 text-base text-[#6B6560] leading-snug break-words">
              山居民宿<span className="mx-1.5 text-accent-wood opacity-60">·</span>屏南龙潭村
            </div>
            <span
              className="inline-flex items-center gap-1 mt-3 h-7 px-3 rounded-pill text-white text-sm font-medium tracking-wider"
              style={{
                background: 'var(--color-accent-wood)',
                boxShadow: '0 2px 6px rgba(139,111,71,0.18)',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
              首批认证
            </span>
          </div>
        </section>

        {/* Section: 2026年5月数据 */}
        <section className="px-6 mt-6">
          <h2 className="text-[20px] font-semibold text-text-primary tracking-wider leading-tight">
            2026 年 5 月数据
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {/* Stat 1 - 本月收入 */}
            <article
              className="min-h-[110px] bg-card-bg rounded-card shadow-base flex flex-col items-center justify-center gap-1 text-center p-3.5"
              style={{ animation: 'stat-fade-up 400ms 100ms ease-out forwards', opacity: 0, transform: 'translateY(8px)' }}
            >
              <div className="text-base text-[#6B6560] tracking-wider leading-tight">本月收入</div>
              <div className="text-[32px] font-semibold leading-tight tracking-wider text-accent-primary" style={{ fontFeatureSettings: '"tnum"' }}>
                <span className="text-[22px] font-medium mr-px">¥</span>2,100
              </div>
              <div className="text-base font-semibold leading-tight tracking-wider text-accent-primary truncate max-w-full">
                <span className="text-sm align-[1px] mr-0.5">↑</span>比上月 +25%
              </div>
            </article>

            {/* Stat 2 - 接待宠物 */}
            <article
              className="min-h-[110px] bg-card-bg rounded-card shadow-base flex flex-col items-center justify-center gap-1 text-center p-3.5"
              style={{ animation: 'stat-fade-up 400ms 200ms ease-out forwards', opacity: 0, transform: 'translateY(8px)' }}
            >
              <div className="text-base text-[#6B6560] tracking-wider leading-tight">接待宠物</div>
              <div className="text-[32px] font-semibold leading-tight tracking-wider text-accent-wood" style={{ fontFeatureSettings: '"tnum"' }}>
                5 <span className="text-[22px] font-medium">只</span>
              </div>
              <div className="text-base text-[#6B6560] leading-tight tracking-wider truncate max-w-full">
                豆豆、小花、阿橘等
              </div>
            </article>

            {/* Stat 3 - 宠主好评 */}
            <article
              className="min-h-[110px] bg-card-bg rounded-card shadow-base flex flex-col items-center justify-center gap-1 text-center p-3.5"
              style={{ animation: 'stat-fade-up 400ms 300ms ease-out forwards', opacity: 0, transform: 'translateY(8px)' }}
            >
              <div className="text-base text-[#6B6560] tracking-wider leading-tight">宠主好评</div>
              <div className="text-[32px] font-semibold leading-tight tracking-wider text-text-primary" style={{ fontFeatureSettings: '"tnum"' }}>
                4.9
              </div>
              <div className="flex items-center gap-0.5 text-accent-shimmer" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3 L14.6 9 L21 9.8 L16 14 L17.4 20.5 L12 17 L6.6 20.5 L8 14 L3 9.8 L9.4 9 Z" />
                  </svg>
                ))}
              </div>
            </article>

            {/* Stat 4 - 任务完成 */}
            <article
              className="min-h-[110px] bg-card-bg rounded-card shadow-base flex flex-col items-center justify-center gap-1 text-center p-3.5"
              style={{ animation: 'stat-fade-up 400ms 400ms ease-out forwards', opacity: 0, transform: 'translateY(8px)' }}
            >
              <div className="text-base text-[#6B6560] tracking-wider leading-tight">任务完成</div>
              <div className="text-[32px] font-semibold leading-tight tracking-wider text-accent-primary" style={{ fontFeatureSettings: '"tnum"' }}>
                100<span className="text-[22px] font-medium ml-px">%</span>
              </div>
              <div className="text-base text-[#6B6560] leading-tight tracking-wider">
                你真棒!
              </div>
            </article>
          </div>
        </section>

        {/* Section: 近6个月收入 Chart */}
        <section className="px-6 mt-6">
          <h2 className="text-[20px] font-semibold text-text-primary tracking-wider leading-tight mb-4">
            近 6 个月收入
          </h2>

          <div className="bg-card-bg rounded-card shadow-base px-4 pt-4 pb-2 overflow-hidden">
            <svg className="w-full h-[160px] block" viewBox="0 0 345 160" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              <defs>
                <linearGradient id="incomeFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#6B8E7F" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#6B8E7F" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Y-axis gridlines */}
              <g stroke="#D8D2C5" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.7">
                <line x1="36" y1="28" x2="320" y2="28" />
                <line x1="36" y1="64" x2="320" y2="64" />
                <line x1="36" y1="100" x2="320" y2="100" />
              </g>

              {/* Y-axis labels */}
              <g fontFamily="Inter, sans-serif" fontSize="11" fill="#8A847D">
                <text x="32" y="32" textAnchor="end">2200</text>
                <text x="32" y="68" textAnchor="end">1700</text>
                <text x="32" y="104" textAnchor="end">1200</text>
              </g>

              {/* Fill area */}
              <path
                d="M 55 100 L 105 90 L 155 78 L 205 70 L 255 50 L 305 28 L 305 130 L 55 130 Z"
                fill="url(#incomeFill)"
                className="opacity-0"
                style={{ animation: 'fadeIn 600ms 700ms ease-out forwards' }}
              />

              {/* Line */}
              <polyline
                points="55,100 105,90 155,78 205,70 255,50 305,28"
                fill="none"
                stroke="#6B8E7F"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: 600,
                  strokeDashoffset: 600,
                  animation: 'drawLine 900ms 200ms ease-out forwards',
                }}
              />

              {/* Data points */}
              {[
                { cx: 55, cy: 100, delay: 250 },
                { cx: 105, cy: 90, delay: 350 },
                { cx: 155, cy: 78, delay: 450 },
                { cx: 205, cy: 70, delay: 550 },
                { cx: 255, cy: 50, delay: 650 },
              ].map((pt) => (
                <circle
                  key={`${pt.cx}-${pt.cy}`}
                  cx={pt.cx}
                  cy={pt.cy}
                  r="4"
                  fill="#8B6F47"
                  className="opacity-0"
                  style={{
                    animation: `dotPop 400ms ${pt.delay}ms ease-out forwards`,
                    transformOrigin: `${pt.cx}px ${pt.cy}px`,
                  }}
                />
              ))}

              {/* Last point highlighted */}
              <circle
                cx="305"
                cy="28"
                r="6.5"
                fill="#6B8E7F"
                stroke="#fff"
                strokeWidth="2"
                className="opacity-0"
                style={{
                  animation: 'dotPop 400ms 750ms ease-out forwards',
                  transformOrigin: '305px 28px',
                }}
              />

              {/* Label callout for May */}
              <g className="opacity-0" style={{ animation: 'fadeIn 400ms 900ms ease-out forwards' }}>
                <rect x="270" y="6" width="58" height="20" rx="10" fill="#3E3A36" />
                <text x="299" y="20" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="600" fill="#fff" letterSpacing="0.04em">¥2,100</text>
              </g>

              {/* X-axis labels */}
              <g fontFamily="Noto Sans SC, sans-serif" fontSize="11" fill="#6B6560" textAnchor="middle">
                <text x="55" y="150">12 月</text>
                <text x="105" y="150">1 月</text>
                <text x="155" y="150">2 月</text>
                <text x="205" y="150">3 月</text>
                <text x="255" y="150">4 月</text>
                <text x="305" y="150" fontWeight="600" fill="#3E3A36">5 月</text>
              </g>
            </svg>
          </div>

          <style>{`
            @keyframes drawLine { to { stroke-dashoffset: 0; } }
            @keyframes fadeIn { to { opacity: 1; } }
            @keyframes dotPop {
              0%   { opacity: 0; transform: scale(0.6); }
              80%  { opacity: 1; transform: scale(1.2); }
              100% { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </section>

        {/* Section: 本月成就 */}
        <section className="px-6 mt-6">
          <h2 className="text-[20px] font-semibold text-text-primary tracking-wider leading-tight flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-accent-cream text-accent-wood flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 4h10v6a5 5 0 0 1-10 0z" />
                <path d="M7 7H4a3 3 0 0 0 3 3" />
                <path d="M17 7h3a3 3 0 0 1-3 3" />
                <path d="M9 16h6v4H9z" />
              </svg>
            </span>
            本月成就
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {/* Achievement 1 - wood */}
            <span className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-pill text-[15px] font-medium tracking-wider whitespace-nowrap bg-accent-cream text-accent-wood">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M5 9 Q5 5 12 5 Q19 5 19 9 Q19 14 12 14 Q5 14 5 9 Z" />
                <path d="M6 6 L4 2 L8 5 Z" />
                <path d="M18 6 L20 2 L16 5 Z" />
              </svg>
              接待第 5 只宠物
            </span>

            {/* Achievement 2 - green */}
            <span className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-pill text-[15px] font-medium tracking-wider whitespace-nowrap bg-accent-soft text-accent-primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 3 L13.2 9 L19 10.5 L13.2 12 L12 18 L10.8 12 L5 10.5 L10.8 9 Z" />
              </svg>
              100% 任务完成
            </span>

            {/* Achievement 3 - shimmer */}
            <span className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-pill text-[15px] font-medium tracking-wider whitespace-nowrap bg-shimmer-bg text-accent-shimmer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
              </svg>
              收到 3 次特别表扬
            </span>
          </div>
        </section>

        {/* Platform support card */}
        <section className="mx-6 mt-8 p-5 bg-accent-cream rounded-card">
          <h3 className="text-lg font-semibold text-accent-wood tracking-wider mb-3">
            Moodmold 为你做的
          </h3>
          <ul className="flex flex-col gap-2 list-none p-0 m-0">
            <li className="flex items-center gap-2.5 text-base text-text-primary leading-snug">
              <span className="w-[22px] h-[22px] rounded-full bg-accent-primary text-white flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>
              AI 自动生成日记，你不用写字
            </li>
            <li className="flex items-center gap-2.5 text-base text-text-primary leading-snug">
              <span className="w-[22px] h-[22px] rounded-full bg-accent-primary text-white flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>
              平台保险已覆盖意外
            </li>
            <li className="flex items-center gap-2.5 text-base text-text-primary leading-snug">
              <span className="w-[22px] h-[22px] rounded-full bg-accent-primary text-white flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>
              24 小时支持答疑
            </li>
          </ul>
        </section>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="absolute left-0 right-0 bottom-0 px-6 pt-4 pb-7 bg-primary-bg z-[25]">
        {/* Gradient mask */}
        <div className="absolute left-0 right-0 -top-6 h-6 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(245,241,234,0) 0%, var(--color-primary-bg) 100%)',
          }}
        />
        <button
          type="button"
          onClick={() => showToast('本月明细 即将开放')}
          className="w-full h-16 rounded-pill bg-accent-primary text-white text-xl font-semibold tracking-wider border-0 cursor-pointer active:translate-y-px active:scale-[0.99] transition-all"
          style={{ boxShadow: '0 6px 20px rgba(107,142,127,0.30)' }}
        >
          查看本月明细
        </button>
      </div>
    </div>
  );
}
