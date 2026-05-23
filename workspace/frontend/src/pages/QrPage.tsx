import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QRCode from 'qrcode'

const BASE_URL = 'https://moodmold-pingnan.vercel.app'

const qrItems = [
  { label: '品牌首页 · 总入口', url: `${BASE_URL}/`, desc: '评委 / 宠主扫码进入' },
  { label: '民宿端入口', url: `${BASE_URL}/host`, desc: '托管方演示扫码进入' },
]

export default function QrPage() {
  const navigate = useNavigate()
  const [qrImages, setQrImages] = useState<string[]>([])

  useEffect(() => {
    Promise.all(
      qrItems.map((item) =>
        QRCode.toDataURL(item.url, {
          width: 260,
          margin: 2,
          color: { dark: '#3E3A36', light: '#F5F1EA' },
        })
      )
    ).then(setQrImages)
  }, [])

  return (
    <div className="w-full h-full flex flex-col bg-primary-bg overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
      <nav className="h-14 px-4 grid grid-cols-[40px_1fr_40px] items-center flex-shrink-0">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-text-primary hover:bg-[rgba(62,58,54,0.06)] transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <div className="text-center font-[family-name:var(--font-serif)] text-base font-medium text-text-primary tracking-[0.03em]">
          演示二维码
        </div>
        <div />
      </nav>

      <div className="px-6 pt-6 pb-20 flex flex-col items-center gap-8">
        <p className="font-[family-name:var(--font-sans)] text-sm text-text-secondary text-center leading-relaxed">
          以下二维码指向 Moodmold 线上环境<br />
          用手机相机扫码即可打开对应页面
        </p>

        {qrItems.map((item, idx) => (
          <div key={item.label} className="flex flex-col items-center gap-3">
            <div
              className={`bg-card-bg rounded-card p-5 shadow-base ${
                qrImages[idx] ? '' : 'w-[260px] h-[260px] flex items-center justify-center'
              }`}
            >
              {qrImages[idx] ? (
                <img
                  src={qrImages[idx]}
                  alt={item.label}
                  className="w-[260px] h-[260px]"
                />
              ) : (
                <span className="font-[family-name:var(--font-sans)] text-sm text-text-tertiary">
                  生成中...
                </span>
              )}
            </div>
            <div className="text-center">
              <div className="font-[family-name:var(--font-serif)] text-[15px] font-medium text-text-primary">
                {item.label}
              </div>
              <div className="font-[family-name:var(--font-sans)] text-xs text-text-tertiary mt-1">
                {item.desc}
              </div>
              <div className="font-[family-name:var(--font-en-sans)] text-[11px] text-accent-wood mt-0.5 tracking-[0.04em]">
                {item.url}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
