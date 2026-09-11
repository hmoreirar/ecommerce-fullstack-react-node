type ConfirmDialogProps = {
  open: boolean
  title: string
  message: string
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title,
  message,
  loading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 1000,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: 'var(--color-background)',
          padding: 28,
          borderRadius: 20,
          maxWidth: 400,
          width: '90%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginBottom: 8 }}>{title}</h3>
        <p style={{ color: 'var(--color-foreground-light)', marginBottom: 20 }}>{message}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 18px',
              border: '1px solid var(--color-border)',
              borderRadius: 12,
              background: 'var(--color-surface)',
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: '10px 18px',
              border: 'none',
              borderRadius: 12,
              background: 'var(--color-accent)',
              color: 'var(--color-button-text)',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {loading ? 'Procesando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  )
}
