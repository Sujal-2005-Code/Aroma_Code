"use client";

import { ProfileWorkspace } from "@/components/profile/workspace";
import { normalizeProfile } from "@/lib/profile";
import { computeCompletion, computeScores, generateInsights } from "@/lib/scoring";

function fallbackBundle() {
  const data = normalizeProfile(null);
  const scores = computeScores(data);
  return {
    profile: {
      slug: "aroma-profile",
      status: "draft" as const,
      completion: computeCompletion(data),
      scores,
      insights: generateInsights(data, scores),
      updatedAt: new Date().toISOString(),
      data,
    },
    activity: [],
  };
}

export default function StudentProfilePage() {
  const bundle = fallbackBundle();
  return <ProfileWorkspace initialProfile={bundle.profile} initialActivity={bundle.activity} />;
}
