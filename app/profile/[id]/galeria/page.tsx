import { prisma } from "@/lib/prisma";
import GaleriaClient from "./GaleriaClient";

export default async function GaleriaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const items = await prisma.galleryItem.findMany({
    where: { profileId: id },
    orderBy: { order: "asc" },
  });
  return <GaleriaClient profileId={id} galleryItems={items} />;
}
