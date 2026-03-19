'use client'
import { cn, neu } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-[Questrial] transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed'

    const variants = {
      primary: `bg-[#F7941D] text-white rounded-full ${neu.sm} hover:bg-[#E8820A] active:shadow-[inset_-3px_-3px_6px_rgba(255,255,255,0.3),inset_3px_3px_6px_rgba(22,27,29,0.3)]`,
      secondary: `bg-[#EFF2F9] text-[#1A1F2B] rounded-full ${neu.sm} hover:shadow-[-3px_-3px_6px_#FAFBFF,3px_3px_6px_rgba(22,27,29,0.15)]`,
      ghost: `bg-transparent text-[#F7941D] border border-[#F7941D]/30 rounded-full hover:bg-[#F7941D]/10`,
      danger: `bg-[#7C1F31] text-white rounded-full ${neu.sm} hover:bg-[#6a1a29]`,
    }

    const sizes = {
      sm: 'px-4 py-2 text-[13px] tracking-wide',
      md: 'px-6 py-3 text-[14px] tracking-wide',
      lg: 'px-8 py-4 text-[16px] tracking-wide',
    }

    return (
      <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props}>
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
