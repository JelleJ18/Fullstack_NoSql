import { Star, ArrowRight, Check } from 'lucide-react'
import { useState } from 'react'

export default function ModuleKaart({ module, isEnrolled = false, onEnroll }: { module: any; isEnrolled?: boolean; onEnroll?: (moduleId: string) => void }) {
  const [loading, setLoading] = useState(false)

  const handleEnroll = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!onEnroll) return
    
    setLoading(true)
    try {
      await onEnroll(module._id)
    } finally {
      setLoading(false)
    }
  }

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
        marginBottom: '12px'
      }}>
        Details bekijken
        <ArrowRight size={16} />
      </div>

      <button
        onClick={handleEnroll}
        disabled={loading || isEnrolled}
        style={{
          padding: '10px 16px',
          backgroundColor: isEnrolled ? 'var(--success)' : 'var(--primary)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: isEnrolled || loading ? 'not-allowed' : 'pointer',
          fontWeight: '500',
          fontSize: '14px',
          opacity: isEnrolled || loading ? 0.7 : 1,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          justifyContent: 'center',
          transition: 'all 0.2s'
        }}
      >
        {isEnrolled ? (
          <>
            <Check size={16} />
            Ingeschreven
          </>
        ) : (
          loading ? 'Bezig...' : 'Inschrijven'
        )}
      </button>
    </div>
  )
}