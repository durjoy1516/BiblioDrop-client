import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

export const metadata = {
  title: "BiblioDrop | Local Library Book Delivery",
  description: "Your local library, delivered doorstep.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" data-theme="dark">
      <body className="min-h-screen flex flex-col theme-bg-main theme-text-primary antialiased">
        {/* AuthProvider-কে একদম উপরে র‍্যাপ করতে হবে */}
        <AuthProvider>
          <Navbar /> {/* Navbar অবশ্যই AuthProvider-এর ভেতরে থাকতে হবে */}
          <main className="flex-grow">{children}</main>
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </AuthProvider>
      </body>
    </html>
  );
}