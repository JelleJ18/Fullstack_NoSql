'use client'; // Zorg dat dit een client component is, zodat je fetch in de browser draait

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Page() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/hello')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.text(); // backend retourneert een plain string
      })
      .then((data) => setMessage(data))
      .catch((err) => {
        console.error(err);
        setError(String(err));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1>React Frontend (Next.js)</h1>
      <Link href="/register">Account aanmaken</Link>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : (
        <p>Backend says: {message}</p>
      )}
    </div>
  );
}
