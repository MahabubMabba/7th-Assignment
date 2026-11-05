import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const instant = false;

type Price = number | string | undefined;

type Market = {
  market?: string;
  division?: string;
  min?: Price;
  max?: Price;
};

type Product = {
  id?: number | string;
  slug: string;
  nameBn: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  image?: string;
  today?: Price;
  unit?: string;
  change?: {
    dir?: string;
    pct?: Price;
  };
  markets?: Market[];
};

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type MarketRow = {
  market: string;
  division: string;
  min: number;
  max: number;
  average: number;
};

function isApiObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getProducts(data: unknown): Product[] {
  if (Array.isArray(data)) {
    return data.filter(isApiObject) as Product[];
  }

  if (!isApiObject(data)) {
    return [];
  }

  if (Array.isArray(data.products)) {
    return data.products.filter(isApiObject) as Product[];
  }

  if (Array.isArray(data.data)) {
    return data.data.filter(isApiObject) as Product[];
  }

  if (isApiObject(data.data) && Array.isArray(data.data.products)) {
    return data.data.products.filter(isApiObject) as Product[];
  }

  return [];
}

function getProduct(data: unknown): Product | null {
  let product: unknown = data;

  if (isApiObject(product)) {
    if (product.product !== undefined) {
      product = product.product;
    } else if (product.data !== undefined) {
      product = product.data;
    }
  }

  if (isApiObject(product) && product.product !== undefined) {
    product = product.product;
  }

  if (Array.isArray(product)) {
    product = product[0];
  }

  return isApiObject(product) ? (product as Product) : null;
}

function getNumber(value: Price): number {
  const banglaDigits = "০১২৩৪৫৬৭৮৯";

  const englishNumber = String(value ?? "0")
    .replace(/[০-৯]/g, (digit) =>
      String(banglaDigits.indexOf(digit))
    )
    .replace(/[,\s]/g, "")
    .replace(/[^\d.-]/g, "");

  const number = Number(englishNumber);
  return Number.isNaN(number) ? 0 : number;
}

function formatPrice(value: number | Price): string {
  return new Intl.NumberFormat("bn-BD").format(getNumber(value));
}

function getUnit(unit: string | undefined): string {
  const cleanUnit = (unit || "একক").replace(/^প্রতি\s*/, "");

  if (cleanUnit === "kg") return "কেজি";
  if (cleanUnit === "liter" || cleanUnit === "litre") return "লিটার";
  if (cleanUnit === "dozen") return "ডজন";
  if (cleanUnit === "piece") return "পিস";

  return cleanUnit;
}

export default async function ProductDetails({ params }: PageProps) {
  const { slug } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    const callbackURL = `/product/${slug}`;

    redirect(`/signin?callbackURL=${encodeURIComponent(callbackURL)}`);
  }

  let product: Product | null = null;
  let loadError = false;

  try {
    const response = await fetch(
      "https://openapi.programming-hero.com/api/bazardor/products",
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("পণ্যের তথ্য লোড হয়নি");
    }

    const data: unknown = await response.json();
    const products = getProducts(data);
    const foundProduct = products.find((item) => item.slug === slug);

    if (foundProduct) {
      product = foundProduct;

      if (foundProduct.id) {
        const detailsResponse = await fetch(
          `https://openapi.programming-hero.com/api/bazardor/products/${foundProduct.id}`,
          { cache: "no-store" }
        );

        if (detailsResponse.ok) {
          const detailsData: unknown = await detailsResponse.json();
          const details = getProduct(detailsData);

          if (details) {
            product = { ...foundProduct, ...details };
          }
        }
      }
    }
  } catch (error) {
    console.log("পণ্যের তথ্য লোড হয়নি", error);
    loadError = true;
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f3f7f3] px-4 py-16">
        <div className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-5xl">🛒</p>

          <h1 className="mt-4 text-2xl font-bold text-gray-800">
            {loadError ? "তথ্য লোড হয়নি" : "পণ্যটি পাওয়া যায়নি"}
          </h1>

          <p className="mt-2 text-gray-500">
            {loadError
              ? "আবার চেষ্টা করুন।"
              : "পণ্যের ঠিকানাটি সঠিক কি না দেখুন।"}
          </p>

          <Link href="/" className="btn btn-success mt-6 text-white">
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  const markets = Array.isArray(product.markets) ? product.markets : [];

  const marketRows: MarketRow[] = markets.map((market) => {
    const minimum = getNumber(market.min ?? product.today);
    const maximum = getNumber(market.max ?? product.today);

    return {
      market: market.market || "বাজার",
      division: market.division || "—",
      min: minimum,
      max: maximum,
      average: Math.round((minimum + maximum) / 2),
    };
  });

  const minimumPrice =
    marketRows.length > 0
      ? Math.min(...marketRows.map((row) => row.min))
      : getNumber(product.today);

  const maximumPrice =
    marketRows.length > 0
      ? Math.max(...marketRows.map((row) => row.max))
      : getNumber(product.today);

  const averagePrice =
    marketRows.length > 0
      ? Math.round(
          marketRows.reduce((total, row) => total + row.average, 0) /
            marketRows.length
        )
      : getNumber(product.today);

  const unit = getUnit(product.unit);
  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";

  const changeColor = isUp
    ? "text-green-700"
    : isDown
      ? "text-red-600"
      : "text-gray-500";

  return (
    <main className="min-h-screen bg-[#f3f7f3] px-3 py-5 sm:px-4 sm:py-8">
      <div className="mx-auto max-w-5xl space-y-3">
        <Link
          href="/"
          className="inline-block text-sm text-green-800 hover:underline"
        >
          ← সব পণ্যে ফিরে যান
        </Link>

        <section className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-2xl">
            {product.image || product.categoryIcon || "🛒"}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold text-gray-900">
              {product.nameBn}
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              {product.categoryIcon} {product.categoryNameBn} · প্রতি {unit}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {marketRows.length > 0
                ? `${formatPrice(marketRows.length)}টি বাজারের দাম তুলনা`
                : "আজকের পণ্যের দাম"}
            </p>
          </div>

          <div className="ml-auto min-w-28 rounded-lg bg-[#f3f7f3] px-4 py-3 text-center">
            <p className="text-xs text-gray-500">আজকের দাম</p>
            <p className="text-xl font-bold text-gray-900">
              {formatPrice(product.today)}
            </p>
            <p className="text-xs text-gray-500">টাকা / {unit}</p>

            <p className={`mt-1 text-xs font-semibold ${changeColor}`}>
              {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
              {formatPrice(product.change?.pct)}%
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
          <h2 className="mb-3 text-sm font-bold text-gray-900">
            দামের সারসংক্ষেপ
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 p-3">
              <p className="text-xs text-gray-500">সর্বনিম্ন</p>
              <p className="mt-1 font-bold text-green-700">
                {formatPrice(minimumPrice)} টাকা
              </p>
              <p className="mt-1 text-xs text-gray-500">প্রতি {unit}</p>
            </div>

            <div className="rounded-lg border border-gray-200 p-3">
              <p className="text-xs text-gray-500">সর্বোচ্চ</p>
              <p className="mt-1 font-bold text-red-600">
                {formatPrice(maximumPrice)} টাকা
              </p>
              <p className="mt-1 text-xs text-gray-500">প্রতি {unit}</p>
            </div>

            <div className="rounded-lg border border-gray-200 p-3">
              <p className="text-xs text-gray-500">গড় দাম</p>
              <p className="mt-1 font-bold text-gray-800">
                {formatPrice(averagePrice)} টাকা
              </p>
              <p className="mt-1 text-xs text-gray-500">প্রতি {unit}</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
          <h2 className="mb-3 text-sm font-bold text-gray-900">
            বাজারভিত্তিক আজকের দাম
          </h2>

          {marketRows.length === 0 ? (
            <p className="rounded-lg bg-[#f3f7f3] p-4 text-sm text-gray-600">
              এই পণ্যের বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি।
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-xs min-w-[600px]">
                <thead>
                  <tr className="text-gray-600">
                    <th>বাজার</th>
                    <th>বিভাগ</th>
                    <th className="text-right">সর্বনিম্ন</th>
                    <th className="text-right">সর্বোচ্চ</th>
                    <th className="text-right">গড়</th>
                  </tr>
                </thead>

                <tbody>
                  {marketRows.map((row, index) => (
                    <tr
                      key={`${row.market}-${index}`}
                      className="border-t border-gray-200"
                    >
                      <td className="font-medium text-gray-800">
                        {row.market}
                      </td>
                      <td>{row.division}</td>
                      <td className="text-right">
                        {formatPrice(row.min)} টাকা
                      </td>
                      <td className="text-right">
                        {formatPrice(row.max)} টাকা
                      </td>
                      <td className="text-right font-semibold text-green-700">
                        {formatPrice(row.average)} টাকা
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}