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

  const data = await response.json();

  let categories: Category[] = [];

  if (Array.isArray(data)) {
    categories = data;
  } else if (Array.isArray(data.categories)) {
    categories = data.categories;
  } else if (Array.isArray(data.data)) {
    categories = data.data;
  } else if (Array.isArray(data.data?.categories)) {
    categories = data.data.categories;
  }

  const today = new Date().toLocaleDateString("bn-BD", {
    timeZone: "Asia/Dhaka",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="bg-white shadow-sm">
      <div className="navbar mx-auto max-w-6xl px-4">
        <div className="navbar-start">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo-icon.png"
              alt="বাজার দর"
              className="h-10 w-10 object-contain"
            />

            <div>
              <p className="font-bold text-green-700">বাজার দর</p>
              <p className="text-xs text-gray-500">{today}</p>
            </div>
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
        <ul className="menu menu-horizontal mx-auto flex-nowrap gap-2 overflow-x-auto px-4">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link href={`/category/${category.slug}`}>
                {category.icon} {category.nameBn}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}