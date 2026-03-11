"use client";
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

export default function ContinueReading() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const username = localStorage.getItem('user_mangaku');
      if (!username) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('read_history')
        .select('*')
        .eq('username', username)
        .order('updated_at', { ascending: false })
        .limit(10); 

      setHistory(data || []);
      setLoading(false);
    };

    fetchHistory();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 350; 
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading || history.length === 0) return null;

  return (
    <div className="mb-8 md:mb-12">
      <h3 className="text-xl md:text-2xl font-black mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
        <span className="w-1.5 md:w-2 h-6 md:h-8 bg-blue-500 rounded-full animate-pulse"></span>
        LANJUT BACA
      </h3>
      
      <div className="relative group">
        
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 hidden md:flex items-center justify-center w-12 h-12 bg-manga-900 text-white rounded-full border border-slate-700 shadow-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-manga-accent hover:border-manga-accent hover:scale-110"
          aria-label="Geser Kiri"
        >
          &#10094;
        </button>

        <div 
          ref={scrollRef} 
          className="flex overflow-x-auto gap-3 md:gap-4 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {history.map((item) => {
            // TRIK 1: Ambil Judul Asli dari ID
            const originalTitle = item.comic_id
              .split('-')
              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');

            // TRIK 2: Ekstrak Angka Chapter & Buang Angka 0 di Depan
            // Kita cari grup angka di dalam teks (contoh: dari "Chapter 08" kita tangkap "08")
            const chapterMatch = item.last_chapter_title.match(/chapter\s*([0-9.]+)/i);
            let cleanChapter = item.last_chapter_title; // Default jaga-jaga kalau gagal match

            if (chapterMatch && chapterMatch[1]) {
              // ParseFloat akan otomatis mengubah "05" jadi 5, "08" jadi 8, dsb.
              const chapterNumber = parseFloat(chapterMatch[1]);
              cleanChapter = `Chapter ${chapterNumber}`;
            }

            return (
              <Link 
                href={`/comic/${item.comic_id}`} 
                key={item.comic_id}
                className="flex shrink-0 w-[85vw] sm:w-[300px] md:w-[350px] gap-3 md:gap-4 bg-manga-800 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-700 hover:border-manga-accent transition-all group snap-center"
              >
                {/* Gambar */}
                <div className="relative w-16 h-24 md:w-20 md:h-28 shrink-0 rounded-md md:rounded-lg overflow-hidden">
                  <Image src={item.comic_image} alt={originalTitle} fill className="object-cover" unoptimized />
                </div>
                
                {/* Teks */}
                <div className="flex flex-col justify-center overflow-hidden">
                  <h4 className="font-bold text-xs md:text-sm truncate group-hover:text-manga-accent">{originalTitle}</h4>
                  
                  {/* Gunakan variabel cleanChapter yang sudah disempurnakan */}
                  <p className="text-[10px] md:text-xs text-manga-subtext mt-1 md:mt-1 italic truncate">{cleanChapter}</p>
                  
                  <span className="mt-2 md:mt-3 text-[8px] md:text-[10px] bg-manga-accent/20 text-manga-accent px-1.5 py-0.5 md:px-2 md:py-1 rounded-md font-bold w-fit">
                    KLIK UNTUK LANJUT →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 hidden md:flex items-center justify-center w-12 h-12 bg-manga-900 text-white rounded-full border border-slate-700 shadow-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-manga-accent hover:border-manga-accent hover:scale-110"
          aria-label="Geser Kanan"
        >
          &#10095;
        </button>
        
      </div>
    </div>
  );
}