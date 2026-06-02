"use client"; // Wajib pakai ini karena kita butuh akses ke browser (localStorage)

import { useEffect } from 'react';
import { saveHistory } from '@/lib/history';
import { saveReadingProgress } from '@/lib/readingProgress';

interface HistoryTrackerProps {
  comic: {
    id: string;
    title: string;
    thumbnail: string;
  };
  chapterId: string;
  chapterTitle: string;
}

export default function HistoryTracker({ comic, chapterId, chapterTitle }: HistoryTrackerProps) {
  useEffect(() => {
    const saveReaderState = async () => {
      // 1. Ambil nama user yang sedang login dari memori browser
      const username = localStorage.getItem('user_mangaku');
      
      // 2. Jika user login dan data komik ada, simpan ke Supabase
      if (username && comic) {
        await saveHistory(username, comic, chapterId, chapterTitle);
        await saveReadingProgress({
          user_id: username,
          comic_id: comic.id,
          comic_title: comic.title,
          comic_thumbnail: comic.thumbnail,
          chapter_id: chapterId,
          chapter_title: chapterTitle,
        });
      }
    };

    saveReaderState().catch((error) => {
      console.error('Gagal menyimpan progress baca:', error);
    });
  }, [comic, chapterId, chapterTitle]); // Berjalan setiap kali chapter berubah

  return null; // Komponen ini bekerja di balik layar, jadi tidak perlu tampil apa-apa
}
