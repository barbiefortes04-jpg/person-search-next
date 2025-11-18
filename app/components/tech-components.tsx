interface TechStackItem {
  name: string
  items: string[]
}

interface TechStackGridProps {
  stacks: TechStackItem[]
  columns?: 2 | 3
}

export function TechStackGrid({ stacks, columns = 2 }: TechStackGridProps) {
  const gridCols = columns === 2 ? 'grid-cols-2' : 'grid-cols-3'
  
  return (
    <div className={`grid ${gridCols} gap-3 text-sm`}>
      {stacks.map((stack, index) => (
        <div key={index} className="p-3 border rounded-lg">
          <strong>{stack.name}:</strong>
          <ul className="mt-1 space-y-1 text-muted-foreground">
            {stack.items.map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

interface FileReferenceItem {
  path: string
  description: string
}

interface FileReferenceListProps {
  files: FileReferenceItem[]
  className?: string
}

export function FileReferenceList({ files, className }: FileReferenceListProps) {
  return (
    <div className={`space-y-2 text-sm font-mono ${className}`}>
      {files.map((file, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <code className="text-sm">{file.path}</code>
          <span className="text-xs text-muted-foreground">{file.description}</span>
        </div>
      ))}
    </div>
  )
}
