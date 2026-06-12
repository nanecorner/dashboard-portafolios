import { prisma } from "@/lib/prisma";
import InicioClient from "./InicioClient";

export default async function InicioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await prisma.profile.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      photoUrl: true,
      bio: true,
      quote: true,
      cvUrl: true,
      themePrimary: true,
      themeSecondary: true,
      themeFont: true,
    },
  });

  if (!profile) return <p>Perfil no encontrado</p>;

  return <InicioClient profile={profile} />;
}
