import { useEffect, useRef, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

function StatusBar() {
  return (
    <div className="absolute top-0 left-0 right-0 h-[54px] flex justify-between items-center px-7 pt-[18px] font-[family-name:var(--font-en-sans)] text-[15px] font-semibold text-text-primary z-40 pointer-events-none">
      <span>9:41</span>
      <span className="inline-flex gap-[5px] items-center">
        <svg width="18" height="11" viewBox="0 0 18 11"><path d="M1 7h2v3H1zM5 5h2v5H5zM9 3h2v7H9zM13 1h2v9h-2z" fill="currentColor"/></svg>
        <svg width="16" height="11" viewBox="0 0 16 11"><path d="M8 2.5C5 2.5 2.3 3.7.5 5.5L2 7C3.6 5.4 5.7 4.5 8 4.5s4.4.9 6 2.5l1.5-1.5C13.7 3.7 11 2.5 8 2.5zM8 6.5c-1.4 0-2.7.5-3.7 1.5L8 11l3.7-3c-1-1-2.3-1.5-3.7-1.5z" fill="currentColor"/></svg>
        <svg width="26" height="12" viewBox="0 0 26 12">
          <rect x="0.5" y="0.5" width="22" height="11" rx="2.5" fill="none" stroke="currentColor" opacity="0.5"/>
          <rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor"/>
          <rect x="23" y="4" width="2" height="4" rx="0.5" fill="currentColor" opacity="0.5"/>
        </svg>
      </span>
    </div>
  )
}

export default function PhoneFrame({ children }: { children: ReactNode }) {
  const location = useLocation()
  const screenRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = screenRef.current
    if (!el) return
    el.style.animation = 'none'
    requestAnimationFrame(() => {
      el.style.animation = 'page-enter 320ms cubic-bezier(.4,0,.2,1) both'
    })
  }, [location.pathname])

  return (
    <>
      {/* Desktop: iPhone frame */}
      <div className="hidden md:flex min-h-screen items-center justify-center p-6"
        style={{ background: 'radial-gradient(ellipse at 20% 0%, rgba(255,255,255,0.55) 0%, transparent 55%), radial-gradient(ellipse at 85% 100%, rgba(232,239,235,0.45) 0%, transparent 55%), var(--color-primary-bg)' }}>
        <div className="relative w-[393px] h-[852px] bg-[#1a1a1a] rounded-[54px] p-[11px] shadow-[0_8px_32px_rgba(62,58,54,0.1),0_0_0_1px_rgba(0,0,0,0.05)] flex-shrink-0">
          <div className="absolute left-[-2px] top-[180px] w-[3px] h-[60px] bg-[#2a2a2a] rounded-[2px]" />
          <div className="absolute top-[11px] left-1/2 -translate-x-1/2 w-[120px] h-[32px] bg-[#1a1a1a] rounded-[20px] z-50" />
          <div className="w-full h-full bg-primary-bg rounded-[44px] overflow-hidden relative">
            <StatusBar />
            <div ref={screenRef} className="absolute inset-0 overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: fullscreen */}
      <div className="md:hidden min-h-screen bg-primary-bg">
        {children}
      </div>
    </>
  )
}
