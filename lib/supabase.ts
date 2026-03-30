import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-only client with full permissions (for uploads/deletes)
export const supabaseAdmin = createClient(supabaseUrl, serviceKey);

// Bucket names used in plantilla
export const BUCKETS = {
  images: "images",
  pdfs: "pdfs",
} as const;

export async function uploadFile(
  bucket: string,
  path: string,
  file: File | Buffer,
  contentType: string
): Promise<string> {
  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, file, { contentType, upsert: true });
  if (error) throw new Error(error.message);
  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteFile(bucket: string, path: string): Promise<void> {
  const { error } = await supabaseAdmin.storage.from(bucket).remove([path]);
  if (error) console.error("Storage delete error:", error.message);
}
