"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ProfileWorkspace } from "@/components/profile/workspace";
import { normalizeProfile, type ActivityItem, type StoredProfile } from "@/lib/profile";
import { computeCompletion, computeScores, generateInsights } from "@/lib/scoring";
import { useState } from "react";

function fallbackBundle(): { profile: StoredProfile; activity: ActivityItem[] } {
  const data = normalizeProfile(null);
  const scores = computeScores(data);
  return {
    profile: {
      slug: "default",
      status: "draft",
      completion: computeCompletion(data),
      scores,
      insights: generateInsights(data, scores),
      updatedAt: new Date().toISOString(),
      data,
    },
    activity: [],
  };
}

export default function PortfolioPage() {
  const [bundle] = useState<{ profile: StoredProfile; activity: ActivityItem[] }>(fallbackBundle());

  return (
    <DashboardLayout>
      <ProfileWorkspace initialProfile={bundle.profile} initialActivity={bundle.activity} />
    </DashboardLayout>
  );
}