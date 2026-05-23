import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const filterOptions = [
  { key: 'all', label: '全部' },
  { key: 'longtan', label: '龙潭村' },
  { key: 'shuangxi', label: '双溪镇' },
  { key: 'bridge', label: '近廊桥' },
  { key: 'yard', label: '有院落' },
];

export default function StayPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const showToast = useCallback((msg: string, duration = 1600) => {
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), duration);
  }, []);

  const handleStayClick = (inn: string) => {
    if (inn === 'shanju') {
      navigate(`/book/${inn}`);
    } else {
      showToast('即将开放,敬请期待');
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-primary-bg relative" style={{ scrollbarWidth: 'none' }}>
      {/* Toast */}
      <div
        className={`absolute left-1/2 top-[40px] -translate-x-1/2 z-50 bg-[rgba(62,58,54,0.92)] text-white px-5 py-3 rounded-pill font-[family-name:var(--font-sans)] text-[13px] tracking-[0.02em] shadow-lift transition-all duration-[220ms] pointer-events-none ${
          toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
        }`}
      >
        即将开放,敬请期待
      </div>

      {/* Content */}
      <div className="pb-8">
        {/* Top nav */}
        <nav className="h-14 px-4 grid grid-cols-[40px_1fr_40px] items-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-text-primary hover:bg-[rgba(62,58,54,0.06)] transition-colors"
            title="返回"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6"/>
            </svg>
          </button>
          <div className="text-center font-[family-name:var(--font-sans)] text-base font-medium text-text-primary tracking-[0.02em]">
            选择民宿
          </div>
          <div />
        </nav>

        {/* Filter chips */}
        <div className="h-[60px] flex items-center gap-2 px-6 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {filterOptions.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveFilter(f.key)}
              className={`flex-shrink-0 h-8 px-4 rounded-pill font-[family-name:var(--font-sans)] text-[13px] font-medium cursor-pointer transition-all duration-150 active:scale-95 select-none border ${
                activeFilter === f.key
                  ? 'bg-accent-primary text-white border-accent-primary'
                  : 'bg-white text-text-secondary border-border-light hover:border-accent-primary hover:text-accent-primary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Stay cards */}
        <section className="px-6 pt-2 flex flex-col gap-4">
          {/* Card 1 - 其祥居 (primary, 有福的家) */}
          <article
            className="bg-card-bg rounded-card overflow-hidden shadow-base cursor-pointer transition-all duration-200 active:scale-[0.995] active:shadow-soft"
            onClick={() => handleStayClick('shanju')}
          >
            {/* Photo area */}
            <div className="relative h-[160px] overflow-hidden bg-gradient-to-b from-[#cfd9d3] to-[#e3ecdf]">
              <img
                src="/assets/village/village-qixiangju.png"
                alt="其祥居"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Tags */}
              <span className="absolute top-3 right-3 h-7 pl-1 pr-2.5 bg-white/95 text-accent-wood rounded-pill font-[family-name:var(--font-sans)] text-xs font-medium tracking-[0.02em] flex items-center gap-1 shadow-[0_2px_8px_rgba(62,58,54,0.12)]" style={{ backdropFilter: 'blur(4px)' }}>
                <img src="/assets/badges/badge-certified.png" alt="首批认证" className="w-5 h-5 object-contain" />
                首批认证
              </span>
              <span className="absolute bottom-3 right-3 h-[26px] px-3 bg-white/95 text-accent-primary rounded-pill font-[family-name:var(--font-sans)] text-xs font-medium tracking-[0.02em] flex items-center gap-1 shadow-[0_2px_8px_rgba(62,58,54,0.12)]" style={{ backdropFilter: 'blur(4px)' }}>
                <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                  <path d="M3 6 L4 3 L5.5 5 Q8 4.5 10.5 5 L12 3 L13 6 Q14 9 11.5 11 Q8 12.5 4.5 11 Q2 9 3 6 Z"/>
                  <circle cx="6" cy="8" r="0.7" fill="#fff"/>
                  <circle cx="10" cy="8" r="0.7" fill="#fff"/>
                </svg>
                有有福
              </span>
            </div>

            {/* Info */}
            <div className="p-5 flex flex-col gap-2">
              <div className="flex justify-between items-baseline gap-3">
                <div className="font-[family-name:var(--font-serif)] text-xl font-medium text-text-primary leading-[1.3]">其祥居</div>
                <div className="font-[family-name:var(--font-sans)] text-base font-medium text-accent-primary whitespace-nowrap">
                  <span className="font-[family-name:var(--font-en-sans)] font-semibold tracking-[0.01em]">&#165;150</span>
                  <span className="text-xs text-text-tertiary font-normal ml-0.5">/天起</span>
                </div>
              </div>
              <div className="font-[family-name:var(--font-sans)] text-[13px] text-text-secondary leading-[1.4]">屏南县熙岭乡龙潭村 · 王青</div>
              <div className="flex items-center gap-1 font-[family-name:var(--font-sans)] text-xs text-text-tertiary leading-[1.4] flex-wrap">
                <span className="inline-flex items-center gap-0.5 text-accent-shimmer font-medium">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l2.2 4.5 5 .7-3.6 3.5.8 4.9L8 12.3l-4.5 2.3.9-4.9L.8 6.2l4.9-.7L8 1z"/></svg>
                  4.9
                </span>
                <span className="text-text-tertiary opacity-60 mx-1">·</span>已寄养 23 只
                <span className="text-text-tertiary opacity-60 mx-1">·</span>距廊桥 800m
              </div>
              <div className="flex gap-2 mt-0.5">
                <span className="inline-flex items-center h-6 px-2.5 text-xs rounded-pill bg-accent-soft text-accent-primary font-[family-name:var(--font-sans)] font-medium">院落</span>
                <span className="inline-flex items-center h-6 px-2.5 text-xs rounded-pill bg-accent-soft text-accent-primary font-[family-name:var(--font-sans)] font-medium">山景房</span>
                <span className="inline-flex items-center h-6 px-2.5 text-xs rounded-pill bg-accent-cream text-accent-wood font-[family-name:var(--font-sans)] font-medium">有村猫</span>
              </div>
            </div>
          </article>

          {/* Card 2 - 金豆子烤吧 (coming soon) */}
          <article className="bg-card-bg rounded-card overflow-hidden shadow-base opacity-60 cursor-default">
            <div className="relative h-[160px] overflow-hidden bg-gradient-to-b from-[#F5EFE6] to-[#F0E6D6]">
              <img
                src="/assets/village/village-jindouzi.png"
                alt="金豆子烤吧"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="absolute top-3 right-3 h-[26px] px-3 bg-[rgba(176,168,157,0.95)] text-white rounded-pill font-[family-name:var(--font-sans)] text-xs font-medium tracking-[0.02em] shadow-[0_1px_4px_rgba(62,58,54,0.1)]">
                即将开放
              </span>
            </div>
            <div className="p-5 flex flex-col gap-2">
              <div className="flex justify-between items-baseline gap-3">
                <div className="font-[family-name:var(--font-serif)] text-xl font-medium text-text-primary leading-[1.3]">金豆子烤吧</div>
                <div className="font-[family-name:var(--font-sans)] text-base font-medium text-accent-primary whitespace-nowrap">
                  <span className="font-[family-name:var(--font-en-sans)] font-semibold tracking-[0.01em]">&#165;120</span>
                  <span className="text-xs text-text-tertiary font-normal ml-0.5">/天起</span>
                </div>
              </div>
              <div className="font-[family-name:var(--font-sans)] text-[13px] text-text-secondary leading-[1.4]">屏南县龙潭村 · 院落烤吧</div>
              <div className="flex items-center gap-1 font-[family-name:var(--font-sans)] text-xs text-text-tertiary leading-[1.4] flex-wrap">
                <span className="inline-flex items-center gap-0.5 text-accent-shimmer font-medium">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l2.2 4.5 5 .7-3.6 3.5.8 4.9L8 12.3l-4.5 2.3.9-4.9L.8 6.2l4.9-.7L8 1z"/></svg>
                  —
                </span>
                <span className="text-text-tertiary opacity-60 mx-1">·</span>待开放<span className="text-text-tertiary opacity-60 mx-1">·</span>近古茶树
              </div>
              <div className="flex gap-2 mt-0.5">
                <span className="inline-flex items-center h-6 px-2.5 text-xs rounded-pill bg-accent-soft text-accent-primary font-[family-name:var(--font-sans)] font-medium">院落</span>
                <span className="inline-flex items-center h-6 px-2.5 text-xs rounded-pill bg-accent-cream text-accent-wood font-[family-name:var(--font-sans)] font-medium">烤吧</span>
              </div>
            </div>
          </article>

          {/* Card 3 - 溪边小筑 (coming soon) */}
          <article className="bg-card-bg rounded-card overflow-hidden shadow-base opacity-60 cursor-default">
            <div className="relative h-[160px] overflow-hidden bg-gradient-to-b from-[#E8EFEB] to-[#F1F0E7]">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 345 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <rect width="345" height="160" fill="url(#sky3)"/>
                <defs><linearGradient id="sky3" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#E8EFEB"/><stop offset="100%" stopColor="#F1F0E7"/></linearGradient></defs>
                <g fill="#9EB1A6" opacity="0.7">
                  <circle cx="40" cy="78" r="14"/><circle cx="70" cy="74" r="16"/><circle cx="105" cy="78" r="13"/><circle cx="140" cy="76" r="14"/><circle cx="200" cy="76" r="15"/><circle cx="240" cy="78" r="13"/><circle cx="280" cy="76" r="14"/><circle cx="315" cy="78" r="12"/>
                </g>
                <g transform="translate(120,108)">
                  <path d="M0,0 Q50,-22 100,0" stroke="#8B6F47" strokeWidth="3" fill="none"/>
                  <path d="M0,0 L0,8 M20,-9 L20,3 M40,-15 L40,-3 M60,-15 L60,-3 M80,-9 L80,3 M100,0 L100,8" stroke="#8B6F47" strokeWidth="2"/>
                </g>
                <rect x="0" y="120" width="345" height="40" fill="#B6C5BC" opacity="0.7"/>
                <g stroke="#FFFFFF" strokeWidth="1" opacity="0.55">
                  <path d="M20,134 Q40,130 60,134 T100,134"/><path d="M150,142 Q170,138 190,142 T230,142"/><path d="M260,134 Q280,130 300,134 T340,134"/>
                </g>
                <g transform="translate(270,108)">
                  <rect x="-18" y="-2" width="36" height="14" fill="#EFE7D6"/>
                  <path d="M-22,-2 L0,-14 L22,-2 Z" fill="#5A4A3A"/>
                  <rect x="-4" y="2" width="8" height="10" fill="#5A4A3A"/>
                </g>
              </svg>
              <span className="absolute top-3 right-3 h-[26px] px-3 bg-[rgba(176,168,157,0.95)] text-white rounded-pill font-[family-name:var(--font-sans)] text-xs font-medium tracking-[0.02em] shadow-[0_1px_4px_rgba(62,58,54,0.1)]">
                即将开放
              </span>
            </div>
            <div className="p-5 flex flex-col gap-2">
              <div className="flex justify-between items-baseline gap-3">
                <div className="font-[family-name:var(--font-serif)] text-xl font-medium text-text-primary leading-[1.3]">溪边小筑</div>
                <div className="font-[family-name:var(--font-sans)] text-base font-medium text-accent-primary whitespace-nowrap">
                  <span className="font-[family-name:var(--font-en-sans)] font-semibold tracking-[0.01em]">&#165;180</span>
                  <span className="text-xs text-text-tertiary font-normal ml-0.5">/天起</span>
                </div>
              </div>
              <div className="font-[family-name:var(--font-sans)] text-[13px] text-text-secondary leading-[1.4]">屏南县龙潭村 · 临溪而建</div>
              <div className="flex items-center gap-1 font-[family-name:var(--font-sans)] text-xs text-text-tertiary leading-[1.4] flex-wrap">
                <span className="inline-flex items-center gap-0.5 text-accent-shimmer font-medium">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l2.2 4.5 5 .7-3.6 3.5.8 4.9L8 12.3l-4.5 2.3.9-4.9L.8 6.2l4.9-.7L8 1z"/></svg>
                  —
                </span>
                <span className="text-text-tertiary opacity-60 mx-1">·</span>待开放<span className="text-text-tertiary opacity-60 mx-1">·</span>临廊桥 100m
              </div>
              <div className="flex gap-2 mt-0.5">
                <span className="inline-flex items-center h-6 px-2.5 text-xs rounded-pill bg-accent-soft text-accent-primary font-[family-name:var(--font-sans)] font-medium">临溪</span>
                <span className="inline-flex items-center h-6 px-2.5 text-xs rounded-pill bg-accent-soft text-accent-primary font-[family-name:var(--font-sans)] font-medium">山景房</span>
              </div>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
