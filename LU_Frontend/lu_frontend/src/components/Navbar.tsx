'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const linkStyle = {
    color: '#333',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    fontWeight: '500',
  } as React.CSSProperties

  const buttonStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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

  return (
    <header style={{
      background: 'linear-gradient(to right, #ffffff, #f8f9fa)',
      borderBottom: '1px solid #e0e0e0',
      padding: '1rem 2rem',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
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
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Link href="/" style={{ ...linkStyle, fontWeight: '700', fontSize: '18px', color: '#667eea' }}>
           Keuzemodule App
          </Link>
          <div style={{ width: '1px', height: '20px', background: '#e0e0e0', margin: '0 8px' }} />
          <Link 
            href="/" 
            style={linkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f0f0f0'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            Home
          </Link>
          {user && (<Link 
                href="/profile" 
                style={linkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0f0f0'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                Profile
              </Link>)}

          {!user && (
            <>
              <Link 
                href="/login" 
                style={linkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0f0f0'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                Login
              </Link>
              <Link 
                href="/register" 
                style={linkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0f0f0'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                Register
              </Link>
            </>
          )}
        </div>
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
            Logout
          </button>
        )}
      </nav>
    </header>
  )
}
