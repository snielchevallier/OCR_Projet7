export default function Spinner() {
  return (
    <div role="status" aria-label="Chargement en cours" className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div aria-hidden="true" className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-orange" />
    </div>
  )
}