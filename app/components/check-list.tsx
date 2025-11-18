import { CheckCircle } from 'lucide-react'

interface CheckListItem {
  text: string | React.ReactNode
}

interface CheckListProps {
  items: CheckListItem[]
  variant?: 'default' | 'success'
  className?: string
}

export function CheckList({ items, variant = 'default', className }: CheckListProps) {
  const iconColor = variant === 'success' ? 'text-green-500' : 'text-muted-foreground'
  
  return (
    <ul className={`space-y-2 text-sm ${className}`}>
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          <CheckCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${iconColor}`} />
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  )
}
