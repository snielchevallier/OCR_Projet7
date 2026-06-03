'use client'

import { useState, useRef, useEffect } from 'react'

export default function TaskOptionsMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={ref} className="relative shrink-0 -mr-1 -mt-1">
      <button
        onClick={() => setOpen(v => !v)}
        className="text-gray-400 hover:text-black transition-colors p-1"
        aria-label="Options"
        aria-expanded={open}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[130px] rounded-lg bg-black shadow-lg overflow-hidden">
          <button
            onClick={() => setOpen(false)}
            className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
          >
            Modifier
          </button>
          <button
            onClick={() => setOpen(false)}
            className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 transition-colors"
          >
            Supprimer
          </button>
        </div>
      )}
    </div>
  )
}