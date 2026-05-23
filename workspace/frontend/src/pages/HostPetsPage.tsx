import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import QRCode from 'qrcode'

interface PetTask {
  label: string
  status: 'done' | 'pending-strong' | 'pending' | 'important'
}

interface PetCardData {
  tagId: string
  name: string
  breed: string
  day: number
  totalDays: number
  isNew: boolean
  tasks: PetTask[]
}

const PET_AVATARS: Record<string, string> = {
  doudou: '/assets/doudou/doudou.png',
  xiaohua: '/assets/xiaohua/xiaohua.png',
}

const mockPets: PetCardData[] = [
  {
    tagId: 'doudou',
    name: '豆豆',
    breed: '橘猫',
    day: 3,
    totalDays: 7,
    isNew: false,
    tasks: [
      { label: '喂早餐', status: 'done' },
      { label: '拍照打卡', status: 'pending-strong' },
      { label: '喂午餐', status: 'pending' },
      { label: '状态提交', status: 'important' },
    ],
  },
  {
    tagId: 'xiaohua',
    name: '小花',
    breed: '柴犬',
    day: 1,
    totalDays: 5,
    isNew: true,
    tasks: [
      { label: '喂早餐', status: 'done' },
      { label: '拍照打卡', status: 'pending-strong' },
      { label: '喂午餐', status: 'pending' },
      { label: '状态提交', status: 'important' },
    ],
  },
]

function CollarBindModal({
  pet,
  open,
  onClose,
}: {
  pet: PetCardData
  open: boolean
  onClose: () => void
}) {
  const navigate = useNavigate()
  const [stage, setStage] = useState<'qr' | 'scanning' | 'done'>('qr')
  const [qrDataUrl, setQrDataUrl] = useState('')

  useEffect(() => {
    if (!open) return
    setStage('qr')
    const collarCode = `MOODMOLD-COLLAR-${Date.now().toString(36).toUpperCase()}`
    QRCode.toDataURL(collarCode, {
      width: 220,
      margin: 2,
      color: { dark: '#3E3A36', light: '#FFFFFF' },
    }).then(setQrDataUrl)
  }, [open])

  const handleSimulateScan = useCallback(() => {
    setStage('scanning')
    setTimeout(() => setStage('done'), 1500)
  }, [])

  const handleGoToPet = useCallback(() => {
    onClose()
    navigate(`/pet/${pet.tagId}`)
  }, [navigate, onClose, pet.tagId])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center">
      <div className="absolute inset-0 bg-[rgba(62,58,54,0.45)]" onClick={onClose} />
      <div className="relative w-full max-w-[393px] bg-card-bg rounded-t-[24px] px-6 pt-4 pb-8 animate-[sheetUp_280ms_cubic-bezier(.4,0,.2,1)_both]">
        <div className="w-9 h-1 bg-border-light rounded-sm mx-auto mb-5" />

        {stage === 'qr' && (
          <div className="flex flex-col items-center gap-4">
            <h3 className="font-[family-name:var(--font-serif)] text-lg font-medium text-text-primary">
              绑定项圈 · {pet.name}
            </h3>
            <p className="font-[family-name:var(--font-sans)] text-sm text-text-secondary text-center leading-relaxed">
              请用手机扫描项圈上的二维码<br />完成智能项圈与宠物档案的配对
            </p>
            <div className="bg-white rounded-card p-4 shadow-base border border-border-light">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="项圈绑定码" className="w-[220px] h-[220px]" />
              ) : (
                <div className="w-[220px] h-[220px] flex items-center justify-center">
                  <span className="font-[family-name:var(--font-sans)] text-sm text-text-tertiary">生成中...</span>
                </div>
              )}
            </div>
            <div className="flex gap-3 w-full">
              <button type="button" onClick={onClose} className="flex-1 h-12 rounded-pill border border-border-light text-text-secondary font-[family-name:var(--font-sans)] text-sm font-medium active:scale-[0.98] transition-transform">
                取消
              </button>
              <button type="button" onClick={handleSimulateScan} className="flex-1 h-12 rounded-pill bg-accent-primary text-white font-[family-name:var(--font-sans)] text-sm font-medium shadow-[0_4px_14px_rgba(107,142,127,0.28)] active:scale-[0.98] transition-transform">
                模拟扫描成功
              </button>
            </div>
          </div>
        )}

        {stage === 'scanning' && (
          <div className="flex flex-col items-center gap-5 py-8">
            <div className="relative w-[100px] h-[100px] flex items-center justify-center">
              {[0, 1, 2].map((i) => (
                <div key={i} className="absolute w-[100px] h-[100px] rounded-full border-[2px] border-accent-primary opacity-0"
                  style={{ animation: `ring-pulse 1.6s ease-out infinite`, animationDelay: `${i * 0.4}s` }} />
              ))}
              <div className="w-16 h-16 rounded-full bg-accent-primary flex items-center justify-center text-white z-[2]">
                <svg className="animate-spin" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              </div>
            </div>
            <p className="font-[family-name:var(--font-sans)] text-base text-text-primary font-medium">正在同步项圈数据...</p>
            <p className="font-[family-name:var(--font-sans)] text-sm text-text-secondary">GPS · 体温 · 活动量</p>
          </div>
        )}

        {stage === 'done' && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-20 h-20 rounded-full bg-accent-primary flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </div>
            <h3 className="font-[family-name:var(--font-serif)] text-lg font-medium text-text-primary">项圈绑定成功</h3>
            <p className="font-[family-name:var(--font-sans)] text-sm text-text-secondary text-center leading-relaxed">
              {pet.name}的智能项圈已激活<br />现在可以实时查看定位、体温和活动量
            </p>
            <div className="flex gap-3 w-full mt-2">
              <button type="button" onClick={onClose} className="flex-1 h-12 rounded-pill border border-border-light text-text-secondary font-[family-name:var(--font-sans)] text-sm font-medium active:scale-[0.98] transition-transform">
                返回列表
              </button>
              <button type="button" onClick={handleGoToPet} className="flex-1 h-12 rounded-pill bg-accent-primary text-white font-[family-name:var(--font-sans)] text-sm font-medium shadow-[0_4px_14px_rgba(107,142,127,0.28)] active:scale-[0.98] transition-transform">
                查看{pet.name}主页
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes ring-pulse { 0% { transform: scale(0.6); opacity: 0.6; } 100% { transform: scale(1.4); opacity: 0; } }
      `}</style>
    </div>
  )
}

export default function HostPetsPage() {
  const navigate = useNavigate()
  const [toastMsg, setToastMsg] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})
  const [bindModalPet, setBindModalPet] = useState<PetCardData | null>(null)

  const totalTasks = mockPets.reduce((sum, p) => sum + p.tasks.length, 0)
  const doneTasks = mockPets.reduce(
    (sum, p) => sum + p.tasks.filter((t) => t.status === 'done').length,
    0,
  )

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 1800)
  }

  const toggleExpand = (tagId: string) => {
    setExpandedCards((prev) => ({ ...prev, [tagId]: !prev[tagId] }))
  }

  const progressPercent = (day: number, totalDays: number) =>
    Math.round((day / totalDays) * 100)

  return (
    <div className="relative h-full">
      {bindModalPet && (
        <CollarBindModal
          pet={bindModalPet}
          open={!!bindModalPet}
          onClose={() => setBindModalPet(null)}
        />
      )}

      {/* Toast */}
      <div
        className={`absolute left-1/2 top-[110px] -translate-x-1/2 z-50 px-[22px] py-[14px] rounded-pill text-white text-[16px] font-medium tracking-[0.02em] shadow-[0_8px_32px_rgba(62,58,54,0.1)] max-w-[84%] text-center pointer-events-none transition-all duration-[220ms] ease-out ${
          toastVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-3'
        }`}
        style={{ background: 'rgba(62, 58, 54, 0.92)' }}
      >
        {toastMsg}
      </div>

      {/* Scrollable content */}
      <div
        className="h-full overflow-y-auto pt-[54px] pb-8 bg-primary-bg
        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {/* Top nav · 64px */}
        <nav
          className="h-16 px-4 grid items-center gap-2"
          style={{ gridTemplateColumns: '48px 1fr 60px' }}
        >
          <button
            onClick={() => navigate('/host')}
            className="w-12 h-12 rounded-full flex items-center justify-center text-text-primary hover:bg-[rgba(62,58,54,0.06)] transition-colors duration-[150ms]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6"/>
            </svg>
          </button>
          <div className="text-center text-[20px] font-semibold tracking-[0.02em] text-text-primary">
            今日宠物
          </div>
          <button
            onClick={() => showToast('查看历史寄养记录 即将开放')}
            className="justify-self-end text-[16px] font-medium text-accent-primary inline-flex items-center gap-0.5 px-[6px] py-2 hover:text-[#5d8071] transition-colors duration-[150ms]"
          >
            全部
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6"/>
            </svg>
          </button>
        </nav>

        {/* Stats row */}
        <div className="px-6 pt-4 text-[16px] hcolor-text-secondary leading-[1.5]">
          今天总共{' '}
          <span className="text-text-primary font-semibold">{mockPets.length} 位客人</span>
          <span className="mx-[6px] text-accent-wood opacity-55">·</span>
          <span>
            已完成{' '}
            <span className="text-accent-wood font-semibold">{doneTasks}</span> / {totalTasks} 项任务
          </span>
        </div>

        {/* Pet cards */}
        <section className="px-6 pt-6 flex flex-col gap-4">
          {mockPets.map((pet, idx) => (
            <article
              key={pet.tagId}
              className={`min-h-[240px] bg-card-bg rounded-card shadow-base overflow-hidden flex flex-col animate-cell-enter`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Top portrait band */}
              <div
                className="min-h-[90px] px-4 flex items-center gap-2.5 py-2"
                style={{
                  background: pet.isNew
                    ? 'var(--color-shimmer-bg)'
                    : 'var(--color-accent-soft)',
                }}
              >
                {/* Avatar — click opens collar bind modal */}
                <button
                  type="button"
                  className="w-20 h-20 rounded-full border-2 border-accent-wood shrink-0 overflow-hidden flex items-center justify-center relative cursor-pointer active:scale-[0.96] transition-transform bg-accent-cream"
                  style={{
                    boxShadow: '0 3px 12px rgba(139,111,71,0.18)',
                  }}
                  onClick={() => setBindModalPet(pet)}
                  aria-label={`绑定${pet.name}的项圈`}
                >
                  {PET_AVATARS[pet.tagId] ? (
                    <img
                      src={PET_AVATARS[pet.tagId]}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                  ) : pet.tagId === 'xiaohua' ? (
                    <span className="block w-full h-full relative">
                      <span className="absolute w-[6px] h-[6px] rounded-full bg-[rgba(62,58,54,0.7)] top-[36%] left-[30%]" />
                      <span className="absolute w-[6px] h-[6px] rounded-full bg-[rgba(62,58,54,0.7)] top-[36%] right-[30%]" />
                      <span className="absolute left-1/2 top-[48%] -translate-x-1/2 w-3 h-2 rounded-full"
                        style={{ background: 'rgba(62,58,54,0.8)' }} />
                      <span className="absolute left-[44%] top-[57%] w-4 h-3 rounded-b-full"
                        style={{ background: 'rgba(62,58,54,0.55)' }} />
                    </span>
                  ) : (
                    <span className="block w-full h-full relative">
                      <span className="absolute w-[6px] h-[6px] rounded-full bg-[rgba(62,58,54,0.7)] top-[38%] left-[32%]" />
                      <span className="absolute w-[6px] h-[6px] rounded-full bg-[rgba(62,58,54,0.7)] top-[38%] right-[32%]" />
                      <span className="absolute left-1/2 top-[54%] -translate-x-1/2"
                        style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '5px solid rgba(139,90,60,0.85)' }} />
                    </span>
                  )}
                </button>

                {/* Meta info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[24px] font-semibold text-text-primary leading-[1.2] tracking-[0.02em]">
                      {pet.name}
                    </span>
                    {pet.isNew && (
                      <span className="inline-flex items-center h-6 px-[10px] rounded-pill bg-accent-wood text-white text-[14px] font-medium tracking-[0.04em]">
                        Day {pet.day} 新到
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-[16px] hcolor-text-secondary leading-[1.4]">
                    {pet.breed}
                    <span className="mx-[6px] text-accent-wood opacity-55">·</span>
                    寄养 <span className="text-accent-wood font-semibold">Day {pet.day}</span> / 共 {pet.totalDays} 天
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 w-20 h-1 rounded-[2px] bg-[rgba(139,111,71,0.16)] overflow-hidden">
                    <div
                      className="h-full rounded-[2px] transition-all duration-500"
                      style={{
                        width: `${progressPercent(pet.day, pet.totalDays)}%`,
                        background: pet.isNew
                          ? 'var(--color-accent-wood)'
                          : 'var(--color-accent-primary)',
                      }}
                    />
                  </div>
                </div>

                {/* Bind collar button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setBindModalPet(pet)
                  }}
                  className="shrink-0 h-8 px-2.5 rounded-pill border border-accent-primary/60 text-accent-primary text-[12px] font-medium font-[family-name:var(--font-sans)] hover:bg-accent-soft active:scale-[0.96] transition-all flex items-center gap-0.5 whitespace-nowrap"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.91 11.84a8.56 8.56 0 0 0-1.28-4.63L17.79 8.5"/>
                    <path d="M21 12a9 9 0 1 1-3.72-7.36"/>
                    <path d="M12 2v4"/>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10"/>
                  </svg>
                  项圈
                </button>
              </div>

              {/* Tasks area */}
              <div className="p-5 pb-5 flex flex-col">
                <div className="text-[16px] font-semibold text-text-primary tracking-[0.02em] mb-3">
                  今日{pet.name}的任务
                </div>
                <ul
                  className="list-none m-0 p-0 grid gap-x-4 gap-y-[10px]"
                  style={{ gridTemplateColumns: '1fr 1fr' }}
                >
                  {pet.tasks.map((task, ti) => (
                    <li
                      key={ti}
                      className={`flex items-center gap-[10px] text-[16px] leading-[1.3] ${
                        task.status === 'done'
                          ? 'text-[#8A847D] line-through decoration-[#8A847D] font-normal'
                          : task.status === 'pending-strong'
                          ? 'text-text-primary font-semibold'
                          : task.status === 'important'
                          ? 'text-accent-wood font-semibold'
                          : 'text-text-primary font-normal'
                      }`}
                    >
                      {/* Checkbox */}
                      <span
                        className={`w-5 h-5 rounded-[5px] border-[1.5px] shrink-0 flex items-center justify-center ${
                          task.status === 'done'
                            ? 'bg-[#B0A89D] border-[#B0A89D] text-white'
                            : task.status === 'important'
                            ? 'border-accent-shimmer bg-[rgba(196,145,92,0.08)]'
                            : 'border-accent-wood bg-transparent text-transparent'
                        }`}
                      >
                        {task.status === 'done' && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12.5l4.5 4.5L19 7.5"/>
                          </svg>
                        )}
                      </span>
                      {task.label}
                      {task.status === 'important' && (
                        <svg className="w-[14px] h-[14px] text-accent-shimmer shrink-0 -ml-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M12 3 L13.2 9 L19 10.5 L13.2 12 L12 18 L10.8 12 L5 10.5 L10.8 9 Z"/>
                        </svg>
                      )}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => navigate(`/host/checkin/${pet.tagId}`)}
                  className="mt-4 w-full h-14 rounded-pill bg-accent-primary text-white text-[18px] font-semibold tracking-[0.02em] inline-flex items-center justify-center gap-2 active:translate-y-px active:scale-[0.99] transition-all duration-[120ms]"
                  style={{
                    boxShadow: '0 4px 14px rgba(107,142,127,0.28)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  为{pet.name}打卡
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                  </svg>
                </button>

                {/* Consumer quick entry links - collapsible */}
                <div className="mt-3 border-t border-border-light pt-3">
                  <button
                    onClick={() => toggleExpand(pet.tagId)}
                    className="w-full flex items-center justify-between text-xs text-accent-wood hover:text-accent-wood/80 transition-colors"
                  >
                    <span>消费者快捷入口</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform duration-200 ${expandedCards[pet.tagId] ? 'rotate-180' : ''}`}
                    >
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                  {expandedCards[pet.tagId] && (
                    <div className="mt-2 grid grid-cols-3 gap-1.5">
                      <Link
                        to={`/diary/${pet.tagId}`}
                        className="flex items-center justify-center py-1.5 px-0.5 rounded-pill border border-accent-wood/30 text-accent-wood text-[11px] leading-none hover:bg-accent-cream hover:border-accent-wood/60 transition-colors"
                      >
                        <span className="whitespace-nowrap">屏南日记</span>
                      </Link>
                      <Link
                        to={`/collection/${pet.tagId}`}
                        className="flex items-center justify-center py-1.5 px-0.5 rounded-pill border border-accent-wood/30 text-accent-wood text-[11px] leading-none hover:bg-accent-cream hover:border-accent-wood/60 transition-colors"
                      >
                        <span className="whitespace-nowrap">屏南收藏</span>
                      </Link>
                      <Link
                        to={`/card/${pet.tagId}`}
                        className="flex items-center justify-center py-1.5 px-0.5 rounded-pill border border-accent-wood/30 text-accent-wood text-[11px] leading-none hover:bg-accent-cream hover:border-accent-wood/60 transition-colors"
                      >
                        <span className="whitespace-nowrap truncate">寄养纪念卡</span>
                      </Link>
                      <Link
                        to={`/pass/${pet.tagId}`}
                        className="flex items-center justify-center py-1.5 px-0.5 rounded-pill border border-accent-wood/30 text-accent-wood text-[11px] leading-none hover:bg-accent-cream hover:border-accent-wood/60 transition-colors"
                      >
                        <span className="whitespace-nowrap">屏南通行证</span>
                      </Link>
                      <Link
                        to={`/checkin/${pet.tagId}`}
                        className="flex items-center justify-center py-1.5 px-0.5 rounded-pill border border-accent-wood/30 text-accent-wood text-[11px] leading-none hover:bg-accent-cream hover:border-accent-wood/60 transition-colors"
                      >
                        <span className="whitespace-nowrap">变装打卡</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Bottom note */}
        <p className="mx-8 mt-8 mb-8 text-center text-[16px] hcolor-text-secondary leading-[1.6] tracking-[0.02em]">
          <svg
            className="w-4 h-4 text-accent-wood inline-block align-[-3px] mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="6" width="18" height="13" rx="2"/>
            <path d="M3 8l9 6 9-6"/>
          </svg>
          完成所有任务后会自动发送日报给宠主
        </p>
      </div>

      <style>{`
        @keyframes cell-enter {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
