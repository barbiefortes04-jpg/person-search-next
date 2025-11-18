import { ReactNode } from 'react'
import { CheckCircle2, LucideIcon } from 'lucide-react'

interface InfoListProps {
  items: Array<{
    icon?: LucideIcon
    label: string | ReactNode
  }>
  variant?: 'default' | 'checklist' | 'numbered'
  className?: string
}

export function InfoList({ items, variant = 'default', className }: InfoListProps) {
  const Icon = variant === 'checklist' ? CheckCircle2 : null
  const listClass = variant === 'numbered' ? 'list-decimal list-inside' : ''
  
  return (
    <ul className={`space-y-2 ${listClass} ${className}`}>
      {items.map((item, index) => {
        const ItemIcon = item.icon || Icon
        return (
          <li key={index} className={ItemIcon ? "flex items-start gap-2" : undefined}>
            {ItemIcon && (
              <ItemIcon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${variant === 'checklist' ? 'text-green-600' : ''}`} />
            )}
            <span>{item.label}</span>
          </li>
        )
      })}
    </ul>
  )
}
