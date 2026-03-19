'use client'
import { cn, neu } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-[12px] text-[#6B7280] tracking-widest uppercase">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-4 text-[#9CA3AF] w-4 h-4 flex items-center justify-center">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-[#EFF2F9] rounded-2xl px-5 py-3.5 text-[14px] text-[#1A1F2B] font-[Questrial]',
              'placeholder:text-[#9CA3AF] outline-none transition-all duration-200',
              neu.inset,
              'focus:shadow-[inset_-4px_-4px_10px_#FAFBFF,inset_4px_4px_10px_rgba(22,27,29,0.18)]',
              icon ? 'pl-11' : 'pl-5',
              error && 'ring-1 ring-[#7C1F31]/50',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-[11px] text-[#7C1F31]">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
