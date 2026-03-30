import { prisma } from "@/lib/prisma";
import TrayectoriaClient from "./TrayectoriaClient";

export default async function TrayectoriaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [education, experience, teaching] = await Promise.all([
    prisma.education.findMany({ where: { profileId: id }, orderBy: { order: "asc" } }),
    prisma.experience.findMany({ where: { profileId: id }, orderBy: { order: "asc" } }),
    prisma.teaching.findMany({ where: { profileId: id }, orderBy: { order: "asc" } }),
  ]);
  return <TrayectoriaClient profileId={id} education={education} experience={experience} teaching={teaching} />;
}
