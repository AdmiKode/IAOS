'use client'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Modal({ open, onClose, title, children, size = 'md', className }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1A1F2B]/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          'relative w-full bg-[#EFF2F9] rounded-3xl p-6',
          'shadow-[-6px_-6px_16px_#FAFBFF,6px_6px_16px_rgba(22,27,29,0.18)]',
          sizes[size],
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[16px] font-[Questrial] text-[#1A1F2B] tracking-wide">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#EFF2F9] shadow-[-2px_-2px_6px_#FAFBFF,2px_2px_6px_rgba(22,27,29,0.15)] hover:scale-105 transition-transform"
            >
              <X size={14} className="text-[#6B7280]" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
