import type { FormEvent } from 'react'

type LoginFormProps = {
  email: string
  password: string
  loading: boolean
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
}

export default function LoginForm({
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-background)'}}>
      <div style={{width: '100%', maxWidth: 400, padding: 20}}>
        <div style={{textAlign: 'center', marginBottom: 32}}>
          <h1 style={{fontSize: '1.75rem', marginBottom: 8}}>Nicommerce</h1>
          <p style={{color: 'var(--color-foreground-light)', fontSize: '0.95rem'}}>
            Ingresa a tu panel de tienda
          </p>
        </div>

        <form onSubmit={onSubmit} style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          <div>
            <label style={{display: 'block', marginBottom: 6, fontSize: '0.875rem', fontWeight: 600}}>
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
            <label style={{display: 'block', marginBottom: 6, fontSize: '0.875rem', fontWeight: 600}}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{marginTop: 8}}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
