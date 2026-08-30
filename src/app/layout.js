import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";
import { Plus_Jakarta_Sans } from "next/font/google";

import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: [
    "400",
    "500",
    "600",
    "700",
    "800",
  ],
  display: "swap",
});

export const metadata = {
  title: "BiblioDrop | Local Library Book Delivery",
  description:
    "Your local library, delivered doorstep.",
};

export default function RootLayout({
  children,
}) {
  return (
    <html
      lang="en"
      className="dark"
      data-theme="dark"
    >
      <body
        className={`${plusJakartaSans.className} min-h-screen flex flex-col theme-bg-main theme-text-primary antialiased`}
      >
        <AuthProvider>
          <Navbar />

          <main className="flex-grow">
            {children}
          </main>

          <Footer />

          <ToastContainer
            position="top-right"
            autoClose={3000}
            theme="dark"
          />
        </AuthProvider>
      </body>
    </html>
  );
}