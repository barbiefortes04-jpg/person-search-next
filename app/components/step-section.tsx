import { ReactNode } from 'react'
import { SectionCard } from './section-card'
import { LucideIcon } from 'lucide-react'

interface StepSectionProps {
  stepNumber: number
  title: string
  icon?: LucideIcon
  children: ReactNode
  className?: string
}

export function StepSection({ stepNumber, title, icon, children, className }: StepSectionProps) {
  return (
    <SectionCard 
      title={`Step ${stepNumber}: ${title}`}
      icon={icon}
      className={className}
    >
      {children}
    </SectionCard>
  )
}
