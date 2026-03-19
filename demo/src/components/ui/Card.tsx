'use client'
import { cn, neu } from '@/lib/utils'

interface CardProps {
  className?: string
  children: React.ReactNode
  glass?: boolean
  onClick?: () => void
}

export function Card({ className, children, glass, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-[#EFF2F9] rounded-3xl p-6',
        glass
          ? 'bg-white/20 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_rgba(22,27,29,0.12)]'
          : neu.md,
        onClick && 'cursor-pointer hover:scale-[1.01] transition-transform duration-200',
        className
      )}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between mb-4', className)}>
      <div>
        <h3 className="text-[15px] font-[Questrial] text-[#1A1F2B] tracking-wide">{title}</h3>
        {subtitle && <p className="text-[12px] text-[#6B7280] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
