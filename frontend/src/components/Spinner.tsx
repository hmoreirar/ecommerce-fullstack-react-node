type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: '16px',
  md: '24px',
  lg: '40px',
}

export default function Spinner({ size = 'md' }: SpinnerProps) {
  return (
    <div
      style={{
        width: sizes[size],
        height: sizes[size],
        border: '2px solid var(--color-border)',
        borderTopColor: 'var(--color-accent)',
        borderRadius: '50%',
        animation: 'spin 0.6s linear infinite',
      }}
    />
  )
}
