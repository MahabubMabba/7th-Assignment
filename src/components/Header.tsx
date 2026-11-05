import Link from "next/link";

export default function Header() {
   const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
    timeZone: "Asia/Dhaka",
  });
  return (
    <header className="bg-white shadow-sm">
      <div className="navbar mx-auto max-w-6xl px-4">
        <div className="navbar-start">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/bazar-hero.png"
              alt="বাজার দর"
              className="h-10 w-10 object-contain"
            />

            <span>
              <span className="block font-bold text-green-700">বাজার দর</span>
              <span className="block text-xs text-gray-500">🕒 {date}</span>
            </span>
          </Link>
        </div>

        <div className="navbar-end gap-2">
          <Link
            href="/signin"
            className="btn btn-xs border-green-700 text-green-700 sm:btn-sm"
          >
            সাইন ইন
          </Link>

          <button className="btn btn-xs bg-green-700 text-white sm:btn-sm">
            সাইন আউট
          </button>
        </div>
      </div>
    </header>
  );
}