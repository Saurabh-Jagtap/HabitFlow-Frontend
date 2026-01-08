"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar.jsx";
import { AuthProvider } from "./components/AuthProvider";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Navbar />
          {children}
          <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1f2933",
              color: "#fff",
            },
          }}
        />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
