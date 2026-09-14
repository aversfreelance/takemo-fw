type ArriveOpts = {
  hero?: boolean
}

export function hasArrived(node: Element, opts: ArriveOpts = {}) {
  const box = node.getBoundingClientRect()
  const vh = window.innerHeight

  if (opts.hero) {
    return box.top < vh * 0.25 && box.bottom > vh * 0.2
  }

  if (window.scrollY < vh * 0.6) return false
  return box.top < vh * 0.3 && box.bottom > 80
}

export function watchArrived(node: Element, onArrive: () => void, opts: ArriveOpts = {}) {
  let done = false
  const check = () => {
    if (done || !hasArrived(node, opts)) return
    done = true
    onArrive()
    window.removeEventListener('scroll', check)
    window.removeEventListener('resize', check)
  }
  check()
  window.addEventListener('scroll', check, { passive: true })
  window.addEventListener('resize', check)
  return () => {
    window.removeEventListener('scroll', check)
    window.removeEventListener('resize', check)
  }
}
