'use client'

import ModuleCard from '@/components/ModuleKaart'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function Home() {
  const { user } = useAuth()
  const [modules, setModules] = useState<any[]>([])  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getModules = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/modules`, {
        credentials: 'include',
      })
      const data = await res.json()
      console.log('Modules:', data)
      setModules(Array.isArray(data) ? data : []) 
      setLoading(false)
    }
    getModules()
  }, [])

  if(loading) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <h1>Welkom bij de de keuzemodule webapp!</h1>
      {user ? (
      <p>Je bent ingelogd als: <strong>{user.username}</strong></p>
    ) : (
      <p>Je bent niet ingelogd</p>
    )}
    
      <b>Modules</b>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',  
      gap: '20px',  
      padding: '20px',
    }}>
      {modules.map((module: any) => (
        <ModuleCard key={module._id} module={module} />
      ))}
    </div>
    </div>
  );
}
