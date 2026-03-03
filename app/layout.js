import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "DiamondDesk",
  description: "Surat Diamond ERP",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-gray-50 text-stone-800 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </body>
    </html>
  );
}