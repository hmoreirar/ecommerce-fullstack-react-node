import type { FormEvent } from 'react'

type RegisterFormProps = {
  email: string
  password: string
  confirmPassword: string
  loading: boolean
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  onBackToLogin: () => void
  onBackToStore?: () => void
}

export default function RegisterForm({
  email,
  password,
  confirmPassword,
  loading,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  onBackToLogin,
  onBackToStore,
}: RegisterFormProps) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-background)' }}>
      <div style={{ width: '100%', maxWidth: 400, padding: 20 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: 8 }}>Nicommerce</h1>
          <p style={{ color: 'var(--color-foreground-light)', fontSize: '0.95rem' }}>
            Crea tu cuenta de cliente
          </p>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.875rem', fontWeight: 600 }}>
              Email
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              className="form-input"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.875rem', fontWeight: 600 }}>
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              className="form-input"
              minLength={6}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.875rem', fontWeight: 600 }}>
              Repetir contraseña
            </label>
            <input
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(event) => onConfirmPasswordChange(event.target.value)}
              className="form-input"
              minLength={6}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onBackToLogin}
          style={{ width: '100%', marginTop: 12 }}
        >
          Volver al login
        </button>

        {onBackToStore && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onBackToStore}
            style={{ width: '100%', marginTop: 12 }}
          >
            Volver a la tienda
          </button>
        )}
      </div>
    </div>
  )
}
