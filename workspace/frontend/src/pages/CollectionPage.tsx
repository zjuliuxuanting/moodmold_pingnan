import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPetByTagId } from '../utils/storage';
import type { Pet } from '../types';

interface CollectionItem {
  id: string;
  name: string;
  description: string;
  dayNumber: number;
  unlocked: boolean;
}

const ITEMS: CollectionItem[] = [
  {
    id: 'passport',
    name: '屏南通行证',
    description: '豆豆抵达屏南龙潭村时获得的乡村身份证明，由村猫有福亲自签发。',
    dayNumber: 1,
    unlocked: true,
  },
  {
    id: 'hat',
    name: '龙潭斗笠',
    description: '有福送给豆豆的竹编斗笠，午后阳光下戴在头上，是村里最神气的猫。',
    dayNumber: 3,
    unlocked: true,
  },
  {
    id: 'robe',
    name: '古厝戏服',
    description: '豆豆在龙潭古戏台试穿的戏服，绣有祥云与牡丹，仿佛穿越百年时光。',
    dayNumber: 5,
    unlocked: false,
  },
  {
    id: 'badge',
    name: '荣誉村猫',
    description: '由龙潭村委会授予的“荣誉村民”徽章，表彰豆豆为村庄带来的欢乐。',
    dayNumber: 7,
    unlocked: false,
  },
];

function PassportSVG() {
  return (
    <svg viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="128" height="168" rx="10" fill="#FBF7EE" stroke="#8B6F47" strokeWidth="2"/>
      <rect x="12" y="12" width="116" height="156" rx="6" fill="none" stroke="#8B6F47" strokeWidth="0.8" opacity="0.5"/>
      <rect x="16" y="16" width="108" height="14" rx="4" fill="#8B6F47"/>
      <circle cx="26" cy="23" r="2.5" fill="#FBF7EE"/>
      <circle cx="114" cy="23" r="2.5" fill="#FBF7EE"/>
      <rect x="36" y="38" width="68" height="14" rx="7" fill="#E8EFEB" stroke="#6B8E7F" strokeWidth="1"/>
      <text x="70" y="48" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="8" fontWeight="600" fill="#5B7553">DAY 1</text>
      <circle cx="70" cy="72" r="18" fill="#F5EFE6" stroke="#8B6F47" strokeWidth="1"/>
      <path d="M62 68a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM70 68a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM78 68a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM64 74a2 2 0 0 0 4 0M72 74a2 2 0 0 0 4 0" fill="none" stroke="#8B6F47" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M66 74h8" stroke="#8B6F47" strokeWidth="0.8" strokeLinecap="round"/>
      <line x1="40" y1="100" x2="100" y2="100" stroke="#8B6F47" strokeWidth="0.6" opacity="0.4"/>
      <line x1="40" y1="107" x2="92" y2="107" stroke="#8B6F47" strokeWidth="0.6" opacity="0.4"/>
      <line x1="40" y1="114" x2="96" y2="114" stroke="#8B6F47" strokeWidth="0.6" opacity="0.4"/>
      <line x1="40" y1="121" x2="84" y2="121" stroke="#8B6F47" strokeWidth="0.6" opacity="0.4"/>
      <rect x="90" y="130" width="32" height="32" rx="5" fill="white" stroke="#B8542F" strokeWidth="1.5" opacity="0.85" transform="rotate(-8 106 146)"/>
      <text x="106" y="152" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="18" fontWeight="700" fill="#B8542F" transform="rotate(-8 106 146)">印</text>
      <text x="70" y="170" textAnchor="middle" fontFamily="var(--font-en-serif)" fontSize="6" fill="#8B6F47" opacity="0.4">moodmold · 2026</text>
    </svg>
  );
}

function HatSVG() {
  return (
    <svg viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#FFF4E6" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#F5F1EA" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="140" height="180" rx="12" fill="url(#glow)"/>
      <ellipse cx="70" cy="140" rx="30" ry="12" fill="#C9A87C"/>
      <ellipse cx="70" cy="118" rx="22" ry="18" fill="#D4B896"/>
      <path d="M52 108a6 5 0 1 1 0-10 6 5 0 0 1 0 10zM88 108a6 5 0 1 1 0-10 6 5 0 0 1 0 10z" fill="#D4B896" stroke="#B8956A" strokeWidth="0.8"/>
      <ellipse cx="67" cy="121" rx="1.8" ry="2.2" fill="#3E3A36"/>
      <ellipse cx="73" cy="121" rx="1.8" ry="2.2" fill="#3E3A36"/>
      <ellipse cx="70" cy="126" rx="2.5" ry="1.5" fill="#E8927C"/>
      <path d="M64 126h-4M76 126h4M66 128h-6M74 128h6" stroke="#8B847C" strokeWidth="0.5" strokeLinecap="round"/>
      <path d="M30 98 Q70 28 110 98 Z" fill="#E8D5A3" stroke="#B8956A" strokeWidth="1.2"/>
      <line x1="72" y1="46" x2="36" y2="96" stroke="#C9A87C" strokeWidth="0.5" opacity="0.5"/>
      <line x1="68" y1="46" x2="104" y2="96" stroke="#C9A87C" strokeWidth="0.5" opacity="0.5"/>
      <line x1="66" y1="48" x2="44" y2="98" stroke="#C9A87C" strokeWidth="0.5" opacity="0.4"/>
      <line x1="74" y1="48" x2="96" y2="98" stroke="#C9A87C" strokeWidth="0.5" opacity="0.4"/>
      <line x1="70" y1="40" x2="48" y2="98" stroke="#D4B896" strokeWidth="0.6" opacity="0.3"/>
      <line x1="70" y1="40" x2="92" y2="98" stroke="#D4B896" strokeWidth="0.6" opacity="0.3"/>
      <line x1="70" y1="38" x2="60" y2="98" stroke="#C9A87C" strokeWidth="0.4" opacity="0.25"/>
      <line x1="70" y1="38" x2="80" y2="98" stroke="#C9A87C" strokeWidth="0.4" opacity="0.25"/>
      <circle cx="70" cy="36" r="5" fill="#E8D5A3" stroke="#B8956A" strokeWidth="1"/>
      <circle cx="70" cy="36" r="2.5" fill="#B8956A"/>
      <path d="M70 32 Q80 24 83 28" fill="none" stroke="#C44E3A" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M70 32 Q58 24 55 28" fill="none" stroke="#C44E3A" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M70 32 Q64 22 62 26" fill="none" stroke="#C44E3A" strokeWidth="0.8" strokeLinecap="round"/>
    </svg>
  );
}

function RobeSVG() {
  return (
    <svg viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M70 30 L62 60 L50 52 L40 70 L30 62 L42 100 L32 140 L38 165 L70 175 L102 165 L108 140 L98 100 L110 62 L100 70 L90 52 L78 60 Z" fill="#C44E3A" stroke="#8B3A2A" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M62 60 L70 30 L78 60" fill="none" stroke="#F0D9A0" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M70 30 L70 175" stroke="#F0D9A0" strokeWidth="0.8" opacity="0.5"/>
      <circle cx="50" cy="90" r="3" fill="none" stroke="#F0D9A0" strokeWidth="0.8" opacity="0.5"/>
      <circle cx="90" cy="90" r="3" fill="none" stroke="#F0D9A0" strokeWidth="0.8" opacity="0.5"/>
      <path d="M38 140 Q70 130 102 140" fill="none" stroke="#F0D9A0" strokeWidth="1" opacity="0.6"/>
      <rect x="48" y="60" width="44" height="24" rx="3" fill="none" stroke="#F0D9A0" strokeWidth="1" opacity="0.5"/>
      <circle cx="70" cy="72" r="6" fill="#F0D9A0" opacity="0.3"/>
    </svg>
  );
}

function BadgeSVG() {
  return (
    <svg viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M70 176 L28 40 L70 6 L112 40 Z" fill="#C4915C" stroke="#8B6F47" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M70 176 L32 42 L70 10 L108 42 Z" fill="#F0D9A0" stroke="#C4915C" strokeWidth="0.8" strokeLinejoin="round"/>
      <circle cx="70" cy="76" r="22" fill="white" stroke="#C4915C" strokeWidth="1.5"/>
      <path d="M70 60 L74 69 L84 70 L76 76 L78 86 L70 81 L62 86 L64 76 L56 70 L66 69 Z" fill="#C4915C"/>
      <rect x="38" y="40" width="5" height="14" rx="2.5" fill="#8B6F47"/>
      <rect x="97" y="40" width="5" height="14" rx="2.5" fill="#8B6F47"/>
      <path d="M70 176 Q60 148 70 130 Q80 148 70 176" fill="#8B6F47" opacity="0.3"/>
    </svg>
  );
}

function LockOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="w-10 h-10 rounded-full bg-[rgba(62,58,54,0.35)] flex items-center justify-center backdrop-blur-sm">
        <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="9" width="14" height="11" rx="2.5" fill="white" stroke="white" strokeWidth="2"/>
          <path d="M5 9V6a4 4 0 0 1 8 0v3" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="9" cy="14.5" r="1.5" fill="rgba(62,58,54,0.7)"/>
        </svg>
      </div>
    </div>
  );
}

function ShimmerStar() {
  return (
    <svg className="absolute top-2 right-2 w-5 h-5 z-10" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 1L12.2 7.8L19 10L12.2 12.2L10 19L7.8 12.2L1 10L7.8 7.8Z" fill="#C4915C" opacity="0.9"/>
      <path d="M10 3L11.5 7.5L16 9L11.5 10.5L10 15L8.5 10.5L4 9L8.5 7.5Z" fill="#F5EFE6"/>
    </svg>
  );
}

function ModalOverlay({
  item,
  onClose,
}: {
  item: CollectionItem;
  onClose: () => void;
}) {
  const imgMap: Record<string, string> = {
    passport: '/assets/decorations/stamp-pingnan-pass.png',
    hat: '/assets/skins/skin-bamboo-hat.png',
    robe: '/assets/skins/skin-opera-collar.png',
    badge: '/assets/badges/badge-villagecat.png',
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(62,58,54,0.45)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <article
        className="relative w-full max-w-[300px] rounded-card bg-card-bg shadow-lift overflow-hidden"
        style={{ animation: 'pass-reveal 320ms cubic-bezier(.4,0,.2,1) both' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full h-2 bg-accent-wood relative">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-card-bg border border-accent-wood" />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-card-bg border border-accent-wood" />
        </div>

        <div className="p-6 pt-5">
          <div className="flex justify-center mb-4">
            <div className="w-[180px] h-[230px] flex items-center justify-center">
              <img src={imgMap[item.id]} alt={item.name} className="max-w-full max-h-full object-contain" />
            </div>
          </div>

          <h2 className="text-center font-[family-name:var(--font-serif)] text-lg font-semibold text-text-primary tracking-[0.04em]">
            {item.name}
          </h2>

          <p className="mt-2 text-center font-[family-name:var(--font-sans)] text-sm leading-[1.7] text-text-secondary">
            {item.description}
          </p>

          <div className="mt-4 flex justify-center">
            <div
              className="w-12 h-12 border-[1.5px] border-[#B8542F] rounded-[6px] flex items-center justify-center opacity-70 bg-[rgba(184,84,47,0.06)]"
              style={{ transform: 'rotate(-6deg)' }}
            >
              <span className="font-[family-name:var(--font-serif)] font-bold text-[24px] text-[#B8542F] leading-none">印</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:bg-[rgba(62,58,54,0.06)] transition-colors cursor-pointer"
          title="关闭"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18"/>
          </svg>
        </button>
      </article>
    </div>
  );
}

export default function CollectionPage() {
  const { tagId } = useParams<{ tagId: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 1600);
  }, []);

  useEffect(() => {
    if (!tagId) return;
    const foundPet = getPetByTagId(tagId);
    if (foundPet) setPet(foundPet);
  }, [tagId]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const petName = pet?.name || '豆豆';
  const unlockedCount = ITEMS.filter((i) => i.unlocked).length;
  const totalCount = ITEMS.length;
  const progressPct = Math.round((unlockedCount / totalCount) * 100);

  const handleCellClick = (item: CollectionItem) => {
    if (item.unlocked) {
      setSelectedItem(item);
    } else {
      showToast(`${item.name}尚未解锁，继续记录日记吧`);
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative bg-primary-bg">
      {/* Toast */}
      <div
        className={`absolute left-1/2 top-[20px] -translate-x-1/2 z-[70] bg-[rgba(62,58,54,0.92)] text-white px-5 py-3 rounded-pill font-[family-name:var(--font-sans)] text-[13px] tracking-[0.02em] shadow-lift transition-all duration-[220ms] pointer-events-none ${
          toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
        }`}
      >
        {toastMsg}
      </div>

      {/* Modal */}
      {selectedItem && (
        <ModalOverlay item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-[140px]" style={{ scrollbarWidth: 'none' }}>
        {/* Navigation */}
        <nav className="h-14 px-4 grid grid-cols-[40px_1fr_40px] items-center flex-shrink-0">
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
          <div className="text-center font-[family-name:var(--font-serif)] text-base font-medium text-text-primary tracking-[0.02em]">
            {petName}的屏南收藏
          </div>
        </nav>

        {/* Stats */}
        <div className="mt-4 mx-6 flex flex-col items-center">
          <div className="flex items-baseline gap-1">
            <span className="font-[family-name:var(--font-en-sans)] text-[32px] font-semibold text-accent-wood tracking-[0.02em]">
              {unlockedCount}
            </span>
            <span className="font-[family-name:var(--font-en-sans)] text-[20px] text-text-tertiary">
              /{totalCount}
            </span>
          </div>
          <span className="mt-1 font-[family-name:var(--font-sans)] text-sm text-text-secondary tracking-[0.02em]">
            已解锁屏南非遗变装
          </span>

          {/* Progress bar */}
          <div className="mt-3 w-full max-w-[200px] h-1.5 bg-border-light rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progressPct}%`,
                background: 'linear-gradient(90deg, #8B6F47 0%, #C4915C 100%)',
              }}
            />
          </div>
        </div>

        {/* Grid */}
        <div className="mt-8 mx-6 grid grid-cols-2 gap-4">
          {ITEMS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleCellClick(item)}
              className="relative rounded-card border border-border-light bg-card-bg overflow-hidden cursor-pointer active:scale-[0.98] transition-transform shadow-soft hover:shadow-base"
              style={{
                aspectRatio: '165 / 220',
                animation: `pass-reveal 400ms cubic-bezier(.4,0,.2,1) both`,
                animationDelay: `${index * 120}ms`,
                filter: item.unlocked ? 'none' : 'grayscale(1) opacity(0.65)',
              }}
            >
              {/* DAY pill */}
              <span className={`absolute top-2.5 left-2.5 z-10 inline-flex items-center h-5 px-2.5 rounded-pill font-[family-name:var(--font-sans)] text-[10px] font-semibold tracking-[0.04em] ${
                item.unlocked
                  ? 'bg-accent-soft text-accent-primary'
                  : 'bg-[rgba(139,132,124,0.2)] text-text-tertiary'
              }`}>
                DAY {item.dayNumber}
              </span>

              {/* Star for unlocked */}
              {item.unlocked && <ShimmerStar />}

              {/* Illustration */}
              <div className="absolute inset-0 flex items-center justify-center p-4 pt-10 pb-8">
                <img
                  src={
                    item.id === 'passport' ? '/assets/decorations/stamp-pingnan-pass.png'
                    : item.id === 'hat' ? '/assets/skins/skin-bamboo-hat.png'
                    : item.id === 'robe' ? '/assets/skins/skin-opera-collar.png'
                    : '/assets/badges/badge-villagecat.png'
                  }
                  alt={item.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Lock overlay */}
              {!item.unlocked && <LockOverlay />}

              {/* Label at bottom */}
              <div className="absolute bottom-3 left-0 right-0 text-center">
                <span className={`font-[family-name:var(--font-sans)] text-[11px] font-medium tracking-[0.02em] ${
                  item.unlocked ? 'text-text-primary' : 'text-text-tertiary'
                }`}>
                  {item.name}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom text */}
        <p className="mt-8 mx-6 text-center font-[family-name:var(--font-sans)] text-sm leading-[1.7] text-text-secondary">
          解锁全部非遗变装，{petName}将成为屏南最靓的猫
        </p>
      </div>

      {/* Fixed bottom button */}
      <div className="absolute left-0 right-0 bottom-0 pt-3 pb-6 px-6 bg-primary-bg flex flex-col items-center gap-2 z-[25]">
        <div
          className="absolute left-0 right-0 -top-6 h-6 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(245,241,234,0) 0%, var(--color-primary-bg) 100%)' }}
        />
        <button
          type="button"
          onClick={() => tagId && navigate(`/diary/${tagId}`)}
          className="w-full h-[52px] rounded-pill bg-accent-primary text-white font-[family-name:var(--font-sans)] text-base font-medium shadow-[0_6px_20px_rgba(107,142,127,0.28)] active:translate-y-px active:scale-[0.99] transition-transform"
        >
          回到日记本
        </button>
      </div>
    </div>
  );
}
