"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfilePage() {
  const [username, setUsername] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. Cek User & Ambil Data History
  useEffect(() => {
    const user = localStorage.getItem('user_mangaku');
    if (!user) {
      router.push('/login'); // Lempar ke login kalau belum masuk
      return;
    }
    setUsername(user);
    fetchAllHistory(user);
  }, [router]);

  const fetchAllHistory = async (user: string) => {
    const { data } = await supabase
      .from('read_history')
      .select('*')
      .eq('username', user)
      .order('updated_at', { ascending: false }); // Ambil SEMUA history terbaru ke terlama
    
    setHistory(data || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-manga-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-manga-accent"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-10 max-w-7xl mx-auto bg-manga-900 text-white">
      {/* Navbar Simple */}
      <nav className="mb-10 flex items-center justify-between">
        <Link href="/" className="text-manga-subtext hover:text-manga-accent font-bold transition-colors flex items-center gap-2">
          ← Kembali ke Beranda
        </Link>
        <h1 className="text-2xl font-black italic tracking-tighter text-manga-accent">MANGAKU</h1>
      </nav>

      {/* Kartu Profil Utama */}
      <div className="bg-manga-800 rounded-3xl p-8 border border-slate-700 mb-12 flex flex-col md:flex-row items-center gap-8 shadow-xl">
        <div className="w-24 h-24 bg-manga-accent rounded-full flex items-center justify-center text-5xl font-black text-white uppercase shadow-lg shadow-manga-accent/30 shrink-0">
          {username?.charAt(0)}
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-black mb-2">{username}</h2>
          <div className="flex gap-4 justify-center md:justify-start">
             <p className="text-manga-subtext bg-manga-900 px-4 py-2 rounded-xl text-sm border border-slate-700">
               Total Komik Dibaca: <strong className="text-manga-accent text-lg ml-1">{history.length}</strong>
             </p>
          </div>
        </div>
      </div>

      {/* Daftar Semua Riwayat Bacaan */}
      <div>
        <h3 className="text-2xl font-black mb-6 border-b border-slate-800 pb-4 flex items-center gap-3">
           📚 Riwayat Bacaan
        </h3>
        
        {history.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
            {history.map((item) => (
              <Link href={`/comic/${item.comic_id}`} key={item.comic_id} className="group h-full">
                <div className="bg-manga-800 rounded-2xl overflow-hidden transition-all hover:ring-2 hover:ring-manga-accent h-full flex flex-col border border-slate-700/50">
                  <div className="aspect-[3/4] relative">
                    <Image src={item.comic_image} alt={item.comic_title} fill className="object-cover" unoptimized />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                       <p className="text-[10px] text-gray-300 italic mb-1">Terakhir dibaca:</p>
                       <p className="text-xs font-bold text-manga-accent line-clamp-1 bg-black/50 px-2 py-1 rounded w-fit">{item.last_chapter_title}</p>
                    </div>
                  </div>
                  <div className="p-3 flex-grow">
                    <h4 className="text-sm font-bold line-clamp-2 group-hover:text-manga-accent transition-colors">
                      {item.comic_title}
                    </h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-manga-800 rounded-3xl border border-slate-700 border-dashed">
            <p className="text-manga-subtext mb-2">Kamu belum membaca komik apapun.</p>
            <Link href="/" className="text-manga-accent hover:underline font-bold">Cari komik sekarang!</Link>
          </div>
        )}
      </div>
    </main>
  );
}