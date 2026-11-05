// src/components/Navbar.tsx

import Link from "next/link";

type Category = {
  slug: string;
  nameBn: string;
  icon?: string;
};

export default async function Navbar() {
  const response = await fetch(
    "https://openapi.programming-hero.com/api/bazardor/categories",
    { cache: "no-store" }
  );

  const categories: Category[] = await response.json();

  const time = new Date().toLocaleTimeString("bn-BD", {
    timeZone: "Asia/Dhaka",
    hour: "2-digit",
    minute: "2-digit",
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
              <span className="block text-xs text-gray-500">🕒 {time}</span>
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

      <nav className="border-t">
        <div className="mx-auto max-w-6xl overflow-x-auto px-4">
          <ul className="menu menu-horizontal flex-nowrap gap-2">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/category/${category.slug}`}
                  className="whitespace-nowrap"
                >
                  {category.icon} {category.nameBn}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}