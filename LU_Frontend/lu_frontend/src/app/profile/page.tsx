'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function ProfilePage() {
  const { user, refreshUser, logout } = useAuth()
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [success, setSuccess] = useState<string | null>(null)
  const [enrolledModules, setEnrolledModules] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      const loadModules = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/modules`, {
            credentials: 'include',
          })
          if (res.ok) {
            const moduleIds = await res.json()
            
            if (Array.isArray(moduleIds) && moduleIds.length > 0) {
              const moduleDetailsPromises = moduleIds.map((id: string) =>
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/modules/${id}`, {
                  credentials: 'include',
                }).then(r => r.json())
              )
              const moduleDetails = await Promise.all(moduleDetailsPromises)
              setEnrolledModules(moduleDetails)
            } else {
              setEnrolledModules([])
            }
          }
        } catch (err) {
          console.error('Error loading modules:', err)
        }
      }
      loadModules()
    }
  }, [user])

  const handleRefresh = async () => {
    setPending(true)
    setError(null)
    try {
      await refreshUser()
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/modules`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setEnrolledModules(Array.isArray(data) ? data : [])
      }
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

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUsername.trim()) {
      setError('Vul een geldige gebruikersnaam in')
      return
    }
    
    setPending(true)
    setError(null)
    setSuccess(null)
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/username`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: newUsername }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.message || 'Kon gebruikersnaam niet wijzigen')
        return
      }

      setSuccess('Gebruikersnaam succesvol gewijzigd!')
      setEditing(false)
      setNewUsername('')
      await refreshUser()
    } catch (err) {
      console.error(err)
      setError('Er is iets misgegaan')
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
        {!editing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <p style={{ margin: 0, fontWeight: 600, color: 'var(--foreground)' }}>{user?.username || 'Onbekend'}</p>
            {user && (
              <button
                onClick={() => {
                  setEditing(true)
                  setNewUsername(user.username)
                  setError(null)
                  setSuccess(null)
                }}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.875rem',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Wijzig
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleUpdateUsername} style={{ marginTop: '8px' }}>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Nieuwe gebruikersnaam"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--foreground)',
                marginBottom: '10px',
              }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                disabled={pending}
                style={{
                  padding: '8px 14px',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: pending ? 'not-allowed' : 'pointer',
                  opacity: pending ? 0.6 : 1,
                }}
              >
                {pending ? 'Bezig...' : 'Opslaan'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false)
                  setNewUsername('')
                  setError(null)
                }}
                disabled={pending}
                style={{
                  padding: '8px 14px',
                  backgroundColor: 'var(--border-color)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  cursor: pending ? 'not-allowed' : 'pointer',
                  opacity: pending ? 0.6 : 1,
                }}
              >
                Annuleer
              </button>
            </div>
          </form>
        )}
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

      {success && (
        <p style={{ marginTop: '12px', color: 'var(--success)', fontWeight: 600 }}>
          {success}
        </p>
      )}

      {user && (
        <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid var(--border-color)' }}>
          <h2 style={{ color: 'var(--foreground)', marginTop: 0 }}>Mijn Inschrijvingen ({enrolledModules.length})</h2>
          {enrolledModules.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>Je bent nog niet ingeschreven voor modules. <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Bekijk beschikbare modules</Link></p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px', marginTop: '16px' }}>
              {enrolledModules.map((module: any) => (
                <div key={module._id} style={{
                  padding: '16px',
                  backgroundColor: 'var(--card-background)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '8px'
                }}>
                  <h3 style={{ margin: '0 0 8px', color: 'var(--foreground)', fontSize: '16px', fontWeight: 600 }}>{module.name}</h3>
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/modules/${module._id}`, {
                          method: 'DELETE',
                          credentials: 'include',
                        })
                        if (res.ok) {
                          // Reload enrolled modules after unenroll
                          const reloadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/modules`, {
                            credentials: 'include',
                          })
                          if (reloadRes.ok) {
                            const moduleIds = await reloadRes.json()
                            if (Array.isArray(moduleIds) && moduleIds.length > 0) {
                              const moduleDetailsPromises = moduleIds.map((id: string) =>
                                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/modules/${id}`, {
                                  credentials: 'include',
                                }).then(r => r.json())
                              )
                              const moduleDetails = await Promise.all(moduleDetailsPromises)
                              setEnrolledModules(moduleDetails)
                            } else {
                              setEnrolledModules([])
                            }
                          }
                          setSuccess('Uitgeschreven!')
                          setTimeout(() => setSuccess(null), 2000)
                        } else {
                          setError('Uitschrijven mislukt')
                        }
                      } catch (err) {
                        console.error('Uitschrijven mislukt:', err)
                        setError('Uitschrijven mislukt')
                      }
                    }}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'var(--error)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 500
                    }}
                  >
                    Uitschrijven
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}