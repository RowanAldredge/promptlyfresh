export const LIMITS = {
  free: {
    dailyGenerations: 2, // adjust your cap here
  },
  pro: {
    dailyGenerations: Infinity,
  },
} as const;
// src/lib/limits.ts
export const FREE_DAILY_GEN_CAP = 2;

export function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Given a profile, return how many generations remain today for Free.
 *  For Pro, return Infinity so the UI can render "Unlimited".
 */
export function remainingGensForToday(profile: {
  plan: string;
  genCount: number;
  genPeriodStart: Date | null;
}) {
  if (profile.plan === "pro") return Infinity;
  const today = startOfToday();
  const used =
    profile.genPeriodStart && profile.genPeriodStart >= today
      ? profile.genCount ?? 0
      : 0;
  return Math.max(0, FREE_DAILY_GEN_CAP - used);
}
