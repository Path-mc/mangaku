"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthMenu() {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  // Mengecek apakah ada user yang sedang login saat web dimuat
  useEffect(() => {
    const user = localStorage.getItem('user_mangaku');
    if (user) setUsername(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_mangaku');
    setUsername(null);
    router.refresh(); // Refresh halaman agar riwayat baca menghilang
  };

  // Tampilan JIKA SUDAH LOGIN
// Tampilan JIKA SUDAH LOGIN
  if (username) {
    return (
      <div className="flex items-center gap-4">
        {/* Ubah div ini menjadi Link ke /profile */}
        <Link href="/profile" className="flex items-center gap-2 bg-manga-800 px-4 py-2 rounded-full border border-slate-700 hover:border-manga-accent transition-all cursor-pointer group">
          <div className="w-6 h-6 bg-manga-accent rounded-full flex items-center justify-center text-xs font-bold text-white uppercase group-hover:scale-110 transition-transform">
            {username.charAt(0)}
          </div>
          <span className="text-sm font-bold text-white group-hover:text-manga-accent transition-colors">Halo, {username}!</span>
        </Link>
        <button onClick={handleLogout} className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors">
          Logout
        </button>
      </div>
    );
  }

  // Tampilan JIKA BELUM LOGIN
  return (
    <div className="flex items-center gap-3 shrink-0">
      <Link href="/login" className="text-sm font-bold hover:text-manga-accent transition-colors">
        Masuk
      </Link>
      <Link href="/register" className="text-sm font-bold bg-manga-accent text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors shadow-lg shadow-manga-accent/20">
        Daftar
      </Link>
    </div>
  );
}