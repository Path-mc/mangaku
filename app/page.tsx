import AuthMenu from './AuthMenu';
import SearchBar from './SearchBar'; // <-- Tambahan import komponen pencarian pintar
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import ContinueReading from './ContinueReading'; 

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

// ==========================================
// 1. KOMPONEN LOADING ANIMATION (SKELETON)
// ==========================================
function LoadingSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="flex justify-center mb-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-manga-accent"></div>
      </div>
      {/* BERUBAH: Menjadi grid-cols-3 di HP dan jarak diperkecil (gap-2) */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-6 mb-12">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-manga-800 rounded-xl md:rounded-2xl aspect-[3/4] border border-slate-700 flex flex-col justify-end p-2 md:p-3">
             <div className="h-2 md:h-4 bg-slate-700 rounded w-3/4 mb-1.5 md:mb-2"></div>
             <div className="h-1.5 md:h-3 bg-slate-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 2. KOMPONEN DATA (Grid & Pagination)
// ==========================================
async function ComicList({ currentTab, currentPage, searchQuery }: { currentTab: string, currentPage: string, searchQuery?: string }) {
  const comics = await getComics(currentTab, currentPage, searchQuery);

  return (
    <>
      {/* BERUBAH: Menjadi grid-cols-3 di HP */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-6 mb-12">
        {comics.length > 0 ? (
          comics.map((comic: Comic, index: number) => {
            const comicPath = comic.endpoint.replace('/manga/', '').replace(/\//g, '');
            return (
              <Link href={`/comic/${comicPath}`} key={index} className="group h-full">
                <div className="bg-manga-800 rounded-xl md:rounded-2xl overflow-hidden transition-all hover:ring-2 hover:ring-manga-accent h-full flex flex-col">
                  <div className="aspect-[3/4] relative">
                    <Image src={comic.image} alt={comic.title} fill className="object-cover" unoptimized />
                    {/* Label tipe diperkecil di HP */}
                    <div className="absolute top-1 left-1 md:top-2 md:left-2 bg-black/80 px-1 md:px-2 py-0.5 rounded text-[7px] md:text-[10px] font-bold text-manga-accent uppercase">
                      {comic.type || 'Manga'}
                    </div>
                  </div>
                  {/* Padding card diperkecil di HP */}
                  <div className="p-1.5 md:p-3 flex-grow flex flex-col justify-start">
                    {/* Judul diperkecil ukurannya (text-[10px]) dan jarak antar barisnya dirapatkan di HP */}
                    <h2 className="text-[10px] leading-tight md:text-sm md:leading-normal font-bold line-clamp-2 group-hover:text-manga-accent transition-colors">
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

      {!searchQuery && comics.length > 0 && (
        <div className="flex justify-center items-center gap-2 md:gap-4 py-8 md:py-10 border-t border-slate-800 flex-wrap">
          {parseInt(currentPage) > 1 && (
            <Link href={`/?tab=${currentTab}&page=1`} className="px-3 py-2 md:px-4 md:py-3 bg-manga-900 text-manga-subtext hover:text-white hover:bg-slate-800 rounded-xl font-bold transition-all border border-slate-700 text-xs md:text-base">
              « Awal
            </Link>
          )}

          {parseInt(currentPage) > 1 && (
            <Link href={`/?tab=${currentTab}&page=${parseInt(currentPage) - 1}`} className="px-4 py-2 md:px-6 md:py-3 bg-manga-800 hover:bg-manga-accent rounded-xl font-bold transition-all text-xs md:text-base">
              ← Prev
            </Link>
          )}
          
          <div className="text-center px-2 md:px-4">
            <p className="text-[8px] md:text-[10px] text-manga-subtext uppercase tracking-widest">Page</p>
            <p className="text-xl md:text-2xl font-black text-manga-accent">{currentPage}</p>
          </div>

          <Link href={`/?tab=${currentTab}&page=${parseInt(currentPage) + 1}`} className="px-4 py-2 md:px-6 md:py-3 bg-manga-800 hover:bg-manga-accent rounded-xl font-bold transition-all text-xs md:text-base">
            Next →
          </Link>
        </div>
      )}
    </>
  );
}

// ==========================================
// 3. KOMPONEN UTAMA (Layout Navbar & Tab)
// ==========================================
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const currentPage = params.page || '1';
  const currentTab = params.tab || 'newest';
  const searchQuery = params.q;

  return (
    <main className="min-h-screen p-3 md:p-10 max-w-7xl mx-auto bg-manga-900 text-white overflow-hidden">
      
      {/* Header, Search & Menu Akun */}
      <header className="flex flex-wrap items-center justify-between mb-8 md:mb-10 gap-y-4 md:gap-x-6">
        <Link href="/" className="order-1">
          <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter text-manga-accent shrink-0">MANGAKU</h1>
        </Link>
        
        <div className="order-2 md:order-3 shrink-0">
          <AuthMenu />
        </div>

        {/* MENGGUNAKAN KOMPONEN SEARCHBAR PINTAR */}
        <SearchBar initialQuery={searchQuery} />
      </header>

      {/* FITUR LANJUT BACA */}
      {!searchQuery && (
        <ContinueReading />
      )}

      {/* Tabs Menu */}
      {!searchQuery && (
        <div className="flex gap-2 md:gap-4 mb-6 md:mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'newest', label: 'Terbaru' },
            { id: 'popular', label: 'Populer' },
            { id: 'recommended', label: 'Rekomendasi' }
          ].map((tab) => (
            <Link
              key={tab.id}
              href={`/?tab=${tab.id}&page=1`}
              className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-base font-bold transition-all shrink-0 ${
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

      {/* Daftar Komik Utama */}
      <Suspense key={`${currentTab}-${currentPage}-${searchQuery || ''}`} fallback={<LoadingSkeleton />}>
        <ComicList currentTab={currentTab} currentPage={currentPage} searchQuery={searchQuery} />
      </Suspense>

    </main>
  );
}