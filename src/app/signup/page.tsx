"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("দুইটি পাসওয়ার্ড মিলছে না");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি");
        return;
      }

      toast.success("অ্যাকাউন্ট তৈরি হয়েছে");

      setTimeout(() => {
        router.push("/signin");
      }, 1000);
    } catch {
      toast.error("অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করো");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-green-50/50 px-4 py-10 sm:py-14">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="mx-auto max-w-md">
        <Link
          href="/"
          className="text-sm font-medium text-green-700 hover:underline"
        >
          ← হোম পেজে ফিরে যান
        </Link>

        <div className="mt-5 rounded-2xl border border-green-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">
              🛒
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              অ্যাকাউন্ট তৈরি করুন
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="form-control">
              <span className="label-text mb-2 font-medium">নাম</span>
              <input
                className="input input-bordered w-full focus:border-green-600 focus:outline-none"
                type="text"
                placeholder="যেমন: রহিম উদ্দিন"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </label>

            <label className="form-control">
              <span className="label-text mb-2 font-medium">ইমেইল</span>
              <input
                className="input input-bordered w-full focus:border-green-600 focus:outline-none"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label className="form-control">
              <span className="label-text mb-2 font-medium">পাসওয়ার্ড</span>
              <input
                className="input input-bordered w-full focus:border-green-600 focus:outline-none"
                type="password"
                placeholder="কমপক্ষে ৮ অক্ষর"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
              />
            </label>

            <label className="form-control">
              <span className="label-text mb-2 font-medium">
                পাসওয়ার্ড নিশ্চিত করুন
              </span>
              <input
                className="input input-bordered w-full focus:border-green-600 focus:outline-none"
                type="password"
                placeholder="আবার পাসওয়ার্ড লিখুন"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength={8}
                required
              />
            </label>

            <button
              className="btn w-full border-0 bg-green-700 text-white hover:bg-green-800"
              type="submit"
              disabled={loading}
            >
              {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            অ্যাকাউন্ট আছে?{" "}
            <Link
              className="font-semibold text-green-700 hover:underline"
              href="/signin"
            >
              সাইন ইন করুন
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}