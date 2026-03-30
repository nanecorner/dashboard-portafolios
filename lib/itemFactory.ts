import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type Model = "education" | "experience" | "teaching" | "publication" | "galleryItem" | "dissemination" | "footerLink" | "researchLine" | "award" | "society" | "collaboration" | "funding";

export function makeItemRoutes(model: Model) {
  async function checkAuth(profileId: string) {
    const session = await getSession();
    if (!session || session.profileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    return null;
  }

  // PATCH update
  async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; itemId: string }> }
  ) {
    const { id, itemId } = await params;
    const deny = await checkAuth(id);
    if (deny) return deny;
    const body = await req.json();
    // @ts-expect-error dynamic model
    const updated = await prisma[model].update({ where: { id: itemId }, data: body });
    return NextResponse.json(updated);
  }

  // DELETE
  async function DELETE(
    _: NextRequest,
    { params }: { params: Promise<{ id: string; itemId: string }> }
  ) {
    const { id, itemId } = await params;
    const deny = await checkAuth(id);
    if (deny) return deny;
    // @ts-expect-error dynamic model
    await prisma[model].delete({ where: { id: itemId } });
    return NextResponse.json({ ok: true });
  }

  return { PATCH, DELETE };
}
