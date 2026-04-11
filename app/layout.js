import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "हीरा डेस्क",
  description: "हीरा उद्योग प्रबंधन",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f59e0b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="हीरा डेस्क" />
      </head>
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