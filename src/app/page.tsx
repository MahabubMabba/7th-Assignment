// src/app/page.tsx

import { Suspense } from "react";
import Banner from "@/components/Banner";
import PriceChange from "@/components/PriceChange";
import AllProducts from "@/components/AllProduct";

export default function Home() {
  return (
    <>
      <Suspense
        fallback={
          <div className="mx-auto my-6 max-w-7xl px-4 py-8 text-center">
            লোড হচ্ছে...
          </div>
        }
      >
        <Banner />
      </Suspense>

      <PriceChange />
      <AllProducts />
    </>
  );
}