import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { watchArrived } from '../lib/whenArrived'

type Props = {
  children: ReactNode
  className?: string
  delay?: number
  variant?: 'up' | 'left' | 'right' | 'zoom' | 'fade'
}

export function Reveal({ children, className = '', delay = 0, variant = 'up' }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    return watchArrived(node, () => node.classList.add('is-in'))
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal reveal-${variant} ${className}`}
      style={{ '--d': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}
