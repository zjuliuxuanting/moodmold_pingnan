import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPetByTagId, getUpdates } from '../utils/storage';
import type { Pet, StatusUpdate } from '../types';
import { toast, registerToastShow } from '../utils/toast';

const POLL_INTERVAL = 3000;

type DiaryEntry = {
  day: number;
  date: string;
  time: string;
  title: string;
  excerpt: string;
  isShimmer: boolean;
};

function mockDiaryEntries(): DiaryEntry[] {
  return [
    {
      day: 1,
      date: '5月25日',
      time: '20:30',
      title: '有福在门口张望了很久，远远看见一团橘色的小影子',
      excerpt: '车门打开的时候，豆豆从笼子里探出半个脑袋，耳朵压得低低的。我蹲下来，用手指碰了碰她的鼻子——湿的，还热乎乎。她闻了我好一会儿，然后忽然伸出爪子拍了一下我的手背。',
      isShimmer: false,
    },
    {
      day: 2,
      date: '5月26日',
      time: '18:12',
      title: '豆豆今天第一次主动蹭过来，我看了一眼她的眼睛',
      excerpt: '午觉睡醒的时候，豆豆不知道什么时候蹲在了我枕头旁边。我睁开眼，她的脸离我只有一巴掌远。她没有叫，就那样看着我，然后慢慢把脑袋歪过来，蹭了一下我的肩膀。那一刻，我忽然觉得——她不是来寄养的，她本来就是屏南的猫。',
      isShimmer: false,
    },
    {
      day: 3,
      date: '5月27日',
      time: '17:42',
      title: '带豆豆走了一遍万安廊桥，她在桥上停了三分钟',
      excerpt: '廊桥的木头被太阳晒得温温的。豆豆走在前面，爪子在木板上发出轻轻的嗒嗒声。走到桥心的时候，她忽然停下来，坐了下来，面向远处的山。我安静地陪她坐了一会儿。风从桥下穿过，吹着她的毛往后飘。那一刻，我觉得她比我更懂这座桥。',
      isShimmer: true,
    },
  ];
}

function DiarySummaryCard({ petName, newArrived }: { petName: string; newArrived: boolean }) {
  const totalDays = 7;
  const currentDay = 3;
  const progressPercent = Math.round((currentDay / totalDays) * 100);

  return (
    <div className={`mx-4 h-[100px] rounded-card bg-card-bg shadow-base flex items-center px-4 gap-4 relative overflow-hidden transition-shadow duration-500 ${newArrived ? 'shadow-[0_0_24px_rgba(196,145,92,0.32)]' : ''}`}>
      {/* Dual avatars */}
      <div className="flex-shrink-0 relative w-[72px] h-[56px]">
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full overflow-hidden shadow-[0_2px_8px_rgba(139,111,71,0.25)] bg-accent-cream">
          <img src="/assets/youfu/avatar-youfu.png" alt="有福" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-2 left-6 w-12 h-12 rounded-full overflow-hidden shadow-[0_2px_8px_rgba(196,145,92,0.28)] border-[2.5px] border-card-bg bg-accent-cream">
          <img src="/assets/doudou/doudou.png" alt={petName} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-[family-name:var(--font-serif)] text-[15px] font-medium text-text-primary leading-tight">
          有福 × {petName}
        </div>
        <div className="mt-1 font-[family-name:var(--font-sans)] text-[13px] text-text-secondary">
          Day{currentDay} · 共{totalDays}天
        </div>
        {/* Mini progress bar */}
        <div className="mt-1.5 h-1 rounded-full bg-border-light overflow-hidden">
          <div
            className="h-full rounded-full bg-accent-shimmer transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Subtle grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 30% 40%, #8B6F47 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />
    </div>
  );
}

function Day1Illustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      {/* Sky gradient */}
      <defs>
        <linearGradient id="d1sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A8C8D8" />
          <stop offset="100%" stopColor="#E8D5B7" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="12" fill="url(#d1sky)" />
      {/* Distant mountains */}
      <path d="M0 70 Q20 40 50 65 Q70 48 90 62 Q105 50 120 68 V120 H0 Z" fill="#8B9C88" opacity="0.6" />
      <path d="M0 78 Q30 58 60 76 Q85 62 120 74 V120 H0 Z" fill="#6B7E6B" opacity="0.5" />
      {/* Ground */}
      <rect x="0" y="88" width="120" height="32" fill="#D8C4A6" />
      {/* Door frame */}
      <rect x="40" y="58" width="40" height="40" rx="3" fill="#5B4E3C" />
      <rect x="44" y="62" width="32" height="34" rx="1" fill="#2C2418" />
      {/* Light from door */}
      <rect x="50" y="62" width="6" height="34" fill="#F5EFD0" opacity="0.6" />
      {/* Cat silhouette (back) */}
      <ellipse cx="66" cy="84" rx="8" ry="6" fill="#3E3A36" />
      <circle cx="66" cy="75" r="5" fill="#3E3A36" />
      <path d="M61 77 Q58 72 60 70" stroke="#3E3A36" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M71 77 Q74 72 72 70" stroke="#3E3A36" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Tail */}
      <path d="M74 84 Q82 78 80 72" stroke="#3E3A36" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Luggage */}
      <rect x="56" y="88" width="10" height="7" rx="2" fill="#8B6F47" />
      <rect x="58" y="90" width="6" height="3" rx="1" fill="#A0855A" />
      {/* Ground line */}
      <line x1="0" y1="92" x2="120" y2="92" stroke="#C4B08A" strokeWidth="0.5" />
    </svg>
  );
}

function Day2Illustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <defs>
        <linearGradient id="d2sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8DDD0" />
          <stop offset="100%" stopColor="#F0EAE0" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="12" fill="url(#d2sky)" />
      {/* Floor */}
      <rect x="0" y="88" width="120" height="32" fill="#E8DCC8" />
      <line x1="0" y1="88" x2="120" y2="88" stroke="#D0C4A8" strokeWidth="0.5" />
      {/* Mat/tatami area */}
      <rect x="20" y="72" width="80" height="16" rx="4" fill="#F5EDDF" stroke="#E0D6C2" strokeWidth="0.5" />
      {/* Left cat (有福) */}
      <ellipse cx="42" cy="76" rx="10" ry="7" fill="#7B6B5A" />
      <circle cx="42" cy="66" r="7" fill="#7B6B5A" />
      <path d="M35 65 Q33 60 36 58" stroke="#7B6B5A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M49 65 Q51 60 48 58" stroke="#7B6B5A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Left cat eyes */}
      <ellipse cx="39" cy="65" rx="1.5" ry="1.2" fill="#F5F1EA" />
      <ellipse cx="45" cy="65" rx="1.5" ry="1.2" fill="#F5F1EA" />
      <circle cx="39.5" cy="65" r="0.8" fill="#3E3A36" />
      <circle cx="45.5" cy="65" r="0.8" fill="#3E3A36" />
      {/* Right cat (豆豆) */}
      <ellipse cx="78" cy="76" rx="10" ry="7" fill="#E8A64B" />
      <circle cx="78" cy="66" r="7" fill="#E8A64B" />
      <path d="M71 65 Q69 60 72 58" stroke="#E8A64B" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M85 65 Q87 60 84 58" stroke="#E8A64B" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Right cat eyes */}
      <ellipse cx="75" cy="65" rx="1.5" ry="1.2" fill="#F5F1EA" />
      <ellipse cx="81" cy="65" rx="1.5" ry="1.2" fill="#F5F1EA" />
      <circle cx="75.5" cy="65" r="0.8" fill="#3E3A36" />
      <circle cx="81.5" cy="65" r="0.8" fill="#3E3A36" />
      {/* Heart between them */}
      <path d="M60 60 C58 56 54 56 54 59 C54 63 60 68 60 68 C60 68 66 63 66 59 C66 56 62 56 60 60 Z" fill="#C4915C" opacity="0.7" />
    </svg>
  );
}

function Day3Illustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <defs>
        <linearGradient id="d3sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5E6D0" />
          <stop offset="60%" stopColor="#FDF2E0" />
          <stop offset="100%" stopColor="#E8DCC4" />
        </linearGradient>
        <radialGradient id="d3sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FDE2A8" />
          <stop offset="80%" stopColor="#FDE2A8" stopOpacity="0.1" />
        </radialGradient>
      </defs>
      <rect width="120" height="120" rx="12" fill="url(#d3sky)" />
      {/* Sun */}
      <circle cx="95" cy="18" r="10" fill="url(#d3sun)" />
      <circle cx="95" cy="18" r="3" fill="#F5C56A" />
      {/* Distant mountains */}
      <path d="M0 62 Q25 38 55 60 Q72 48 95 58 Q108 50 120 62 V120 H0 Z" fill="#9BAF98" opacity="0.5" />
      <path d="M0 70 Q35 52 70 68 Q90 58 120 68 V120 H0 Z" fill="#7B8E7B" opacity="0.4" />
      {/* Water */}
      <rect x="0" y="72" width="120" height="48" fill="#B8D4D8" opacity="0.6" />
      {/* Water ripples */}
      <line x1="10" y1="76" x2="30" y2="76" stroke="#9CB8BC" strokeWidth="0.4" opacity="0.5" />
      <line x1="70" y1="80" x2="100" y2="80" stroke="#9CB8BC" strokeWidth="0.4" opacity="0.5" />
      <line x1="25" y1="84" x2="55" y2="84" stroke="#9CB8BC" strokeWidth="0.4" opacity="0.5" />
      {/* Bridge base */}
      <rect x="8" y="68" width="104" height="3" rx="1" fill="#8B6F47" />
      {/* Bridge arch */}
      <path d="M10 68 Q30 52 50 64 Q70 52 90 64 Q110 52 110 68" stroke="#8B6F47" strokeWidth="2.5" fill="none" />
      {/* Bridge roof */}
      <path d="M12 64 L118 64 L114 58 L96 56 L80 56 L64 54 L40 56 L24 56 L6 58 Z" fill="#8B6F47" />
      <path d="M12 64 L118 64" stroke="#6B5335" strokeWidth="0.8" />
      {/* Roof tiles */}
      <line x1="20" y1="60" x2="20" y2="63" stroke="#6B5335" strokeWidth="0.3" opacity="0.5" />
      <line x1="35" y1="58" x2="35" y2="63" stroke="#6B5335" strokeWidth="0.3" opacity="0.5" />
      <line x1="50" y1="57" x2="50" y2="63" stroke="#6B5335" strokeWidth="0.3" opacity="0.5" />
      <line x1="65" y1="56" x2="65" y2="63" stroke="#6B5335" strokeWidth="0.3" opacity="0.5" />
      <line x1="80" y1="57" x2="80" y2="63" stroke="#6B5335" strokeWidth="0.3" opacity="0.5" />
      <line x1="95" y1="58" x2="95" y2="63" stroke="#6B5335" strokeWidth="0.3" opacity="0.5" />
      <line x1="110" y1="60" x2="110" y2="63" stroke="#6B5335" strokeWidth="0.3" opacity="0.5" />
      {/* Pavilion spire */}
      <path d="M58 57 L62 50 L66 57" fill="#8B6F47" />
      <circle cx="62" cy="50" r="1.2" fill="#C4915C" />
      {/* Bridge pillars */}
      <rect x="18" y="68" width="2" height="10" fill="#6B5335" />
      <rect x="38" y="68" width="2" height="8" fill="#6B5335" />
      <rect x="58" y="68" width="2" height="8" fill="#6B5335" />
      <rect x="78" y="68" width="2" height="8" fill="#6B5335" />
      <rect x="98" y="68" width="2" height="10" fill="#6B5335" />
      {/* Cat on bridge (豆豆) */}
      <ellipse cx="54" cy="66" rx="4" ry="3" fill="#E8A64B" />
      <circle cx="54" cy="62" r="3" fill="#E8A64B" />
      <path d="M51 62 Q50 59 51 58" stroke="#E8A64B" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M57 62 Q58 59 57 58" stroke="#E8A64B" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Hat on cat */}
      <path d="M49 59 Q54 56 59 59" stroke="#8B6F47" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M51 59 L57 59" stroke="#8B6F47" strokeWidth="0.8" />
      {/* 有福 figure walking ahead */}
      <circle cx="74" cy="63" r="3" fill="#7B6B5A" />
      <line x1="74" y1="66" x2="74" y2="71" stroke="#7B6B5A" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="74" y1="68" x2="69" y2="66" stroke="#7B6B5A" strokeWidth="1" strokeLinecap="round" />
      <line x1="74" y1="68" x2="79" y2="66" stroke="#7B6B5A" strokeWidth="1" strokeLinecap="round" />
      <line x1="74" y1="71" x2="71" y2="74" stroke="#7B6B5A" strokeWidth="1" strokeLinecap="round" />
      <line x1="74" y1="71" x2="77" y2="74" stroke="#7B6B5A" strokeWidth="1" strokeLinecap="round" />
      {/* Gold particles */}
      <circle cx="70" cy="58" r="0.6" fill="#C4915C" opacity="0.8" />
      <circle cx="80" cy="55" r="0.5" fill="#C4915C" opacity="0.6" />
      <circle cx="65" cy="60" r="0.7" fill="#C4915C" opacity="0.7" />
      <circle cx="85" cy="60" r="0.4" fill="#C4915C" opacity="0.5" />
      <circle cx="76" cy="53" r="0.5" fill="#C4915C" opacity="0.7" />
    </svg>
  );
}

function FloatingEnvelope() {
  return (
    <svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-bounce">
      <rect x="1" y="2" width="30" height="20" rx="3" fill="#F5F1EA" stroke="#8B6F47" strokeWidth="1.2" />
      <path d="M1 2 L16 14 L31 2" stroke="#8B6F47" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="12" r="2" fill="#C4915C" opacity="0.8" />
    </svg>
  );
}

function DiaryCard({
  day,
  date,
  time,
  title,
  excerpt,
  isShimmer,
  onClick,
}: DiaryEntry & { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-card bg-card-bg shadow-base overflow-hidden cursor-pointer transition-transform active:scale-[0.98] ${
        isShimmer ? 'border-[1.5px] border-accent-shimmer' : ''
      }`}
      style={isShimmer ? { background: 'linear-gradient(135deg, #FFF8EE 0%, #FFF4E3 50%, #FFF8EE 100%)' } : undefined}
    >
      {/* Header row */}
      <div className="flex items-center gap-2 px-4 pt-4">
        <span
          className={`inline-flex items-center h-6 px-2.5 rounded-pill font-[family-name:var(--font-sans)] text-xs font-medium tracking-[0.03em] ${
            isShimmer
              ? 'bg-accent-shimmer text-white'
              : 'bg-accent-wood text-white'
          }`}
        >
          Day{day}
        </span>
        <span className="font-[family-name:var(--font-sans)] text-xs text-text-tertiary">{time}</span>
        {isShimmer && (
          <span className="ml-auto flex items-center gap-0.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#C4915C">
              <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
            </svg>
            <span className="font-[family-name:var(--font-sans)] text-[11px] font-semibold text-accent-shimmer">闪闪时刻</span>
          </span>
        )}
      </div>

      {/* Illustration */}
      <div className="px-4 mt-3">
        <img
          src={`/assets/diary/diary-day${day}-${day === 1 ? 'arrival' : day === 2 ? 'explore' : 'shimmer'}.png`}
          alt={`Day ${day}`}
          className="w-full h-auto rounded-[12px] object-cover"
        />
      </div>

      {/* Title */}
      <h3 className="px-4 mt-3 font-[family-name:var(--font-serif)] text-[15px] font-semibold text-text-primary leading-[1.5] line-clamp-2">
        {title}
      </h3>

      {/* Excerpt */}
      <p className="px-4 mt-2 font-[family-name:var(--font-sans)] text-[14px] text-text-secondary leading-[1.65] line-clamp-3">
        {excerpt}
      </p>

      {/* Signature */}
      <p className="px-4 mt-2 mb-4 font-[family-name:var(--font-serif)] text-[13px] italic text-accent-wood text-right">
        —— 有福
      </p>

      {/* Shimmer bottom gradient */}
      {isShimmer && (
        <div
          className="h-[2px] w-full"
          style={{ background: 'linear-gradient(90deg, transparent, #C4915C 20%, #E8B87A 50%, #C4915C 80%, transparent)' }}
        />
      )}
    </button>
  );
}

export default function DiaryListPage() {
  const { tagId } = useParams<{ tagId: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [updates, setUpdates] = useState<StatusUpdate[]>([]);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [pulseNew, setPulseNew] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();
  const prevUpdateCount = useRef(0);
  const pulseTimer = useRef<ReturnType<typeof setTimeout>>();

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
    const storedUpdates = getUpdates(tagId);
    setUpdates(storedUpdates);
    prevUpdateCount.current = storedUpdates.length;
  }, [tagId]);

  useEffect(() => {
    if (!tagId) return;
    const interval = setInterval(() => {
      const latest = getUpdates(tagId);
      if (latest.length > prevUpdateCount.current) {
        const newCount = latest.length - prevUpdateCount.current;
        prevUpdateCount.current = latest.length;
        setUpdates(latest);
        setPulseNew(true);
        if (pulseTimer.current) clearTimeout(pulseTimer.current);
        pulseTimer.current = setTimeout(() => setPulseNew(false), 1800);
        showToast(`有福刚更新了 ${newCount} 篇日记`);
      }
    }, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [tagId, showToast]);

  const entries = useMemo(() => {
    const mockEntries = mockDiaryEntries();
    // If there are real updates, merge timestamps; otherwise use mock
    const realUpdates = updates
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return mockEntries.map((entry, idx) => {
      const realUpdate = realUpdates[idx];
      if (realUpdate) {
        return {
          ...entry,
          date: new Date(realUpdate.timestamp).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
          time: new Date(realUpdate.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }),
        };
      }
      return entry;
    });
  }, [updates]);

  const petName = pet?.name || '豆豆';

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

      {/* Navigation */}
      <nav className="h-14 px-4 grid grid-cols-[40px_1fr_60px] items-center flex-shrink-0 bg-primary-bg">
        <button
          type="button"
          onClick={() => navigate(tagId ? `/pet/${tagId}` : '/')}
          className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-text-primary hover:bg-[rgba(62,58,54,0.06)] transition-colors"
          title="返回"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <div className="text-center font-[family-name:var(--font-serif)] text-base font-medium text-text-primary tracking-[0.03em]">
          {petName}的屏南日记
        </div>
        <button
          type="button"
          onClick={() => toast('链接已复制，分享给朋友吧')}
          className="justify-self-end w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-text-secondary hover:bg-[rgba(62,58,54,0.06)] transition-colors"
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
      </nav>

      {/* Divider */}
      <div className="h-px bg-border-light mx-4" />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {/* Summary card */}
        <div className="mt-4">
          <DiarySummaryCard petName={petName} newArrived={pulseNew} />
        </div>

        {/* Diary list */}
        <div className="flex flex-col gap-4 px-4 mt-4 pb-[120px]">
          {entries.map((entry) => (
            <DiaryCard
              key={entry.day}
              {...entry}
              onClick={() => navigate(`/diary/${tagId}/${entry.day}`)}
            />
          ))}
        </div>
      </div>

      {/* Fixed bottom */}
      <div className="absolute left-0 right-0 bottom-0 h-[96px] bg-primary-bg flex items-center justify-center gap-3 z-[25]">
        <div
          className="absolute left-0 right-0 -top-6 h-6 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(245,241,234,0) 0%, var(--color-primary-bg) 100%)' }}
        />
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-60" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-primary" />
        </span>
        <span className="font-[family-name:var(--font-sans)] text-[13px] text-text-secondary tracking-[0.02em]">
          实时等待有福更新中
        </span>
      </div>
    </div>
  );
}
