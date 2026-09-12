type ThemeToggleProps = {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export default function ThemeToggle({ theme, onToggleTheme }: ThemeToggleProps) {
  return (
    <button className="theme-toggle" onClick={onToggleTheme} type="button" aria-label={`Activar modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}>
      <span aria-hidden="true">{theme === 'dark' ? '☼' : '☾'}</span>
      <span>{theme === 'dark' ? 'Claro' : 'Oscuro'}</span>
    </button>
  )
}
