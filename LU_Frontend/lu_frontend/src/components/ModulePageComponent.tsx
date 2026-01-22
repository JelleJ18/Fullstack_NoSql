'use client'

export default function ModulePageComponent({ module }: { module: any }) {
  return (
    <div style={{ padding: '20px' }}>
      <h1>{module.name}</h1>
      <p>{module.description}</p>
    </div>
  )
}