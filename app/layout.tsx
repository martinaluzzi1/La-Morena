// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Estancia La Morena",
  description: "Naturaleza, confort y experiencias auténticas en una estancia boutique.",
  icons: {
    icon: "/fotos/logo.ico",      
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
