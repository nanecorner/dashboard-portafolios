import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { supabaseAdmin, BUCKETS } from "@/lib/supabase";

async function auth(profileId: string) {
  const session = await getSession();
  if (!session || session.profileId !== profileId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return null;
}

// GET /api/profile/[id]
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await prisma.profile.findUnique({
    where: { id },
    include: {
      researchLines: { orderBy: { order: "asc" } },
      awards: true,
      societies: true,
      collaborations: true,
      fundings: true,
      education: { orderBy: { order: "asc" } },
      experience: { orderBy: { order: "asc" } },
      teaching: { orderBy: { order: "asc" } },
      publications: { orderBy: { order: "asc" } },
      gallery: { orderBy: { order: "asc" } },
      dissemination: { orderBy: { order: "asc" } },
      footerLinks: { orderBy: { order: "asc" } },
    },
  });
  if (!profile) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(profile);
}

// PATCH /api/profile/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deny = await auth(id);
  if (deny) return deny;

  try {
    const body = await req.json();
    const updated = await prisma.profile.update({ where: { id }, data: body });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH profile error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
