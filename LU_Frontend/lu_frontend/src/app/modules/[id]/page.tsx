'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ModulePageComponent from '@/components/ModulePageComponent'

export default function ModulePage() {
  const params = useParams()
  const [module, setModule] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchModule = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/modules/${params.id}`, {
        credentials: 'include',
      })
      const data = await res.json()
      setModule(data)
      setLoading(false)
    }
    fetchModule()
  }, [params.id])

  if (loading) return <p>Loading...</p>
  if (!module) return <p>Module not found</p>

  return <ModulePageComponent module={module} />
}
