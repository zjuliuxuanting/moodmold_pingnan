import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDemoHostPets } from '../utils/storage'

interface TaskItem {
  id: string
  time: string
  title: string
  pets: string
  important?: boolean
  done: boolean
  icon: 'done' | 'camera' | 'meal' | 'checkin'
  action: 'toast' | 'navigate-checkin' | 'navigate-pets'
  navigatePetId?: string
}

const tasks: TaskItem[] = [
  {
    id: 'breakfast',
    time: '上午 09:00',
    title: '喂早餐',
    pets: '豆豆、小花',
    done: true,
    icon: 'done',
    action: 'toast',
  },
  {
    id: 'photo-morning',
    time: '上午 10:00',
    title: '拍照打卡',
    pets: '豆豆 - 在院子里',
    important: true,
    done: false,
    icon: 'camera',
    action: 'navigate-checkin',
    navigatePetId: 'doudou',
  },
  {
    id: 'lunch',
    time: '下午 14:00',
    title: '喂午餐',
    pets: '豆豆、小花',
    done: false,
    icon: 'meal',
    action: 'navigate-pets',
  },
  {
    id: 'photo-evening',
    time: '下午 17:00',
    title: '拍照 + 状态提交',
    pets: '豆豆、小花',
    important: true,
    done: false,
    icon: 'checkin',
    action: 'navigate-checkin',
    navigatePetId: 'doudou',
  },
]

export default function HostPage() {
  const navigate = useNavigate()
  const [toastMsg, setToastMsg] = useState('')
  const [toastVisible, setToastVisible] = useState(false)

  // 用固定 demo 寄养清单（豆豆 + 小花），不受 HostRegister 误录数据影响
  const pets = getDemoHostPets()
  const guestCount = pets.length
  const guestNames = pets.map((p) => p.name)
  const doneCount = tasks.filter((t) => t.done).length
  const totalCount = tasks.length

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 1800)
  }

  const handleTaskClick = (task: TaskItem) => {
    if (task.done) {
      showToast('这一项今天已完成')
      return
    }
    if (task.action === 'navigate-checkin' && task.navigatePetId) {
      navigate(`/host/checkin/${task.navigatePetId}`)
    } else if (task.action === 'navigate-pets') {
      navigate('/host/pets')
    } else {
      showToast('这一项今天已完成')
    }
  }

  return (
    <div className="relative h-full">
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
      <div className="h-full overflow-y-auto pt-[54px] pb-[132px] bg-primary-bg
        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {/* Welcome strip · 120px · accent-soft */}
        <section
          className="h-[120px] px-6 flex items-center gap-4"
          style={{ background: 'var(--color-accent-soft)' }}
        >
          <div className="flex-1 min-w-0">
            <h1 className="text-[28px] font-semibold leading-[1.3] tracking-[0.01em] text-text-primary m-0 font-[family-name:var(--font-sans)]">
              你好,王老板
            </h1>
            <div className="mt-2 text-[16px] hcolor-text-secondary leading-[1.4]">
              2026 年 5 月 25 日 星期六
              <span className="inline-flex items-center gap-1 ml-1 text-accent-primary font-medium">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M17 18a5 5 0 0 0 0-10c-.4 0-.8 0-1.1.1A7 7 0 0 0 4 12c0 1.5.5 3 1.5 4"/>
                  <path d="M16 18H6"/>
                </svg>
                多云
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/host/month')}
              className="mt-2 inline-flex items-center gap-1 h-7 px-3 rounded-pill bg-white/85 backdrop-blur-sm border border-accent-wood/30 text-accent-wood font-[family-name:var(--font-sans)] text-[12px] font-medium active:scale-95 transition-transform shadow-[0_2px_6px_rgba(139,111,71,0.12)]"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              我的本月数据
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
          <button
            type="button"
            onClick={() => navigate('/host/month')}
            className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center text-white text-[22px] font-semibold tracking-[0.04em] shrink-0 cursor-pointer active:scale-95 transition-transform"
            style={{
              background: 'linear-gradient(140deg, #C8A77F 0%, #8B6F47 100%)',
              boxShadow: '0 2px 10px rgba(62,58,54,0.12)',
              textShadow: '0 1px 2px rgba(0,0,0,0.15)',
              fontFamily: 'var(--font-sans)',
            }}
            title="查看我的本月数据"
          >
            王
          </button>
        </section>

        {/* Summary card · 100px */}
        <section className="mx-6 mt-6 min-h-[100px] bg-card-bg rounded-card shadow-base p-[18px_20px] flex items-center gap-[14px]">
          <div className="flex-1 min-w-0">
            <div className="text-[20px] font-semibold leading-[1.35] tracking-[0.01em] text-text-primary">
              今天有 <span className="text-accent-primary font-bold mx-px">{guestCount}</span> 位客人
            </div>
            <ul className="mt-2 flex flex-col gap-1 list-none p-0 m-0">
              {guestNames.length > 0 ? (
                <>
                  <li className="flex items-center gap-[6px] text-[16px] leading-[1.4]">
                    <span className="text-text-primary font-medium">{guestNames[0]}</span>
                    <span className="text-accent-wood font-medium tracking-[0.02em] before:content-['·'] before:mr-[6px] before:text-accent-wood before:opacity-55">Day 3</span>
                  </li>
                  {guestNames.length > 1 && (
                    <li className="flex items-center gap-[6px] text-[16px] leading-[1.4]">
                      <span className="text-text-primary font-medium">{guestNames[1]}</span>
                      <span className="text-accent-wood font-medium tracking-[0.02em] before:content-['·'] before:mr-[6px] before:text-accent-wood before:opacity-55">Day 1</span>
                    </li>
                  )}
                </>
              ) : (
                <li className="text-[16px] hcolor-text-secondary leading-[1.4]">暂无寄养宠物</li>
              )}
            </ul>
          </div>
          <div className="shrink-0 text-center pl-[14px] border-l border-border-light min-w-[78px]">
            <div className="text-[32px] font-bold tracking-[0.02em] leading-none text-accent-wood">
              {doneCount}<span className="text-[#8A847D] font-medium">/{totalCount}</span>
            </div>
            <div className="mt-[6px] text-[16px] hcolor-text-secondary whitespace-nowrap">已完成任务</div>
          </div>
        </section>

        {/* Today schedule */}
        <section className="mx-6 mt-8">
          <h2 className="text-[20px] font-semibold tracking-[0.01em] text-text-primary mb-4">
            今日时间表<span className="text-[16px] font-medium hcolor-text-secondary ml-2">共 {totalCount} 项</span>
          </h2>

          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <article
                key={task.id}
                onClick={() => handleTaskClick(task)}
                className={`min-h-[96px] p-4 rounded-card flex items-center gap-[14px] cursor-pointer transition-all duration-[150ms] ease-out active:scale-[0.995] active:shadow-soft relative border-[1.5px] ${
                  task.done
                    ? 'bg-accent-soft shadow-none border-transparent'
                    : task.important
                    ? 'border-accent-shimmer shadow-[0_2px_16px_rgba(196,145,92,0.16)]'
                    : 'bg-card-bg shadow-base border-[rgba(139,111,71,0.16)]'
                }`}
                style={
                  task.important && !task.done
                    ? { background: 'linear-gradient(135deg, #FFFBF5 0%, #FFFFFF 100%)' }
                    : task.done
                    ? { background: 'var(--color-accent-soft)' }
                    : undefined
                }
              >
                {/* Icon disc */}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${
                    task.icon === 'done'
                      ? 'bg-accent-primary text-white'
                      : task.icon === 'camera'
                      ? 'bg-shimmer-bg text-accent-wood'
                      : 'bg-accent-cream text-accent-wood'
                  }`}
                >
                  {task.icon === 'done' ? (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5l4.5 4.5L19 7.5"/>
                    </svg>
                  ) : task.icon === 'camera' || task.icon === 'checkin' ? (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 8h3l2-2h6l2 2h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
                      <circle cx="12" cy="13" r="4"/>
                      {task.icon === 'checkin' && (
                        <path d="M11 14.2l1.4 1.4 2.6-2.6" strokeWidth="1.6"/>
                      )}
                    </svg>
                  ) : (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 11h14"/>
                      <path d="M5 11a7 7 0 0 1 14 0"/>
                      <path d="M3 15h18l-2 5H5l-2-5z"/>
                      <path d="M12 8V4"/>
                    </svg>
                  )}
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="text-[16px] font-medium hcolor-text-secondary leading-[1.2] tracking-[0.02em]">
                    {task.time}
                  </div>
                  <div
                    className={`mt-0.5 text-[18px] font-semibold leading-[1.3] tracking-[0.01em] ${
                      task.done
                        ? 'hcolor-text-secondary line-through decoration-[rgba(107,142,127,0.5)] decoration-[1.5px] font-medium'
                        : 'text-text-primary'
                    }`}
                  >
                    {task.title}
                  </div>
                  <div className="mt-1 text-[16px] hcolor-text-secondary leading-[1.4]">
                    {task.pets}
                    {task.important && (
                      <span className="text-accent-shimmer font-semibold ml-1">重点!</span>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div
                  className={`shrink-0 text-[16px] font-semibold flex items-center gap-1 whitespace-nowrap ${
                    task.done ? 'text-accent-primary' : 'text-accent-wood'
                  }`}
                >
                  {task.done ? (
                    '已完成'
                  ) : (
                    <>
                      去完成
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M9 6l6 6-6 6"/>
                      </svg>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Tip card */}
        <section className="mx-6 mt-8 min-h-[110px] p-5 bg-shimmer-bg rounded-card flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-full bg-accent-wood flex items-center justify-center text-white shrink-0"
            style={{ boxShadow: '0 2px 8px rgba(139,111,71,0.22)' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 18h6"/>
              <path d="M10 22h4"/>
              <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.1 1 1.8V18h6v-1.5c0-.7.4-1.3 1-1.8A7 7 0 0 0 12 2z"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[16px] font-semibold text-accent-wood tracking-[0.02em] leading-[1.3]">
              今日小提示
            </div>
            <div className="mt-2 text-[16px] hcolor-text-secondary leading-[1.6]">
              今天<span className="text-accent-wood font-medium">有福</span>和<span className="text-accent-wood font-medium">豆豆</span>熟悉了,<br/>
              记得拍一张她们一起的照片!
            </div>
          </div>
        </section>
      </div>

      {/* Fixed bottom CTA */}
      <div className="absolute left-0 right-0 bottom-0 z-25 pt-4 px-6 pb-7 bg-primary-bg">
        <div
          className="absolute left-0 right-0 top-0 h-6 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(245,241,234,0) 0%, var(--color-primary-bg) 100%)',
          }}
        />
        <button
          onClick={() => navigate('/host/pets')}
          className="w-full h-16 rounded-pill bg-accent-primary text-white text-[20px] font-semibold tracking-[0.02em] flex items-center justify-center gap-2 active:scale-[0.99] active:translate-y-px transition-all duration-[120ms]"
          style={{
            boxShadow: '0 6px 20px rgba(107,142,127,0.32)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          <span>查看今日宠物</span>
          <span className="font-medium text-[16px] opacity-85 ml-1">({guestCount} 只)</span>
        </button>
      </div>
    </div>
  )
}
