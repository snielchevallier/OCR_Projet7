'use client'

import { useEffect } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  message: string
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void | Promise<void>
}

export default function ConfirmModal({ open, onClose, message, confirmLabel, cancelLabel, onConfirm }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-sm relative shadow-xl">

          <button
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors text-xl leading-none"
          >
            ✕
          </button>

          <p className="text-base font-medium text-black mb-8 pr-6">{message}</p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-medium border border-grey-border text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={async () => { await onConfirm(); onClose() }}
              className="px-5 py-2.5 rounded-lg text-sm font-medium bg-black text-white hover:bg-orange transition-colors"
            >
              {confirmLabel}
            </button>
          </div>

        </div>
      </div>
    </>
  )
}