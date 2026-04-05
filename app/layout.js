import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "हीरा डेस्क",
  description: "हीरा उद्योग प्रबंधन",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <body>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 p-4 md:p-8 pt-16 pb-24 md:pt-8 md:pb-8 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}