"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // <-- Jangan lupa import Link ini

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mencocokkan username & password di database
    const { data, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (dbError || !data) {
      setError('Username atau Password salah!');
    } else {
      // Simpan status login di browser (sederhana)
      localStorage.setItem('user_mangaku', username);
      router.push('/');
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-manga-900 p-6">
      <div className="w-full max-w-md bg-manga-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
        <h1 className="text-3xl font-black text-manga-accent mb-6 text-center italic tracking-tighter">MANGAKU LOGIN</h1>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Username" 
            className="bg-manga-900 border border-slate-700 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-manga-accent"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="bg-manga-900 border border-slate-700 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-manga-accent"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}
          <button type="submit" className="bg-manga-accent hover:bg-blue-600 text-white py-4 rounded-xl font-black transition-all shadow-lg shadow-manga-accent/20">
            MASUK
          </button>
        </form>

        {/* --- BAGIAN BARU YANG DITAMBAHKAN --- */}
        <div className="mt-6 text-center text-sm text-manga-subtext">
          Belum punya akun? <Link href="/register" className="text-manga-accent font-bold hover:underline">Daftar di sini</Link>
        </div>
        {/* ----------------------------------- */}

      </div>
    </main>
  );
}