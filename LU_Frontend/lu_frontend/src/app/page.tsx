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
  const [enrolledModuleIds, setEnrolledModuleIds] = useState<string[]>([])
  const [filterLevel, setFilterLevel] = useState('')
  const [filterLocation, setFilterLocation] = useState('')
  const [filterStudyCredit, setFilterStudyCredit] = useState('')

  useEffect(() => {
    const getModules = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/modules`, {
        credentials: 'include',
      })
      const data = await res.json()
      setModules(Array.isArray(data) ? data : []) 
      setLoading(false)
    }
    
    const getEnrolled = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/modules`, {
          credentials: 'include',
        })
        const data = await res.json()
        // API returns array of IDs directly, not objects
        const ids = Array.isArray(data) ? data : []
        setEnrolledModuleIds(ids)
      } catch (err) {
        console.log('No enrolled modules yet')
      }
    }

    getModules()
    if (user) getEnrolled()
  }, [user])

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = !filterLevel || module.level === filterLevel
    const matchesLocation = !filterLocation || module.location === filterLocation
    const matchesStudyCredit = !filterStudyCredit || module.studycredit?.toString() === filterStudyCredit
    
    return matchesSearch && matchesLevel && matchesLocation && matchesStudyCredit
  });

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
            marginBottom: '16px',
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
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Niveau</label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: 'var(--foreground)',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="">Alle niveaus</option>
                {Array.from(new Set(modules.map(m => m.level).filter(Boolean))).sort().map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Locatie</label>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: 'var(--foreground)',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="">Alle locaties</option>
                {Array.from(new Set(modules.map(m => m.location).filter(Boolean))).sort().map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Studiepunten (EC)</label>
              <select
                value={filterStudyCredit}
                onChange={(e) => setFilterStudyCredit(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: 'var(--foreground)',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="">Alle studiepunten</option>
                {Array.from(new Set(modules.map(m => m.studycredit).filter(Boolean))).sort((a, b) => a - b).map(credit => (
                  <option key={credit} value={credit}>{credit} EC</option>
                ))}
              </select>
            </div>
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
                  <ModuleKaart 
                    module={module} 
                    isEnrolled={enrolledModuleIds.includes(module._id)}
                    onEnroll={async (moduleId) => {
                      try {
                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/modules/${moduleId}`, {
                          method: 'POST',
                          credentials: 'include',
                        })
                        if (res.ok) {
                          setEnrolledModuleIds([...enrolledModuleIds, moduleId])
                        } else if (res.status === 400) {
                          const error = await res.json()
                          alert(`Inschrijven niet mogelijk: ${error.message || 'Je bent al ingeschreven voor deze module'}`)
                        } else {
                          alert('Inschrijven mislukt')
                        }
                      } catch (err) {
                        console.error('Inschrijven mislukt:', err)
                      }
                    }}
                  />
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
