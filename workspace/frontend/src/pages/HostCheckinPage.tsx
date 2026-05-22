import { useNavigate, useParams, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { getPetByTagId, addUpdate } from '../utils/storage';
import type { Pet } from '../types';

const STATUS_OPTIONS = [
  {
    key: 'eat',
    label: '吃饭好',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12 Q3 19 12 19 Q21 19 21 12"/>
        <path d="M3 12 L21 12"/>
        <path d="M5.5 12 Q12 8 18.5 12"/>
        <line x1="8" y1="11" x2="9.5" y2="11"/>
        <line x1="11.2" y1="10.2" x2="12.8" y2="10.2"/>
        <line x1="14.5" y1="11" x2="16" y2="11"/>
        <path d="M9 7 Q10 5.5 9 4"/>
        <path d="M12 6.5 Q13 5 12 3.5"/>
        <path d="M15 7 Q16 5.5 15 4"/>
      </svg>
    ),
  },
  {
    key: 'drink',
    label: '喝水好',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 6 L18 6 L17 18 Q17 20 15 20 L8 20 Q6 20 6 18 Z"/>
        <path d="M18 9 Q21 9 21 12 Q21 15 18 15"/>
        <path d="M6.5 10 L16.5 10"/>
        <path d="M7.5 12.5 Q9.5 11.7 11.5 12.5 Q13.5 13.3 15.5 12.5"/>
      </svg>
    ),
  },
  {
    key: 'litter',
    label: '排泄正常',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9 L21 9 L20 19 Q20 20 19 20 L5 20 Q4 20 4 19 Z"/>
        <path d="M4 13 L20 13"/>
        <circle cx="7" cy="16" r="0.7" fill="currentColor" stroke="none"/>
        <circle cx="10.5" cy="15.5" r="0.7" fill="currentColor" stroke="none"/>
        <circle cx="13.5" cy="16.5" r="0.7" fill="currentColor" stroke="none"/>
        <circle cx="17" cy="15" r="0.7" fill="currentColor" stroke="none"/>
        <circle cx="8" cy="18" r="0.55" fill="currentColor" stroke="none"/>
        <circle cx="15" cy="18" r="0.55" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    key: 'mood',
    label: '精神好',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 12 Q6 7 12 7 Q18 7 18 12 Q18 18 12 18 Q6 18 6 12 Z"/>
        <path d="M8 8.2 L6 4.6 L10 6.6 Z"/>
        <path d="M16 8.2 L18 4.6 L14 6.6 Z"/>
        <path d="M9 11.2 Q9.7 12 10.4 11.2"/>
        <path d="M13.6 11.2 Q14.3 12 15 11.2"/>
        <path d="M11.5 13.2 L12.5 13.2 L12 14.1 Z" fill="currentColor" stroke="none"/>
        <path d="M9 14 L6.5 13.8"/>
        <path d="M9 15 L6.5 15.3"/>
        <path d="M15 14 L17.5 13.8"/>
        <path d="M15 15 L17.5 15.3"/>
        <path d="M11 15.8 Q12 16.6 13 15.8"/>
      </svg>
    ),
  },
] as const;

const PHOTO_SILHOUETTES = [
  <svg viewBox="0 0 64 64" fill="currentColor" key="s1">
    <path d="M50 48 Q60 42 56 30 Q50 32 47 40 Q46 44 50 48 Z"/>
    <ellipse cx="32" cy="44" rx="20" ry="14"/>
    <ellipse cx="24" cy="57" rx="4" ry="2.5"/>
    <ellipse cx="40" cy="57" rx="4" ry="2.5"/>
    <circle cx="32" cy="24" r="13"/>
    <path d="M22 16 L19 7 L26 13 Z"/>
    <path d="M42 16 L45 7 L38 13 Z"/>
  </svg>,
  <svg viewBox="0 0 64 64" fill="currentColor" key="s2">
    <ellipse cx="16" cy="52" rx="11" ry="2.6"/>
    <path d="M6 50 Q6 44 16 44 Q26 44 26 50 L24 52 L18 53 L12 52 L8 51 Z"/>
    <ellipse cx="42" cy="44" rx="17" ry="10"/>
    <ellipse cx="26" cy="46" rx="9" ry="8"/>
    <path d="M22 40 L19 31 L25 38 Z"/>
    <path d="M30 40 L33 31 L27 38 Z"/>
    <path d="M55 38 Q62 28 56 20 Q52 24 52 32 Q52 36 55 38 Z"/>
    <ellipse cx="36" cy="55" rx="3.5" ry="2"/>
    <ellipse cx="48" cy="55" rx="3.5" ry="2"/>
  </svg>,
  <svg viewBox="0 0 64 64" fill="currentColor" key="s3">
    <ellipse cx="30" cy="40" rx="24" ry="13"/>
    <circle cx="48" cy="34" r="9"/>
    <path d="M44 27 L42 19 L47 26 Z"/>
    <path d="M52 27 L53 19 L49 26 Z"/>
    <path d="M10 36 Q4 30 8 22 Q14 22 16 28 Q18 32 16 36 L14 38 Z"/>
  </svg>,
];

function computeDayCount(checkinDate: string): number {
  const checkin = new Date(checkinDate);
  const today = new Date();
  const diffTime = today.getTime() - checkin.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1);
}

function generateId(): string {
  return `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function HostCheckinPage() {
  const navigate = useNavigate();
  const { petId } = useParams<{ petId: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null]);
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set(['drink']));
  const [highlight, setHighlight] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!petId) {
      setLoading(false);
      return;
    }
    const found = getPetByTagId(petId);
    setPet(found ?? null);
    setLoading(false);
  }, [petId]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 1600);
  };

  const handlePhotoSelect = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotos((prev) => {
        const next = [...prev];
        next[index] = reader.result as string;
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoRemove = (index: number) => {
    setPhotos((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = '';
    }
  };

  const toggleStatus = (key: string) => {
    setSelectedStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const uploadedCount = photos.filter(Boolean).length;
  const selectedCount = selectedStatuses.size;
  const canSubmit = uploadedCount > 0 && selectedCount > 0;

  const handleSubmit = () => {
    if (!canSubmit || !petId) return;
    const firstPhoto = photos.find(Boolean) ?? '';
    addUpdate({
      id: generateId(),
      petTagId: petId,
      timestamp: new Date().toISOString(),
      text: [highlight.trim(), ...Array.from(selectedStatuses).map((k) => {
        const opt = STATUS_OPTIONS.find((o) => o.key === k);
        return opt ? `[${opt.label}]` : '';
      })].filter(Boolean).join(' '),
      photo: firstPhoto,
    });
    navigate(`/host/submitted/${encodeURIComponent(petId)}`, { replace: true });
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-primary-bg px-6">
        <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-border-light border-t-accent-primary" />
      </div>
    );
  }

  const petName = pet?.name ?? '宠物';
  const dayCount = pet ? computeDayCount(pet.checkinDate) : 1;

  return (
    <div className="h-full bg-primary-bg relative overflow-hidden">
      {/* Toast */}
      <div
        className={`absolute left-1/2 top-[110px] -translate-x-1/2 bg-[rgba(62,58,54,0.92)] text-white px-[22px] py-[14px] rounded-pill text-base tracking-[0.02em] shadow-lift z-70 pointer-events-none transition-all duration-[220ms] max-w-[84%] text-center ${
          toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
        }`}
      >
        {toastMsg}
      </div>

      {/* Scrollable content */}
      <div className="w-full h-full overflow-y-auto pb-[140px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Top nav · 64px */}
        <nav className="h-[64px] px-4 grid grid-cols-[48px_1fr_60px] items-center gap-2">
          <Link
            to="/host/pets"
            className="w-12 h-12 rounded-full flex items-center justify-center text-text-primary hover:bg-[rgba(62,58,54,0.06)] transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6"/>
            </svg>
          </Link>
          <div className="text-center text-[20px] font-semibold text-text-primary tracking-[0.02em]">
            为{petName}打卡
          </div>
          <button
            type="button"
            onClick={() => showToast('已保存到草稿')}
            className="justify-self-end text-base font-medium text-accent-primary px-[6px] py-2 hover:text-[#5d8071] transition-colors"
          >
            草稿
          </button>
        </nav>

        {/* Pet info strip */}
        <section className="mx-6 mt-4 h-[72px] px-4 bg-accent-soft rounded-card flex items-center gap-[14px]">
          <div className="w-[56px] h-[56px] rounded-full border-2 border-accent-wood shrink-0 relative overflow-hidden"
            style={{ background: 'radial-gradient(circle at 36% 30%, #ffd9a8 0%, #f0b97a 45%, #c9885a 100%)' }}>
            <div className="absolute w-[5px] h-[5px] rounded-full bg-[rgba(62,58,54,0.7)] top-[38%] left-[32%]" />
            <div className="absolute w-[5px] h-[5px] rounded-full bg-[rgba(62,58,54,0.7)] top-[38%] right-[32%]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[20px] font-semibold text-text-primary leading-[1.2] tracking-[0.02em]">
              {petName}
              <span className="text-accent-wood ml-1"> · Day {dayCount}</span>
            </div>
            <div className="mt-1 text-base text-[#6B6560] leading-[1.3]">
              今天的<span className="text-accent-primary font-semibold">第 1 次</span>打卡
            </div>
          </div>
        </section>

        {/* Step 1 · Photos */}
        <section className="px-6 mt-8">
          <h2 className="flex items-center gap-3 text-[20px] font-semibold text-text-primary tracking-[0.02em] leading-[1.3] m-0">
            <span className="w-7 h-7 rounded-full bg-accent-primary text-white text-base font-semibold inline-flex items-center justify-center shrink-0">1</span>
            拍 3 张今天的照片
          </h2>
          <p className="mt-2 text-base text-[#6B6560] leading-[1.5]">拍她在做什么就行，不用摆拍</p>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[0, 1, 2].map((idx) => (
              <label
                key={idx}
                className={`relative h-[116px] rounded-card border-[1.5px] cursor-pointer flex flex-col items-center justify-center gap-[6px] transition-all duration-[180ms] overflow-hidden ${
                  photos[idx]
                    ? 'border-accent-primary border-solid bg-[radial-gradient(circle_at_35%_30%,#f5d9b0_0%,#d6a877_50%,#8c5d36_100%)]'
                    : 'border-dashed border-[#8A847D] bg-[rgba(255,255,255,0.55)] hover:border-accent-primary hover:bg-accent-soft'
                }`}
                onClick={(e) => {
                  if (photos[idx]) {
                    e.preventDefault();
                    fileInputRefs.current[idx]?.click();
                  }
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => { fileInputRefs.current[idx] = el; }}
                  onChange={handlePhotoSelect(idx)}
                />
                {photos[idx] ? (
                  <>
                    <span className="flex w-8 h-8 rounded-full bg-[rgba(255,255,255,0.92)] items-center justify-center text-accent-primary shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12.5l4.5 4.5L19 7.5"/>
                      </svg>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePhotoRemove(idx);
                      }}
                      className="absolute top-2 right-2 w-[26px] h-[26px] rounded-full bg-[rgba(0,0,0,0.45)] text-white flex items-center justify-center backdrop-blur-[4px]"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 6l12 12M18 6L6 18"/>
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    <span className="w-[56px] h-[56px] text-[rgba(139,111,71,0.32)] shrink-0 transition-colors duration-200">
                      {PHOTO_SILHOUETTES[idx]}
                    </span>
                    <span className="text-base tracking-[0.02em] font-medium text-[#6B6560] transition-colors duration-150">
                      上传第 {idx + 1} 张
                    </span>
                  </>
                )}
              </label>
            ))}
          </div>

          <p className="mt-3 text-center text-base text-[#6B6560] tracking-[0.02em] flex justify-center items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent-wood">
              <path d="M4 8h3l2-2h6l2 2h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            <span>
              <span className="text-accent-wood font-medium">建议</span>:1 张吃饭 + 1 张玩耍 + 1 张睡觉
            </span>
          </p>
        </section>

        {/* Step 2 · Status */}
        <section className="px-6 mt-8">
          <h2 className="flex items-center gap-3 text-[20px] font-semibold text-text-primary tracking-[0.02em] leading-[1.3] m-0">
            <span className="w-7 h-7 rounded-full bg-accent-primary text-white text-base font-semibold inline-flex items-center justify-center shrink-0">2</span>
            今天{petName}怎么样？
          </h2>
          <p className="mt-2 text-base text-[#6B6560] leading-[1.5]">好的就勾上，有问题先不勾</p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {STATUS_OPTIONS.map((opt) => {
              const isSelected = selectedStatuses.has(opt.key);
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => toggleStatus(opt.key)}
                  className={`relative min-h-[90px] p-[14px] rounded-card flex items-center gap-3 transition-all duration-[180ms] ${
                    isSelected
                      ? 'bg-accent-soft border-[2px] border-accent-primary'
                      : 'bg-white border-[1.5px] border-border-light hover:border-accent-primary'
                  }`}
                >
                  <span
                    className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center transition-all duration-[180ms] ${
                      isSelected ? 'bg-white text-accent-primary' : 'bg-accent-cream text-accent-wood'
                    }`}
                  >
                    <span className="w-[26px] h-[26px]">{opt.icon}</span>
                  </span>
                  <span className={`text-lg font-semibold tracking-[0.02em] leading-[1.3] ${
                    isSelected ? 'text-accent-primary' : 'text-text-primary'
                  }`}>
                    {opt.label}
                  </span>
                  {isSelected && (
                    <span className="absolute top-2 right-2 w-[22px] h-[22px] rounded-full bg-accent-primary flex items-center justify-center text-white shadow-[0_2px_6px_rgba(107,142,127,0.35)]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12.5l4.5 4.5L19 7.5"/>
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 3 · Highlight */}
        <section className="px-6 mt-8">
          <h2 className="flex items-center gap-3 text-[20px] font-semibold text-text-primary tracking-[0.02em] leading-[1.3] m-0">
            <span className="w-7 h-7 rounded-full bg-accent-primary text-white text-base font-semibold inline-flex items-center justify-center shrink-0">3</span>
            <span>今日有什么特别的？<span className="font-medium text-[#8A847D]">（可不填）</span></span>
          </h2>
          <p className="mt-2 text-base text-[#6B6560] leading-[1.5]">比如：她今天和有福玩了一下午</p>

          <textarea
            className="mt-4 w-full h-[100px] px-4 py-[14px] rounded-input border border-border-light bg-white text-base text-text-primary leading-[1.5] resize-none outline-none transition-all duration-[150ms] placeholder:text-[#8A847D] placeholder:text-base focus:border-accent-primary focus:shadow-[0_0_0_3px_rgba(107,142,127,0.15)]"
            placeholder="比如：她今天和有福一起晒太阳，看起来很享受……"
            rows={3}
            value={highlight}
            onChange={(e) => setHighlight(e.target.value)}
          />
        </section>

        {/* Step 4 · Auto-write hint */}
        <section className="mx-6 mt-8 min-h-[88px] p-[14px_16px] rounded-card bg-shimmer-bg flex items-center gap-[14px]">
          <div className="w-12 h-12 rounded-full bg-accent-wood shrink-0 flex items-center justify-center text-white shadow-[0_2px_8px_rgba(139,111,71,0.22)]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 4 L20 9"/>
              <path d="M4 20 L17 7"/>
              <path d="M8 4 L9 6 L11 7 L9 8 L8 10 L7 8 L5 7 L7 6 Z" fill="currentColor"/>
              <path d="M19 14 L19.6 15.2 L21 15.6 L19.6 16 L19 17.2 L18.4 16 L17 15.6 L18.4 15.2 Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-[5px] text-base font-semibold text-accent-wood tracking-[0.02em] leading-[1.3]">
              <svg className="w-[14px] h-[14px] text-accent-shimmer" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3 L13.2 9 L19 10.5 L13.2 12 L12 18 L10.8 12 L5 10.5 L10.8 9 Z"/>
              </svg>
              系统会自动写日记
            </div>
            <div className="mt-[6px] text-base text-[#6B6560] leading-[1.4]">
              你只要<span className="text-accent-wood font-medium">拍照</span>和<span className="text-accent-wood font-medium">勾选</span>，有福会替你说
            </div>
          </div>
        </section>
      </div>

      {/* Fixed submit bar */}
      <div className="absolute left-0 right-0 bottom-0 px-6 pb-7 pt-3 bg-primary-bg z-25 flex flex-col gap-[10px] items-center">
        <div className="absolute left-0 right-0 -top-6 h-6 bg-gradient-to-b from-transparent to-primary-bg pointer-events-none" />
        <div className="text-base text-[#6B6560] tracking-[0.02em]">
          提交后 <span className="text-accent-primary font-semibold">30 秒</span> 内推送给宠主
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full h-16 rounded-pill bg-accent-primary text-white text-[20px] font-semibold tracking-[0.02em] inline-flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(107,142,127,0.32)] transition-all duration-200 active:translate-y-px active:scale-[0.99] hover:bg-[#5d8071] disabled:bg-border-light disabled:cursor-not-allowed disabled:shadow-none"
        >
          提交今日打卡
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
