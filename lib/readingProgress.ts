import { supabase } from './supabase';

export interface ReadingProgressPayload {
  user_id: string;
  comic_id: string;
  comic_title: string;
  comic_thumbnail: string;
  chapter_id: string;
  chapter_title: string;
}

export async function getReadingProgress(userId: string) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('reading_progress')
    .select('*')
    .eq('user_id', userId)
    .order('last_read_at', { ascending: false });

  if (error) {
    console.error('Gagal mengambil progress baca:', error.message);
    return [];
  }

  return data || [];
}

export async function getComicProgress(userId: string, comicId: string) {
  if (!userId || !comicId) return null;

  const { data, error } = await supabase
    .from('reading_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('comic_id', comicId)
    .maybeSingle();

  if (error) {
    console.error('Gagal mengambil progress komik:', error.message);
    return null;
  }

  return data;
}

export async function saveReadingProgress(payload: ReadingProgressPayload) {
  if (!payload.user_id || !payload.comic_id || !payload.chapter_id) return null;

  const now = new Date().toISOString();
  const existingProgress = await getComicProgress(payload.user_id, payload.comic_id);

  if (existingProgress) {
    const { data, error } = await supabase
      .from('reading_progress')
      .update({
        comic_title: payload.comic_title,
        comic_thumbnail: payload.comic_thumbnail,
        last_read_at: now,
        last_chapter_id: payload.chapter_id,
        last_chapter_title: payload.chapter_title,
        updated_at: now,
      })
      .eq('user_id', payload.user_id)
      .eq('comic_id', payload.comic_id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from('reading_progress')
    .insert({
      user_id: payload.user_id,
      comic_id: payload.comic_id,
      comic_title: payload.comic_title,
      comic_thumbnail: payload.comic_thumbnail,
      first_read_at: now,
      first_chapter_id: payload.chapter_id,
      first_chapter_title: payload.chapter_title,
      last_read_at: now,
      last_chapter_id: payload.chapter_id,
      last_chapter_title: payload.chapter_title,
      updated_at: now,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
