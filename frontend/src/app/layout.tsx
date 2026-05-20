import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import AuthAwareLayout from "./auth-aware-layout";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "EventX - The Ultimate Digital Command Center for School Events",
  description:
    "From debates to cultural fests - EventX unifies schedules, registrations, and live updates so your school community never misses a moment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.variable}>
        <AuthAwareLayout>{children}</AuthAwareLayout>
      </body>
    </html>
  );
}
