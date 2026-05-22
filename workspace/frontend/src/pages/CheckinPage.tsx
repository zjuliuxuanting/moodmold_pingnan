import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { getPetByTagId, getUpdates } from '../utils/storage';
import { overlayStickerOnPhoto } from '../utils/overlay';
import { stickerSets, type StickerDef } from '../data/stickers';
import type { Pet, StatusUpdate } from '../types';

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const PINGNAN_BG = 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80';

export default function CheckinPage() {
  const { tagId } = useParams<{ tagId: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null | undefined>(undefined);
  const [updates, setUpdates] = useState<StatusUpdate[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generatedPhoto, setGeneratedPhoto] = useState<string | null>(null);
  const [selectedSticker, setSelectedSticker] = useState<StickerDef | null>(null);
  const [stickerSetId, setStickerSetId] = useState(stickerSets[0].id);

  useEffect(() => {
    if (!tagId) {
      setPet(null);
      return;
    }
    const found = getPetByTagId(tagId);
    setPet(found ?? null);
    if (found) setUpdates(getUpdates(tagId));
  }, [tagId]);

  const currentSet = stickerSets.find((s) => s.id === stickerSetId) ?? stickerSets[0];

  const latestOverlay = useMemo(() => {
    const withOverlay = updates.filter((u) => u.overlaidPhoto);
    return withOverlay.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0] ?? null;
  }, [updates]);

  const handleGenerate = async () => {
    if (!pet?.photo || !selectedSticker) return;
    setGenerating(true);
    try {
      const result = await overlayStickerOnPhoto(pet.photo, selectedSticker.svgContent, {
        stickerSize: 140,
        margin: 24,
        opacity: 0.88,
      });
      setGeneratedPhoto(result);
    } catch (e) {
      console.error('Generate failed:', e);
    }
    setGenerating(false);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/checkin/${tagId}`;
    const title = pet ? `${pet.name} 在屏南打卡` : '屏南宠物打卡';
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

  const displayPhoto = generatedPhoto || latestOverlay?.overlaidPhoto || null;

  if (pet === undefined) {
    return (
      <div className="min-h-screen bg-primary-bg flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-border-light border-t-accent-primary mb-6" />
        <p className="text-text-secondary text-sm">加载中...</p>
      </div>
    );
  }

  if (pet === null) {
    return (
      <div className="min-h-screen bg-primary-bg flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-6">🐾</div>
          <h1 className="text-2xl font-serif text-text-primary mb-3">未找到宠物</h1>
          <p className="text-text-secondary mb-8">
            挂牌编号 <span className="text-text-primary font-mono">{tagId}</span> 尚未绑定任何宠物。
          </p>
          <button
            type="button"
            onClick={() => navigate('/', { replace: true })}
            className="px-8 h-[52px] flex items-center justify-center rounded-pill bg-accent-primary text-white font-medium text-sm active:scale-[0.98] transition-all"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* 屏南古村背景 Header */}
      <div className="relative w-full h-56 overflow-hidden">
        <img
          src={PINGNAN_BG}
          alt="屏南古村"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-primary-bg" />
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-white text-2xl font-serif drop-shadow-md">
            {pet.name} 在屏南
          </h1>
          <p className="text-white/80 text-sm mt-1 drop-shadow">
            非遗变装打卡 · 挂牌 {pet.tagId}
          </p>
        </div>
      </div>

      <div className="max-w-sm mx-auto px-6 pb-12 space-y-6 -mt-4 relative z-10">
        {/* 数字孪生出图卡片 */}
        <section>
          {displayPhoto ? (
            <div className="bg-card-bg rounded-card shadow-base overflow-hidden">
              <img
                src={displayPhoto}
                alt="数字孪生出图"
                className="w-full h-72 object-cover"
              />
              <div className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">数字孪生打卡照</p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {latestOverlay?.heritageStyle ?? '非遗变装'}
                    {latestOverlay && ` · ${formatTimestamp(latestOverlay.timestamp)}`}
                  </p>
                </div>
                <button
                  onClick={handleShare}
                  className="px-5 py-2 rounded-pill bg-accent-primary text-white text-sm font-medium active:scale-[0.98] transition-all flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  分享
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-card-bg rounded-card shadow-soft p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-accent-soft flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-text-secondary text-sm">暂无数字孪生打卡照</p>
              <p className="text-text-tertiary text-xs mt-1">托管方还未生成出图</p>
            </div>
          )}
        </section>

        {/* 即时生成区 */}
        {!latestOverlay && pet.photo && (
          <section>
            <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-3">
              即时生成打卡照
            </h2>
            <div className="bg-card-bg rounded-card shadow-soft p-5">
              <img
                src={pet.photo}
                alt={pet.name}
                className="w-full h-44 object-cover rounded-input mb-4"
              />

              {/* 套装切换 */}
              <div className="flex gap-2 mb-3">
                {stickerSets.map((set) => (
                  <button
                    key={set.id}
                    type="button"
                    onClick={() => {
                      setStickerSetId(set.id);
                      setSelectedSticker(null);
                      setGeneratedPhoto(null);
                    }}
                    className={`flex-1 py-2 rounded-input text-xs font-medium transition-colors ${
                      stickerSetId === set.id
                        ? 'bg-accent-primary text-white'
                        : 'bg-accent-soft text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {set.name}
                  </button>
                ))}
              </div>

              {/* 挂件选择 */}
              <div className="flex gap-2 flex-wrap mb-4">
                {currentSet.stickers.map((sticker) => (
                  <button
                    key={sticker.id}
                    type="button"
                    onClick={() =>
                      setSelectedSticker(
                        selectedSticker?.id === sticker.id ? null : sticker
                      )
                    }
                    className={`w-14 h-14 rounded-input border-2 flex items-center justify-center overflow-hidden transition-colors ${
                      selectedSticker?.id === sticker.id
                        ? 'border-accent-primary bg-accent-soft'
                        : 'border-border-light hover:border-text-tertiary'
                    }`}
                  >
                    <img
                      src={`data:image/svg+xml,${encodeURIComponent(sticker.svgContent)}`}
                      alt={sticker.label}
                      className="w-10 h-10 object-contain"
                    />
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={!selectedSticker || generating}
                className="w-full h-[52px] flex items-center justify-center rounded-pill bg-accent-primary text-white text-sm font-medium disabled:bg-border-light disabled:cursor-not-allowed active:scale-[0.98] transition-all"
              >
                {generating ? '生成中...' : '生成打卡照'}
              </button>
            </div>
          </section>
        )}

        {/* 宠物信息 */}
        <section>
          <div className="bg-card-bg rounded-card shadow-soft px-5 py-4 flex items-center gap-4">
            {pet.photo ? (
              <img
                src={pet.photo}
                alt={pet.name}
                className="w-14 h-14 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-accent-soft flex items-center justify-center shrink-0">
                <span className="text-2xl">🐾</span>
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-base font-serif text-text-primary">{pet.name}</h3>
              <p className="text-xs text-text-secondary mt-0.5">
                挂牌 {pet.tagId} · {pet.status === 'active' ? '寄养中' : '已结束'}
              </p>
            </div>
          </div>
        </section>

        {/* 分享按钮 */}
        <section>
          <button
            onClick={handleShare}
            className="w-full h-[52px] flex items-center justify-center rounded-pill bg-accent-primary text-white font-medium text-base active:scale-[0.98] transition-all gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            分享打卡页面
          </button>
        </section>
      </div>
    </div>
  );
}
