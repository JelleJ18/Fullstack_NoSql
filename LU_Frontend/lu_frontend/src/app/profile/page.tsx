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
    <div style={{ maxWidth: '480px', margin: '40px auto', padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fff' }}>
      <h1>Profiel</h1>
      <p style={{ color: '#475569', marginTop: '6px' }}>
        Bekijk je accountgegevens, ververs de sessie of log uit.
      </p>

      <div style={{ marginTop: '16px' }}>
        <p style={{ margin: '0 0 6px', color: '#64748b' }}>Gebruikersnaam</p>
        <p style={{ margin: 0, fontWeight: 600 }}>{user?.username || 'Onbekend'}</p>
      </div>

      <div style={{ marginTop: '12px' }}>
        <p style={{ margin: '0 0 6px', color: '#64748b' }}>Status</p>
        <p style={{ margin: 0, fontWeight: 600, color: user ? '#15803d' : '#b91c1c' }}>
          {user ? 'Ingelogd' : 'Niet ingelogd'}
        </p>
      </div>

      {!user && (
        <div style={{ marginTop: '14px', padding: '12px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '6px' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Niet ingelogd</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link href="/login">Naar login</Link>
            <Link href="/register">Account aanmaken</Link>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
        <button onClick={handleRefresh} disabled={pending} style={{ padding: '10px 14px' }}>
          {pending ? 'Bezig...' : 'Ververs'}
        </button>
        <button onClick={handleLogout} disabled={pending} style={{ padding: '10px 14px' }}>
          Log uit
        </button>
      </div>

      {error && (
        <p style={{ marginTop: '12px', color: '#b91c1c', fontWeight: 600 }}>
          {error}
        </p>
      )}
    </div>
  )
}