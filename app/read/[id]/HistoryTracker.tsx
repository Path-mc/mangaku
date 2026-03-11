"use client"; // Wajib pakai ini karena kita butuh akses ke browser (localStorage)

import { useEffect } from 'react';
import { saveHistory } from '@/lib/history';

export default function HistoryTracker({ comic, chapterId, chapterTitle }: any) {
  useEffect(() => {
    // 1. Ambil nama user yang sedang login dari memori browser
    const username = localStorage.getItem('user_mangaku');
    
    // 2. Jika user login dan data komik ada, simpan ke Supabase
    if (username && comic) {
      saveHistory(username, comic, chapterId, chapterTitle);
    }
  }, [comic, chapterId, chapterTitle]); // Berjalan setiap kali chapter berubah

  return null; // Komponen ini bekerja di balik layar, jadi tidak perlu tampil apa-apa
}