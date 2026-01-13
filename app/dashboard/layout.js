"use client"
export default function Header({ children }) {
    const handleLogout = async () => {
        window.location.href = "/api/logout";
      }
    return (
      <>
        <nav className="w-full h-14 px-6 flex items-center justify-between border-b bg-white">
          {/* Left: Logo */}
          <div className="text-lg font-semibold">
            MyLogo
          </div>
  
          {/* Right: Logout */}
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </nav>
  
        <main>
          {children}
        </main>
      </>
    );
  }
  