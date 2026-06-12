import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, BUCKETS } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.profileId !== id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const bucket = (form.get("bucket") as string) || BUCKETS.images;

  if (!file) return NextResponse.json({ error: "No se envió archivo" }, { status: 400 });

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  const path = `${id}/${Date.now()}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl, path });
}
