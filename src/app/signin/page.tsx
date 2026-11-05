"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

type Provider = "google" | "github";

export default function SigninPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<Provider | null>(null);

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
      router.replace("/");
    } catch {
      toast.error("সাইন ইন করা যায়নি। আবার চেষ্টা করো");
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
          <h1 className="text-center text-2xl font-bold">সাইন ইন</h1>

          <p className="mb-6 mt-2 text-center text-sm text-gray-600">
            বিস্তারিত দাম ও বাজারের তথ্য দেখতে অ্যাকাউন্টে ঢুকুন।
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="পাসওয়ার্ড লিখুন"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
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
            অ্যাকাউন্ট নেই?{" "}
            <Link href="/signup" className="font-semibold text-green-700">
              সাইন আপ করুন
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}