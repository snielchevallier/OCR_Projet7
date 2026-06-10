'use client'

import { useEffect } from 'react'
import { useFocusTrap } from '@/hooks/useFocusTrap'

type Props = {
  open: boolean
  onClose: () => void
  message: string
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void | Promise<void>
  error?: string
  loading?: boolean
}

export default function ConfirmModal({ open, onClose, message, confirmLabel, cancelLabel, onConfirm, error, loading }: Props) {
  const dialogRef = useFocusTrap(open)

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
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-message"
          className="bg-white rounded-2xl p-8 w-full max-w-sm relative shadow-xl"
        >

          <button
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors text-xl leading-none"
          >
            ✕
          </button>

          <p id="confirm-modal-message" className="text-base font-medium text-black mb-8 pr-6">{message}</p>

          {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg text-sm font-medium border border-grey-border text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg text-sm font-medium bg-black text-white hover:bg-orange transition-colors disabled:opacity-50"
            >
              {loading ? 'Suppression...' : confirmLabel}
            </button>
          </div>

        </div>
      </div>
    </>
  )
}