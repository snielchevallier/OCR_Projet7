import { useEffect, useRef } from 'react'

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function useFocusTrap(active: boolean) {
  const ref = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return
    previousFocus.current = document.activeElement as HTMLElement
    const el = ref.current
    if (!el) return
    el.querySelectorAll<HTMLElement>(FOCUSABLE)[0]?.focus()
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab' || !ref.current) return
      const all = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE))
      const first = all[0]
      const last = all[all.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previousFocus.current?.focus()
    }
  }, [active])

  return ref
}