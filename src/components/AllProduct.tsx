"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  slug: string;
  nameBn: string;
  image: string;
  today: number;
  unit: string;
  change: {
    dir: string;
    pct: number;
  };
};

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState("default");

  useEffect(() => {
    async function getProducts() {
      try {
        const response = await fetch(
          "https://openapi.programming-hero.com/api/bazardor/products"
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
      } finally {
        setLoading(false);
      }
    }

    getProducts();
  }, []);

  const sortedProducts = [...products];

  if (sortType === "low") {
    sortedProducts.sort((a, b) => a.today - b.today);
  } else if (sortType === "high") {
    sortedProducts.sort((a, b) => b.today - a.today);
  }

  return (
    <section
      id="sob-panno"
      className="mx-auto max-w-6xl space-y-8 px-4 py-8"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">সব পণ্য</h2>
          <p className="mt-1 text-sm text-gray-500">
            মোট {products.length.toLocaleString("bn-BD")} টি পণ্য দেখানো হচ্ছে
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm">
          সাজান
          <select
            className="select select-bordered select-sm"
            value={sortType}
            onChange={(event) => setSortType(event.target.value)}
          >
            <option value="default">ডিফল্ট</option>
            <option value="low">দাম: কম থেকে বেশি</option>
            <option value="high">দাম: বেশি থেকে কম</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p>লোড হচ্ছে...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => {
            const isUp = product.change?.dir === "up";

            return (
              <Link key={product.slug} href={`/product/${product.slug}`}>
                <div className="card border border-gray-200 bg-white shadow-sm">
                  <div className="card-body p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-4xl">{product.image}</span>

                      {product.change && (
                        <span
                          className={isUp ? "text-red-600" : "text-green-700"}
                        >
                          {isUp ? "▲" : "▼"}{" "}
                          {Number(product.change.pct).toLocaleString("bn-BD")}%
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 font-bold">{product.nameBn}</h3>

                    <p className="text-sm text-gray-500">
                      প্রতি {product.unit}
                    </p>

                    <p className="font-bold text-green-700">
                      {Number(product.today).toLocaleString("bn-BD")} টাকা
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}