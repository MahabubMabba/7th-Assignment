"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

type Category = {
  slug: string;
  nameBn: string;
  icon?: string;
};

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending, refetch } = authClient.useSession();

  const [categories, setCategories] = useState<Category[]>([]);
  const [today, setToday] = useState("");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let active = true;

    async function getCategories() {
      try {
        const response = await fetch(
          "https://openapi.programming-hero.com/api/bazardor/categories"
        );

        const data = await response.json();
        let categoryList: Category[] = [];

        if (Array.isArray(data)) {
          categoryList = data;
        } else if (Array.isArray(data.categories)) {
          categoryList = data.categories;
        } else if (Array.isArray(data.data)) {
          categoryList = data.data;
        } else if (Array.isArray(data.data?.categories)) {
          categoryList = data.data.categories;
        }

        if (active) {
          setCategories(categoryList);
        }
      } catch (error) {
        console.error("ক্যাটাগরির তথ্য লোড হয়নি", error);
      }
    }

    getCategories();

    const timer = setTimeout(() => {
      const date = new Date().toLocaleDateString("bn-BD", {
        timeZone: "Asia/Dhaka",
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      setToday(date);
    }, 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  async function handleNameChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = newName.trim();

    if (!name) {
      toast.error("নাম লিখো");
      return;
    }

    setSavingName(true);

    try {
      const { error } = await authClient.updateUser({ name });

      if (error) {
        toast.error(error.message || "নাম পরিবর্তন করা যায়নি");
        return;
      }

      await refetch();
      toast.success("প্রোফাইলের নাম পরিবর্তন হয়েছে");
      setEditingName(false);
    } catch {
      toast.error("নাম পরিবর্তন করা যায়নি। আবার চেষ্টা করো");
    } finally {
      setSavingName(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "সাইন আউট করা যায়নি");
        return;
      }

      toast.success("সাইন আউট হয়েছে");
      setProfileMenuOpen(false);
      router.replace("/");
    } catch {
      toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করো");
    } finally {
      setSigningOut(false);
    }
  }

  const userName = session?.user?.name || "প্রোফাইল";

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

        <div className="ml-auto flex items-center gap-2">
          {isPending ? (
            <span className="text-sm text-gray-500">লোড হচ্ছে...</span>
          ) : session ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="btn btn-xs border-green-700 text-green-700 sm:btn-sm"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 font-bold">
                  {userName.charAt(0).toUpperCase()}
                </span>

                <span className="max-w-24 truncate">{userName}</span>
                <span>⌄</span>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
                  <div className="mb-3 border-b pb-3">
                    <p className="font-semibold text-gray-800">{userName}</p>
                    <p className="break-all text-xs text-gray-500">
                      {session.user.email}
                    </p>
                  </div>

                  {!editingName ? (
                    <button
                      type="button"
                      onClick={() => {
                        setNewName(session.user.name || "");
                        setEditingName(true);
                      }}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-green-50"
                    >
                      প্রোফাইলের নাম পরিবর্তন
                    </button>
                  ) : (
                    <form onSubmit={handleNameChange} className="space-y-2">
                      <label className="block text-sm font-medium">
                        নতুন নাম
                      </label>

                      <input
                        className="input input-bordered input-sm w-full"
                        type="text"
                        value={newName}
                        onChange={(event) => setNewName(event.target.value)}
                        required
                      />

                      <div className="flex gap-2">
                        <button
                          className="btn btn-sm flex-1 bg-green-700 text-white"
                          type="submit"
                          disabled={savingName}
                        >
                          {savingName ? "সেভ হচ্ছে..." : "সেভ"}
                        </button>

                        <button
                          className="btn btn-sm flex-1"
                          type="button"
                          onClick={() => setEditingName(false)}
                        >
                          বাতিল
                        </button>
                      </div>
                    </form>
                  )}

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    {signingOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/signin"
                className="btn btn-xs border-green-700 text-green-700 sm:btn-sm"
              >
                সাইন ইন
              </Link>

              <Link
                href="/signup"
                className="btn btn-xs bg-green-700 text-white sm:btn-sm"
              >
                সাইন আপ
              </Link>
            </>
          )}
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