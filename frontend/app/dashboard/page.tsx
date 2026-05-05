import CloudLedgerMVP from "@/components/CloudLedgerMVP";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <CloudLedgerMVP />
    </ProtectedRoute>
  );
}