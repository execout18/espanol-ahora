import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Español Ahora",
  description: "Buenos Aires or bust. Daily Spanish, no excuses.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
