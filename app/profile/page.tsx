"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getFavorites } from '@/lib/favorites';
import { getReadingProgress } from '@/lib/readingProgress';

interface ReadHistoryItem {
  comic_id: string;
  comic_title: string;
  comic_image: string;
  last_chapter_title: string;
}

interface FavoriteItem {
  id?: number;
  comic_id: string;
  comic_title: string;
  comic_thumbnail: string;
}

interface ReadingProgressItem {
  id?: number;
  comic_id: string;
  comic_title: string;
  comic_thumbnail: string;
  first_read_at: string;
  first_chapter_title: string;
  last_read_at: string;
  last_chapter_id: string;
  last_chapter_title: string;
}

function formatJakartaDate(dateValue: string) {
  const date = new Date(dateValue);
  const day = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    timeZone: 'Asia/Jakarta',
  }).format(date);
  const dateText = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(date);
  const timeText = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  }).format(date);

  return {
    day,
    detail: `${dateText} | ${timeText} WIB`,
  };
}

export default function ProfilePage() {
  const [username] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('user_mangaku');
  });
  const [history, setHistory] = useState<ReadHistoryItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [readingProgress, setReadingProgress] = useState<ReadingProgressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. Cek User & Ambil Data History
  useEffect(() => {
    if (!username) {
      router.push('/login'); // Lempar ke login kalau belum masuk
      return;
    }

    const fetchProfileData = async () => {
      const historyRequest = supabase
        .from('read_history')
        .select('*')
        .eq('username', username)
        .order('updated_at', { ascending: false }); // Ambil SEMUA history terbaru ke terlama

      try {
        const [historyResult, favoritesResult, progressResult] = await Promise.all([
          historyRequest,
          getFavorites(username),
          getReadingProgress(username),
        ]);
        
        setHistory(historyResult.data || []);
        setFavorites(favoritesResult);
        setReadingProgress(progressResult);
      } catch (error) {
        console.error('Gagal mengambil data profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [router, username]);

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
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
             <p className="text-manga-subtext bg-manga-900 px-4 py-2 rounded-xl text-sm border border-slate-700">
               Total Komik Dibaca: <strong className="text-manga-accent text-lg ml-1">{history.length}</strong>
             </p>
             <p className="text-manga-subtext bg-manga-900 px-4 py-2 rounded-xl text-sm border border-slate-700">
               Favorit: <strong className="text-manga-accent text-lg ml-1">{favorites.length}</strong>
             </p>
          </div>
        </div>
      </div>

      {/* Daftar Manga Favorit */}
      <section className="mb-12">
        <h3 className="text-2xl font-black mb-6 border-b border-slate-800 pb-4 flex items-center gap-3">
           Favorit Saya
        </h3>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {favorites.map((item) => (
              <Link href={`/comic/${item.comic_id}`} key={item.id || item.comic_id} className="group h-full">
                <div className="bg-manga-800 rounded-2xl overflow-hidden transition-all hover:ring-2 hover:ring-manga-accent h-full flex flex-col border border-slate-700/50">
                  <div className="aspect-[3/4] relative">
                    <Image src={item.comic_thumbnail} alt={item.comic_title} fill className="object-cover" unoptimized />
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
          <div className="text-center py-12 bg-manga-800 rounded-3xl border border-slate-700 border-dashed">
            <p className="text-manga-subtext mb-2">Belum ada manga favorit.</p>
            <Link href="/" className="text-manga-accent hover:underline font-bold">Cari manga untuk disimpan</Link>
          </div>
        )}
      </section>

      {/* Progress Baca */}
      <section className="mb-12">
        <h3 className="text-2xl font-black mb-6 border-b border-slate-800 pb-4 flex items-center gap-3">
           Progress Baca
        </h3>

        {readingProgress.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {readingProgress.map((item) => {
              const firstRead = formatJakartaDate(item.first_read_at);
              const lastRead = formatJakartaDate(item.last_read_at);

              return (
                <div key={item.id || item.comic_id} className="bg-manga-800 rounded-2xl border border-slate-700/70 p-4 md:p-5 flex gap-4">
                  <Link href={`/comic/${item.comic_id}`} className="relative w-20 h-28 md:w-24 md:h-32 shrink-0 rounded-xl overflow-hidden">
                    <Image src={item.comic_thumbnail} alt={item.comic_title} fill className="object-cover" unoptimized />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link href={`/comic/${item.comic_id}`} className="font-black text-base md:text-lg line-clamp-2 hover:text-manga-accent transition-colors">
                      {item.comic_title}
                    </Link>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      <div className="bg-manga-900/70 rounded-xl p-3 border border-slate-800">
                        <p className="text-[10px] uppercase tracking-widest text-manga-subtext font-bold mb-1">Awal baca</p>
                        <p className="text-sm font-bold">{firstRead.day}</p>
                        <p className="text-xs text-manga-subtext mt-1">{firstRead.detail}</p>
                        <p className="text-xs text-manga-accent font-bold mt-2 line-clamp-1">{item.first_chapter_title}</p>
                      </div>

                      <div className="bg-manga-900/70 rounded-xl p-3 border border-slate-800">
                        <p className="text-[10px] uppercase tracking-widest text-manga-subtext font-bold mb-1">Terakhir baca</p>
                        <p className="text-sm font-bold">{lastRead.day}</p>
                        <p className="text-xs text-manga-subtext mt-1">{lastRead.detail}</p>
                        <Link href={`/read/${item.last_chapter_id}`} className="block text-xs text-manga-accent font-bold mt-2 line-clamp-1 hover:underline">
                          {item.last_chapter_title}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-manga-800 rounded-3xl border border-slate-700 border-dashed">
            <p className="text-manga-subtext mb-2">Progress baca belum tersedia.</p>
            <Link href="/" className="text-manga-accent hover:underline font-bold">Mulai baca manga</Link>
          </div>
        )}
      </section>

      {/* Daftar Semua Riwayat Bacaan */}
      <section>
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
      </section>
    </main>
  );
}
