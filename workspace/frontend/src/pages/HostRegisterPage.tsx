import { useNavigate, Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { savePet, getPetByTagId } from '../utils/storage';

export default function HostRegisterPage() {
  const navigate = useNavigate();
  const [tagId, setTagId] = useState('');
  const [petName, setPetName] = useState('');
  const [photo, setPhoto] = useState('');
  const [tagIdError, setTagIdError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    const trimmedTag = tagId.trim();
    if (!trimmedTag) {
      setTagIdError('请输入挂牌编号');
      return;
    }
    const existing = getPetByTagId(trimmedTag);
    if (existing) {
      setTagIdError('该挂牌编号已绑定宠物');
      return;
    }
    setTagIdError('');
    setSubmitting(true);
    setTimeout(() => {
      savePet({
        tagId: trimmedTag,
        name: petName.trim() || '未命名',
        photo,
        checkinDate: new Date().toISOString(),
        status: 'active',
      });
      navigate(`/host/update/${encodeURIComponent(trimmedTag)}`, { replace: true });
    }, 1200);
  };

  const isFormValid = tagId.trim().length > 0 && !tagIdError;

  if (submitting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-card-bg px-6">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-border-light border-t-accent-primary mb-6" />
        <p className="text-text-primary text-base">正在录入宠物信息...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg flex flex-col px-6 py-12">
      <div className="w-full max-w-sm mx-auto">
        {/* 顶部导航 */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            to="/host"
            className="w-8 h-8 rounded-input bg-card-bg flex items-center justify-center shadow-soft hover:shadow transition-shadow shrink-0"
          >
            <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-serif text-text-primary">录入宠物</h1>
            <p className="text-text-secondary text-sm">添加新寄养宠物信息</p>
          </div>
        </div>

        {/* 挂牌编号 */}
        <div className="bg-card-bg rounded-card p-5 mb-4 shadow-soft">
          <label
            htmlFor="tagId"
            className="block text-sm font-medium text-text-primary mb-2"
          >
            挂牌编号 <span className="text-red-400">*</span>
          </label>
          <input
            id="tagId"
            type="text"
            value={tagId}
            onChange={(e) => {
              setTagId(e.target.value);
              if (tagIdError) setTagIdError('');
            }}
            placeholder="请输入宠物挂牌编号"
            className="w-full h-[52px] px-4 rounded-input border border-border-light focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none text-text-primary placeholder-text-tertiary transition-colors"
            autoFocus
          />
          {tagIdError && (
            <p className="text-red-500 text-xs mt-2">{tagIdError}</p>
          )}
        </div>

        {/* 宠物照片 */}
        <div className="bg-card-bg rounded-card p-5 mb-4 shadow-soft">
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
                className="w-full h-48 object-cover"
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
              className="w-full h-48 border-2 border-dashed border-border-light rounded-card flex flex-col items-center justify-center text-text-secondary hover:border-accent-primary hover:text-text-primary transition-colors"
            >
              <svg
                className="w-10 h-10 mb-2"
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

        {/* 宠物名字 */}
        <div className="bg-card-bg rounded-card p-5 mb-8 shadow-soft">
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
            placeholder="请输入宠物名字（选填）"
            className="w-full h-[52px] px-4 rounded-input border border-border-light focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none text-text-primary placeholder-text-tertiary transition-colors"
          />
        </div>

        {/* 提交按钮 */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="w-full h-[52px] flex items-center justify-center rounded-pill bg-accent-primary text-white font-medium text-base disabled:bg-border-light disabled:cursor-not-allowed active:scale-[0.98] transition-all"
        >
          确认录入
        </button>
      </div>
    </div>
  );
}
