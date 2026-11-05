"use client";

import { useEffect, useState } from "react";
import MarqueeText from "react-marquee-text";

type Product = {
  slug: string;
  nameBn: string;
  image: string;
  categoryIcon: string;
  today: number;
  unit: string;
  change: {
    dir: string;
    pct: number;
  };
};

export default function Marquee() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          "https://openapi.programming-hero.com/api/bazardor/products"
        );

        if (!response.ok) {
          throw new Error("Product data load hoyni");
        }

        const data = await response.json();

        const productList = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
            ? data.data
            : Array.isArray(data.products)
              ? data.products
              : [];

        setProducts(productList);
      } catch (error) {
        console.error("Product fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="border-y bg-gray-50 py-3">দাম লোড হচ্ছে...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="border-y bg-gray-50 py-3">
        পণ্যের তথ্য পাওয়া যায়নি
      </div>
    );
  }

  return (
    <div className="border-y bg-gray-50 py-3">
      <MarqueeText direction="left" duration={10}>
        {products.map((product) => {
          const isUp = product.change.dir === "up";
          const isDown = product.change.dir === "down";

          return (
            <span
              key={product.slug}
              className="mx-6 inline-flex items-center gap-2 whitespace-nowrap text-sm"
            >
              <span className="text-xl">
                {product.image || product.categoryIcon || "🛒"}
              </span>

              <span className="font-medium">{product.nameBn}</span>

              <span>
                {product.today.toLocaleString("bn-BD")} টাকা/{product.unit}
              </span>

              <span
                className={
                  isUp
                    ? "font-medium text-red-600"
                    : isDown
                      ? "font-medium text-green-700"
                      : "font-medium text-gray-500"
                }
              >
                {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
                {product.change.pct.toLocaleString("bn-BD")}%
              </span>
            </span>
          );
        })}
      </MarqueeText>
    </div>
  );
}