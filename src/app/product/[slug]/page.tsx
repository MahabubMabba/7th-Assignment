// src/app/product/[slug]/page.tsx

import Link from "next/link";

export const instant = false;

type Market = {
  name?: string;
  nameBn?: string;
  market?: string;
  marketBn?: string;
  marketName?: string;
  marketNameBn?: string;
  price?: number;
  today?: number;
};

type Product = {
  slug: string;
  nameBn: string;
  categoryNameBn: string;
  categoryIcon: string;
  image: string;
  today: number;
  unit: string;
  change: {
    dir: string;
    pct: number;
  };
  markets: Market[];
  minPrice?: number;
  maxPrice?: number;
  avgPrice?: number;
};

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductDetails({ params }: PageProps) {
  const { slug } = await params;

  let products: Product[] = [];

  try {
    const response = await fetch(
      "https://openapi.programming-hero.com/api/bazardor/products",
      { cache: "no-store" }
    );

    const data = await response.json();

    if (Array.isArray(data)) {
      products = data;
    } else if (Array.isArray(data.products)) {
      products = data.products;
    } else if (Array.isArray(data.data)) {
      products = data.data;
    } else if (Array.isArray(data.data?.products)) {
      products = data.data.products;
    }
  } catch (error) {
    console.log("পণ্যের তথ্য লোড হয়নি", error);
  }

  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">পণ্যটি পাওয়া যায়নি</h1>

        <Link href="/" className="btn btn-success text-white">
          হোম পেজে ফিরে যান
        </Link>
      </main>
    );
  }

  const markets = product.markets || [];

  const marketPrices = markets
    .map((market) => Number(market.today ?? market.price ?? 0))
    .filter((price) => price > 0);

  const prices =
    marketPrices.length > 0 ? marketPrices : [Number(product.today)];

  const minimumPrice =
    product.minPrice ?? Math.min(...prices);

  const maximumPrice =
    product.maxPrice ?? Math.max(...prices);

  const averagePrice =
    product.avgPrice ??
    Math.round(
      prices.reduce((total, price) => total + price, 0) / prices.length
    );

  let unitName = product.unit;

  if (product.unit === "kg") {
    unitName = "কেজি";
  } else if (product.unit === "liter" || product.unit === "litre") {
    unitName = "লিটার";
  } else if (product.unit === "dozen") {
    unitName = "ডজন";
  } else if (product.unit === "piece") {
    unitName = "পিস";
  }

  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <Link href="/" className="text-sm text-green-700 hover:underline">
        ← সব পণ্যে ফিরে যান
      </Link>

      <section className="grid gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-2 md:p-8">
        <div className="flex min-h-56 items-center justify-center rounded-xl bg-green-50">
          <span className="text-8xl">{product.image}</span>
        </div>

        <div className="flex flex-col justify-center">
          <p className="mb-2 text-sm text-gray-500">
            {product.categoryIcon} {product.categoryNameBn}
          </p>

          <h1 className="text-3xl font-bold text-gray-800">
            {product.nameBn}
          </h1>

          <p className="mt-2 text-gray-500">প্রতি {unitName}</p>

          <p className="mt-6 text-sm text-gray-500">আজকের দাম</p>

          <p className="text-3xl font-bold text-green-700">
            {Number(product.today).toLocaleString("bn-BD")} টাকা
          </p>

          <p
            className={`mt-3 font-medium ${
              isUp
                ? "text-red-600"
                : isDown
                  ? "text-green-700"
                  : "text-gray-500"
            }`}
          >
            {isUp
              ? "▲ দাম বেড়েছে"
              : isDown
                ? "▼ দাম কমেছে"
                : "— দাম অপরিবর্তিত"}{" "}
            {Number(product.change.pct).toLocaleString("bn-BD")}%
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-gray-800">
          দামের সারসংক্ষেপ
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">সর্বনিম্ন দাম</p>
            <p className="mt-2 text-xl font-bold text-green-700">
              {Number(minimumPrice).toLocaleString("bn-BD")} টাকা
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">গড় দাম</p>
            <p className="mt-2 text-xl font-bold text-gray-800">
              {Number(averagePrice).toLocaleString("bn-BD")} টাকা
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">সর্বোচ্চ দাম</p>
            <p className="mt-2 text-xl font-bold text-red-600">
              {Number(maximumPrice).toLocaleString("bn-BD")} টাকা
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-gray-800">
          বাজারভিত্তিক আজকের দাম
        </h2>

        {markets.length === 0 ? (
          <p className="rounded-xl border border-gray-200 bg-white p-5 text-gray-500">
            এই পণ্যের বাজারভিত্তিক দাম পাওয়া যায়নি।
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="table">
              <thead>
                <tr>
                  <th>বাজারের নাম</th>
                  <th>আজকের দাম</th>
                  <th>একক</th>
                </tr>
              </thead>

              <tbody>
                {markets.map((market, index) => {
                  const marketName =
                    market.nameBn ||
                    market.marketNameBn ||
                    market.marketBn ||
                    market.marketName ||
                    market.market ||
                    market.name ||
                    "বাজার";

                  const marketPrice = Number(
                    market.today ?? market.price ?? 0
                  );

                  return (
                    <tr key={index}>
                      <td>{marketName}</td>
                      <td>
                        {marketPrice.toLocaleString("bn-BD")} টাকা
                      </td>
                      <td>প্রতি {unitName}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}