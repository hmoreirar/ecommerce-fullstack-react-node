type ThemeToggleProps = {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export default function ThemeToggle({ theme, onToggleTheme }: ThemeToggleProps) {
  return (
    <button className="theme-toggle" onClick={onToggleTheme} type="button">
      {theme === 'dark' ? 'Activar light' : 'Activar dark'}
    </button>
  )
}
