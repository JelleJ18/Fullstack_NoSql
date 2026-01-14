'use client';
import { useState } from 'react';

export default function RegisterForm() {
  const [form, setForm] = useState({ username: '', password: '', email: '' });
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    setLoading(true);
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      setResult('✅ Account aangemaakt!');
      setForm({ username: '', password: '', email: '' });
    } else {
      const data = await res.json();
      setResult('❌ Fout: ' + (data.message || res.statusText));
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: 'var(--form-bg, #f4f4f4ff)',
        borderRadius: 12,
        boxShadow: '0 2px 16px #0001',
        padding: 28,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        fontFamily: 'system-ui, sans-serif',
        border: '1px solid #4b4b4bff',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Account aanmaken</h2>
      <label style={{ fontWeight: 500 }}>
        Gebruikersnaam
        <input
          style={{
            width: '100%',
            padding: '8px 10px',
            marginTop: 4,
            borderRadius: 6,
            border: '1px solid #ccc',
            fontSize: 16,
          }}
          placeholder="Gebruikersnaam"
          value={form.username}
          onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
          required
          autoFocus
        />
      </label>
      <label style={{ fontWeight: 500 }}>
        Wachtwoord
        <input
          style={{
            width: '100%',
            padding: '8px 10px',
            marginTop: 4,
            borderRadius: 6,
            border: '1px solid #ccc',
            fontSize: 16,
          }}
          type="password"
          placeholder="Wachtwoord"
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          required
        />
      </label>
      <label style={{ fontWeight: 500 }}>
        E-mail (optioneel)
        <input
          style={{
            width: '100%',
            padding: '8px 10px',
            marginTop: 4,
            borderRadius: 6,
            border: '1px solid #ccc',
            fontSize: 16,
          }}
          type="email"
          placeholder="E-mail"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
      </label>
      <button
        type="submit"
        style={{
          background: '#0a7d0a',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '10px 0',
          fontWeight: 600,
          fontSize: 17,
          marginTop: 8,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'opacity 0.2s',
        }}
        disabled={loading}
      >
        {loading ? 'Bezig...' : 'Registreren'}
      </button>
      {result && (
        <div
          style={{
            marginTop: 6,
            textAlign: 'center',
            color: result.startsWith('✅') ? '#0a7d0a' : '#b00020',
            fontWeight: 500,
          }}
        >
          {result}
        </div>
      )}
    </form>
  );
}