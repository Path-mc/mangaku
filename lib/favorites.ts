import { supabase } from './supabase';

export interface FavoritePayload {
  user_id: string;
  comic_id: string;
  comic_title: string;
  comic_thumbnail: string;
}

export async function getFavorites(userId: string) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Gagal mengambil favorit:', error.message);
    return [];
  }

  return data || [];
}

export async function isFavorite(userId: string, comicId: string) {
  if (!userId || !comicId) return false;

  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('comic_id', comicId)
    .maybeSingle();

  if (error) {
    console.error('Gagal mengecek favorit:', error.message);
    return false;
  }

  return Boolean(data);
}

export async function addFavorite(payload: FavoritePayload) {
  const { data, error } = await supabase
    .from('favorites')
    .upsert(payload, {
      onConflict: 'user_id,comic_id',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeFavorite(userId: string, comicId: string) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('comic_id', comicId);

  if (error) throw error;
}

export async function toggleFavorite(payload: FavoritePayload) {
  const favorited = await isFavorite(payload.user_id, payload.comic_id);

  if (favorited) {
    await removeFavorite(payload.user_id, payload.comic_id);
    return { favorited: false };
  }

  await addFavorite(payload);
  return { favorited: true };
}
