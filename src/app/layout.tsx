import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DND Quests - Епічні квести для щоденних справ",
  description: "Перетвори свої щоденні справи на епічні квести! Створюй завдання, знаходь героїв та виконуй місії разом з друзями.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            <Navigation />
            <main>
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
