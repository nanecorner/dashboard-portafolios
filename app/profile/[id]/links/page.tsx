import { prisma } from "@/lib/prisma";
import LinksClient from "./LinksClient";

export default async function LinksPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const items = await prisma.footerLink.findMany({
    where: { profileId: id },
    orderBy: { order: "asc" },
  });
  return <LinksClient profileId={id} footerLinks={items} />;
}
