import "./globals.css"
import "katex/dist/katex.min.css";
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import HighlightTheme from "@/components/HighlightTheme";
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: {
    default: "Marsha Teo", 
    template: "%s - Marsha Teo",
  },
  description: "Portfolio and writing on data and software",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem("theme");
                  if (saved) {
                    document.documentElement.setAttribute("data-theme", saved);
                  } else {
                    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                    document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
                  }
                } catch (e) {}
              })();
              `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <HighlightTheme />
        <Navbar />
          <main className="flex-1">
            {children}
          </main>
        <Footer />
        <Analytics/>
      </body>
    </html>
  )
}