import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { savePet } from '../utils/storage';

interface DatePreset {
  range: string;
  nights: number;
  price: string;
  priceNum: number;
}

const datePresets: DatePreset[] = [
  { range: '5 月 25 日 - 5 月 31 日', nights: 7, price: '1,050', priceNum: 1050 },
  { range: '6 月 1 日 - 6 月 5 日', nights: 5, price: '750', priceNum: 750 },
  { range: '6 月 10 日 - 6 月 20 日', nights: 11, price: '1,650', priceNum: 1650 },
  { range: '整个七月 · 暑期长托', nights: 31, price: '4,650', priceNum: 4650 },
];

function generateTagId(): string {
  const num = String(Math.floor(Math.random() * 900) + 100);
  return `YF-2026-${num}`;
}

export default function BookPage() {
  const { innId } = useParams<{ innId: string }>();
  const navigate = useNavigate();

  const [photo, setPhoto] = useState('');
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('');
  const [selectedDate, setSelectedDate] = useState(datePresets[0]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 1600);
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSheetSelect = (preset: DatePreset) => {
    setSelectedDate(preset);
  };

  const handleSheetConfirm = () => {
    setSheetOpen(false);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      showToast('请填写宠物名字');
      return;
    }
    const tagId = generateTagId();
    savePet({
      tagId,
      name: name.trim(),
      photo,
      checkinDate: new Date().toISOString(),
      status: 'active',
    });
    navigate(`/pass/${tagId}`);
  };

  const catDisplayName = name.trim() || '豆豆';

  return (
    <div className="w-full h-full flex flex-col relative bg-primary-bg">
      {/* Toast */}
      <div
        className={`absolute left-1/2 top-[50px] -translate-x-1/2 z-[60] bg-[rgba(62,58,54,0.92)] text-white px-5 py-3 rounded-pill font-[family-name:var(--font-sans)] text-[13px] tracking-[0.02em] shadow-lift transition-all duration-[220ms] pointer-events-none ${
          toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
        }`}
      >
        {toastVisible ? toastMsg : ''}
      </div>

      {/* Date picker sheet */}
      {sheetOpen && (
        <>
          <div
            className="absolute inset-0 bg-[rgba(62,58,54,0.35)] z-[55]"
            onClick={() => setSheetOpen(false)}
          />
          <div className="absolute left-0 right-0 bottom-0 bg-card-bg rounded-t-[24px] px-6 pt-3 pb-7 z-[56] max-h-[60%] overflow-y-auto animate-[sheetUp_280ms_cubic-bezier(.4,0,.2,1)_both]">
            <div className="w-9 h-1 bg-border-light rounded-sm mx-auto mb-[18px]" />
            <h4 className="font-[family-name:var(--font-serif)] text-lg font-medium text-text-primary mb-1.5">
              选一个去屏南的日期
            </h4>
            <p className="text-[13px] text-text-secondary mb-4">
              完整原型日历视图待后续。这里先用几个常用区间。
            </p>
            <div className="flex flex-col gap-2 mb-4">
              {datePresets.map((p) => (
                <button
                  key={p.range}
                  type="button"
                  onClick={() => handleSheetSelect(p)}
                  className={`flex justify-between items-center px-4 py-3.5 rounded-input border transition-all duration-150 cursor-pointer ${
                    selectedDate.range === p.range
                      ? 'bg-accent-soft border-accent-primary'
                      : 'bg-white border-border-light hover:border-accent-primary'
                  }`}
                >
                  <span className="font-[family-name:var(--font-sans)] text-[15px] font-medium text-text-primary">
                    {p.range}
                  </span>
                  <span className="font-[family-name:var(--font-en-serif)] italic text-[13px] text-accent-wood">
                    {p.nights} 晚 · &#165;{p.price}
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleSheetConfirm}
              className="w-full h-[52px] rounded-pill bg-accent-primary text-white font-[family-name:var(--font-sans)] text-base font-medium active:translate-y-px active:scale-[0.99] transition-transform"
            >
              确认日期
            </button>
          </div>
        </>
      )}

      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto pb-[140px]" style={{ scrollbarWidth: 'none' }}>
        {/* Top nav */}
        <nav className="h-14 px-4 grid grid-cols-[40px_1fr_40px] items-center">
          <button
            type="button"
            onClick={() => navigate('/stay')}
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-text-primary hover:bg-[rgba(62,58,54,0.06)] transition-colors"
            title="返回"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6"/>
            </svg>
          </button>
          <div className="text-center font-[family-name:var(--font-sans)] text-base font-medium text-text-primary tracking-[0.02em]">
            寄养预约
          </div>
          <div />
        </nav>

        {/* Inn summary */}
        <div className="mx-6 mt-4 h-[88px] bg-card-bg rounded-card px-4 flex items-center gap-3.5 shadow-base">
          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border border-border-light">
            <svg className="w-full h-full" viewBox="0 0 64 64" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <defs>
                <linearGradient id="mini-sky" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#E8EFEB"/>
                  <stop offset="100%" stopColor="#F5EFE6"/>
                </linearGradient>
              </defs>
              <rect width="64" height="64" fill="url(#mini-sky)"/>
              <circle cx="48" cy="18" r="6" fill="#FFF4E6" opacity="0.9"/>
              <path d="M0,42 L14,28 L26,36 L40,22 L54,32 L64,26 L64,64 L0,64 Z" fill="#8FA899" opacity="0.85"/>
              <path d="M0,52 L20,44 L40,48 L64,40 L64,64 L0,64 Z" fill="#6B8E7F"/>
              <g transform="translate(32,46)">
                <path d="M-7,2 L0,-3 L7,2 Z" fill="#5A4A3A"/>
                <rect x="-6" y="2" width="12" height="8" fill="#EFE7D6"/>
                <rect x="-1" y="4" width="3" height="6" fill="#5A4A3A"/>
              </g>
            </svg>
          </div>
          <div className="flex-1 min-w-0 leading-[1.4]">
            <div className="font-[family-name:var(--font-sans)] text-base font-medium text-text-primary">
              山居民宿
            </div>
            <div className="text-sm text-text-secondary mt-1">
              屏南龙潭村 · 由<span className="text-accent-wood">有福</span>接待
            </div>
          </div>
        </div>

        {/* Cat photo upload */}
        <section className="px-6 pt-8">
          <div className="font-[family-name:var(--font-serif)] text-lg font-medium text-text-primary leading-[1.4]">
            你的宠物
          </div>
          <div className="font-[family-name:var(--font-sans)] text-sm text-text-secondary mt-2 leading-[1.5]">
            推荐正面照,光线充足,背景简洁。
          </div>
          <div className="mt-4 flex items-center gap-4">
            <input
              type="file"
              accept="image/jpeg,image/png"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              className="hidden"
            />
            {photo ? (
              <div className="relative w-[120px] h-[120px] rounded-card overflow-hidden border border-accent-primary">
                <img
                  src={photo}
                  alt="宠物照片预览"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPhoto('');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute right-2 bottom-2 w-[26px] h-[26px] rounded-full bg-white/95 flex items-center justify-center text-text-primary"
                  aria-label="编辑照片"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-[120px] h-[120px] rounded-card border-[1.5px] border-dashed border-border-light bg-white/50 flex flex-col items-center justify-center gap-2 cursor-pointer text-text-tertiary hover:border-accent-primary hover:text-accent-primary hover:bg-accent-soft transition-colors active:scale-[0.98]"
              >
                <div className="w-7 h-7 rounded-full border-[1.5px] border-current flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </div>
                <span className="font-[family-name:var(--font-sans)] text-[13px] font-medium tracking-[0.02em]">上传照片</span>
              </button>
            )}
            <div className="flex-1 font-[family-name:var(--font-sans)] text-xs text-text-tertiary leading-[1.6] tracking-[0.02em]">
              <b className="block font-medium text-text-secondary text-[13px] mb-1">建议</b>
              支持 JPG / PNG<br/>
              不超过 5MB
            </div>
          </div>
        </section>

        {/* Cat info form */}
        <section className="px-6 pt-8">
          <div className="font-[family-name:var(--font-serif)] text-lg font-medium text-text-primary leading-[1.4]">
            宠物档案
          </div>

          <div className="mt-4">
            <label className="block font-[family-name:var(--font-sans)] text-[13px] font-medium text-text-secondary mb-2 tracking-[0.02em]" htmlFor="cat-name">
              名字
            </label>
            <input
              id="cat-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="如: 豆豆 / Momo"
              className="w-full h-[52px] px-4 rounded-input border border-border-light bg-white font-[family-name:var(--font-sans)] text-[15px] text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent-primary transition-colors"
            />
          </div>

          <div className="mt-4">
            <label className="block font-[family-name:var(--font-sans)] text-[13px] font-medium text-text-secondary mb-2 tracking-[0.02em]" htmlFor="cat-breed">
              品种
            </label>
            <input
              id="cat-breed"
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="如: 橘猫 / 柴犬"
              className="w-full h-[52px] px-4 rounded-input border border-border-light bg-white font-[family-name:var(--font-sans)] text-[15px] text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent-primary transition-colors"
            />
          </div>

          <div className="mt-4">
            <span className="block font-[family-name:var(--font-sans)] text-[13px] font-medium text-text-secondary mb-2 tracking-[0.02em]">
              性别
            </span>
            <div className="flex gap-3 items-center">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`w-11 h-11 rounded-full border flex items-center justify-center font-[family-name:var(--font-serif)] text-base font-medium transition-all duration-180 active:scale-[0.94] select-none cursor-pointer ${
                  gender === 'male'
                    ? 'bg-accent-primary border-accent-primary text-white shadow-[0_2px_8px_rgba(107,142,127,0.25)]'
                    : 'bg-white border-border-light text-text-secondary'
                }`}
              >
                公
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`w-11 h-11 rounded-full border flex items-center justify-center font-[family-name:var(--font-serif)] text-base font-medium transition-all duration-180 active:scale-[0.94] select-none cursor-pointer ${
                  gender === 'female'
                    ? 'bg-accent-primary border-accent-primary text-white shadow-[0_2px_8px_rgba(107,142,127,0.25)]'
                    : 'bg-white border-border-light text-text-secondary'
                }`}
              >
                母
              </button>
            </div>
          </div>

          <div className="mt-4">
            <label className="block font-[family-name:var(--font-sans)] text-[13px] font-medium text-text-secondary mb-2 tracking-[0.02em]" htmlFor="cat-age">
              年龄
            </label>
            <input
              id="cat-age"
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="如: 3 岁"
              className="w-full h-[52px] px-4 rounded-input border border-border-light bg-white font-[family-name:var(--font-sans)] text-[15px] text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent-primary transition-colors"
            />
          </div>
        </section>

        {/* Date picker */}
        <section className="px-6 pt-8">
          <div className="font-[family-name:var(--font-serif)] text-lg font-medium text-text-primary leading-[1.4]">
            寄养日期
          </div>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="mt-4 w-full h-[52px] px-[18px] rounded-input border border-border-light bg-white flex items-center justify-between cursor-pointer hover:border-accent-primary transition-colors active:scale-[0.998]"
          >
            <span className="flex flex-col items-start">
              <span className="font-[family-name:var(--font-sans)] text-[15px] font-medium text-text-primary leading-[1.3]">
                {selectedDate.range}
                <span className="font-[family-name:var(--font-en-serif)] italic text-[13px] text-accent-wood font-normal ml-1.5">
                  ({selectedDate.nights} 晚)
                </span>
              </span>
            </span>
            <svg className="text-text-tertiary" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6"/>
            </svg>
          </button>
        </section>

        {/* Price summary */}
        <section className="px-6 pt-8">
          <div className="font-[family-name:var(--font-serif)] text-lg font-medium text-text-primary leading-[1.4]">
            费用
          </div>
          <div className="mt-4 rounded-card bg-accent-cream px-5 pt-[18px] pb-4 relative overflow-hidden">
            {/* subtle ornament */}
            <div className="absolute -right-7 -bottom-7 w-[110px] h-[110px] rounded-full border border-accent-wood opacity-[0.12] pointer-events-none" />
            <div className="flex justify-between items-start gap-3">
              <div>
                <div className="font-[family-name:var(--font-sans)] text-sm text-text-secondary tracking-[0.02em]">总费用</div>
                <div className="font-[family-name:var(--font-serif)] text-[28px] font-bold text-text-primary tracking-[0.01em] leading-[1.2] mt-1">
                  <span className="font-[family-name:var(--font-serif)] text-lg font-medium align-[2px] mr-0.5 text-text-primary">&#165;</span>
                  {selectedDate.price}
                </div>
              </div>
              <button
                type="button"
                onClick={() => showToast('费用明细弹层 · 即将开放')}
                className="font-[family-name:var(--font-sans)] text-sm text-accent-primary font-medium inline-flex items-center cursor-pointer py-1 relative z-[2] hover:text-[#5d8071] transition-colors"
              >
                明细
                <svg className="ml-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6"/>
                </svg>
              </button>
            </div>
            <div className="mt-4 pt-3 border-t border-dashed border-[rgba(139,111,71,0.25)] font-[family-name:var(--font-sans)] text-xs text-text-tertiary tracking-[0.02em] leading-[1.5]">
              含寄养费
              <span className="inline-block w-1 h-1 rounded-full bg-accent-wood opacity-50 align-middle mx-1.5 mb-0.5" />
              数字纪念卡
              <span className="inline-block w-1 h-1 rounded-full bg-accent-wood opacity-50 align-middle mx-1.5 mb-0.5" />
              保险
            </div>
          </div>
        </section>

        {/* Bottom spacer */}
        <div className="h-14" />
      </div>

      {/* Fixed CTA */}
      <div className="absolute left-0 right-0 bottom-0 h-[120px] pt-4 pb-6 px-6 bg-primary-bg flex flex-col items-center gap-2.5 z-20">
        <div
          className="absolute left-0 right-0 -top-6 h-6 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(245,241,234,0) 0%, var(--color-primary-bg) 100%)' }}
        />
        <div className="font-[family-name:var(--font-sans)] text-xs text-text-tertiary tracking-[0.02em]">
          下一步将为{catDisplayName}生成
          <span className="font-[family-name:var(--font-en-serif)] italic text-accent-wood mx-1">·</span>
          屏南通行证
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full h-[52px] rounded-pill bg-accent-primary text-white font-[family-name:var(--font-sans)] text-base font-medium shadow-[0_6px_20px_rgba(107,142,127,0.28)] active:translate-y-px active:scale-[0.99] transition-transform"
        >
          确认预约,送{catDisplayName}去屏南
        </button>
      </div>

      {/* Keyframe for sheet slide-up */}
      <style>{`
        @keyframes sheetUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
