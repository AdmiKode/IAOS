import { cn } from '@/lib/utils'

export function Panel({
  title,
  subtitle,
  children,
  right,
  className,
}: {
  title: string
  subtitle?: string
  right?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <section className={cn('rounded-3xl bg-[#EFF2F9] p-4 md:p-5 shadow-[-10px_-10px_24px_#FAFBFF,10px_10px_24px_rgba(22,27,29,0.18)]', className)}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-[18px] text-[#1A1F2B]">{title}</h2>
          {subtitle && <p className="text-[11px] text-[#6E7F8D] mt-0.5">{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </section>
  )
}

export function TrendBadge({
  trend,
  text,
}: {
  trend: 'up' | 'down' | 'neutral'
  text: string
}) {
  const color = trend === 'up' ? '#69A481' : trend === 'down' ? '#7C1F31' : '#6E7F8D'
  return (
    <span
      className="inline-flex rounded-full px-2.5 py-1 text-[10px]"
      style={{ background: `${color}1A`, color }}
    >
      {text}
    </span>
  )
}

export function StatusBadge({
  color,
  text,
}: {
  color: '#69A481' | '#7C1F31' | '#F7941D' | '#6E7F8D'
  text: string
}) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px]"
      style={{ background: `${color}1A`, color }}
    >
      {text}
    </span>
  )
}
