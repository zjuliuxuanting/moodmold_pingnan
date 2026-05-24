import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { getPetByTagIdOrDemo, getUpdates } from '../utils/storage';
import type { Pet, StatusUpdate } from '../types';

function calcDays(checkinDate: string): number {
  if (!checkinDate) return 0;
  const diff = Date.now() - new Date(checkinDate).getTime();
  return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function PetPage() {
  const { tagId } = useParams<{ tagId: string }>();
  const [pet, setPet] = useState<Pet | undefined>(undefined);
  const [updates, setUpdates] = useState<StatusUpdate[]>([]);

  useEffect(() => {
    // 任何 tagId 都至少能拿到豆豆 demo 兜底
    setPet(getPetByTagIdOrDemo(tagId));
    if (tagId) setUpdates(getUpdates(tagId));
  }, [tagId]);

  const latestOverlay = useMemo(() => {
    const withOverlay = updates.filter((u) => u.overlaidPhoto);
    return withOverlay.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0] ?? null;
  }, [updates]);

  const sortedUpdates = useMemo(
    () =>
      [...updates].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    [updates]
  );

  const handleShare = async () => {
    const url = `${window.location.origin}/pet/${tagId}`;
    const title = pet ? `${pet.name}的数字主页` : '宠物数字主页';
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert('链接已复制到剪贴板');
      } catch {
        alert('分享功能暂不可用');
      }
    }
  };

  // loading state
  if (pet === undefined) {
    return (
      <div className="min-h-screen bg-primary-bg flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-border-light border-t-accent-primary mb-6" />
        <p className="text-text-secondary text-sm">加载中...</p>
      </div>
    );
  }

  const days = calcDays(pet.checkinDate);

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* hero: pet photo */}
      <div className="relative w-full h-80 bg-border-light overflow-hidden">
        {pet.photo ? (
          <img
            src={pet.photo}
            alt={pet.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-secondary">
            <svg
              className="w-24 h-24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {/* gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-primary-bg to-transparent" />
      </div>

      {/* pet info card */}
      <div className="px-6 -mt-16 relative z-10">
        <div className="bg-card-bg rounded-card shadow-soft px-6 py-5 max-w-sm mx-auto">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-serif text-text-primary break-words line-clamp-2">{pet.name}</h1>
              <p className="text-sm text-text-secondary mt-1 break-all">挂牌：{pet.tagId}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-3xl font-serif text-text-primary">{days}</div>
              <div className="text-xs text-text-secondary whitespace-nowrap">寄养天数</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-sm mx-auto px-6 mt-6 pb-12 space-y-6">
        {/* latest overlay image */}
        {latestOverlay && (
          <section>
            <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-3">
              最近出图
            </h2>
            <div className="rounded-card overflow-hidden bg-card-bg shadow-soft">
              <img
                src={latestOverlay.overlaidPhoto}
                alt="最近一次数字孪生出图"
                className="w-full h-64 object-cover"
              />
              <div className="px-4 py-3 text-xs text-text-secondary">
                {latestOverlay.heritageStyle
                  ? `${latestOverlay.heritageStyle} · ${formatTimestamp(latestOverlay.timestamp)}`
                  : formatTimestamp(latestOverlay.timestamp)}
              </div>
            </div>
          </section>
        )}

        {/* activity timeline */}
        <section>
          <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-3">
            活动时间线
          </h2>
          {sortedUpdates.length === 0 ? (
            <div className="bg-card-bg rounded-card shadow-soft px-4 py-10 text-center text-text-secondary text-sm">
              暂无活动记录
            </div>
          ) : (
            <div className="relative">
              {/* timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border-light" />
              <div className="space-y-4">
                {sortedUpdates.map((update) => (
                  <div key={update.id} className="relative flex gap-4 pl-10">
                    {/* dot */}
                    <div className="absolute left-2.5 top-2 w-3 h-3 rounded-full bg-text-tertiary border-2 border-primary-bg z-10" />
                    <div className="bg-card-bg rounded-card shadow-soft px-4 py-3 flex-1 min-w-0">
                      <div className="text-xs text-text-secondary mb-2">
                        {formatTimestamp(update.timestamp)}
                      </div>
                      {update.text && (
                        <p className="text-sm text-text-primary leading-relaxed mb-2">
                          {update.text}
                        </p>
                      )}
                      {update.photo && (
                        <img
                          src={update.photo}
                          alt="活动照片"
                          className="rounded-input w-full h-48 object-cover mt-2"
                        />
                      )}
                      {update.overlaidPhoto && (
                        <div className="mt-2 rounded-input overflow-hidden border border-accent-primary/30">
                          <img
                            src={update.overlaidPhoto}
                            alt="数字孪生出图"
                            className="w-full h-40 object-cover"
                          />
                          {update.heritageStyle && (
                            <div className="px-3 py-1 bg-accent-soft text-xs text-accent-primary">
                              {update.heritageStyle}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* bottom navigation pills */}
        <nav className="border-t border-border-light py-4 grid grid-cols-4 gap-1">
          <Link
            to={`/diary/${tagId}`}
            className="flex flex-col items-center gap-0.5 px-1 py-2 rounded-pill border border-border-light text-text-secondary hover:bg-accent-soft hover:text-accent-primary active:scale-[0.97] transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-[10px] leading-none">日记</span>
          </Link>
          <Link
            to={`/collection/${tagId}`}
            className="flex flex-col items-center gap-0.5 px-1 py-2 rounded-pill border border-border-light text-text-secondary hover:bg-accent-soft hover:text-accent-primary active:scale-[0.97] transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="text-[10px] leading-none">收藏</span>
          </Link>
          <Link
            to={`/card/${tagId}`}
            className="flex flex-col items-center gap-0.5 px-1 py-2 rounded-pill border border-border-light text-text-secondary hover:bg-accent-soft hover:text-accent-primary active:scale-[0.97] transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h6" />
            </svg>
            <span className="text-[10px] leading-none">纪念卡</span>
          </Link>
          <Link
            to={`/pass/${tagId}`}
            className="flex flex-col items-center gap-0.5 px-1 py-2 rounded-pill border border-border-light text-text-secondary hover:bg-accent-soft hover:text-accent-primary active:scale-[0.97] transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <span className="text-[10px] leading-none">通行证</span>
          </Link>
        </nav>

        {/* share entry */}
        <section>
          <button
            onClick={handleShare}
            className="w-full h-[52px] flex items-center justify-center rounded-pill bg-accent-primary text-white font-medium text-base active:scale-[0.98] transition-all gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            分享宠物主页
          </button>
        </section>
      </div>
    </div>
  );
}
