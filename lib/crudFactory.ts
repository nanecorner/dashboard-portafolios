import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type Model = "education" | "experience" | "teaching" | "publication" | "galleryItem" | "dissemination" | "footerLink" | "researchLine" | "award" | "society" | "collaboration" | "funding";

export function makeCrudRoutes(model: Model, profileField = "profileId") {
  async function checkAuth(profileId: string) {
    const session = await getSession();
    if (!session || session.profileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    return null;
  }

  // GET list
  async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const deny = await checkAuth(id);
    if (deny) return deny;
    // @ts-expect-error dynamic model
    const items = await prisma[model].findMany({
      where: { [profileField]: id },
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
    return NextResponse.json(items);
  }

  // POST create
  async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const deny = await checkAuth(id);
    if (deny) return deny;
    const body = await req.json();
    // @ts-expect-error dynamic model
    const item = await prisma[model].create({ data: { ...body, [profileField]: id } });
    return NextResponse.json(item, { status: 201 });
  }

  return { GET, POST };
}
