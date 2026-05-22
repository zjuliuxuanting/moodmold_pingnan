import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getPetByTagId, savePet } from '../utils/storage';

type UIState = 'checking' | 'brand-splash' | 'form' | 'submitting';

export default function BindPage() {
  const { tagId } = useParams<{ tagId: string }>();
  const navigate = useNavigate();
  const [uiState, setUIState] = useState<UIState>('checking');
  const [petName, setPetName] = useState('');
  const [photo, setPhoto] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!tagId) return;
    const existing = getPetByTagId(tagId);
    if (existing) {
      navigate(`/pet/${tagId}`, { replace: true });
      return;
    }
    setUIState('brand-splash');
    const timer = setTimeout(() => setUIState('form'), 3000);
    return () => clearTimeout(timer);
  }, [tagId, navigate]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!tagId || !petName.trim()) return;
    setUIState('submitting');
    setTimeout(() => {
      savePet({
        tagId,
        name: petName.trim(),
        photo,
        checkinDate: new Date().toISOString(),
        status: 'active',
      });
      navigate(`/pet/${tagId}`, { replace: true });
    }, 2000);
  };

  if (uiState === 'checking' && !tagId) {
    return (
      <div className="min-h-screen bg-primary-bg flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <div className="text-6xl mb-6">🐾</div>
          <h2 className="text-xl font-serif text-text-primary mb-2">缺少挂牌编号</h2>
          <p className="text-text-secondary text-sm mb-8">请扫描正确的二维码或联系托管方获取挂牌编号</p>
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

  if (uiState === 'checking') {
    return (
      <div className="min-h-screen bg-card-bg flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-border-light border-t-accent-primary mb-6" />
        <p className="text-text-secondary text-sm">正在检查绑定状态...</p>
      </div>
    );
  }

  if (uiState === 'brand-splash') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-card-bg">
        <div
          className="flex flex-col items-center"
          style={{ animation: 'brandFadeIn 0.8s ease-out forwards' }}
        >
          <div className="text-4xl font-serif tracking-wider text-text-primary mb-2 select-none">
            Moodmold
          </div>
          <div className="h-1 w-14 bg-accent-primary rounded-full mb-8" />
        </div>
        <div
          className="flex items-center gap-1 text-text-secondary text-sm"
          style={{ animation: 'brandFadeIn 0.8s 0.3s ease-out both' }}
        >
          <span>正在建立连接</span>
          <span className="inline-flex gap-0.5">
            <span className="inline-block w-1 h-1 rounded-full bg-text-tertiary" style={{ animation: 'dotPulse 1.4s ease-in-out infinite' }} />
            <span className="inline-block w-1 h-1 rounded-full bg-text-tertiary" style={{ animation: 'dotPulse 1.4s 0.2s ease-in-out infinite' }} />
            <span className="inline-block w-1 h-1 rounded-full bg-text-tertiary" style={{ animation: 'dotPulse 1.4s 0.4s ease-in-out infinite' }} />
          </span>
        </div>
      </div>
    );
  }

  if (uiState === 'submitting') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-card-bg px-6">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-border-light border-t-accent-primary mb-8" />
        <p className="text-text-primary text-base">正在为宠物建立数字身份...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-serif text-text-primary mb-1">绑定宠物</h2>
        <p className="text-text-secondary text-sm mb-8">挂牌编号：{tagId}</p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-text-primary mb-2">
            宠物照片
          </label>
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
                alt="宠物照片预览"
                className="w-full h-56 object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setPhoto('');
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
              className="w-full h-56 border-2 border-dashed border-border-light rounded-card flex flex-col items-center justify-center text-text-secondary hover:border-accent-primary hover:text-text-primary transition-colors bg-card-bg"
            >
              <svg
                className="w-12 h-12 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="text-sm">点击上传照片</span>
            </button>
          )}
        </div>

        <div className="mb-8">
          <label
            htmlFor="petName"
            className="block text-sm font-medium text-text-primary mb-2"
          >
            宠物名字
          </label>
          <input
            id="petName"
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            placeholder="请输入宠物名字"
            className="w-full h-[52px] px-4 rounded-input border border-border-light focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none text-text-primary placeholder-text-tertiary transition-colors bg-card-bg"
            autoFocus
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!petName.trim()}
          className="w-full h-[52px] flex items-center justify-center rounded-pill bg-accent-primary text-white font-medium text-base disabled:bg-border-light disabled:cursor-not-allowed active:scale-[0.98] transition-all"
        >
          完成绑定
        </button>
      </div>
    </div>
  );
}
