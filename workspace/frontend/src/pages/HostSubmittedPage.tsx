import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getPetByTagId } from '../utils/storage';
import type { Pet } from '../types';

export default function HostSubmittedPage() {
  const navigate = useNavigate();
  const { petId } = useParams<{ petId: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [diaryVisible, setDiaryVisible] = useState(false);

  useEffect(() => {
    if (!petId) return;
    const found = getPetByTagId(petId);
    setPet(found ?? null);
    const timer = setTimeout(() => setDiaryVisible(true), 500);
    return () => clearTimeout(timer);
  }, [petId]);

  const petName = pet?.name ?? '豆豆';
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return (
    <div className="h-full bg-primary-bg relative overflow-hidden">
      {/* Scrollable content */}
      <div className="w-full h-full overflow-y-auto pb-[140px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Success area · 200px */}
        <section className="pt-8 px-6 h-[200px] flex flex-col items-center">
          <div className="relative w-[96px] h-[96px] flex items-center justify-center">
            <span
              className="absolute inset-0 rounded-full border-2 border-accent-primary opacity-0 animate-ring-expand z-[1]"
            />
            <span
              className="absolute inset-0 rounded-full border-2 border-accent-primary opacity-0 animate-ring-expand z-[1]"
              style={{ animationDelay: '700ms' }}
            />
            <span
              className="absolute inset-0 rounded-full border-2 border-accent-primary opacity-0 animate-ring-expand z-[1]"
              style={{ animationDelay: '1400ms' }}
            />
            <div
              className="w-[96px] h-[96px] rounded-full bg-accent-primary flex items-center justify-center text-white shadow-[0_8px_24px_rgba(107,142,127,0.30)] z-[2] animate-disc-pop"
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5"/>
              </svg>
            </div>
          </div>
          <h1 className="mt-6 text-2xl font-semibold text-text-primary tracking-[0.02em] leading-[1.3] animate-text-fade-up" style={{ animationDelay: '200ms' }}>
            已发送给{petName}主人
          </h1>
          <p className="mt-2 text-base text-[#6B6560] leading-[1.4] animate-text-fade-up" style={{ animationDelay: '350ms' }}>
            <span className="text-accent-primary font-semibold">30 秒</span>后宠主就能看到
          </p>
        </section>

        {/* AI Diary preview · HERO */}
        {diaryVisible && (
          <section className="mx-6 mt-10 animate-diary-reveal">
            <article
              className="relative rounded-card shadow-[0_12px_36px_rgba(139,111,71,0.20),0_2px_6px_rgba(62,58,54,0.06)] border border-[rgba(139,111,71,0.22)] overflow-hidden p-[16px_22px_22px]"
              style={{
                background: 'radial-gradient(circle at 20% 12%, rgba(139,111,71,0.10) 0%, transparent 38%), radial-gradient(circle at 86% 84%, rgba(196,145,92,0.08) 0%, transparent 36%), radial-gradient(circle at 50% 50%, rgba(255,255,255,0.45) 0%, transparent 60%), linear-gradient(168deg, #FBF4E6 0%, #F5EFE6 50%, #EBE0CC 100%)',
              }}
            >
              {/* Paper grain noise overlay */}
              <div
                className="absolute inset-0 rounded-card pointer-events-none z-[1] opacity-[0.14]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.45  0 0 0 0 0.36  0 0 0 0 0.22  0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  backgroundSize: '220px 220px',
                  mixBlendMode: 'multiply',
                }}
              />
              {/* Laid paper horizontal grain */}
              <div
                className="absolute inset-0 rounded-card pointer-events-none z-[1] opacity-55"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(139,111,71,0.045) 2px, rgba(139,111,71,0.045) 3px)',
                  mixBlendMode: 'multiply',
                }}
              />

              <div className="relative z-[2]">
                {/* Badge */}
                <span className="inline-flex items-center gap-[5px] h-7 px-3 rounded-pill bg-shimmer-bg text-accent-shimmer text-sm font-semibold tracking-[0.04em] shadow-[0_1px_4px_rgba(196,145,92,0.16)]">
                  <svg className="w-3 h-3 text-accent-shimmer" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3 L13.2 9 L19 10.5 L13.2 12 L12 18 L10.8 12 L5 10.5 L10.8 9 Z"/>
                  </svg>
                  系统自动生成
                </span>

                {/* Orange cat motif · top-right */}
                <span className="absolute top-[14px] right-[18px] w-9 h-9 text-[rgba(139,111,71,0.55)] z-[2] rotate-[4deg]">
                  <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 24 Q8 18 14 17 Q21 16 25 20 Q28 23 26 26 Q22 28 17 28 Q11 28 9 24 Z"/>
                    <path d="M11 16 Q10 11 14 10 Q19 9 20 13 Q21 17 17 18 Q13 18 11 16 Z"/>
                    <path d="M12 11 L11 7 L14 10"/>
                    <path d="M19 11 L20 7 L17 10"/>
                    <path d="M26 22 Q31 19 30 14 Q27 14 26 18"/>
                    <path d="M14 14.5 L11 14.7"/>
                    <path d="M14 15.5 L11 16"/>
                  </svg>
                </span>

                {/* Title */}
                <h2 className="mt-[18px] font-[family-name:var(--font-serif)] text-[23px] font-semibold text-text-primary text-center tracking-[0.06em] leading-[1.4] [text-shadow:0_0.4px_0_rgba(62,58,54,0.05)]">
                  今天我们晒了一下午太阳
                </h2>

                {/* Photo placeholder */}
                <div className="mx-auto mt-4 w-[200px] h-[120px] rounded-[12px] border border-[rgba(139,111,71,0.22)] flex flex-col items-center justify-center gap-[6px] text-accent-wood relative overflow-hidden"
                  style={{ background: 'linear-gradient(160deg, #EBE0CC 0%, #D9C9A7 100%)' }}>
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.0' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.4  0 0 0 0 0.25  0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                      mixBlendMode: 'multiply',
                    }}
                  />
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-55">
                    <path d="M4 8h3l2-2h6l2 2h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  <span className="text-sm font-medium tracking-[0.04em] opacity-85">你刚上传的照片之一</span>
                </div>

                {/* Diary body */}
                <div className="mt-[18px] text-base leading-[1.8] text-text-primary tracking-[0.02em]">
                  <p className="m-0 mb-2">今天那只城里客猫学会</p>
                  <p className="m-0 mb-2">用我们山里的山泉水盆了。</p>
                  <p className="m-0 mb-2">喝完打了个嗝。</p>
                  <p className="h-[6px]" />
                  <p className="m-0 mb-2 text-[#6B6560]">我没笑——</p>
                  <p className="m-0 text-[#6B6560]">但我心里笑了。</p>
                </div>

                {/* Signature */}
                <div className="mt-[14px] flex justify-end items-center gap-2 font-[family-name:var(--font-en-serif)] italic text-base text-accent-wood tracking-[0.04em]">
                  <span className="w-12 h-[10px] text-accent-wood opacity-75 shrink-0">
                    <svg viewBox="0 0 48 10" fill="none" stroke="currentColor" strokeLinecap="round">
                      <path d="M2 6 Q8 5.6 14 5 Q22 4.4 28 5.4 Q36 6.2 42 5.6 Q45 5.4 46 6" strokeWidth="1.4"/>
                      <path d="M16 4.5 Q24 4 32 4.7" strokeWidth="0.7" opacity="0.6"/>
                      <circle cx="2.2" cy="6" r="0.9" fill="currentColor" stroke="none"/>
                    </svg>
                  </span>
                  <span className="font-[family-name:var(--font-serif)] not-italic font-medium">有福</span>
                  <span className="font-[family-name:var(--font-en-sans)] not-italic text-[#6B6560] ml-1">· {timeStr}</span>
                </div>
              </div>
            </article>
          </section>
        )}

        {/* System hint */}
        <div className="mx-6 mt-6 text-center text-base text-[#6B6560] tracking-[0.02em] flex items-center justify-center gap-2">
          {petName}主人会在 <span className="text-accent-primary font-semibold">30 秒</span> 内收到这条日记
          <span className="w-4 h-4 text-accent-wood inline-flex animate-[envFloat_3s_ease-in-out_infinite]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="6" width="18" height="13" rx="2"/>
              <path d="M3 8l9 6 9-6"/>
            </svg>
          </span>
        </div>

        {/* Encouragement card */}
        <section className="mx-6 mt-8 min-h-[100px] p-4 bg-accent-soft rounded-card flex items-center gap-[14px]">
          <div className="w-12 h-12 rounded-full bg-accent-primary shrink-0 flex items-center justify-center text-white shadow-[0_2px_10px_rgba(107,142,127,0.25)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-lg font-semibold text-accent-primary tracking-[0.02em] leading-[1.3]">你今天做得真好</div>
            <div className="mt-1 text-base text-[#6B6560] leading-[1.4]">
              本月你已经成功打卡 <span className="text-accent-wood font-semibold">23</span> 次
            </div>
          </div>
        </section>
      </div>

      {/* Footer buttons */}
      <div className="absolute left-0 right-0 bottom-0 px-6 pb-7 pt-3 bg-primary-bg z-25 flex gap-3">
        <div className="absolute left-0 right-0 -top-6 h-6 bg-gradient-to-b from-transparent to-primary-bg pointer-events-none" />
        <Link
          to="/host/pets"
          className="flex-1 h-[56px] rounded-pill bg-white text-accent-primary border-[1.5px] border-accent-primary text-base font-semibold tracking-[0.02em] inline-flex items-center justify-center gap-1 transition-all duration-200 hover:bg-accent-soft active:translate-y-px active:scale-[0.99]"
        >
          继续小花的打卡
        </Link>
        <Link
          to="/host"
          className="flex-1 h-[56px] rounded-pill bg-accent-primary text-white text-base font-semibold tracking-[0.02em] inline-flex items-center justify-center shadow-[0_6px_18px_rgba(107,142,127,0.30)] transition-all duration-200 hover:bg-[#5d8071] active:translate-y-px active:scale-[0.99]"
        >
          回到首页
        </Link>
      </div>

      {/* Keyframe for envelope float */}
      <style>{`
        @keyframes envFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
      `}</style>
    </div>
  );
}
