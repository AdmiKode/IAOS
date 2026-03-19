// Utilidad para combinar clases Tailwind
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Sombras neumórficas reutilizables
export const neu = {
  sm: 'shadow-[-5px_-5px_10px_#FAFBFF,5px_5px_10px_rgba(22,27,29,0.23)]',
  md: 'shadow-[-10px_-10px_20px_#FAFBFF,10px_10px_20px_rgba(22,27,29,0.23)]',
  lg: 'shadow-[-20px_-20px_40px_#FAFBFF,20px_20px_40px_rgba(22,27,29,0.23)]',
  inset: 'shadow-[inset_-5px_-5px_10px_#FAFBFF,inset_5px_5px_10px_rgba(22,27,29,0.23)]',
  insetMd: 'shadow-[inset_-10px_-10px_20px_#FAFBFF,inset_10px_10px_20px_rgba(22,27,29,0.23)]',
}

export const glass = 'bg-white/20 backdrop-blur-[16px] border border-white/30'
