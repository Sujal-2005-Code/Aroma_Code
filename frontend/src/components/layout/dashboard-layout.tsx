"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { currentUser } from "@/lib/auth";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!currentUser()) router.replace("/auth/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar isDashboard />
      <Sidebar />
      <main className="pt-16 lg:pl-[240px] transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
