import { Star, ArrowRight } from 'lucide-react'

export default function ModuleKaart({ module }: { module: any }) {
  return (
    <div style={{
      backgroundColor: 'var(--card-background)',
      border: '1px solid var(--card-border)',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = 'var(--primary)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
      e.currentTarget.style.transform = 'translateY(-4px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'var(--card-border)';
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: 'var(--foreground)',
          margin: 0,
          flex: 1,
        }}>{module.name}</h3>
        <Star size={20} color="#fbbf24" fill="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
      </div>
      <p style={{
        fontSize: '14px',
        color: 'var(--text-secondary)',
        margin: 0,
        marginBottom: '16px',
        flex: 1,
        lineHeight: '1.5',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>{module.description}</p>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: 'var(--primary)',
        fontSize: '14px',
        fontWeight: '500',
      }}>
        Details bekijken
        <ArrowRight size={16} />
      </div>
    </div>
  )
}