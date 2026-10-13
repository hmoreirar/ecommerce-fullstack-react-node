import type { FormEvent } from 'react'

type LoginFormProps = {
  email: string
  password: string
  loading: boolean
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  onRegister: () => void
  onBackToStore?: () => void
}

export default function LoginForm({
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onRegister,
  onBackToStore,
}: LoginFormProps) {
  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-card__header">
          <h1>Nicommerce</h1>
          <p>Ingresa a tu cuenta</p>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <button type="button" className="btn btn-secondary auth-alt" onClick={onRegister}>
          Crear una cuenta
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
