import { useNavigate, useParams, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { getPetByTagId, addUpdate } from '../utils/storage';
import type { Pet } from '../types';

const STATUS_OPTIONS = [
  {
    key: 'eat',
    label: '吃饭好',
    icon: <img src="/assets/icons/icon-state-food.png" alt="" className="w-full h-full object-contain" />,
  },
  {
    key: 'drink',
    label: '喝水好',
    icon: <img src="/assets/icons/icon-state-water.png" alt="" className="w-full h-full object-contain" />,
  },
  {
    key: 'litter',
    label: '排泄正常',
    icon: <img src="/assets/icons/icon-state-litter.png" alt="" className="w-full h-full object-contain" />,
  },
  {
    key: 'mood',
    label: '精神好',
    icon: <img src="/assets/icons/icon-state-happy.png" alt="" className="w-full h-full object-contain" />,
  },
] as const;

const PHOTO_SILHOUETTES = [
  <img src="/assets/silhouettes/silhouette-eating.png" alt="吃饭" key="s1" className="w-full h-full object-contain" />,
  <img src="/assets/silhouettes/silhouette-playing.png" alt="玩耍" key="s2" className="w-full h-full object-contain" />,
  <img src="/assets/silhouettes/silhouette-sleeping.png" alt="睡觉" key="s3" className="w-full h-full object-contain" />,
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
                    ? 'border-accent-primary border-solid bg-[#1a1a1a]'
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
                    {/* 实际照片预览，铺满整个上传框 */}
                    <img
                      src={photos[idx]!}
                      alt={`第 ${idx + 1} 张`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* 顶部勾选标识，叠在照片上 */}
                    <span className="absolute bottom-2 left-2 flex w-7 h-7 rounded-full bg-accent-primary text-white items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.25)] z-[2]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
                      className="absolute top-2 right-2 w-[26px] h-[26px] rounded-full bg-[rgba(0,0,0,0.55)] text-white flex items-center justify-center backdrop-blur-[4px] z-[2]"
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
