"use client";

export default function Login() {
  const handleLogin = () => {
    // MUST be a navigation, not axios
    window.location.href = "/api/login";
  };

  return (
    <main className="min-h-screen flex items-center justify-center ">

      <div className="w-full z-10 max-w-md bg-white rounded-2xl shadow-xl p-8 mx-5 ring-4 ring-gray-200">
        {/* Logo / Brand */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-500 ">
            welcome to <span className="">autoscale</span>
          </h1>
          <p className="text-gray-500 mt-2">
            Automate your Instagram engagement in minutes
          </p>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-2  py-3 rounded-lg bg-black text-white font-semibold hover:opacity-90 transition"
        >
          Continue with Instagram
          <img className="h-7" src="https://img.icons8.com/?size=100&id=KDWXXYcBSEcJ&format=png&color=FFFFFF"></img>

        </button>

        {/* Divider */}
        <div className="my-6 flex items-center gap-2 text-gray-400 text-sm">
          <div className="flex-1 h-px bg-gray-200" />
          Secure OAuth Login
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Footer note */}
        <p className="text-xs text-center text-gray-400">
          We never post without your permission.
          You’re always in control.
        </p>
      </div>
      <div className="absolute  inset-0 h-full w-full 
bg-[radial-gradient(circle,#73737350_1px,transparent_1px)] 
bg-[size:10px_10px] 
[mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_80%,transparent_100%)]" ></div>

    </main>
  );
}
