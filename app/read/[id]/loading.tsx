export default function Loading() {
  return (
    <main className="min-h-screen bg-black animate-pulse">
      {/* Skeleton Navbar Atas */}
      <nav className="fixed top-0 left-0 right-0 bg-black/90 p-4 z-50 flex justify-between items-center border-b border-white/10">
        <div className="h-6 w-24 bg-manga-800 rounded-md"></div>
        <div className="h-4 w-40 md:w-64 bg-manga-800 rounded-md"></div>
        <div className="h-6 w-16 bg-manga-800 rounded-md"></div>
      </nav>

      {/* Skeleton Gambar Manga (Memanjang ke bawah) */}
      <div className="pt-16 flex flex-col items-center w-full gap-1">
        {[...Array(3)].map((_, index) => (
          <div 
            key={index} 
            className="w-full max-w-3xl h-[70vh] md:h-[90vh] bg-manga-900 border-x border-white/5 flex items-center justify-center"
          >
            {/* Hanya tampilkan spinner muter di kerangka gambar pertama */}
            {index === 0 && (
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-manga-accent/50"></div>
            )}
          </div>
        ))}
      </div>

      {/* Skeleton Navigasi Bawah */}
      <div className="bg-manga-900 p-12 md:p-20 flex flex-col items-center gap-8 border-t border-white/10 mt-1">
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-xl">
          <div className="flex-1 h-14 bg-manga-800 rounded-xl"></div>
          <div className="flex-1 h-14 bg-manga-800 rounded-xl"></div>
        </div>
        <div className="h-4 w-48 bg-manga-800 rounded-md"></div>
      </div>
    </main>
  );
}