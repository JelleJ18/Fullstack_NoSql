'use client'

import Navbar from "@/components/Navbar";

export default function RootLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '1rem', marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        © 2025 LU Frontend
      </footer>
    </>
  );
}
