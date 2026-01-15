export default function ModuleCard({ module }: { module: any }) {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}>
      <b>{module.name}</b>
      <p>{module.description}</p>
    </div>
  )
}