import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getPetByTagId, addUpdate, getUpdates, savePet } from '../utils/storage';
import { overlayStickerOnPhoto } from '../utils/overlay';
import { stickerSets, type StickerDef } from '../data/stickers';
import type { Pet, StatusUpdate } from '../types';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);

  if (diffMin < 1) return '刚刚';
  if (diffMin < 60) return `${diffMin} 分钟前`;
  if (diffHour < 24) return `${diffHour} 小时前`;

  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${month}-${day} ${hours}:${minutes}`;
}

export default function HostUpdatePage() {
  const { petId } = useParams<{ petId: string }>();
  const tagId = decodeURIComponent(petId ?? '');

  const [pet, setPet] = useState<Pet | undefined>(undefined);
  const [updates, setUpdates] = useState<StatusUpdate[]>([]);
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [overlaying, setOverlaying] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [stickerSetId, setStickerSetId] = useState(stickerSets[0].id);
  const [selectedSticker, setSelectedSticker] = useState<StickerDef | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!tagId) return;
    const found = getPetByTagId(tagId);
    setPet(found);
    setUpdates(getUpdates(tagId));
  }, [tagId]);

  const refreshUpdates = () => {
    setUpdates(getUpdates(tagId));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleEndBoarding = () => {
    if (!pet || !tagId) return;
    const newStatus = pet.status === 'active' ? 'ended' : 'active';
    savePet({ ...pet, status: newStatus });
    setPet({ ...pet, status: newStatus });
  };

  const handleSubmit = async () => {
    if (!tagId) return;
    setSubmitting(true);

    try {
      let overlaidPhoto: string | undefined;
      if (photo && selectedSticker) {
        setOverlaying(true);
        try {
          overlaidPhoto = await overlayStickerOnPhoto(photo, selectedSticker.svgContent, {
            stickerSize: 120,
            margin: 20,
            opacity: 0.88,
          });
        } catch (e) {
          console.error('Overlay failed:', e);
        }
        setOverlaying(false);
      }

      addUpdate({
        id: generateId(),
        petTagId: tagId,
        timestamp: new Date().toISOString(),
        text: text.trim(),
        photo,
        overlaidPhoto,
        heritageStyle: selectedSticker
          ? `${currentSet?.name} · ${selectedSticker.label}`
          : undefined,
      });

      setText('');
      setPhoto('');
      setSelectedSticker(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setSubmitting(false);
      setShowForm(false);
      refreshUpdates();
    } catch {
      const fallbackUpdate: StatusUpdate = {
        id: generateId(),
        petTagId: tagId,
        timestamp: new Date().toISOString(),
        text: text.trim(),
        photo,
      };
      addUpdate(fallbackUpdate);
      setText('');
      setPhoto('');
      setSelectedSticker(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setSubmitting(false);
      setShowForm(false);
      refreshUpdates();
    }
  };

  const currentSet = stickerSets.find((s) => s.id === stickerSetId) ?? stickerSets[0];

  const isFormValid = text.trim().length > 0 || photo.length > 0;

  // 宠物未找到
  if (!pet) {
    return (
      <div className="min-h-screen bg-primary-bg flex flex-col px-6 py-12">
        <div className="w-full max-w-sm mx-auto">
          <Link
            to="/host"
            className="inline-flex items-center gap-2 text-[#6B6560] text-base mb-8 hover:text-text-primary transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回后台
          </Link>
          <div className="bg-card-bg rounded-card p-8 shadow-soft text-center">
            <div className="w-16 h-16 rounded-full bg-accent-soft flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-lg text-text-primary mb-2">未找到宠物</h2>
            <p className="text-[#6B6560] text-base mb-6">
              挂牌编号 <span className="text-text-primary font-medium">{tagId}</span> 尚未录入
            </p>
            <Link
              to="/host/checkin"
              className="inline-block px-6 h-14 flex items-center justify-center rounded-pill bg-accent-primary text-white font-medium text-base active:scale-[0.98] transition-all"
            >
              录入该宠物
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 倒序排列的更新列表
  const sortedUpdates = [...updates].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="min-h-screen bg-primary-bg flex flex-col px-6 py-12 pb-24">
      <div className="w-full max-w-sm mx-auto">
        {/* 顶部导航 */}
        <Link
          to="/host"
          className="inline-flex items-center gap-2 text-[#6B6560] text-base mb-6 hover:text-text-primary transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回后台
        </Link>

        {/* 宠物信息卡片 */}
        <div className="bg-card-bg rounded-card p-5 mb-6 shadow-soft">
          <div className="flex items-center gap-4">
            {pet.photo ? (
              <img
                src={pet.photo}
                alt={pet.name}
                className="w-16 h-16 rounded-card object-cover shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-card bg-accent-soft flex items-center justify-center shrink-0">
                <svg className="w-8 h-8 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div className="min-w-0">
              <h2 className="text-lg text-text-primary truncate">{pet.name}</h2>
              <p className="text-sm text-[#6B6560] mt-0.5">挂牌编号：{pet.tagId}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className={`inline-block w-1.5 h-1.5 rounded-full ${
                    pet.status === 'active' ? 'bg-accent-primary' : 'bg-text-tertiary'
                  }`}
                />
                <span className="text-sm text-[#6B6560]">
                  {pet.status === 'active' ? '寄养中' : '已结束'} · {sortedUpdates.length} 条更新
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleEndBoarding}
            className={`mt-3 w-full h-14 rounded-pill text-base font-medium transition-colors active:scale-[0.98] ${
              pet.status === 'active'
                ? 'border border-red-200 text-red-500 hover:bg-red-50'
                : 'border border-accent-primary text-accent-primary hover:bg-accent-soft'
            }`}
          >
            {pet.status === 'active' ? '结束寄养' : '重新开始寄养'}
          </button>
        </div>

        {/* 消费者视图预览入口 */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          <Link
            to={`/pet/${encodeURIComponent(tagId)}`}
            className="px-2.5 py-1 rounded-pill bg-accent-soft text-accent-primary text-sm hover:bg-accent-primary/10 transition-colors"
          >
            预览宠物主页
          </Link>
          <Link
            to={`/diary/${encodeURIComponent(tagId)}`}
            className="px-2.5 py-1 rounded-pill bg-accent-soft text-accent-primary text-sm hover:bg-accent-primary/10 transition-colors"
          >
            预览日记
          </Link>
          <Link
            to={`/collection/${encodeURIComponent(tagId)}`}
            className="px-2.5 py-1 rounded-pill bg-accent-soft text-accent-primary text-sm hover:bg-accent-primary/10 transition-colors"
          >
            预览收藏
          </Link>
          <Link
            to={`/card/${encodeURIComponent(tagId)}`}
            className="px-2.5 py-1 rounded-pill bg-accent-soft text-accent-primary text-sm hover:bg-accent-primary/10 transition-colors"
          >
            预览纪念卡
          </Link>
          <Link
            to={`/pass/${encodeURIComponent(tagId)}`}
            className="px-2.5 py-1 rounded-pill bg-accent-soft text-accent-primary text-sm hover:bg-accent-primary/10 transition-colors"
          >
            回看通行证
          </Link>
        </div>

        {/* 添加状态更新 */}
        {!showForm ? (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="w-full py-3 rounded-card border-2 border-dashed border-border-light text-[#6B6560] text-base font-medium mb-8 hover:border-accent-primary hover:text-text-primary transition-colors active:scale-[0.98]"
          >
            添加状态更新
          </button>
        ) : (
          <div className="bg-card-bg rounded-card p-5 mb-8 shadow-soft">
            <h3 className="text-base font-medium text-text-primary mb-4">添加状态更新</h3>

            {/* 文字描述 */}
            <div className="mb-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="描述宠物的当前状态..."
                rows={3}
                className="w-full px-4 py-3 rounded-input border border-border-light focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none text-text-primary placeholder-text-tertiary transition-colors resize-none text-base"
                autoFocus
              />
            </div>

            {/* 照片上传 */}
            <div className="mb-5">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                className="hidden"
              />
              {photo ? (
                <div className="relative rounded-card overflow-hidden">
                  <img
                    src={photo}
                    alt="状态照片预览"
                    className="w-full h-40 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhoto('');
                      setSelectedSticker(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg leading-none hover:bg-black/70 transition-colors"
                    aria-label="移除照片"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 border-2 border-dashed border-border-light rounded-card flex flex-col items-center justify-center text-[#6B6560] hover:border-accent-primary hover:text-text-primary transition-colors"
                >
                  <svg className="w-8 h-8 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-base">添加照片（选填）</span>
                </button>
              )}
            </div>

            {/* 挂件选择 */}
            {photo && (
              <div className="mb-5">
                <label className="block text-base font-medium text-text-primary mb-2">
                  数字孪生挂件（选填）
                </label>

                {/* 套装切换 */}
                <div className="flex gap-2 mb-3">
                  {stickerSets.map((set) => (
                    <button
                      key={set.id}
                      type="button"
                      onClick={() => {
                        setStickerSetId(set.id);
                        setSelectedSticker(null);
                      }}
                      className={`flex-1 py-2 rounded-input text-sm font-medium transition-colors ${
                        stickerSetId === set.id
                          ? 'bg-accent-primary text-white'
                          : 'bg-accent-soft text-[#6B6560] hover:text-text-primary'
                      }`}
                    >
                      {set.name}
                    </button>
                  ))}
                </div>

                {/* 挂件列表 */}
                <div className="flex gap-2 flex-wrap">
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
                {selectedSticker && (
                  <p className="text-sm text-accent-primary mt-1.5">
                    已选：{selectedSticker.label}
                  </p>
                )}
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setText('');
                  setPhoto('');
                  setSelectedSticker(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="flex-1 h-14 flex items-center justify-center rounded-pill border border-border-light text-[#6B6560] text-base font-medium hover:bg-accent-soft transition-colors active:scale-[0.98]"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid || submitting || overlaying}
                className="flex-1 h-14 flex items-center justify-center rounded-pill bg-accent-primary text-white text-base font-medium disabled:bg-border-light disabled:cursor-not-allowed active:scale-[0.98] transition-all"
              >
                {overlaying ? '生成中...' : submitting ? '提交中...' : '提交更新'}
              </button>
            </div>
          </div>
        )}

        {/* 时间线 */}
        <div>
          <h3 className="text-base font-medium text-[#6B6560] mb-4">
            活动时间线
            {sortedUpdates.length > 0 && (
              <span className="ml-1 text-text-tertiary">({sortedUpdates.length})</span>
            )}
          </h3>

          {sortedUpdates.length === 0 ? (
            <div className="bg-card-bg rounded-card p-8 shadow-soft text-center">
              <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[#6B6560] text-base">暂无状态更新</p>
              <p className="text-text-tertiary text-sm mt-1">点击上方按钮添加第一条更新</p>
            </div>
          ) : (
            <div className="relative">
              {/* 时间线竖线 */}
              <div className="absolute left-5 top-0 bottom-0 w-px bg-border-light" />

              <div className="flex flex-col gap-4">
                {sortedUpdates.map((update) => (
                  <div key={update.id} className="relative pl-12">
                    {/* 时间线圆点 */}
                    <div className="absolute left-[14px] top-1.5 w-3 h-3 rounded-full bg-card-bg border-2 border-border-light z-10" />

                    {/* 更新卡片 */}
                    <div className="bg-card-bg rounded-card p-4 shadow-soft">
                      {/* 时间戳 */}
                      <div className="text-sm text-[#6B6560] mb-2">
                        {formatTime(update.timestamp)}
                      </div>

                      {/* 文字内容 */}
                      {update.text && (
                        <p className="text-base text-text-primary leading-relaxed mb-3">
                          {update.text}
                        </p>
                      )}

                      {/* 照片 */}
                      {update.photo && (
                        <div className="rounded-input overflow-hidden mb-2">
                          <img
                            src={update.photo}
                            alt="状态照片"
                            className="w-full object-cover max-h-64"
                          />
                        </div>
                      )}

                      {/* 出图预览 */}
                      {update.overlaidPhoto && (
                        <div className="rounded-input overflow-hidden border border-accent-primary/30">
                          <img
                            src={update.overlaidPhoto}
                            alt="数字孪生出图"
                            className="w-full object-cover max-h-48"
                          />
                          {update.heritageStyle && (
                            <div className="px-3 py-1.5 bg-accent-soft text-sm text-accent-primary">
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
        </div>
      </div>
    </div>
  );
}
