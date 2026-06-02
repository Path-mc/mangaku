"use client";

import { useEffect, useState } from 'react';
import { addFavorite, isFavorite, removeFavorite } from '@/lib/favorites';

interface FavoriteButtonProps {
  comicId: string;
  comicTitle: string;
  comicThumbnail: string;
}

export default function FavoriteButton({ comicId, comicTitle, comicThumbnail }: FavoriteButtonProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadFavoriteStatus = async () => {
      const currentUser = localStorage.getItem('user_mangaku');
      setUserId(currentUser);

      if (!currentUser) {
        setLoading(false);
        return;
      }

      const currentStatus = await isFavorite(currentUser, comicId);
      setFavorited(currentStatus);
      setLoading(false);
    };

    loadFavoriteStatus();
  }, [comicId]);

  const handleToggleFavorite = async () => {
    setMessage('');

    if (!userId) {
      setMessage('Masuk dulu untuk menyimpan favorit.');
      return;
    }

    setLoading(true);

    try {
      if (favorited) {
        await removeFavorite(userId, comicId);
        setFavorited(false);
        setMessage('Dihapus dari favorit.');
      } else {
        await addFavorite({
          user_id: userId,
          comic_id: comicId,
          comic_title: comicTitle,
          comic_thumbnail: comicThumbnail,
        });
        setFavorited(true);
        setMessage('Ditambahkan ke favorit.');
      }
    } catch {
      setMessage('Gagal memperbarui favorit. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handleToggleFavorite}
        disabled={loading}
        className={`w-full md:w-auto px-6 py-3 rounded-xl font-black border transition-all ${
          favorited
            ? 'bg-manga-accent text-white border-manga-accent shadow-lg shadow-manga-accent/20'
            : 'bg-manga-800 text-white border-slate-700 hover:border-manga-accent hover:text-manga-accent'
        } disabled:opacity-60 disabled:cursor-wait`}
      >
        {loading ? 'Memuat...' : favorited ? 'Sudah Favorit' : 'Tambah Favorit'}
      </button>

      {message && (
        <p className="mt-3 text-xs font-bold text-manga-subtext">
          {message}
        </p>
      )}
    </div>
  );
}
