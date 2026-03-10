export default function Loading() {
  return (
    <main className="min-h-screen bg-manga-900 p-4 md:p-10 max-w-5xl mx-auto w-full animate-pulse">
      {/* Skeleton Tombol Kembali */}
      <div className="h-6 w-40 bg-slate-800 rounded-md mb-8"></div>
      
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Skeleton Thumbnail Besar */}
        <div className="w-full md:w-72 shrink-0">
          <div className="relative aspect-[3/4] rounded-2xl bg-manga-800 border border-slate-700">
            {/* Animasi Spinner di tengah gambar */}
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-manga-accent"></div>
            </div>
          </div>
        </div>

        {/* Skeleton Informasi Utama */}
        <div className="flex-grow pt-4">
          <div className="h-12 md:h-14 bg-manga-800 rounded-xl w-3/4 mb-4"></div>
          <div className="h-6 bg-manga-800 rounded w-1/2 mb-8"></div>
          
          {/* Skeleton Grid Info (Status, Author, dll) */}
          <div className="grid grid-cols-2 gap-4 mb-8 bg-manga-800/40 border border-slate-800 p-6 rounded-2xl">
            <div className="h-10 bg-slate-800 rounded-lg"></div>
            <div className="h-10 bg-slate-800 rounded-lg"></div>
            <div className="h-10 bg-slate-800 rounded-lg"></div>
            <div className="h-10 bg-slate-800 rounded-lg"></div>
          </div>

          {/* Skeleton Genre Tags */}
          <div className="flex flex-wrap gap-2">
            <div className="h-8 w-20 bg-manga-800 rounded-full"></div>
            <div className="h-8 w-24 bg-manga-800 rounded-full"></div>
            <div className="h-8 w-16 bg-manga-800 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Skeleton List Chapter */}
      <div className="bg-manga-800 rounded-3xl p-6 md:p-10 border border-slate-800">
        <div className="h-8 w-56 bg-slate-700 rounded-lg mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-800 rounded-2xl"></div>
          ))}
        </div>
      </div>
    </main>
  );
}