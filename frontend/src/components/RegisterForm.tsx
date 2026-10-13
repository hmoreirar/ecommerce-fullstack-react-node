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
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-card__header">
          <h1>Nicommerce</h1>
          <p>Crea tu cuenta de cliente</p>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="register-password">Contraseña</label>
            <input
              id="register-password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              className="form-input"
              minLength={6}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="register-confirm">Repetir contraseña</label>
            <input
              id="register-confirm"
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(event) => onConfirmPasswordChange(event.target.value)}
              className="form-input"
              minLength={6}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <button type="button" className="btn btn-secondary auth-alt" onClick={onBackToLogin}>
          Volver al login
        </button>

        {onBackToStore && (
          <button type="button" className="btn btn-secondary auth-alt" onClick={onBackToStore}>
            Volver a la tienda
          </button>
        )}
      </div>
    </div>
  )
}
