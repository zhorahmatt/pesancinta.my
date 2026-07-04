import { supabase } from '../lib/supabase';
import type { InnerCompassData } from './landing';

export async function fetchInnerCompassContent(): Promise<InnerCompassData> {
  const { data, error } = await supabase.rpc('get_inner_compass_content');
  if (error) throw error;
  if (!data) throw new Error('Inner Compass content is empty. Run the seed script once.');
  return data as unknown as InnerCompassData;
}

export async function saveInnerCompassContent(data: InnerCompassData): Promise<void> {
  const { error } = await supabase.rpc('save_inner_compass_content', { p_data: data });
  if (error) throw error;
}

const INNER_COMPASS_BUCKET = 'inner-compass-uploads';

export async function uploadInnerCompassImage(file: File): Promise<{ url: string }> {
  const safeBase = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `edits/${Date.now()}-${safeBase}`;

  const { error: uploadError } = await supabase.storage
    .from(INNER_COMPASS_BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type || undefined });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(INNER_COMPASS_BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) throw new Error('Could not resolve public URL for uploaded image.');
  return { url: data.publicUrl };
}
