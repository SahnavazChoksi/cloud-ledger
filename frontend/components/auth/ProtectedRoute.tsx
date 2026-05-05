/*CloudLedger\frontend\components\auth\ProtectedRoute.tsx */

"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardSkeleton from "@/components/ui/DashboardSkeleton";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}