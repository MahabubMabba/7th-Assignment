"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

export default function SigninPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়");
        return;
      }

      toast.success("সাইন ইন সফল হয়েছে");

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch {
      toast.error("সাইন ইন করা যায়নি। আবার চেষ্টা করো");
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

            <h1 className="text-2xl font-bold text-gray-900">সাইন ইন</h1>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <button
              className="btn w-full border-0 bg-green-700 text-white hover:bg-green-800"
              type="submit"
              disabled={loading}
            >
              {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              className="font-semibold text-green-700 hover:underline"
              href="/signup"
            >
              সাইন আপ করুন
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}