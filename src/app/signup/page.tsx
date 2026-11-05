"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

type Provider = "google" | "github";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<Provider | null>(null);

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
      router.replace("/signin");
    } catch {
      toast.error("আবার চেষ্টা করো");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignIn(provider: Provider) {
    setSocialLoading(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "সোশ্যাল লগইন করা যায়নি");
      }
    } catch {
      toast.error("সোশ্যাল লগইন করা যায়নি। আবার চেষ্টা করো");
    } finally {
      setSocialLoading(null);
    }
  }

  return (
    <section className="min-h-[60vh] bg-gray-50 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-md">
        <Link href="/" className="text-sm font-medium text-green-700">
          ← হোম পেজে ফিরে যান
        </Link>

        <div className="mt-5 rounded-xl border bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-center text-2xl font-bold">
            অ্যাকাউন্ট তৈরি করুন
          </h1>

          <p className="mb-6 mt-2 text-center text-sm text-gray-600">
            বিনা খরচে সাইন আপ করে বিস্তারিত বাজারদর দেখুন।
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm">নাম</span>
              <input
                className="input input-bordered w-full"
                type="text"
                placeholder="তোমার নাম"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm">ইমেইল</span>
              <input
                className="input input-bordered w-full"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm">পাসওয়ার্ড</span>
              <input
                className="input input-bordered w-full"
                type="password"
                placeholder="কমপক্ষে ৮ অক্ষর"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm">
                পাসওয়ার্ড নিশ্চিত করুন
              </span>
              <input
                className="input input-bordered w-full"
                type="password"
                placeholder="পাসওয়ার্ড আবার লিখুন"
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

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-gray-200" />
            <span className="text-sm text-gray-500">অথবা</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              className="btn btn-outline"
              type="button"
              onClick={() => handleSocialSignIn("google")}
              disabled={socialLoading !== null}
            >
              {socialLoading === "google"
                ? "Google-এ যাচ্ছি..."
                : "Google দিয়ে চালিয়ে যান"}
            </button>

            <button
              className="btn btn-outline"
              type="button"
              onClick={() => handleSocialSignIn("github")}
              disabled={socialLoading !== null}
            >
              {socialLoading === "github"
                ? "GitHub-এ যাচ্ছি..."
                : "GitHub দিয়ে চালিয়ে যান"}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            অ্যাকাউন্ট আছে?{" "}
            <Link href="/signin" className="font-semibold text-green-700">
              সাইন ইন করুন
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}