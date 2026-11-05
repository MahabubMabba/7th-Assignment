// src/components/Navbar.tsx

import Link from "next/link";

type Category = {
  slug: string;
  nameBn: string;
  icon?: string;
};

export default async function Navbar() {
  let categories: Category[] = [];

  try {
    const response = await fetch(
      "https://openapi.programming-hero.com/api/bazardor/categories",
      { cache: "no-store" }
    );

    const data = await response.json();

    if (Array.isArray(data)) {
      categories = data;
    } else if (Array.isArray(data.categories)) {
      categories = data.categories;
    } else if (Array.isArray(data.data)) {
      categories = data.data;
    } else if (Array.isArray(data.data?.categories)) {
      categories = data.data.categories;
    }
  } catch (error) {
    console.log("ক্যাটাগরির তথ্য লোড হয়নি", error);
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
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-4">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo-icon.png"
            alt="বাজার দর"
            className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
          />

          <div>
            <p className="font-bold text-green-700">বাজার দর</p>
            <p className="whitespace-nowrap text-[10px] text-gray-500 sm:text-xs">
              {today}
            </p>
          </div>
        </Link>

        <div className="ml-auto flex gap-2">
          <Link
            href="/signin"
            className="btn btn-xs border-green-700 text-green-700 sm:btn-sm"
          >
            সাইন ইন
          </Link>

          <button className="btn btn-xs bg-green-700 text-white sm:btn-sm">
            সাইন আপ 
          </button>
        </div>
      </div>

      <nav className="border-t">
        <div className="mx-auto max-w-6xl overflow-x-auto px-3 sm:px-4">
          <ul className="menu menu-horizontal min-w-max flex-nowrap gap-1">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/category/${category.slug}`}
                  className="whitespace-nowrap"
                >
                  {category.icon && <span>{category.icon}</span>}
                  {category.nameBn}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}