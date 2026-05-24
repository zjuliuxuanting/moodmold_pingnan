import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPetByTagIdOrDemo, getUpdates } from '../utils/storage';
import type { Pet } from '../types';

function BridgeSVG() {
  return (
    <svg viewBox="0 0 260 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 44 Q20 48 36 46 L48 28 Q52 20 60 20 L64 20 Q70 20 74 28 L78 44 Q86 48 98 46 L102 28 Q106 18 114 18 L120 18 Q128 18 132 28 L136 44 Q148 48 158 46 L162 28 Q166 18 174 18 L180 18 Q188 18 192 28 L196 44 Q208 48 218 46 L222 28 Q226 20 234 20 L238 20 Q244 20 248 28 L252 44 Q256 46 260 44" fill="none" stroke="#8B6F47" strokeWidth="1.2" opacity="0.5"/>
      <path d="M0 46 Q30 48 60 46 L66 30 Q70 24 78 24 L82 24 Q90 24 94 30 L100 46 Q120 48 160 46 L166 30 Q170 24 178 24 L182 24 Q190 24 194 30 L200 46 Q220 48 260 46" fill="none" stroke="#8B6F47" strokeWidth="1.5"/>
      <rect x="35" y="22" width="4" height="28" rx="1" fill="#C4915C" opacity="0.5"/>
      <rect x="59" y="22" width="4" height="26" rx="1" fill="#C4915C" opacity="0.5"/>
      <rect x="93" y="18" width="8" height="32" rx="2" fill="#B8956A"/>
      <rect x="155" y="18" width="8" height="32" rx="2" fill="#B8956A"/>
      <rect x="195" y="22" width="4" height="26" rx="1" fill="#C4915C" opacity="0.5"/>
      <rect x="219" y="22" width="4" height="28" rx="1" fill="#C4915C" opacity="0.5"/>
      <rect x="74" y="39" width="112" height="3" rx="1" fill="#8B6F47"/>
      <rect x="70" y="35" width="4" height="10" rx="1" fill="#8B6F47"/>
      <rect x="186" y="35" width="4" height="10" rx="1" fill="#8B6F47"/>
      <rect x="80" y="35" width="2" height="6" rx="0.5" fill="#8B6F47" opacity="0.6"/>
      <rect x="88" y="35" width="2" height="6" rx="0.5" fill="#8B6F47" opacity="0.6"/>
      <rect x="96" y="35" width="2" height="6" rx="0.5" fill="#8B6F47" opacity="0.6"/>
      <rect x="104" y="35" width="2" height="6" rx="0.5" fill="#8B6F47" opacity="0.6"/>
      <rect x="112" y="35" width="2" height="6" rx="0.5" fill="#8B6F47" opacity="0.6"/>
      <rect x="120" y="35" width="2" height="6" rx="0.5" fill="#8B6F47" opacity="0.6"/>
      <rect x="128" y="35" width="2" height="6" rx="0.5" fill="#8B6F47" opacity="0.6"/>
      <rect x="136" y="35" width="2" height="6" rx="0.5" fill="#8B6F47" opacity="0.6"/>
      <rect x="144" y="35" width="2" height="6" rx="0.5" fill="#8B6F47" opacity="0.6"/>
      <rect x="152" y="35" width="2" height="6" rx="0.5" fill="#8B6F47" opacity="0.6"/>
      <rect x="160" y="35" width="2" height="6" rx="0.5" fill="#8B6F47" opacity="0.6"/>
      <rect x="168" y="35" width="2" height="6" rx="0.5" fill="#8B6F47" opacity="0.6"/>
      <rect x="176" y="35" width="2" height="6" rx="0.5" fill="#8B6F47" opacity="0.6"/>
      <path d="M86 16 Q130 4 174 16" fill="#6B8E7F" opacity="0.8"/>
      <path d="M90 16 L170 16" stroke="#5B7553" strokeWidth="1" opacity="0.7"/>
      <path d="M88 20 Q130 10 172 20" fill="#6B8E7F" opacity="0.6"/>
      <path d="M84 24 Q130 14 176 24" fill="#6B8E7F" opacity="0.4"/>
      <rect x="125" y="6" width="10" height="16" rx="2" fill="#B8956A"/>
      <rect x="120" y="8" width="20" height="2" rx="0.5" fill="#8B6F47" opacity="0.6"/>
      <rect x="126" y="4" width="8" height="3" rx="1" fill="#B8956A"/>
      <circle cx="130" cy="2" r="2.5" fill="#C4915C"/>
      <path d="M4 52 Q16 52 28 50 L34 44 L46 40" stroke="#6B8E7F" strokeWidth="0.8" opacity="0.4"/>
      <path d="M214 40 L226 44 L232 50 Q244 52 256 52" stroke="#6B8E7F" strokeWidth="0.8" opacity="0.4"/>
      <path d="M0 51 L4 47" stroke="#8B6F47" strokeWidth="0.8" opacity="0.3"/>
      <path d="M256 47 L260 51" stroke="#8B6F47" strokeWidth="0.8" opacity="0.3"/>
    </svg>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="font-[family-name:var(--font-en-sans)] text-lg font-semibold text-accent-wood tracking-[0.04em]">
        {value}
      </span>
      <span className="font-[family-name:var(--font-sans)] text-[11px] text-text-tertiary tracking-[0.02em]">
        {label}
      </span>
    </div>
  );
}

export default function CardPage() {
  const { tagId } = useParams<{ tagId: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [cardReady, setCardReady] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 1600);
  }, []);

  useEffect(() => {
    setPet(getPetByTagIdOrDemo(tagId));
    const timer = setTimeout(() => setCardReady(true), 150);
    return () => clearTimeout(timer);
  }, [tagId]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const petName = pet?.name || '豆豆';
  const petPhoto = pet?.photo || '';
  const formatDate = (iso: string): string => {
    if (/^\d{4}\.\d{2}\.\d{2}/.test(iso)) return iso;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
  };
  const checkinDate = formatDate(pet?.checkinDate || '2026.05.25');
  const updates = tagId ? getUpdates(tagId) : [];
  const diaryCount = updates.length;

  const handleSave = () => showToast('纪念卡已保存到相册');
  const handleDownload = () => showToast('纪念卡下载中，请稍候');

  return (
    <div
      className="w-full h-full flex flex-col relative bg-primary-bg overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(180deg, rgba(245,241,234,0.86) 0%, rgba(245,241,234,0.92) 100%), url(/assets/backgrounds/bg-p5-summary.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Toast */}
      <div
        className={`absolute left-1/2 top-[50px] -translate-x-1/2 z-[70] bg-[rgba(62,58,54,0.92)] text-white px-5 py-3 rounded-pill font-[family-name:var(--font-sans)] text-[13px] tracking-[0.02em] shadow-lift transition-all duration-[220ms] pointer-events-none ${
          toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
        }`}
      >
        {toastMsg}
      </div>

      {/* Sticky nav */}
      <nav
        className="sticky top-0 z-30 h-14 px-4 grid grid-cols-[40px_1fr_60px] items-center flex-shrink-0"
        style={{ background: 'rgba(245,241,234,0.78)', backdropFilter: 'blur(14px)' }}
      >
        <button
          type="button"
          onClick={() => tagId && navigate(`/pet/${tagId}`)}
          className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-text-primary hover:bg-[rgba(62,58,54,0.06)] transition-colors"
          title="返回"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6"/>
          </svg>
        </button>
        <div />
        <button
          type="button"
          className="justify-self-end px-3 h-8 rounded-pill bg-transparent text-text-secondary font-[family-name:var(--font-sans)] text-[13px] font-medium cursor-pointer hover:bg-[rgba(62,58,54,0.06)] transition-colors flex items-center gap-1"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="5" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="19" cy="12" r="1.5" fill="currentColor"/>
          </svg>
        </button>
      </nav>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-[160px]" style={{ scrollbarWidth: 'none' }}>
        {/* Quote */}
        <div className="mt-2 mx-6 flex flex-col items-center">
          <span className="font-[family-name:var(--font-sans)] text-[13px] text-text-tertiary tracking-[0.06em]">
            来自有福
          </span>
          <h1 className="mt-2 font-[family-name:var(--font-serif)] text-[26px] font-medium text-text-primary text-center leading-[1.4] tracking-[0.04em]">
            {petName}已平安到家
          </h1>
        </div>

        {/* Memorial card */}
        <div className="mt-6 mx-4 flex justify-center">
          <article
            className="relative w-full max-w-[520px] rounded-[18px] overflow-hidden"
            style={{
              background: 'radial-gradient(ellipse at 50% 30%, #FDF9F0 0%, #F5EFE6 45%, #F0E8D8 100%)',
              border: '2px solid #8B6F47',
              boxShadow: '0 12px 40px rgba(62,58,54,0.16), 0 2px 8px rgba(62,58,54,0.08)',
              transform: cardReady ? 'scale(1)' : 'scale(0.92)',
              opacity: cardReady ? 1 : 0,
              transition: 'transform 500ms cubic-bezier(.4,0,.2,1), opacity 400ms ease-out',
            }}
          >
            {/* Double inner frame */}
            <div className="absolute inset-[10px] rounded-[12px] border border-accent-wood opacity-25 pointer-events-none" />
            <div className="absolute inset-[14px] rounded-[10px] border border-accent-wood opacity-15 pointer-events-none" />

            {/* Paper noise */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 18% 22%, rgba(139,111,71,0.04) 0%, transparent 25%), radial-gradient(circle at 82% 72%, rgba(107,142,127,0.03) 0%, transparent 25%), radial-gradient(circle at 45% 55%, rgba(196,145,92,0.02) 0%, transparent 40%)',
              }}
            />

            {/* Serial */}
            <span className="absolute top-[22px] right-[22px] font-mono text-[10px] text-accent-wood opacity-55 tracking-[0.12em] z-[2]">
              {tagId || 'YF-2026-023'}
            </span>

            {/* Watermark */}
            <span className="absolute top-[22px] left-[22px] font-[family-name:var(--font-en-serif)] italic text-[12px] text-accent-wood opacity-25 tracking-[0.12em] z-[2]">
              memory.
            </span>

            {/* Top wood band */}
            <div className="w-full h-2 bg-accent-wood relative flex-shrink-0">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-card-bg border border-[rgba(139,111,71,0.5)]" />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-card-bg border border-[rgba(139,111,71,0.5)]" />
            </div>

            <div className="px-[22px] py-5 flex flex-col items-center relative z-[2]">
              {/* Bridge */}
              <div className="w-full flex justify-center">
                <img src="/assets/decorations/decoration-lanqiao.png" alt="廊桥" className="h-14 object-contain" />
              </div>

              {/* Title */}
              <h2 className="mt-2 font-[family-name:var(--font-serif)] text-[22px] font-semibold text-text-primary tracking-[0.06em]">
                屏南旅行纪念卡
              </h2>
              <span className="mt-0.5 font-[family-name:var(--font-en-serif)] italic text-[13px] text-text-tertiary tracking-[0.08em]">
                Pingnan · Longtan · 2026
              </span>

              {/* Dual avatars */}
              <div className="mt-5 flex items-center gap-4">
                {/* 豆豆 */}
                <div
                  className="w-[80px] h-[80px] rounded-full border-[2.5px] border-white shadow-base flex items-center justify-center overflow-hidden"
                  style={{
                    background: petPhoto
                      ? undefined
                      : 'radial-gradient(circle at 35% 30%, #F5A623 0%, #E8923A 55%, #D4782A 100%)',
                  }}
                >
                  {petPhoto ? (
                    <img src={petPhoto} alt={petName} className="w-full h-full object-cover" />
                  ) : (
                    <div
                      className="font-[family-name:var(--font-serif)] font-semibold text-[28px] text-white tracking-[0.08em]"
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}
                    >
                      {petName.charAt(0)}
                    </div>
                  )}
                </div>

                {/* 有福 */}
                <div className="w-[80px] h-[80px] rounded-full border-[2.5px] border-white shadow-base overflow-hidden bg-accent-cream">
                  <img src="/assets/youfu/avatar-youfu.png" alt="有福" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Names + dates */}
              <div className="mt-3 text-center">
                <div className="font-[family-name:var(--font-serif)] text-base font-medium text-text-primary tracking-[0.06em]">
                  {petName} &times; 有福
                </div>
                <div className="mt-1 font-[family-name:var(--font-sans)] text-[13px] text-text-secondary tracking-[0.02em]">
                  {checkinDate} — 05.31 &middot; 7天
                </div>
              </div>

              {/* Stats row */}
              <div className="mt-5 w-full flex justify-center gap-8">
                <StatItem value="7" label="天" />
                <StatItem value={String(diaryCount)} label="条日记" />
                <StatItem value="4" label="张卡" />
                <StatItem value="3" label="次闪光" />
              </div>

              {/* Stamp */}
              <div className="mt-5 flex justify-center">
                <div
                  className="w-[50px] h-[50px] border-[1.5px] border-[#B8542F] rounded-[6px] flex items-center justify-center bg-[rgba(184,84,47,0.06)]"
                  style={{ transform: 'rotate(-6deg)' }}
                >
                  <span className="font-[family-name:var(--font-serif)] font-bold text-[28px] text-[#B8542F] leading-none opacity-85">印</span>
                </div>
              </div>

              {/* Handwritten letter */}
              <div className="mt-5 w-full px-4 py-4 rounded-[12px]" style={{ background: 'rgba(245,239,230,0.6)' }}>
                <p
                  className="text-center font-[family-name:var(--font-serif)] text-[18px] leading-[1.8] text-text-primary tracking-[0.05em]"
                  style={{ fontFamily: '"STKaiti", "KaiTi", "Noto Serif SC", serif' }}
                >
                  城里客人走了，
                  <br />
                  村里的猫还在等。
                  <br />
                  下次来，记得带小鱼干。
                </p>
                <p className="mt-2 text-right font-[family-name:var(--font-serif)] text-[13px] text-text-tertiary tracking-[0.04em]">
                  —— 有福
                </p>
              </div>

              {/* Coordinates */}
              <div className="mt-4 font-[family-name:var(--font-en-sans)] text-[11px] text-text-tertiary tracking-[0.08em]">
                26.9&deg;N &middot; 119.0&deg;E
              </div>
            </div>
          </article>
        </div>

        {/* Bottom tip */}
        <p className="mt-6 mx-6 text-center font-[family-name:var(--font-sans)] text-xs leading-[1.6] text-text-tertiary tracking-[0.02em]">
          长按或点击保存，即可下载高清纪念卡
        </p>
      </div>

      {/* Fixed bottom actions */}
      <div className="absolute left-0 right-0 bottom-0 pt-3 pb-6 px-6 bg-primary-bg flex flex-col items-center gap-3 z-[25]">
        <div
          className="absolute left-0 right-0 -top-6 h-6 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(245,241,234,0) 0%, var(--color-primary-bg) 100%)' }}
        />

        {/* Secondary row */}
        <div className="w-full flex gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 h-11 rounded-pill border border-border-light bg-card-bg text-text-primary font-[family-name:var(--font-sans)] text-sm font-medium cursor-pointer hover:bg-[rgba(62,58,54,0.03)] active:scale-[0.98] transition-transform flex items-center justify-center gap-1.5 shadow-soft"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            保存
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 h-11 rounded-pill border border-border-light bg-card-bg text-text-primary font-[family-name:var(--font-sans)] text-sm font-medium cursor-pointer hover:bg-[rgba(62,58,54,0.03)] active:scale-[0.98] transition-transform flex items-center justify-center gap-1.5 shadow-soft"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            下载
          </button>
        </div>

        {/* Primary CTA */}
        <button
          type="button"
          onClick={() => navigate('/stay')}
          className="w-full h-[52px] rounded-pill bg-accent-primary text-white font-[family-name:var(--font-sans)] text-base font-medium shadow-[0_6px_20px_rgba(107,142,127,0.28)] active:translate-y-px active:scale-[0.99] transition-transform"
        >
          再次预约
        </button>
      </div>
    </div>
  );
}
