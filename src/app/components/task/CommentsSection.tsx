'use client'

import { useState, useEffect } from 'react'
import type { Comment } from '@/types'
import { getTaskCommentsAction, createCommentAction } from '@/actions/comments'
import { getUserInitials, formatDateTime } from '@/lib/utils'

type Props = {
  projectId: string
  taskId: string
}

export default function CommentsSection({ projectId, taskId }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    getTaskCommentsAction(projectId, taskId)
      .then(setComments)
      .catch(() => setError('Impossible de charger les commentaires.'))
      .finally(() => setLoading(false))
  }, [projectId, taskId])

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = content.trim()
    if (!trimmed) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const comment = await createCommentAction(projectId, taskId, trimmed)
      setComments(prev => [...prev, comment])
      setContent('')
    } catch {
      setSubmitError("Impossible d'envoyer le commentaire.")
    } finally {
      setSubmitting(false)
    }
  }

  const count = loading ? null : comments.length

  return (
    <div>
      <button
        onClick={() => setExpanded(v => !v)}
        aria-expanded={expanded}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-black transition-colors"
      >
        <span>Commentaires{count !== null ? ` (${count})` : ''}</span>
        <svg
          aria-hidden="true"
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-grey-border space-y-3">
          {error ? (
            <p className="text-xs text-red-400">{error}</p>
          ) : comments.length === 0 ? (
            <p className="text-xs text-gray-400 italic">Aucun commentaire pour l&apos;instant.</p>
          ) : (
            <ul className="space-y-3">
              {comments.map(comment => (
                <li key={comment.id} className="flex gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center font-semibold shrink-0 mt-0.5">
                    {getUserInitials(comment.author?.name).replace(' ', '')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-black truncate">
                        {comment.author?.name}
                      </span>
                      <span className="text-xs text-gray-400 shrink-0">
                        {formatDateTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{comment.content}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2 pt-1">
            <input
              type="text"
              aria-label="Écrire un commentaire"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Écrire un commentaire…"
              className="flex-1 text-xs border border-grey-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange/30 bg-white"
            />
            <button
              type="submit"
              disabled={!content.trim() || submitting}
              className="px-3 py-2 text-xs font-medium rounded-lg transition-colors
                disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
                enabled:bg-black enabled:text-white enabled:hover:bg-orange"
            >
              {submitting ? '…' : 'Envoyer'}
            </button>
          </form>

          {submitError && (
            <p className="text-xs text-red-500">{submitError}</p>
          )}
        </div>
      )}
    </div>
  )
}