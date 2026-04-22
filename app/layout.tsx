import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

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

export const viewport = {
  colorScheme: "light",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
          <main className="flex-1">
            {children}
          </main>
        <Footer />
      </body>
    </html>
  )
}