import { prisma } from "@/lib/prisma";
import DivulgacionClient from "./DivulgacionClient";

export default async function DivulgacionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const items = await prisma.dissemination.findMany({
    where: { profileId: id },
    orderBy: { order: "asc" },
  });
  return <DivulgacionClient profileId={id} disseminationItems={items} />;
}
