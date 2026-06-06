import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "@/components/Navbar"; //  Import Navbar component
import Footer from "@/components/Footer"; // Import Footer component
import "./globals.css";
import Chatbot from "@/components/Chatbot"; // Import Chatbot Component

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" async></script>


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MedAppoint Portfolio",
  description: "Medical Appointment System by Jee Kai Zhun",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {


   
  return (
    <html lang="en">
      {/* min-vh-100 ensures the body is always at least the full height of the screen */}
      <body className="d-flex flex-column min-vh-100">
        <Navbar />

        {/* flex-grow-1 makes the dashboard area expand to fill all empty space */}
        <main className="grow">
          {children}
          <Chatbot />
        </main>

        <Footer />

      </body>
    </html>
  );
}

