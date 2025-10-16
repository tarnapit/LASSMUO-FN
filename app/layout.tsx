import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ApiProvider } from "./lib/api/providers/ApiProvider";
import TokenExpiryWarning from "./components/ui/TokenExpiryWarning";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LASSMUOO - Learning Astronomy For Fun",
  description:
    "Explore the space and learn astronomy through interactive quizzes and games",
  keywords: "astronomy, space, learning, quiz, education, stars, planets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={inter.className}>
        <ApiProvider>
          {children}
          <TokenExpiryWarning />
        </ApiProvider>
      </body>
    </html>
  );
}
