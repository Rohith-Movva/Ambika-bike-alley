import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import StoreProvider from "../components/StoreProvider"; // <-- Import it

export const metadata: Metadata = {
  title: "Ambika Bike Alley",
  description: "The best bicycle shop in town",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen flex flex-col">
        {/* Wrap everything inside the StoreProvider! */}
        <StoreProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="bg-gray-900 text-white text-center py-4">
            <p>&copy; 2026 Ambika Bike Alley. All rights reserved.</p>
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}