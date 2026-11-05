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

export default function PriceChange() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  const increasedProducts = products
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  const decreasedProducts = products
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  function showProducts(product: Product) {
    const isUp = product.change.dir === "up";

    return (
      <Link key={product.slug} href={`/product/${product.slug}`}>
        <div className="card border border-gray-200 bg-white shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <span className="text-4xl">{product.image}</span>

              <span className={isUp ? "text-red-600" : "text-green-700"}>
                {isUp ? "▲" : "▼"}{" "}
                {Number(product.change.pct).toLocaleString("bn-BD")}%
              </span>
            </div>

            <h3 className="mt-3 font-bold">{product.nameBn}</h3>
            <p className="text-sm text-gray-500">প্রতি {product.unit}</p>

            <p className="font-bold text-green-700">
              {Number(product.today).toLocaleString("bn-BD")} টাকা
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <section>
        <h2 className="mb-4 text-2xl font-bold">আজ দাম বেড়েছে ▲</h2>

        {loading ? (
          <p>লোড হচ্ছে...</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {increasedProducts.map(showProducts)}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">আজ দাম কমেছে ▼</h2>

        {loading ? (
          <p>লোড হচ্ছে...</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {decreasedProducts.map(showProducts)}
          </div>
        )}
      </section>
    </div>
  );
}