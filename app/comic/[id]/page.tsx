import Image from 'next/image';
import Link from 'next/link';

async function getComicDetail(id: string) {
  const res = await fetch(`https://citedd-komiku-api.hf.space/api/comic/info/manga/${id}/`, {
    cache: 'no-store'
  });
  
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export default async function ComicDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const comic = await getComicDetail(id);

  if (!comic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-manga-900 text-white p-10">
        <div className="text-center bg-manga-800 p-10 rounded-3xl border border-slate-700">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-manga-subtext mb-6">Komik tidak ditemukan di database kami.</p>
          <Link href="/" className="px-6 py-3 bg-manga-accent rounded-full font-bold">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  // TRIK CERDAS: Mengubah ID "houkago-no-luminous" menjadi "Houkago No Luminous"
  const originalTitle = id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <main className="min-h-screen bg-manga-900 text-white p-4 md:p-10 max-w-5xl mx-auto">
      <Link href="/" className="text-manga-accent mb-8 inline-block hover:underline font-bold">
        ← Kembali ke Beranda
      </Link>
      
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Thumbnail Besar */}
        <div className="w-full md:w-72 shrink-0">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden ring-4 ring-manga-800 shadow-2xl shadow-manga-accent/20">
            <Image 
              src={comic.thumbnail} 
              alt={originalTitle} 
              fill 
              className="object-cover" 
              unoptimized 
            />
          </div>
        </div>

        {/* Informasi Utama */}
        <div className="flex-grow">
          {/* Judul Utama menggunakan Original Title */}
          <h1 className="text-4xl md:text-5xl font-black mb-2 leading-tight tracking-tighter">
            {originalTitle}
          </h1>
          
          {/* Judul API diletakkan sebagai Alternatif */}
          <p className="text-manga-subtext italic mb-6">
            Alternatif: {comic.title}
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-sm mb-8 bg-manga-800/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm">
            <div>
              <p className="text-manga-subtext uppercase text-[10px] tracking-widest mb-1">Status</p>
              <p className="font-bold text-manga-accent">{comic.status || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-manga-subtext uppercase text-[10px] tracking-widest mb-1">Author</p>
              <p className="font-bold">{comic.author || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-manga-subtext uppercase text-[10px] tracking-widest mb-1">Type</p>
              <p className="font-bold">{comic.type || 'Manga'}</p>
            </div>
            <div>
              <p className="text-manga-subtext uppercase text-[10px] tracking-widest mb-1">Rating</p>
              <p className="font-bold">{comic.rating || 'N/A'}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {comic.genre && comic.genre.map((g: string) => (
              <span key={g} className="bg-manga-accent/10 text-manga-accent border border-manga-accent/30 px-4 py-1.5 rounded-full text-xs font-bold transition-all hover:bg-manga-accent hover:text-white">
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* List Chapter */}
      <div className="bg-manga-800 rounded-3xl p-6 md:p-10 border border-slate-800">
        <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
          <span className="w-2 h-8 bg-manga-accent rounded-full"></span>
          DAFTAR CHAPTER
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {comic.chapter_list && comic.chapter_list.map((ch: any, idx: number) => {
            const chId = ch.endpoint.replace('/ch/', '').replace(/\//g, '');
            return (
              <Link 
                key={idx} 
                href={`/read/${chId}`} 
                className="flex justify-between items-center bg-manga-900/60 hover:bg-manga-accent hover:border-manga-accent p-5 rounded-2xl border border-slate-700 transition-all group"
              >
                <span className="font-bold group-hover:text-white transition-colors">{ch.name}</span>
                <span className="text-manga-accent group-hover:text-white bg-manga-accent/10 px-3 py-1 rounded-lg text-xs font-black">BACA</span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}