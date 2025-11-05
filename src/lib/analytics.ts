import { prisma } from "@/lib/db";

export type Summary = {
  periodDays: number;
  sends: number;
  opens: number;
  clicks: number;
  openRate: number;   // 0..1
  clickRate: number;  // 0..1
};

export async function getSummary(userId: string, periodDays = 30): Promise<Summary> {
  const since = new Date();
  since.setDate(since.getDate() - periodDays);

  const sends = await prisma.delivery.count({
    where: { userId, status: "sent", sentAt: { gte: since } },
  });

  const [opens, clicks] = await Promise.all([
    prisma.event.count({
      where: {
        delivery: { userId, status: "sent", sentAt: { gte: since } },
        type: "OPEN",
      },
    }),
    prisma.event.count({
      where: {
        delivery: { userId, status: "sent", sentAt: { gte: since } },
        type: "CLICK",
      },
    }),
  ]);

  const openRate = sends > 0 ? opens / sends : 0;
  const clickRate = sends > 0 ? clicks / sends : 0;

  return { periodDays, sends, opens, clicks, openRate, clickRate };
}
