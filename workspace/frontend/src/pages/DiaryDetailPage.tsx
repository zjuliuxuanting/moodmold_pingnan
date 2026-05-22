import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPetByTagId } from '../utils/storage';
import type { Pet } from '../types';
import { toast, registerToastShow } from '../utils/toast';

function HeroBridgeSVG() {
  return (
    <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <defs>
        <linearGradient id="heroSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D9845B" />
          <stop offset="35%" stopColor="#F2C07B" />
          <stop offset="70%" stopColor="#FDE8C4" />
          <stop offset="100%" stopColor="#E8DEC8" />
        </linearGradient>
        <linearGradient id="heroWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A8C5C8" />
          <stop offset="100%" stopColor="#7FA8AC" />
        </linearGradient>
        <radialGradient id="heroSun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FFF4D6" />
          <stop offset="40%" stopColor="#FDE2A8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FDE2A8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bridgeWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A07A4A" />
          <stop offset="100%" stopColor="#6B4F2E" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="320" height="320" fill="url(#heroSky)" />

      {/* Sun */}
      <circle cx="260" cy="50" r="40" fill="url(#heroSun)" />
      <circle cx="260" cy="50" r="12" fill="#F5C56A" />

      {/* Distant mountains layer 1 */}
      <path d="M0 140 Q30 100 70 130 Q100 110 140 128 Q170 105 210 125 Q250 108 280 130 Q310 120 320 128 V320 H0 Z" fill="#A8B89A" opacity="0.7" />
      {/* Distant mountains layer 2 */}
      <path d="M0 155 Q40 125 90 148 Q120 135 160 145 Q195 128 230 142 Q270 125 320 140 V320 H0 Z" fill="#8FA382" opacity="0.6" />
      {/* Closer mountains */}
      <path d="M0 170 Q50 145 100 165 Q140 150 180 162 Q220 148 260 160 Q295 148 320 160 V320 H0 Z" fill="#7D916E" opacity="0.5" />

      {/* Water area */}
      <rect x="0" y="190" width="320" height="130" fill="url(#heroWater)" opacity="0.7" />

      {/* Water ripples */}
      <path d="M20 205 Q50 203 80 205" stroke="#C5DDE0" strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M180 210 Q210 208 240 210" stroke="#C5DDE0" strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M60 218 Q100 216 140 218" stroke="#C5DDE0" strokeWidth="0.6" fill="none" opacity="0.4" />
      <path d="M220 220 Q250 218 280 220" stroke="#C5DDE0" strokeWidth="0.6" fill="none" opacity="0.4" />
      <path d="M100 228 Q130 226 160 228" stroke="#C5DDE0" strokeWidth="0.5" fill="none" opacity="0.3" />

      {/* Water reflections of bridge */}
      <path d="M60 195 Q80 200 120 195 Q160 200 200 195 Q240 200 260 195" stroke="#9AAA8E" strokeWidth="1.5" fill="none" opacity="0.3" />

      {/* Stone piers */}
      <rect x="65" y="175" width="10" height="20" rx="2" fill="#8C8866" />
      <rect x="68" y="172" width="4" height="6" rx="1" fill="#A09A7A" />
      <rect x="155" y="175" width="10" height="20" rx="2" fill="#8C8866" />
      <rect x="158" y="172" width="4" height="6" rx="1" fill="#A09A7A" />
      <rect x="245" y="175" width="10" height="20" rx="2" fill="#8C8866" />
      <rect x="248" y="172" width="4" height="6" rx="1" fill="#A09A7A" />

      {/* Bridge base / deck */}
      <rect x="20" y="178" width="280" height="6" rx="2" fill="url(#bridgeWood)" />
      <rect x="20" y="180" width="280" height="3" fill="#5B3F22" opacity="0.5" />

      {/* Bridge railing - bottom */}
      <rect x="30" y="168" width="260" height="2" rx="1" fill="#8B6F47" />
      {/* Bridge railing - top */}
      <rect x="30" y="146" width="260" height="2.5" rx="1" fill="#8B6F47" />
      {/* Railing posts */}
      {[35, 65, 95, 125, 155, 185, 215, 245, 275].map((x) => (
        <rect key={x} x={x} y="146" width="2.5" height="22" rx="1" fill="#7B5F3A" />
      ))}

      {/* Bridge arch structure */}
      <path d="M30 178 Q55 150 80 170 Q105 148 130 165 Q155 148 180 162 Q205 146 230 162 Q255 148 290 178" stroke="#7B5F3A" strokeWidth="4" fill="none" />

      {/* Roof base */}
      <path d="M24 150 L296 150 L290 142 L274 139 L260 139 L244 137 L230 138 L210 137 L190 137 L170 136 L150 136 L130 136 L110 137 L90 138 L76 139 L60 139 L46 139 L30 142 Z" fill="#7B5F3A" />
      <path d="M24 150 L296 150" stroke="#5B3F22" strokeWidth="1" />

      {/* Roof ridge row */}
      <path d="M24 150 L296 150" stroke="#5B3F22" strokeWidth="1" />
      {/* Roof tiles - individual tile lines */}
      {[40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280].map((x) => (
        <line key={`t-${x}`} x1={x} y1="142" x2={x} y2="149" stroke="#5B3F22" strokeWidth="0.5" opacity="0.4" />
      ))}

      {/* Eaves / overhang edge */}
      <path d="M30 145 Q32 140 36 139" stroke="#6B5335" strokeWidth="1.5" fill="none" />
      <path d="M284 145 Q288 140 290 139" stroke="#6B5335" strokeWidth="1.5" fill="none" />

      {/* Central pavilion */}
      <rect x="130" y="122" width="60" height="15" rx="2" fill="#8B6F47" />
      <rect x="134" y="124" width="52" height="11" rx="1" fill="#A07A4A" opacity="0.8" />
      {/* Pavilion roof */}
      <path d="M120 122 L160 105 L200 122 Z" fill="#7B5F3A" />
      <path d="M122 122 L160 107 L198 122" stroke="#5B3F22" strokeWidth="0.8" fill="none" />
      {/* Roof tiles on pavilion */}
      <line x1="140" y1="114" x2="140" y2="120" stroke="#5B3F22" strokeWidth="0.4" opacity="0.4" />
      <line x1="150" y1="110" x2="150" y2="120" stroke="#5B3F22" strokeWidth="0.4" opacity="0.4" />
      <line x1="160" y1="108" x2="160" y2="120" stroke="#5B3F22" strokeWidth="0.4" opacity="0.4" />
      <line x1="170" y1="110" x2="170" y2="120" stroke="#5B3F22" strokeWidth="0.4" opacity="0.4" />
      <line x1="180" y1="114" x2="180" y2="120" stroke="#5B3F22" strokeWidth="0.4" opacity="0.4" />
      {/* Pavilion flying eaves */}
      <path d="M120 122 Q112 124 108 122" stroke="#5B3F22" strokeWidth="1" fill="none" />
      <path d="M200 122 Q208 124 212 122" stroke="#5B3F22" strokeWidth="1" fill="none" />
      {/* Pavilion spire */}
      <path d="M154 105 L160 92 L166 105" fill="#8B6F47" />
      <circle cx="160" cy="92" r="3" fill="#C4915C" />
      <circle cx="160" cy="92" r="1.5" fill="#E8B87A" />

      {/* Pavilion pillars */}
      <rect x="136" y="137" width="3" height="13" fill="#6B4F2E" />
      <rect x="181" y="137" width="3" height="13" fill="#6B4F2E" />

      {/* Cat 豆豆 on the bridge */}
      <ellipse cx="106" cy="172" rx="8" ry="5.5" fill="#E8A64B" />
      <circle cx="106" cy="164" r="6" fill="#E8A64B" />
      {/* Ears */}
      <path d="M100 163 Q99 157 102 156" stroke="#E8A64B" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M112 163 Q113 157 110 156" stroke="#E8A64B" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Eyes */}
      <ellipse cx="103" cy="163" rx="1.8" ry="1.5" fill="#F5F1EA" />
      <ellipse cx="109" cy="163" rx="1.8" ry="1.5" fill="#F5F1EA" />
      <circle cx="103.5" cy="163" r="1" fill="#3E3A36" />
      <circle cx="109.5" cy="163" r="1" fill="#3E3A36" />
      {/* Tail */}
      <path d="M114 174 Q122 170 120 164" stroke="#E8A64B" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* 斗笠 on cat's neck */}
      <ellipse cx="106" cy="174" rx="10" ry="4" fill="#C4A265" opacity="0.9" />
      <path d="M100 170 Q106 166 112 170" stroke="#8B6F47" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* 斗笠 strings */}
      <path d="M100 170 Q102 175 106 176" stroke="#8B6F47" strokeWidth="0.5" fill="none" />
      <path d="M112 170 Q110 175 106 176" stroke="#8B6F47" strokeWidth="0.5" fill="none" />

      {/* 有福 avatar circle bottom right */}
      <circle cx="280" cy="260" r="22" fill="#F5F1EA" stroke="#8B6F47" strokeWidth="2" />
      <circle cx="280" cy="260" r="18" fill="radial-gradient(circle at 35% 30%, #F5E6D0, #D4A96A)" />
      <text x="280" y="266" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="16" fontWeight="bold" fill="white">福</text>

      {/* Gold particles scattered */}
      <circle cx="120" cy="145" r="1.2" fill="#C4915C" opacity="0.85" />
      <circle cx="140" cy="138" r="1" fill="#C4915C" opacity="0.7" />
      <circle cx="155" cy="155" r="0.9" fill="#C4915C" opacity="0.8" />
      <circle cx="175" cy="142" r="1.1" fill="#C4915C" opacity="0.75" />
      <circle cx="190" cy="158" r="1.3" fill="#C4915C" opacity="0.7" />
      <circle cx="130" cy="160" r="0.8" fill="#C4915C" opacity="0.65" />
      <circle cx="210" cy="148" r="1" fill="#C4915C" opacity="0.7" />
      <circle cx="100" cy="150" r="0.9" fill="#C4915C" opacity="0.6" />
      <circle cx="230" cy="135" r="1.1" fill="#C4915C" opacity="0.8" />
      <circle cx="250" cy="155" r="0.8" fill="#C4915C" opacity="0.7" />
    </svg>
  );
}

function HatIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="hatBg" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FDE8C4" />
          <stop offset="100%" stopColor="#F5D5A0" />
        </radialGradient>
      </defs>
      {/* Background circle */}
      <circle cx="40" cy="40" r="38" fill="url(#hatBg)" stroke="#C4915C" strokeWidth="1.5" strokeDasharray="4 3" />
      {/* 斗笠 shape */}
      <ellipse cx="40" cy="50" rx="24" ry="8" fill="#C4A265" />
      <path d="M18 46 Q40 24 62 46" stroke="#8B6F47" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Bamboo weave lines */}
      <line x1="25" y1="46" x2="25" y2="40" stroke="#8B6F47" strokeWidth="0.5" opacity="0.5" />
      <line x1="32" y1="46" x2="33" y2="37" stroke="#8B6F47" strokeWidth="0.5" opacity="0.5" />
      <line x1="40" y1="46" x2="40" y2="34" stroke="#8B6F47" strokeWidth="0.5" opacity="0.5" />
      <line x1="48" y1="46" x2="47" y2="37" stroke="#8B6F47" strokeWidth="0.5" opacity="0.5" />
      <line x1="55" y1="46" x2="55" y2="40" stroke="#8B6F47" strokeWidth="0.5" opacity="0.5" />
      {/* Horizontal weave */}
      <path d="M22 44 Q40 34 58 44" stroke="#8B6F47" strokeWidth="0.5" fill="none" opacity="0.4" />
      <path d="M24 42 Q40 37 56 42" stroke="#8B6F47" strokeWidth="0.5" fill="none" opacity="0.4" />
      {/* Top knot */}
      <circle cx="40" cy="35" r="2.5" fill="#8B6F47" />
      {/* Chin straps */}
      <path d="M20 50 Q30 62 40 64 Q50 62 60 50" stroke="#8B6F47" strokeWidth="1.2" fill="none" opacity="0.6" />
    </svg>
  );
}

function BookmarkIcon({ active }: { active: boolean }) {
  return active ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#C4915C">
      <path d="M5 2h14a1 1 0 0 1 1 1v18l-8-4-8 4V3a1 1 0 0 1 1-1z" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B847C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 2h14a1 1 0 0 1 1 1v18l-8-4-8 4V3a1 1 0 0 1 1-1z" />
    </svg>
  );
}

export default function DiaryDetailPage() {
  const { tagId, dayId } = useParams<{ tagId: string; dayId: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 1600);
  }, []);

  useEffect(() => {
    return registerToastShow(showToast);
  }, [showToast]);

  useEffect(() => {
    if (!tagId) return;
    const foundPet = getPetByTagId(tagId);
    if (foundPet) setPet(foundPet);
  }, [tagId]);

  useEffect(() => {
    const key = `moodmold:bookmarked:${tagId}:${dayId}`;
    const saved = localStorage.getItem(key);
    if (saved === 'true') setBookmarked(true);
  }, [tagId, dayId]);

  const toggleBookmark = useCallback(() => {
    const next = !bookmarked;
    setBookmarked(next);
    const key = `moodmold:bookmarked:${tagId}:${dayId}`;
    localStorage.setItem(key, next ? 'true' : 'false');
    toast(next ? '已收藏到你的闪闪时刻' : '已取消收藏');
  }, [bookmarked, tagId, dayId]);

  const petName = pet?.name || '豆豆';
  const dayNumber = parseInt(dayId || '3', 10) || 3;

  const diaryContent = {
    title: '带豆豆走了一遍万安廊桥，她在桥上停了三分钟',
    body: `廊桥的木头被太阳晒得温温的。豆豆走在前面，爪子在木板上发出轻轻的嗒嗒声。走到桥心的时候，她忽然停下来，坐了下来，面向远处的山。

我安静地陪她坐了一会儿。风从桥下穿过，吹着她的毛往后飘。

那一刻，我觉得她比我更懂这座桥。

她好像在听水声，也好像在等谁。后来我才知道，每只猫都在这里等一个人——而豆豆等的是你。

桥头的阿婆看到我们在桥上待了那么久，走过来递给我两片刚烤的红薯干。她说："这猫有灵性，她认得这座桥。"`,
  };

  const firstChar = diaryContent.body.charAt(0);
  const restBody = diaryContent.body.slice(1);
  const paragraphs = restBody.split('\n\n');

  return (
    <div className="w-full h-full flex flex-col relative bg-primary-bg">
      {/* Toast */}
      <div
        className={`absolute left-1/2 top-[50px] -translate-x-1/2 z-[70] bg-[rgba(62,58,54,0.92)] text-white px-5 py-3 rounded-pill font-[family-name:var(--font-sans)] text-[13px] tracking-[0.02em] shadow-lift transition-all duration-[220ms] pointer-events-none whitespace-nowrap ${
          toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
        }`}
      >
        {toastMsg}
      </div>

      {/* Sticky Navigation - frosted glass */}
      <nav
        className="sticky top-0 z-[26] h-14 px-4 grid grid-cols-[40px_1fr_60px] items-center flex-shrink-0 backdrop-blur-xl"
        style={{ backgroundColor: 'rgba(245, 241, 234, 0.72)' }}
      >
        <button
          type="button"
          onClick={() => navigate(`/diary/${tagId}`)}
          className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-text-primary hover:bg-[rgba(62,58,54,0.06)] transition-colors"
          title="返回"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <div />
        <div className="justify-self-end flex items-center gap-1">
          <button
            type="button"
            onClick={toggleBookmark}
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(62,58,54,0.06)] transition-colors"
            title={bookmarked ? '取消收藏' : '收藏'}
          >
            <BookmarkIcon active={bookmarked} />
          </button>
          <button
            type="button"
            onClick={() => toast('链接已复制，分享给朋友吧')}
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-text-secondary hover:bg-[rgba(62,58,54,0.06)] transition-colors"
            title="分享"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto pb-[100px]" style={{ scrollbarWidth: 'none' }}>
        {/* Shimmer tag */}
        <div className="px-4 mt-3">
          <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-pill font-[family-name:var(--font-sans)] text-xs font-semibold text-accent-shimmer tracking-[0.03em]"
            style={{ background: 'linear-gradient(135deg, #FFF4E6 0%, #FFE8C8 100%)', border: '1px solid rgba(196,145,92,0.25)' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#C4915C">
              <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
            </svg>
            闪闪时刻 · Day{dayNumber} · 5月27日 17:42
          </span>
        </div>

        {/* Hero Image */}
        <div className="mt-3 mx-4 rounded-[16px] overflow-hidden shadow-base">
          <HeroBridgeSVG />
        </div>

        {/* Title */}
        <h1 className="mt-5 px-4 font-[family-name:var(--font-serif)] text-2xl font-bold text-text-primary leading-[1.4] tracking-[0.03em]">
          {diaryContent.title}
        </h1>

        {/* Body */}
        <div className="mt-4 px-4">
          {/* First paragraph with drop cap */}
          <p className="font-[family-name:var(--font-sans)] text-[17px] text-text-primary leading-[1.85] tracking-[0.01em]">
            <span className="float-left font-[family-name:var(--font-serif)] text-[42px] leading-[0.85] text-accent-wood font-bold mr-1.5 mt-1">
              {firstChar}
            </span>
            <span className="text-text-primary leading-[1.85]">{paragraphs[0]}</span>
          </p>

          {/* Remaining paragraphs */}
          {paragraphs.slice(1).map((para, i) => {
            const isQuote = para.startsWith('她好像在听水声');
            const isEmphasized = para.startsWith('桥头的阿婆');
            return (
              <p
                key={i}
                className={`mt-4 font-[family-name:var(--font-sans)] text-[17px] leading-[1.85] tracking-[0.01em] ${
                  isQuote
                    ? 'border-l-[3px] border-accent-wood pl-4 italic text-text-secondary'
                    : isEmphasized
                    ? 'text-text-primary'
                    : 'text-text-primary'
                }`}
              >
                {isEmphasized ? (
                  <>
                    {para.split('"').map((seg, j) =>
                      j % 2 === 1 ? (
                        <em key={j} className="text-accent-wood not-italic">"{seg}"</em>
                      ) : (
                        <span key={j}>{seg}</span>
                      )
                    )}
                  </>
                ) : (
                  para
                )}
              </p>
            );
          })}
        </div>

        {/* Signature block */}
        <div className="mt-8 flex flex-col items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-px bg-border-light" />
            <span className="font-[family-name:var(--font-serif)] text-[15px] italic text-accent-wood tracking-[0.04em]">
              —— 有福
            </span>
            <div className="w-10 h-px bg-border-light" />
          </div>
          <span className="mt-1.5 font-[family-name:var(--font-sans)] text-[12px] text-text-tertiary tracking-[0.03em]">
            屏南 · 龙潭 · 万安廊桥
          </span>
        </div>

        {/* Divider */}
        <div className="mx-4 mt-6 h-px bg-border-light" />

        {/* Unlock card */}
        <div className="mx-4 mt-4">
          <button
            type="button"
            onClick={() => navigate(`/collection/${tagId}`)}
            className="w-full h-[140px] rounded-card overflow-hidden cursor-pointer transition-transform active:scale-[0.98] relative"
            style={{
              background: 'linear-gradient(135deg, #FFF4E6 0%, #FFE8C8 40%, #FFF4E0 100%)',
              border: '1.5px dashed #C4915C',
            }}
          >
            <div className="flex items-center h-full px-5 gap-4">
              {/* Hat icon box */}
              <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center">
                <HatIcon />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0 text-left">
                <span className="font-[family-name:var(--font-sans)] text-[11px] text-accent-shimmer font-medium tracking-[0.08em] uppercase">
                  你刚刚解锁
                </span>
                <div className="mt-1 font-[family-name:var(--font-serif)] text-lg font-semibold text-text-primary leading-tight">
                  廊桥小斗笠
                </div>
                <div className="mt-0.5 font-[family-name:var(--font-sans)] text-[12px] text-text-tertiary leading-tight">
                  屏南非遗 · 木拱桥营造技艺
                </div>
              </div>

              {/* Arrow */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4915C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </div>

            {/* Shimmer overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
              style={{
                backgroundImage: 'radial-gradient(circle at 80% 20%, #C4915C 2px, transparent 2px), radial-gradient(circle at 20% 70%, #C4915C 1.5px, transparent 1.5px)',
                backgroundSize: '60px 60px, 80px 80px',
              }}
            />
          </button>
        </div>

        {/* Bottom spacer for fixed buttons */}
        <div className="h-4" />
      </div>

      {/* Fixed bottom dual buttons */}
      <div className="absolute left-0 right-0 bottom-0 bg-primary-bg z-[25]">
        <div
          className="absolute left-0 right-0 -top-6 h-6 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(245,241,234,0) 0%, var(--color-primary-bg) 100%)' }}
        />
        <div className="px-4 pb-6 pt-2 flex gap-3">
          <button
            type="button"
            onClick={() => toast('已保存到相册')}
            className="flex-1 h-[52px] rounded-pill border-[1.5px] border-border-light bg-card-bg text-text-primary font-[family-name:var(--font-sans)] text-[15px] font-medium cursor-pointer hover:bg-[#F8F6F2] transition-colors active:scale-[0.98]"
          >
            保存到相册
          </button>
          <button
            type="button"
            onClick={() => toast(`已分享${petName}的日记给朋友`)}
            className="flex-1 h-[52px] rounded-pill bg-accent-primary text-white font-[family-name:var(--font-sans)] text-[15px] font-medium shadow-[0_6px_20px_rgba(107,142,127,0.28)] cursor-pointer hover:bg-[#5F7F72] transition-colors active:scale-[0.98] active:translate-y-px"
          >
            发给朋友 · 分享{petName}
          </button>
        </div>
      </div>
    </div>
  );
}
