"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

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
};

export default function CategoryPage() {
  const params = useParams<{ slug: string | string[] }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState("default");

  useEffect(() => {
    async function getProducts() {
      setLoading(true);

      try {
        const response = await fetch(
          `https://openapi.programming-hero.com/api/bazardor/products?category=${encodeURIComponent(slug)}`,
          { cache: "no-store" }
        );

        const data = await response.json();
        let productList: Product[] = [];

        if (Array.isArray(data)) {
          productList = data;
        } else if (Array.isArray(data.products)) {
          productList = data.products;
        } else if (Array.isArray(data.data)) {
          productList = data.data;
        } else if (Array.isArray(data.data?.products)) {
          productList = data.data.products;
        }

        setProducts(productList);
      } catch (error) {
        console.log("পণ্যের তথ্য লোড হয়নি", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    getProducts();
  }, [slug]);

  const sortedProducts = [...products];

  if (sortType === "low") {
    sortedProducts.sort((a, b) => Number(a.today) - Number(b.today));
  } else if (sortType === "high") {
    sortedProducts.sort((a, b) => Number(b.today) - Number(a.today));
  }

  function getUnitName(unit: string) {
    if (unit === "kg") return "কেজি";
    if (unit === "liter" || unit === "litre") return "লিটার";
    if (unit === "dozen") return "ডজন";
    if (unit === "piece") return "পিস";

    return unit;
  }

  if (loading) {
    return <p className="py-10 text-center">পণ্যের তথ্য লোড হচ্ছে...</p>;
  }

  if (products.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="mb-3 text-2xl font-bold">এই ক্যাটাগরিতে পণ্য নেই</h1>

        <Link href="/" className="btn btn-success text-white">
          হোম পেজে ফিরে যান
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {products[0].categoryIcon} {products[0].categoryNameBn}
        </h1>

        <p className="mt-2 text-gray-500">
          {products.length.toLocaleString("bn-BD")} টি পণ্যের আজকের দাম ও
          পরিবর্তন
        </p>
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          মোট {products.length.toLocaleString("bn-BD")} টি পণ্য দেখানো হচ্ছে
        </p>

        <select
          className="select select-bordered select-sm"
          value={sortType}
          onChange={(event) => setSortType(event.target.value)}
        >
          <option value="default">ডিফল্ট</option>
          <option value="low">দাম: কম থেকে বেশি</option>
          <option value="high">দাম: বেশি থেকে কম</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sortedProducts.map((product) => {
          const isUp = product.change.dir === "up";
          const isDown = product.change.dir === "down";

          return (
            <Link key={product.slug} href={`/product/${product.slug}`}>
              <div className="card h-full border border-gray-200 bg-white shadow-sm hover:shadow-md">
                <div className="card-body p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{product.image}</span>

                    <span
                      className={
                        isUp
                          ? "text-red-600"
                          : isDown
                            ? "text-green-700"
                            : "text-gray-500"
                      }
                    >
                      {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
                      {Number(product.change.pct).toLocaleString("bn-BD")}%
                    </span>
                  </div>

                  <h2 className="mt-3 font-bold text-gray-800">
                    {product.nameBn}
                  </h2>

                  <p className="text-sm text-gray-500">
                    প্রতি {getUnitName(product.unit)}
                  </p>

                  <p className="mt-2 text-sm text-gray-600">আজকের দাম</p>

                  <p className="font-bold text-green-700">
                    {Number(product.today).toLocaleString("bn-BD")} টাকা
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}