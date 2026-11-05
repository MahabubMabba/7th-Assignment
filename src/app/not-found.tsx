import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="not-found-code">৪০৪</p>
      <h1>পেজটি খুঁজে পাওয়া যায়নি</h1>
      <p>ঠিকানাটি ভুল হতে পারে, অথবা পেজটি সরানো হয়েছে।</p>

      <Link href="/" className="not-found-button">
        হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}