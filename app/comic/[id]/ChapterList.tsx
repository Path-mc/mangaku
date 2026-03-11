"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ChapterList({ chapters, comicId }: { chapters: any[], comicId: string }) {
  const [readIndex, setReadIndex] = useState<number>(-1);

  useEffect(() => {
    const fetchHistory = async () => {
      const username = localStorage.getItem('user_mangaku');
      if (!username) return;

      const { data } = await supabase
        .from('read_history')
        .select('last_chapter_id')
        .eq('username', username)
        .eq('comic_id', comicId)
        .single();

      if (data && data.last_chapter_id) {
        const index = chapters.findIndex(ch => ch.endpoint.includes(data.last_chapter_id));
        if (index !== -1) {
          setReadIndex(index);
        }
      }
    };

    fetchHistory();
  }, [comicId, chapters]);

  return (
    <div className="grid grid-cols-2 gap-2 md:gap-4">
      {chapters.map((ch: any, idx: number) => {
        const chId = ch.endpoint.replace('/ch/', '').replace(/\//g, '');
        const isRead = readIndex !== -1 && idx >= readIndex;

        // TRIK CERDAS: Menghapus teks "Chapter " (tidak peduli huruf besar/kecil) dari nama bawaan API
        const cleanName = ch.name.replace(/Chapter\s*/ig, '').trim();

        return (
          <Link 
            key={idx} 
            href={`/read/${chId}`} 
            className={`flex justify-between items-center p-3 md:p-5 rounded-xl md:rounded-2xl border transition-all group ${
              isRead 
                ? 'bg-manga-900/30 border-slate-800 opacity-50 hover:opacity-100 hover:border-slate-600' 
                : 'bg-manga-900/60 border-slate-700 hover:bg-manga-accent hover:border-manga-accent'
            }`}
          >
            {/* Ukuran font dibesarkan sedikit ke text-sm karena ruang sudah lega */}
            <span className={`font-bold text-sm md:text-base truncate mr-2 transition-colors ${
              isRead ? 'text-slate-500 group-hover:text-slate-300' : 'text-white group-hover:text-white'
            }`}>
              {/* Kita tambahkan singkatan "Ch." di depannya */}
              Ch. {cleanName}
            </span>
            <span className={`px-2 py-1 md:px-3 md:py-1 rounded-md md:rounded-lg text-[10px] md:text-xs font-black shrink-0 ${
              isRead 
                ? 'text-slate-500 bg-slate-800 group-hover:text-white group-hover:bg-slate-700' 
                : 'text-manga-accent bg-manga-accent/10 group-hover:text-white group-hover:bg-manga-accent/20'
            }`}>
              {isRead ? 'DIBACA' : 'BACA'}
            </span>
          </Link>
        );
      })}
    </div>
  );
}