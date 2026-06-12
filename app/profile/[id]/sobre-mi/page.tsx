import { prisma } from "@/lib/prisma";
import SobreMiClient from "./SobreMiClient";

export default async function SobreMiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const profile = await prisma.profile.findUnique({
    where: { id },
    select: { id: true }
  });

  if (!profile) return <p>Perfil no encontrado</p>;

  const [researchLines, awards, societies, collaborations, fundings] = await Promise.all([
    prisma.researchLine.findMany({ where: { profileId: id }, orderBy: { order: "asc" } }),
    prisma.award.findMany({ where: { profileId: id }, orderBy: { id: "asc" } }),
    prisma.society.findMany({ where: { profileId: id }, orderBy: { id: "asc" } }),
    prisma.collaboration.findMany({ where: { profileId: id }, orderBy: { id: "asc" } }),
    prisma.funding.findMany({ where: { profileId: id }, orderBy: { id: "asc" } })
  ]);

  return <SobreMiClient 
    profileId={profile.id}
    researchLines={researchLines}
    awards={awards}
    societies={societies}
    collaborations={collaborations}
    fundings={fundings}
  />;
}
