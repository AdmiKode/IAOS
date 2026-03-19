'use client'
import { cn } from '@/lib/utils'

interface BadgeProps {
  label: string
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md'
  className?: string
}

const variants = {
  default: 'bg-[#EFF2F9] text-[#6B7280] border border-[#D1D5DB]',
  success: 'bg-[#69A481]/15 text-[#69A481] border border-[#69A481]/30',
  warning: 'bg-[#F7941D]/15 text-[#F7941D] border border-[#F7941D]/30',
  danger: 'bg-[#7C1F31]/15 text-[#7C1F31] border border-[#7C1F31]/30',
  info: 'bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30',
}

const sizes = {
  sm: 'text-[10px] px-2 py-0.5 rounded-lg',
  md: 'text-[12px] px-3 py-1 rounded-xl',
}

export function Badge({ label, variant = 'default', size = 'md', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center font-[Questrial] tracking-wide', variants[variant], sizes[size], className)}>
      {label}
    </span>
  )
}
