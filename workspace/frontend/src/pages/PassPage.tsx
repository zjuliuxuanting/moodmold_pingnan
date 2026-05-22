import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPetByTagId, getUpdates } from '../utils/storage';
import type { Pet } from '../types';

type PassState = 'loading' | 'complete';

export default function PassPage() {
  const { tagId } = useParams<{ tagId: string }>();
  const navigate = useNavigate();
  const [passState, setPassState] = useState<PassState>('loading');
  const [pet, setPet] = useState<Pet | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 1600);
  }, []);

  useEffect(() => {
    if (!tagId) return;
    const foundPet = getPetByTagId(tagId);
    if (foundPet) {
      setPet(foundPet);
    }
    // auto transition after 4s
    const timer = setTimeout(() => setPassState('complete'), 4000);
    return () => clearTimeout(timer);
  }, [tagId]);

  const petName = pet?.name || '豆豆';
  const petPhoto = pet?.photo || '';

  // Loading state
  if (passState === 'loading') {
    return (
      <div className="w-full h-full flex flex-col items-center bg-primary-bg overflow-hidden">
        {/* Loading hero */}
        <div className="mt-[80px] w-[160px] h-[160px] relative flex items-center justify-center">
          {/* 4 breathing rings */}
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute w-[160px] h-[160px] rounded-full border-[1.5px] border-accent-primary opacity-0"
              style={{
                animation: `ring-pulse 2.2s ease-out infinite`,
                animationDelay: `${i * 0.55}s`,
              }}
            />
          ))}
          {/* Cat photo */}
          <div
            className="w-[120px] h-[120px] rounded-full border-2 border-accent-wood flex items-center justify-center relative z-[2] overflow-hidden shadow-[0_4px_18px_rgba(139,111,71,0.18)]"
            style={{
              background: petPhoto
                ? undefined
                : 'radial-gradient(circle at 35% 30%, #f5e2c4 0%, #e8c598 40%, #c89868 100%)',
            }}
          >
            {petPhoto ? (
              <img src={petPhoto} alt={petName} className="w-full h-full object-cover" />
            ) : (
              <div className="font-[family-name:var(--font-serif)] font-semibold text-[22px] text-white tracking-[0.06em]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.18)' }}>
                {petName}
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="mt-12 font-[family-name:var(--font-serif)] text-xl font-medium text-text-primary text-center leading-[1.4] px-6">
          正在为<span className="text-accent-wood font-semibold">{petName}</span>生成屏南通行证
        </h1>

        {/* Steps */}
        <ul className="mt-8 w-full px-12 flex flex-col gap-1" role="list">
          <li className="grid grid-cols-[20px_1fr_auto] items-center gap-3 h-8 font-[family-name:var(--font-sans)] text-sm text-text-primary">
            <span className="w-3 h-3 rounded-full bg-accent-primary flex items-center justify-center justify-self-center">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l5 5L20 7"/>
              </svg>
            </span>
            <span>识别{petName}特征</span>
            <span />
          </li>
          <li className="grid grid-cols-[20px_1fr_auto] items-center gap-3 h-8 font-[family-name:var(--font-sans)] text-sm text-text-primary">
            <span
              className="w-3 h-3 rounded-full bg-accent-primary justify-self-center"
              style={{ animation: 'dot-pulse 1.4s ease-in-out infinite' }}
            />
            <span>解析性格基因</span>
            <span
              className="text-accent-primary font-[family-name:var(--font-en-sans)] font-semibold tracking-[0.08em]"
              style={{ animation: 'dot-pulse 1.4s ease-in-out infinite' }}
            >
              ···
            </span>
          </li>
          <li className="grid grid-cols-[20px_1fr_auto] items-center gap-3 h-8 font-[family-name:var(--font-sans)] text-sm text-text-tertiary">
            <span className="w-3 h-3 rounded-full bg-text-tertiary opacity-40 justify-self-center" />
            <span>生成屏南通行证</span>
            <span />
          </li>
        </ul>

        {/* Progress bar */}
        <div className="mt-12 mx-12 w-[calc(100%-96px)] h-1 bg-border-light rounded-sm overflow-hidden">
          <div
            className="h-full bg-accent-primary rounded-sm"
            style={{
              width: '8%',
              animation: `progress-fill 4s cubic-bezier(.4,0,.2,1) forwards`,
            }}
          />
        </div>

        <div className="mt-4 text-center font-[family-name:var(--font-sans)] text-xs text-text-tertiary tracking-[0.02em] px-6">
          正在准备{petName}的乡村身份
          <span className="inline-block w-1 h-1 rounded-full bg-accent-primary align-middle mx-1.5 mb-0.5" style={{ animation: 'dot-pulse 1.4s ease-in-out infinite' }} />
        </div>
      </div>
    );
  }

  // Complete state
  return (
    <div className="w-full h-full flex flex-col relative bg-primary-bg">
      {/* Toast */}
      <div
        className={`absolute left-1/2 top-[50px] -translate-x-1/2 z-[70] bg-[rgba(62,58,54,0.92)] text-white px-5 py-3 rounded-pill font-[family-name:var(--font-sans)] text-[13px] tracking-[0.02em] shadow-lift transition-all duration-[220ms] pointer-events-none ${
          toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
        }`}
      >
        通行证已保存到相册
      </div>

      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto pb-[120px]" style={{ scrollbarWidth: 'none' }}>
        {/* Top nav */}
        <nav className="h-14 px-4 grid grid-cols-[40px_1fr_60px] items-center flex-shrink-0">
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
          <div className="text-center font-[family-name:var(--font-sans)] text-base font-medium text-text-primary tracking-[0.02em]">
            屏南通行证
          </div>
          <button
            type="button"
            onClick={() => showToast('通行证已保存到相册')}
            className="justify-self-end px-3.5 py-1.5 rounded-pill bg-transparent border-none text-accent-primary font-[family-name:var(--font-sans)] text-sm font-medium cursor-pointer hover:bg-accent-soft transition-colors"
          >
            保存
          </button>
        </nav>

        {/* Pass card */}
        <div className="mx-6 mt-8 flex justify-center">
          <article
            className="w-full min-h-[480px] rounded-[24px] border-[1.5px] border-accent-wood flex flex-col items-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, #FBF7EE 0%, #F5EFE6 50%, #F0E8D8 100%)',
              boxShadow: '0 12px 36px rgba(62,58,54,0.14), 0 2px 6px rgba(62,58,54,0.06)',
              animation: 'pass-reveal 700ms cubic-bezier(.4,0,.2,1) both',
            }}
          >
            {/* Paper grain */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 22% 18%, rgba(139,111,71,0.05) 0%, transparent 30%), radial-gradient(circle at 78% 82%, rgba(107,142,127,0.04) 0%, transparent 30%), radial-gradient(circle at 50% 50%, rgba(196,145,92,0.02) 0%, transparent 60%)',
              }}
            />

            {/* Serial number */}
            <span className="absolute top-[18px] right-4 font-mono text-[10px] text-accent-wood opacity-70 tracking-[0.12em]">
              {tagId || 'YF-2026-023'}
            </span>

            {/* Top wood band */}
            <div className="w-full h-2 bg-accent-wood relative flex-shrink-0">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-card-bg border border-accent-wood" />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-card-bg border border-accent-wood" />
            </div>

            {/* Header */}
            <div className="mt-6 flex flex-col items-center gap-1.5 relative z-[2]">
              <span className="inline-flex items-center h-6 px-3 rounded-pill bg-accent-soft text-accent-primary font-[family-name:var(--font-sans)] text-xs font-medium tracking-[0.04em]">
                屏南龙潭村客籍
              </span>
              <div className="font-[family-name:var(--font-serif)] text-[28px] font-bold text-text-primary leading-[1.2] mt-2 tracking-[0.06em]">
                {petName}
              </div>
              <div className="font-[family-name:var(--font-sans)] text-sm text-text-secondary mt-1">
                第<span className="font-[family-name:var(--font-en-sans)] font-semibold tracking-[0.04em] text-accent-wood mx-0.5">023</span>号寄养通行证
              </div>
            </div>

            {/* Cat photo on pass */}
            <div className="mt-6 w-[160px] h-[160px] rounded-full border-2 border-accent-wood flex items-center justify-center relative z-[2] overflow-hidden shadow-[0_4px_16px_rgba(139,111,71,0.18)]"
              style={{
                background: petPhoto
                  ? undefined
                  : 'radial-gradient(circle at 35% 30%, #f5e2c4 0%, #e8c598 40%, #c89868 100%)',
              }}
            >
              {petPhoto ? (
                <img src={petPhoto} alt={petName} className="w-full h-full object-cover" />
              ) : (
                <div className="font-[family-name:var(--font-serif)] font-semibold text-[32px] text-white tracking-[0.08em]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.18)' }}>
                  {petName.charAt(0)}
                </div>
              )}
            </div>

            {/* Stamp seal */}
            <div
              className="absolute top-[240px] right-[22px] w-11 h-11 border-[1.5px] border-[#B8542F] rounded-[6px] flex items-center justify-center opacity-70 bg-white/20"
              style={{ transform: 'rotate(-6deg)' }}
            >
              <span className="font-[family-name:var(--font-serif)] font-bold text-[22px] text-[#B8542F] leading-none">印</span>
            </div>

            {/* Personality dual-column */}
            <div className="mt-6 w-full px-9 grid items-center gap-[18px] relative z-[2]" style={{ gridTemplateColumns: '1fr 1px 1fr' }}>
              <div className="flex flex-col items-center gap-1">
                <span className="font-[family-name:var(--font-sans)] text-[11px] text-text-tertiary tracking-[0.12em] uppercase">性格 MBTI</span>
                <span className="font-[family-name:var(--font-serif)] text-lg font-semibold text-text-primary tracking-[0.06em]">ESFP</span>
              </div>
              <div className="w-px h-9 bg-accent-wood opacity-25 justify-self-center" />
              <div className="flex flex-col items-center gap-1">
                <span className="font-[family-name:var(--font-sans)] text-[11px] text-text-tertiary tracking-[0.12em] uppercase">性格标签</span>
                <span className="font-[family-name:var(--font-serif)] text-base font-semibold text-text-primary tracking-[0.02em]">派对动物</span>
              </div>
            </div>

            {/* Booking date */}
            <div className="mt-4 font-[family-name:var(--font-sans)] text-sm text-text-secondary tracking-[0.02em] relative z-[2]">
              寄养:<span className="font-[family-name:var(--font-en-sans)] font-medium text-text-primary tracking-[0.04em] mx-0.5">2026.05.25</span>—<span className="font-[family-name:var(--font-en-sans)] font-medium text-text-primary tracking-[0.04em] mx-0.5">05.31</span>
            </div>

            {/* Footer bridge */}
            <div className="mt-auto mb-4 flex flex-col items-center gap-1 relative z-[2]">
              <svg className="h-8 text-accent-wood opacity-40" viewBox="0 0 160 32" fill="currentColor" aria-hidden="true">
                <path d="M0 28 Q40 30 80 28 T160 28 V32 H0 Z" opacity="0.35"/>
                <path d="M16 24 Q30 12 44 24" fill="none" stroke="currentColor" strokeWidth="1"/>
                <path d="M72 24 Q80 14 88 24" fill="none" stroke="currentColor" strokeWidth="1"/>
                <path d="M116 24 Q130 12 144 24" fill="none" stroke="currentColor" strokeWidth="1"/>
                <rect x="2" y="22" width="156" height="2.5"/>
                <path d="M-2 14 Q4 12 8 12 L152 12 Q156 12 162 14 L160 16 L154 16 L154 14 L6 14 L6 16 L0 16 Z"/>
                <path d="M40 8 Q80 4 120 8 L116 12 L44 12 Z" opacity="0.75"/>
                <rect x="78" y="3" width="4" height="5" rx="1"/>
                <circle cx="80" cy="2.5" r="1.2"/>
                <rect x="29" y="16" width="1.5" height="8"/>
                <rect x="79" y="16" width="1.5" height="8"/>
                <rect x="129" y="16" width="1.5" height="8"/>
              </svg>
              <span className="font-[family-name:var(--font-en-serif)] italic text-sm text-accent-wood tracking-[0.06em]">
                in 屏南 · 龙潭
              </span>
            </div>

            {/* Watermark */}
            <span className="absolute bottom-2 left-2.5 font-[family-name:var(--font-en-serif)] italic text-[11px] text-accent-wood opacity-35 tracking-[0.12em]">
              moodmold · 2026
            </span>
          </article>
        </div>

        {/* Description */}
        <p className="mx-6 mt-6 text-center font-[family-name:var(--font-sans)] text-sm leading-[1.7] text-text-secondary">
          <span className="text-accent-wood font-medium">{petName}</span>已抵达山居民宿,<br/>
          <span className="text-accent-wood font-medium">有福</span>正在带她熟悉村子。
        </p>

        {/* Bottom spacer */}
        <div className="h-14" />
      </div>

      {/* Fixed CTA */}
      <div className="absolute left-0 right-0 bottom-0 h-[96px] pt-3 pb-6 px-6 bg-primary-bg flex flex-col items-center gap-2 z-[25]">
        <div
          className="absolute left-0 right-0 -top-6 h-6 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(245,241,234,0) 0%, var(--color-primary-bg) 100%)' }}
        />
        <button
          type="button"
          onClick={() => tagId && navigate(`/diary/${tagId}`)}
          className="w-full h-[52px] rounded-pill bg-accent-primary text-white font-[family-name:var(--font-sans)] text-base font-medium shadow-[0_6px_20px_rgba(107,142,127,0.28)] active:translate-y-px active:scale-[0.99] transition-transform"
        >
          查看有福为{petName}写的日记
        </button>
      </div>
    </div>
  );
}
