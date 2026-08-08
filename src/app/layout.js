import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata = {
  title: "BiblioDrop | Local Library Book Delivery",
  description: "Your local library, delivered doorstep.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" data-theme="dark">
      <body className="min-h-screen flex flex-col theme-bg-main theme-text-primary antialiased">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}