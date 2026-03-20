'use client'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface NeuSelectOption {
  value: string
  label: string
  icon?: React.ReactNode
  desc?: string
}

interface NeuSelectProps {
  value: string
  onChange: (value: string) => void
  options: NeuSelectOption[]
  placeholder?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  label?: string
  disabled?: boolean
}

export function NeuSelect({
  value,
  onChange,
  options,
  placeholder = 'Seleccionar...',
  className,
  size = 'md',
  label,
  disabled = false,
}: NeuSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selected = options.find(o => o.value === value)

  const sizeMap = {
    sm: { py: 'py-2 px-3',   txt: 'text-[12px]', itemPy: 'py-2 px-3' },
    md: { py: 'py-2.5 px-4', txt: 'text-[13px]', itemPy: 'py-2.5 px-4' },
    lg: { py: 'py-3 px-4',   txt: 'text-[14px]', itemPy: 'py-3 px-4' },
  }
  const { py, txt, itemPy } = sizeMap[size]

  return (
    <div ref={ref} className={cn('relative', className)}>
      {label && (
        <label className="block text-[11px] text-[#6B7280] tracking-widest uppercase mb-1.5 font-medium">
          {label}
        </label>
      )}
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(o => !o)}
        className={cn(
          'w-full flex items-center justify-between gap-2 rounded-xl transition-all duration-200 outline-none',
          // Glass base
          'bg-white/40 backdrop-blur-sm border',
          disabled && 'opacity-40 cursor-not-allowed',
          !disabled && 'cursor-pointer',
          // States
          open
            ? 'border-[#F7941D]/60 bg-[#F7941D]/5 shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.8),inset_2px_2px_5px_rgba(22,27,29,0.12)]'
            : selected
            ? 'border-[#F7941D]/40 bg-[#F7941D]/4 shadow-[-3px_-3px_8px_#FAFBFF,3px_3px_8px_rgba(22,27,29,0.13)]'
            : 'border-white/60 shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.13)] hover:border-[#F7941D]/30',
          py, txt
        )}
      >
        <span className={cn(
          'truncate flex items-center gap-2 font-medium',
          selected ? 'text-[#F7941D]' : 'text-[#9CA3AF]'
        )}>
          {selected?.icon && <span className="shrink-0">{selected.icon}</span>}
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={13}
          className={cn(
            'shrink-0 transition-all duration-200',
            open ? 'rotate-180 text-[#F7941D]' : 'text-[#9CA3AF]'
          )}
        />
      </button>

      {/* Dropdown panel — glass */}
      {open && (
        <div className={cn(
          'absolute z-50 left-0 right-0 mt-1.5 rounded-2xl overflow-hidden',
          'bg-white/80 backdrop-blur-md',
          'border border-white/70',
          'shadow-[-6px_-6px_16px_rgba(250,251,255,0.9),6px_6px_20px_rgba(22,27,29,0.20)]',
          'max-h-[260px] overflow-y-auto'
        )}>
          {placeholder && (
            <button
              type="button"
              onClick={() => { onChange(''); setOpen(false) }}
              className={cn(
                'w-full flex items-center px-4 py-2.5 transition-all duration-150',
                'text-[#9CA3AF] hover:bg-[#F7941D]/8 hover:text-[#F7941D]',
                txt
              )}
            >
              <span className="italic">{placeholder}</span>
            </button>
          )}

          {options.map((opt, i) => {
            const isSelected = opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={cn(
                  'w-full flex items-center justify-between gap-3 transition-all duration-150',
                  itemPy,
                  isSelected
                    ? 'bg-[#F7941D]/12 text-[#F7941D]'
                    : 'text-[#1A1F2B] hover:bg-[#F7941D]/8 hover:text-[#F7941D]',
                  i > 0 && 'border-t border-[#EFF2F9]/80',
                  txt
                )}
              >
                <span className="flex items-center gap-2 truncate text-left font-medium">
                  {opt.icon && <span className={cn('shrink-0', isSelected ? 'text-[#F7941D]' : 'text-[#9CA3AF]')}>{opt.icon}</span>}
                  <span className="truncate">{opt.label}</span>
                  {opt.desc && <span className="text-[10px] text-[#9CA3AF] font-normal shrink-0 hidden sm:inline">— {opt.desc}</span>}
                </span>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-[#F7941D] flex items-center justify-center shrink-0">
                    <Check size={11} className="text-white" />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
