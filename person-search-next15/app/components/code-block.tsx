interface CodeBlockProps {
  code: string
  language?: 'bash' | 'json' | 'text'
  className?: string
}

export function CodeBlock({ code, language = 'bash', className }: CodeBlockProps) {
  const bgColor = language === 'bash' ? 'bg-black text-green-400' : 'bg-muted'
  
  return (
    <div className={`${bgColor} p-4 rounded-lg font-mono text-sm overflow-x-auto ${className}`}>
      <pre>{code}</pre>
    </div>
  )
}
