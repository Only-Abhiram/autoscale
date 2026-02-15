
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Site Name",
  description: "Your site description",
  verification: {
    google: "c3hllzvFw5He0x4PZDRsHV0GjQxU6CigfaJDxEvBkcw",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
    
      
        {children}
      </body>
    </html>
  );
}
