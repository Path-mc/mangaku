"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah browser melakukan Hard Reload!
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full md:flex-1 md:max-w-md order-3 md:order-2">
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari judul komik..." 
        className="w-full bg-manga-800 border border-slate-700 rounded-full py-2.5 px-5 md:py-3 md:px-6 text-sm md:text-base text-white focus:ring-2 focus:ring-manga-accent outline-none transition-all"
      />
      <button type="submit" className="absolute right-4 top-2.5 md:top-3 text-sm md:text-base hover:text-manga-accent transition-colors">🔍</button>
    </form>
  );
}