'use client'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface NeuSelectOption {
  value: string
  label: string
}

interface NeuSelectProps {
  value: string
  onChange: (value: string) => void
  options: NeuSelectOption[]
  placeholder?: string
  className?: string
  size?: 'sm' | 'md'
}

export function NeuSelect({
  value,
  onChange,
  options,
  placeholder = 'Seleccionar...',
  className,
  size = 'md',
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
  const py = size === 'sm' ? 'py-2' : 'py-2.5'
  const txt = size === 'sm' ? 'text-[12px]' : 'text-[13px]'

  return (
    <div ref={ref} className={cn('relative', className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={cn(
          'w-full flex items-center justify-between gap-2 px-4 rounded-xl transition-all outline-none',
          'bg-[#EFF2F9] text-[#1A1F2B]',
          open
            ? 'shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.14)]'
            : 'shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.13)] hover:shadow-[-4px_-4px_9px_#FAFBFF,4px_4px_9px_rgba(22,27,29,0.16)]',
          py, txt
        )}
      >
        <span className={cn('truncate', !selected && 'text-[#9CA3AF]')}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={13}
          className={cn('shrink-0 text-[#9CA3AF] transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className={cn(
          'absolute z-50 left-0 right-0 mt-1.5 rounded-2xl overflow-hidden',
          'bg-[#EFF2F9] shadow-[-8px_-8px_20px_#FAFBFF,8px_8px_20px_rgba(22,27,29,0.18)]',
          'border border-[#D1D5DB]/20',
          'max-h-[220px] overflow-y-auto'
        )}>
          {/* Placeholder option */}
          {placeholder && (
            <button
              type="button"
              onClick={() => { onChange(''); setOpen(false) }}
              className={cn(
                'w-full flex items-center justify-between px-4 py-2.5 transition-colors',
                'text-[#B5BFC6] hover:bg-[#F7941D]/8',
                txt
              )}
            >
              <span>{placeholder}</span>
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
                  'w-full flex items-center justify-between px-4 py-2.5 transition-colors gap-3',
                  isSelected
                    ? 'bg-[#F7941D]/10 text-[#F7941D]'
                    : 'text-[#1A1F2B] hover:bg-[#F7941D]/6 hover:text-[#F7941D]',
                  i > 0 && 'border-t border-[#D1D5DB]/15',
                  txt
                )}
              >
                <span className="truncate text-left">{opt.label}</span>
                {isSelected && <Check size={12} className="shrink-0 text-[#F7941D]" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
