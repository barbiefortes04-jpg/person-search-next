import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LucideIcon } from 'lucide-react'

interface SectionCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  children: ReactNode
  className?: string
}

export function SectionCard({ title, description, icon: Icon, children, className }: SectionCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className={Icon ? "flex items-center gap-2" : undefined}>
          {Icon && <Icon className="h-5 w-5" />}
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}
