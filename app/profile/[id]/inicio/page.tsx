import { prisma } from "@/lib/prisma";
import InicioClient from "./InicioClient";

export default async function InicioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await prisma.profile.findUnique({
    where: { id },
    include: {
      researchLines: { orderBy: { order: "asc" } },
      awards: true,
      societies: true,
      collaborations: true,
      fundings: true,
    },
  });
  if (!profile) return <p>Perfil no encontrado</p>;
  return <InicioClient profile={profile} />;
}
