import Image from 'next/image';
import Link from 'next/link';

interface Comic {
  title: string;
  image: string;
  type: string;
  endpoint: string;
}

// Fungsi Fetch
async function getComics(type: string, page: string, search?: string) {
  let url = "";

  if (search && search.trim() !== "") {
    url = `https://citedd-komiku-api.hf.space/api/comic/search/${encodeURIComponent(search)}`;
  } else {
    url = `https://citedd-komiku-api.hf.space/api/comic/${type}/page/${page}`;
  }

  try {
    const res = await fetch(url, { cache: 'no-store' });
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const currentPage = params.page || '1';
  const currentTab = params.tab || 'newest';
  const searchQuery = params.q;

  const comics = await getComics(currentTab, currentPage, searchQuery);

  return (
    <main className="min-h-screen p-4 md:p-10 max-w-7xl mx-auto bg-manga-900 text-white">
      {/* Header & Search */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <Link href="/">
          <h1 className="text-5xl font-black italic tracking-tighter text-manga-accent">MANGAKU</h1>
        </Link>
        
        <form action="/" method="GET" className="relative w-full md:w-96">
          <input 
            type="text" 
            name="q"
            placeholder="Cari judul komik..." 
            defaultValue={searchQuery}
            className="w-full bg-manga-800 border border-slate-700 rounded-full py-3 px-6 text-white focus:ring-2 focus:ring-manga-accent outline-none"
          />
          <button type="submit" className="absolute right-4 top-3 hover:text-manga-accent">🔍</button>
        </form>
      </header>

      {/* Tabs Menu */}
      {!searchQuery && (
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'newest', label: 'Terbaru' },
            { id: 'popular', label: 'Populer' },
            { id: 'recommended', label: 'Rekomendasi' }
          ].map((tab) => (
            <Link
              key={tab.id}
              href={`/?tab=${tab.id}&page=1`}
              className={`px-6 py-2 rounded-full font-bold transition-all shrink-0 ${
                currentTab === tab.id
                  ? 'bg-manga-accent text-white' 
                  : 'bg-manga-800 text-manga-subtext border border-slate-700 hover:text-white'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      )}

      {/* Grid Komik */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
        {comics.length > 0 ? (
          comics.map((comic: Comic, index: number) => {
            const comicPath = comic.endpoint.replace('/manga/', '').replace(/\//g, '');
            return (
              <Link href={`/comic/${comicPath}`} key={index} className="group h-full">
                <div className="bg-manga-800 rounded-2xl overflow-hidden transition-all hover:ring-2 hover:ring-manga-accent h-full flex flex-col">
                  <div className="aspect-[3/4] relative">
                    <Image src={comic.image} alt={comic.title} fill className="object-cover" unoptimized />
                    <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-manga-accent uppercase">
                      {comic.type || 'Manga'}
                    </div>
                  </div>
                  <div className="p-3 flex-grow">
                    <h2 className="text-sm font-bold line-clamp-2 group-hover:text-manga-accent transition-colors">
                      {comic.title}
                    </h2>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full text-center py-20 text-manga-subtext italic">Data tidak ditemukan...</div>
        )}
      </div>

      {/* Pagination yang Sudah Diperbarui */}
      {!searchQuery && comics.length > 0 && (
        <div className="flex justify-center items-center gap-2 md:gap-4 py-10 border-t border-slate-800 flex-wrap">
          
          {/* Tombol Langsung ke Halaman 1 (Hanya muncul jika di atas page 1) */}
          {parseInt(currentPage) > 1 && (
            <Link 
              href={`/?tab=${currentTab}&page=1`}
              className="px-4 py-3 bg-manga-900 text-manga-subtext hover:text-white hover:bg-slate-800 rounded-xl font-bold transition-all border border-slate-700 text-sm md:text-base"
              title="Kembali ke Halaman Pertama"
            >
              « Home
            </Link>
          )}

          {/* Tombol Sebelumnya */}
          {parseInt(currentPage) > 1 && (
            <Link 
              href={`/?tab=${currentTab}&page=${parseInt(currentPage) - 1}`}
              className="px-5 md:px-6 py-3 bg-manga-800 hover:bg-manga-accent rounded-xl font-bold transition-all text-sm md:text-base"
            >
              ← Prev
            </Link>
          )}
          
          {/* Indikator Halaman */}
          <div className="text-center px-4">
            <p className="text-[10px] text-manga-subtext uppercase tracking-widest">Page</p>
            <p className="text-2xl font-black text-manga-accent">{currentPage}</p>
          </div>

          {/* Tombol Selanjutnya */}
          <Link 
            href={`/?tab=${currentTab}&page=${parseInt(currentPage) + 1}`}
            className="px-5 md:px-6 py-3 bg-manga-800 hover:bg-manga-accent rounded-xl font-bold transition-all text-sm md:text-base"
          >
            Next →
          </Link>
        </div>
      )}
    </main>
  );
}