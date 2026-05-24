import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPetByTagIdOrDemo } from '../utils/storage'
import type { Pet } from '../types'

// 4 个站点（手绘地图上的圆点位置，单位 % 相对 SVG viewBox 300x180）
type Station = {
  x: number
  y: number
  time: string
  label: string
  size: number
  color: string
  align: 'left' | 'right' | 'center'
}

const STATIONS: Station[] = [
  { x: 14, y: 70, time: '8:30',  label: '山居',  size: 14, color: '#6B8E7F', align: 'center' },
  { x: 38, y: 50, time: '10:15', label: '廊桥',  size: 12, color: '#8B6F47', align: 'center' },
  { x: 66, y: 75, time: '15:30', label: '古厝',  size: 12, color: '#C4915C', align: 'center' },
  { x: 88, y: 58, time: '18:00', label: '归',    size: 14, color: '#6B8E7F', align: 'center' },
]

function HandDrawnMap() {
  return (
    <div className="relative w-full h-[220px] rounded-card bg-[#FAF7F2] overflow-hidden border border-border-light/50">
      {/* 远景山 + 轨迹 */}
      <svg
        viewBox="0 0 300 180"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* 远景山影 (淡) */}
        <path
          d="M0 110 Q40 70 80 90 Q120 60 160 80 Q200 55 240 75 Q280 60 300 80 V180 H0 Z"
          fill="#B5C7BC"
          opacity="0.4"
        />
        {/* 近景山影 */}
        <path
          d="M0 130 Q50 95 100 115 Q150 90 200 110 Q250 95 300 115 V180 H0 Z"
          fill="#9FB5A8"
          opacity="0.4"
        />
        {/* 田野/底色 */}
        <rect x="0" y="155" width="300" height="25" fill="#E8DCC8" opacity="0.35" />

        {/* 虚线轨迹 — 连接 4 个站点 */}
        <path
          d="M 42 126 Q 80 95, 114 90 T 198 135 T 264 104"
          stroke="#C4915C"
          strokeWidth="1.8"
          fill="none"
          strokeDasharray="4 3"
          strokeLinecap="round"
        />

        {/* 散落的小植被点缀（古朴感） */}
        <g fill="#7A9586" opacity="0.35">
          <circle cx="20" cy="148" r="2" />
          <circle cx="55" cy="162" r="1.8" />
          <circle cx="135" cy="155" r="2.2" />
          <circle cx="180" cy="170" r="1.6" />
          <circle cx="230" cy="160" r="2" />
          <circle cx="275" cy="168" r="1.8" />
        </g>
      </svg>

      {/* 4 个站点圆点（绝对定位，半径自适应） */}
      {STATIONS.map((s, i) => (
        <div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
        >
          <div
            className="rounded-full border-[2px] border-white shadow-[0_2px_6px_rgba(62,58,54,0.18)]"
            style={{
              width: s.size,
              height: s.size,
              background: s.color,
            }}
          />
          <div className="mt-1.5 font-[family-name:var(--font-sans)] text-[9px] text-text-primary leading-tight text-center whitespace-nowrap">
            <div className="font-medium">{s.label}</div>
            <div className="text-text-tertiary mt-0.5">{s.time}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function HealthCell({
  label,
  value,
  unit,
  color,
  status,
  showBar,
  barPercent,
}: {
  label: string
  value: string
  unit?: string
  color: string
  status?: string
  showBar?: boolean
  barPercent?: number
}) {
  return (
    <div>
      <div className="font-[family-name:var(--font-sans)] text-[11px] text-text-tertiary tracking-[0.04em] mb-1">
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className="font-[family-name:var(--font-serif)] text-[20px] font-medium leading-none"
          style={{ color }}
        >
          {value}
        </span>
        {unit && (
          <span className="font-[family-name:var(--font-sans)] text-[11px] text-text-tertiary">{unit}</span>
        )}
      </div>
      {showBar ? (
        <div className="mt-2 h-[3px] rounded-full bg-[#E8EFEB] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${barPercent ?? 0}%`, background: color, opacity: 0.65 }}
          />
        </div>
      ) : status ? (
        <div className="mt-1.5 font-[family-name:var(--font-sans)] text-[10px] text-accent-primary">
          ✓ {status}
        </div>
      ) : null}
    </div>
  )
}

export default function FootprintPage() {
  const { tagId } = useParams<{ tagId: string }>()
  const navigate = useNavigate()
  const [pet, setPet] = useState<Pet | null>(null)
  const [toastMsg, setToastMsg] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setPet(getPetByTagIdOrDemo(tagId))
  }, [tagId])

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
    }
  }, [])

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setToastVisible(true)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastVisible(false), 1800)
  }

  const petName = pet?.name || '豆豆'

  return (
    <div className="w-full h-full flex flex-col relative bg-primary-bg">
      {/* Toast */}
      <div
        className={`absolute left-1/2 top-[60px] -translate-x-1/2 z-[70] bg-[rgba(62,58,54,0.92)] text-white px-5 py-2.5 rounded-pill font-[family-name:var(--font-sans)] text-[13px] tracking-[0.02em] shadow-lift transition-all duration-[220ms] pointer-events-none ${
          toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
      >
        {toastMsg}
      </div>

      {/* Top nav (56px) */}
      <nav className="h-14 px-3 grid grid-cols-[48px_1fr_48px] items-center flex-shrink-0">
        <button
          type="button"
          onClick={() => (tagId ? navigate(`/diary/${tagId}`) : navigate(-1))}
          className="w-10 h-10 rounded-full flex items-center justify-center text-text-primary hover:bg-[rgba(62,58,54,0.06)] transition-colors"
          title="返回"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <div className="text-center font-[family-name:var(--font-serif)] text-[16px] font-medium text-text-primary tracking-[0.02em]">
          {petName}的今日足迹
        </div>
        <button
          type="button"
          onClick={() => showToast('分享链接已复制')}
          className="justify-self-end w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-[rgba(62,58,54,0.06)] transition-colors"
          title="分享"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
            <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
          </svg>
        </button>
      </nav>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-[100px]" style={{ scrollbarWidth: 'none' }}>
        {/* Status card */}
        <section className="px-6 pt-4">
          <div
            className="h-20 rounded-card px-5 flex items-center justify-between border border-border-light/50"
            style={{ background: 'linear-gradient(135deg, #E8EFEB 0%, #F5EFE6 100%)' }}
          >
            <div className="min-w-0">
              <div className="font-[family-name:var(--font-sans)] text-[11px] text-accent-wood/85 tracking-[0.04em]">
                Day 3 · 5 月 27 日
              </div>
              <div className="mt-1 font-[family-name:var(--font-serif)] text-[16px] font-medium text-text-primary leading-tight">
                有福带{petName} · 一日游
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-white shadow-[0_2px_8px_rgba(139,111,71,0.18)] overflow-hidden bg-accent-cream flex-shrink-0">
              <img src="/assets/youfu/avatar-youfu.png" alt="有福" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* Section 1 · 今日走过的路 */}
        <section className="px-6 pt-6">
          <h2 className="font-[family-name:var(--font-serif)] text-[14px] font-medium text-accent-wood mb-3 flex items-center gap-1.5">
            <span>📍</span>
            <span>今日走过的路</span>
          </h2>

          <HandDrawnMap />

          {/* 3 data cards */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[
              { num: '1.2', unit: 'km', label: '活动距离', color: '#6B8E7F' },
              { num: '4',   unit: '处', label: '探访景点', color: '#8B6F47' },
              { num: '9.5', unit: 'h',  label: '出行时间', color: '#C4915C' },
            ].map((c) => (
              <div key={c.label} className="h-14 rounded-[10px] bg-card-bg px-2 flex flex-col justify-center items-center border border-border-light/50">
                <div className="flex items-baseline gap-0.5">
                  <span className="font-[family-name:var(--font-serif)] text-[18px] font-medium leading-none" style={{ color: c.color }}>
                    {c.num}
                  </span>
                  <span className="font-[family-name:var(--font-sans)] text-[11px]" style={{ color: c.color }}>
                    {c.unit}
                  </span>
                </div>
                <div className="mt-1 font-[family-name:var(--font-sans)] text-[10px] text-text-secondary tracking-[0.04em]">
                  {c.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2 · 健康状态 */}
        <section className="px-6 pt-8">
          <h2 className="font-[family-name:var(--font-serif)] text-[14px] font-medium text-accent-wood mb-3 flex items-center gap-1.5">
            <span>🐾</span>
            <span>健康状态</span>
            <span className="text-text-tertiary text-[12px] font-normal font-[family-name:var(--font-sans)]">· 由项圈实时记录</span>
          </h2>

          <div className="rounded-card bg-card-bg p-4 border border-border-light/50 shadow-soft">
            <div className="grid grid-cols-2 gap-4">
              <HealthCell
                label="活动度"
                value="87"
                unit="/100"
                color="#6B8E7F"
                showBar
                barPercent={87}
              />
              <HealthCell
                label="心率"
                value="120"
                unit="bpm"
                color="#C4915C"
                status="健康"
              />
              <HealthCell
                label="睡眠"
                value="14"
                unit="h"
                color="#8B6F47"
                status="充足"
              />
              <HealthCell
                label="进食"
                value="3"
                unit="次"
                color="#6B8E7F"
                status="规律"
              />
            </div>
          </div>
        </section>

        {/* Section 3 · 有福的话 */}
        <section className="px-6 pt-6">
          <div
            className="rounded-card p-4 border-l-[3px] border-accent-shimmer"
            style={{ background: 'linear-gradient(135deg, #FFF4E6 0%, #FAF7F2 100%)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-accent-shimmer flex items-center justify-center text-[12px]">
                🐱
              </div>
              <span className="font-[family-name:var(--font-sans)] text-[11px] font-medium text-accent-wood tracking-[0.04em]">
                有福的话
              </span>
            </div>
            <p className="font-[family-name:var(--font-serif)] italic text-[13px] leading-[1.75] text-text-primary m-0">
              这只城里客人今天表现还行,<br />
              第一次见廊桥呆站 5 分钟。<br />
              晚上回来后心率比早上慢了,<br />
              看来她也开始放松了。
            </p>
          </div>
        </section>
      </div>

      {/* Bottom dual buttons */}
      <div className="absolute left-0 right-0 bottom-0 pt-3 pb-6 px-6 bg-primary-bg flex gap-3">
        <button
          type="button"
          onClick={() => (tagId ? navigate(`/diary/${tagId}`) : navigate(-1))}
          className="flex-1 h-[44px] rounded-pill border border-accent-primary text-accent-primary font-[family-name:var(--font-sans)] text-[14px] font-medium active:scale-[0.98] transition-transform"
        >
          查看完整日记
        </button>
        <button
          type="button"
          onClick={() => showToast('足迹已保存到相册')}
          className="flex-1 h-[44px] rounded-pill bg-accent-primary text-white font-[family-name:var(--font-sans)] text-[14px] font-medium shadow-[0_4px_14px_rgba(107,142,127,0.3)] active:scale-[0.98] transition-transform"
        >
          保存这份足迹
        </button>
      </div>
    </div>
  )
}
