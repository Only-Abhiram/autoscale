"use client"

import { useState } from "react";
import Loader from "@/lib/ui/components/loader";

export default function Header({ children }) {
    const [logoutLoading, setlogoutLoading] = useState(false);
    const handleLogout = async () => {
        setlogoutLoading(true);
        window.location.href = "/api/logout";
        
      }
    return (
      <>
        <nav className="w-full h-14 px-6 flex items-center justify-between   backdrop-blur-xl fixed">
          {/* Left: Logo */}
          <div className="text-2xl font-extrabold bg-linear-to-l from-indigo-500 via-red-500 to-blue-500 text-transparent bg-clip-text">
            autoscale
          </div>
  
          {/* Right: Logout */}
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 text-sm font-bold rounded-md bg-red-500 text-white hover:bg-red-600 transition"
          >
            {logoutLoading ? <Loader/> : "Logout"}
          </button>
        </nav>
  
        <main className="pt-10">
          {children}
        </main>
      </>
    );
  }
  