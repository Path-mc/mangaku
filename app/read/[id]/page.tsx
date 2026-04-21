import Link from 'next/link';
import HistoryTracker from './HistoryTracker'; // <-- Import Tracker

// 1. Fetch Gambar Chapter
async function getChapterDetail(id: string) {
  const res = await fetch(`https://CiiteddPath-komik-api.hf.space/api/comic/chapter/ch/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

// 2. Fetch Info Komik
async function getComicDetail(comicId: string) {
  const res = await fetch(`https://CiiteddPath-komik-api.hf.space/api/comic/info/manga/${comicId}/`, { cache: 'no-store' });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export default async function ReadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const chapterIndex = id.lastIndexOf("-chapter-");
  const comicId = chapterIndex !== -1 ? id.substring(0, chapterIndex) : id;

  const [chapter, comicInfo] = await Promise.all([
    getChapterDetail(id),
    getComicDetail(comicId)
  ]);

  if (!chapter || !comicInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-manga-900 text-white p-10">
        <div className="text-center bg-manga-800 p-10 rounded-3xl border border-slate-700">
          <h1 className="text-2xl font-bold mb-4">Gagal Memuat Gambar</h1>
          <p className="text-manga-subtext mb-6">Chapter ini mungkin belum tersedia atau link salah.</p>
          <Link href={`/comic/${comicId}`} className="px-6 py-2 bg-manga-accent rounded-full font-bold">Kembali ke Detail</Link>
        </div>
      </div>
    );
  }

  // LOGIKA NAVIGASI PINTAR
  let nextChapterId = null;
  let prevChapterId = null;

  if (comicInfo.chapter_list && comicInfo.chapter_list.length > 0) {
    const currentIndex = comicInfo.chapter_list.findIndex((ch: any) => ch.endpoint.includes(id));
    if (currentIndex !== -1) {
      if (currentIndex < comicInfo.chapter_list.length - 1) {
        const prevEndpoint = comicInfo.chapter_list[currentIndex + 1].endpoint;
        prevChapterId = prevEndpoint.replace('/ch/', '').replace(/\//g, '');
      }
      if (currentIndex > 0) {
        const nextEndpoint = comicInfo.chapter_list[currentIndex - 1].endpoint;
        nextChapterId = nextEndpoint.replace('/ch/', '').replace(/\//g, '');
      }
    }
  }

  return (
    <main className="min-h-screen bg-black">
      {/* FITUR HISTORY: 
          Komponen ini otomatis mengirim data ke Supabase 
          setiap kali halaman ini dimuat 
      */}
      <HistoryTracker 
        comic={{ 
          id: comicId, 
          title: comicInfo.title, 
          thumbnail: comicInfo.thumbnail // Memastikan thumbnail tersimpan untuk tampilan "Lanjut Baca"
        }} 
        chapterId={id} 
        chapterTitle={chapter.title} 
      />

      {/* Navbar Atas */}
      <nav className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-xl p-4 z-50 flex justify-between items-center border-b border-white/10">
        <Link href={`/comic/${comicId}`} className="text-manga-accent font-black italic tracking-tighter text-xl">
          MANGAKU
        </Link>
        <h2 className="text-[10px] md:text-sm font-bold text-white truncate px-4">
          {chapter.title}
        </h2>
        <Link href={`/comic/${comicId}`} className="text-[10px] font-bold bg-manga-800 px-3 py-1 rounded text-manga-subtext hover:text-white transition">
           DETAIL
        </Link>
      </nav>

      {/* Gambar Manga */}
      <div className="pt-16 flex flex-col items-center w-full">
        {chapter.image.map((imgUrl: string, index: number) => (
          <div key={index} className="w-full max-w-3xl border-x border-white/5">
            <img 
              src={imgUrl} 
              alt={`Halaman ${index + 1}`}
              className="w-full h-auto block"
              loading={index < 3 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* Navigasi Bawah */}
      <div className="bg-manga-900 p-12 md:p-20 flex flex-col items-center gap-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-xl">
          {prevChapterId ? (
            <Link 
              href={`/read/${prevChapterId}`}
              className="flex-1 text-center py-4 bg-manga-800 hover:bg-slate-700 text-white rounded-xl font-bold border border-slate-700 transition-all"
            >
              ← Chapter Sebelumnya
            </Link>
          ) : (
            <div className="flex-1 text-center py-4 bg-manga-900 text-slate-700 rounded-xl font-bold border border-slate-800 cursor-not-allowed">
              Mentok Bawah
            </div>
          )}

          {nextChapterId ? (
            <Link 
              href={`/read/${nextChapterId}`}
              className="flex-1 text-center py-4 bg-manga-accent hover:bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-manga-accent/20 transition-all"
            >
              Chapter Selanjutnya →
            </Link>
          ) : (
            <div className="flex-1 text-center py-4 bg-manga-900 text-slate-700 rounded-xl font-bold border border-slate-800 cursor-not-allowed">
              Mentok Atas
            </div>
          )}
        </div>

        <Link href={`/comic/${comicId}`} className="text-manga-subtext hover:text-manga-accent transition-colors font-medium">
          Kembali ke Detail Komik
        </Link>
      </div>
    </main>
  );
}
