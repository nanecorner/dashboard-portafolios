import { prisma } from "@/lib/prisma";
import PublicacionesClient from "./PublicacionesClient";

export default async function PublicacionesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const publications = await prisma.publication.findMany({
    where: { profileId: id },
    orderBy: { order: "asc" },
  });
  return <PublicacionesClient profileId={id} publications={publications} />;
}
