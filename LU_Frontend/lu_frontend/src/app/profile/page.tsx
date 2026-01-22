'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function ProfilePage() {
  const { user, refreshUser, logout } = useAuth()
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRefresh = async () => {
    setPending(true)
    setError(null)
    try {
      await refreshUser()
    } catch (err) {
      console.error(err)
      setError('Kon profiel niet verversen.')
    } finally {
      setPending(false)
    }
  }

  const handleLogout = async () => {
    setPending(true)
    setError(null)
    try {
      await logout()
      router.push('/login')
    } catch (err) {
      console.error(err)
      setError('Uitloggen is niet gelukt.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto', padding: '24px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--card-background)' }}>
      <h1 style={{ color: 'var(--foreground)', marginTop: 0 }}>Profiel</h1>
      <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
        Bekijk je accountgegevens.
      </p>

      <div style={{ marginTop: '16px' }}>
        <p style={{ margin: '0 0 6px', color: 'var(--text-muted)' }}>Gebruikersnaam</p>
        <p style={{ margin: 0, fontWeight: 600, color: 'var(--foreground)' }}>{user?.username || 'Onbekend'}</p>
      </div>

      {!user && (
        <div style={{ marginTop: '14px', padding: '12px', background: 'var(--warning-bg)', border: '1px solid var(--warning-border)', borderRadius: '6px' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 600, color: 'var(--foreground)' }}>Niet ingelogd</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link href="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>Naar login</Link>
            <Link href="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>Account aanmaken</Link>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
        <button 
          onClick={handleRefresh} 
          disabled={pending} 
          style={{ 
            padding: '10px 14px',
            backgroundColor: 'var(--border-color)',
            color: 'var(--foreground)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            cursor: pending ? 'not-allowed' : 'pointer',
            opacity: pending ? 0.6 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {pending ? 'Bezig...' : 'Ververs'}
        </button>
        <button 
          onClick={handleLogout} 
          disabled={pending} 
          style={{ 
            padding: '10px 14px',
            backgroundColor: 'var(--border-color)',
            color: 'var(--foreground)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            cursor: pending ? 'not-allowed' : 'pointer',
            opacity: pending ? 0.6 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          Log uit
        </button>
      </div>

      {error && (
        <p style={{ marginTop: '12px', color: 'var(--error)', fontWeight: 600 }}>
          {error}
        </p>
      )}
    </div>
  )
}