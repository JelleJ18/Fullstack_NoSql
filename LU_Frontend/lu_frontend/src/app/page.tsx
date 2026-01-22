'use client'

import ModuleCard from '@/components/ModuleKaart'
import Modal from '@/components/Modal'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Search } from 'lucide-react'
import ModuleKaart from '@/components/ModuleKaart'

export default function Home() {
  const { user } = useAuth()
  const [modules, setModules] = useState<any[]>([])  
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedModule, setSelectedModule] = useState<any>(null)

  useEffect(() => {
    const getModules = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/modules`, {
        credentials: 'include',
      })
      const data = await res.json()
      setModules(Array.isArray(data) ? data : []) 
      setLoading(false)
    }
    getModules()
  }, [])

  const filteredModules = modules.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if(loading) {
    return <p>Loading...</p>
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface)' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 24px 40px',
      }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: 'var(--foreground)',
            marginBottom: '8px',
            lineHeight: '1.2',
          }}>Welkom bij de Keuzemodule App</h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-secondary)',
            fontSize: '14px',
          }}>
            {user ? (
              <>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: 'var(--success)',
                  borderRadius: '50%',
                }}></div>
                <p>Ingelogd als <strong style={{ color: 'var(--foreground)' }}>{user.username}</strong></p>
              </>
            ) : (
              <p>Je bent niet ingelogd</p>
            )}
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--card-background)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '32px',
          border: '1px solid var(--card-border)',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--foreground)',
            marginBottom: '16px',
          }}>Zoek Modules</h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: 'var(--surface)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            transition: 'all 0.2s',
          }}>
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Zoek op naam of beschrijving..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '14px',
                outline: 'none',
                color: 'var(--foreground)',
              }}
            />
          </div>
        </div>

        <div>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--foreground)',
            marginBottom: '24px',
          }}>Beschikbare Modules ({filteredModules.length})</h2>
          
          {filteredModules.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px 24px',
              color: 'var(--text-secondary)',
            }}>
              <p style={{ fontSize: '16px', marginBottom: '8px' }}>Geen modules gevonden</p>
              <p style={{ fontSize: '14px' }}>Probeer een ander zoekterm</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
            }}>
              {filteredModules.map((module: any) => (
                <div
                  key={module._id}
                  onClick={() => setSelectedModule(module)}
                  style={{ cursor: 'pointer' }}
                >
                  <ModuleKaart module={module} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal module={selectedModule} isOpen={!!selectedModule} onClose={() => setSelectedModule(null)} />
    </div>
  );
}
