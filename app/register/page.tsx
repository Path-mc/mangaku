"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Cek apakah username sudah dipakai orang lain
    const { data: existingUser } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      setError('Username sudah dipakai, coba nama lain!');
      return;
    }

    // 2. Simpan user baru ke database
    const { error: insertError } = await supabase
      .from('users')
      .insert([{ username, password }]);

    if (insertError) {
      setError('Terjadi kesalahan sistem. Coba lagi.');
    } else {
      setSuccess(true);
      // Otomatis pindah ke halaman login setelah 2 detik
      setTimeout(() => router.push('/login'), 2000);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-manga-900 p-6">
      <div className="w-full max-w-md bg-manga-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
        <h1 className="text-3xl font-black text-manga-accent mb-2 text-center italic tracking-tighter">BUAT AKUN</h1>
        <p className="text-center text-manga-subtext mb-6 text-sm">Simpan riwayat bacaan komikmu!</p>
        
        {success ? (
          <div className="bg-green-500/20 border border-green-500 text-green-400 p-4 rounded-xl text-center font-bold">
            Pendaftaran berhasil! Mengalihkan ke halaman Login...
          </div>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="Buat Username" 
              className="bg-manga-900 border border-slate-700 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-manga-accent"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input 
              type="password" 
              placeholder="Buat Password" 
              className="bg-manga-900 border border-slate-700 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-manga-accent"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}
            <button type="submit" className="bg-manga-accent hover:bg-blue-600 text-white py-4 rounded-xl font-black transition-all shadow-lg shadow-manga-accent/20">
              DAFTAR SEKARANG
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-manga-subtext">
          Sudah punya akun? <Link href="/login" className="text-manga-accent font-bold hover:underline">Masuk di sini</Link>
        </div>
      </div>
    </main>
  );
}