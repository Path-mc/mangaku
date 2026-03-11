import { supabase } from './supabase';

export async function saveHistory(username: string, comic: any, chapterId: string, chapterTitle: string) {
  if (!username) return;

  const { error } = await supabase
    .from('read_history')
    .upsert({
      username: username,
      comic_id: comic.id,
      comic_title: comic.title,
      comic_image: comic.thumbnail,
      last_chapter_id: chapterId,
      last_chapter_title: chapterTitle,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'username, comic_id'
    });

  if (error) console.error('Gagal simpan history:', error.message);
}