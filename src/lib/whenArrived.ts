export function hasArrived(node: Element) {
  const box = node.getBoundingClientRect()
  const vh = window.innerHeight
  return box.top < vh && box.bottom > 0
}

export function watchArrived(node: Element, onArrive: () => void) {
  let done = false
  const check = () => {
    if (done || !hasArrived(node)) return
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
