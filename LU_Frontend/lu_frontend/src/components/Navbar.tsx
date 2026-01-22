'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useDarkMode } from '@/context/DarkModeContext'
import { Moon, Sun } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const linkStyle = {
    color: 'var(--foreground)',
    textDecoration: 'none',
    padding: '8px 14px',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    fontWeight: '500',
    fontSize: '14px',
  } as React.CSSProperties

  const buttonStyle = {
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
    color: 'white',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
  } as React.CSSProperties

  const themeToggleStyle = {
    background: 'none',
    border: '1px solid var(--border-color)',
    color: 'var(--foreground)',
    padding: '8px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    marginLeft: '12px',
  } as React.CSSProperties

  return (
    <header style={{
      background: 'var(--card-background)',
      borderBottom: '1px solid var(--border-color)',
      padding: '1rem 0',
      boxShadow: 'var(--shadow-sm)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backdropFilter: 'blur(10px)',
    }}>
      <nav style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
      }}>
        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
          <Link href="/" style={{ 
            ...linkStyle, 
            fontWeight: '700', 
            fontSize: '16px', 
            color: 'var(--primary)',
            padding: '8px 0',
            marginRight: '12px',
          }}>
            📚 Keuzemodules
          </Link>
          <Link 
            href="/" 
            style={linkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface)'
              e.currentTarget.style.color = 'var(--primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--foreground)'
            }}
          >
            Home
          </Link>
          {user && (<Link 
                href="/profile" 
                style={linkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface)'
                  e.currentTarget.style.color = 'var(--primary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'var(--foreground)'
                }}
              >
                Profiel
              </Link>)}

          {!user && (
            <>
              <Link 
                href="/login" 
                style={linkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface)'
                  e.currentTarget.style.color = 'var(--primary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'var(--foreground)'
                }}
              >
                Inloggen
              </Link>
              <Link 
                href="/register" 
                style={linkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface)'
                  e.currentTarget.style.color = 'var(--primary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'var(--foreground)'
                }}
              >
                Registreren
              </Link>
            </>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={toggleDarkMode}
            style={themeToggleStyle}
            title={isDarkMode ? 'Naar light mode' : 'Naar dark mode'}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user && (
            <button 
              onClick={handleLogout} 
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)'
              }}
            >
              Uitloggen
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}
