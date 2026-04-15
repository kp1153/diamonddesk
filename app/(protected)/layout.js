import Sidebar from "@/components/Sidebar";

export const dynamic = "force-dynamic";

export default function ProtectedLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 pt-16 pb-24 md:pt-8 md:pb-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}