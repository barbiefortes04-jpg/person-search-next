import { ReactNode } from 'react'

interface FeatureListProps {
  items: Array<{
    title: string
    description: string
    icon?: 'check' | 'security'
  }>
  className?: string
}

export function FeatureList({ items, className }: FeatureListProps) {
  return (
    <div className={`space-y-3 text-sm ${className}`}>
      {items.map((item, index) => (
        <div key={index}>
          <h4 className="font-semibold">
            {item.icon === 'check' && '✓ '}
            {item.icon === 'security' && '🔒 '}
            {item.title}
          </h4>
          <p className="text-muted-foreground">{item.description}</p>
        </div>
      ))}
    </div>
  )
}

interface RouteListItem {
  route: string
  description?: string
  status: 'protected' | 'public'
}

interface RouteListProps {
  items: RouteListItem[]
  className?: string
}

export function RouteList({ items, className }: RouteListProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => (
        <div key={item.route} className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <span 
              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                item.status === 'protected' 
                  ? 'bg-red-500/10 text-red-500 dark:bg-red-500/20' 
                  : 'bg-gray-500/10 text-gray-500 dark:bg-gray-500/20'
              }`}
            >
              {item.status === 'protected' ? 'Protected' : 'Public'}
            </span>
            <code className="text-sm">{item.route}</code>
            {item.description && <span className="text-sm text-muted-foreground">{item.description}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

interface ConfigBoxProps {
  title?: string
  children: ReactNode
  className?: string
}

export function ConfigBox({ title, children, className }: ConfigBoxProps) {
  return (
    <div className={className}>
      {title && <h4 className="font-semibold mb-2">{title}</h4>}
      <div className="bg-muted p-4 rounded-lg text-sm">
        {children}
      </div>
    </div>
  )
}

interface EnvVarsProps {
  vars: Array<{ key: string; value: string }>
}

export function EnvVars({ vars }: EnvVarsProps) {
  return (
    <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-1">
      {vars.map((v) => (
        <div key={v.key}>
          <span className="text-blue-500">{v.key}</span>={v.value}
        </div>
      ))}
    </div>
  )
}
