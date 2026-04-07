import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Black Star Aviation",
  description:
    "AI-powered private charter brokerage with curated empty-leg deals and on-demand trip support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
