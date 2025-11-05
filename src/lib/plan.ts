import { prisma } from "@/lib/db";

export async function getUserPlan(userId: string) {
  const profile = await prisma.profile.findUnique({ where: { userId } });
  return (profile?.plan ?? "free") as "free" | "pro";
}
