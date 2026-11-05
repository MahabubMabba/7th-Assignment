// Banner.tsx
import Image from "next/image";
import Link from "next/link";

export default function Banner() {
  const today = new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });

  return (
    <section className="mx-auto my-6 grid max-w-7xl items-center gap-6 rounded-2xl bg-green-50 px-6 py-8 md:grid-cols-2 md:px-12">
      <div>
        <p className="mb-4 inline-block rounded-full bg-white px-4 py-2 text-sm text-green-700">
          {today}
        </p>

        <h1 className="mb-4 text-3xl font-bold text-gray-800 md:text-5xl">
          আজকের বাজারের দাম এক নজরে
        </h1>

        <p className="mb-6 text-gray-600">
          চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম এক জায়গায় দেখুন।
        </p>

        <Link href="#sob-panno" className="btn btn-success text-white">
          সব পণ্য দেখুন
        </Link>
      </div>

      <div className="flex justify-center">
        <Image
          src="/bazar-hero.png"
          alt="তাজা বাজারের ঝুড়ি"
          width={500}
          height={400}
          className="h-auto max-h-80 w-full object-contain"
        />
      </div>
    </section>
  );
}