/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

import { BsArrowLeft } from "react-icons/bs";
import { categoryService, productService } from "../../database/config";
import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Seo from "@/components/Seo";
import ProductCard from "@/components/ProductCard";

export async function getServerSideProps() {
  const products = await productService.find();
  const categories = await categoryService.find();

  return {
    props: {
      products: products.data || [],
      categories: categories.data || [],
    },
  };
}

export default function Home({
  products,
  categories,
}: {
  products: any[];
  categories: any[];
}) {
  const router = useRouter();

  const categoryId = router.query.id;

  const [search, setSearch] = useState<string>("");

  const categoryDetails = categories.find((c) => c.id === categoryId);

  const categoryProducts = products.filter((p) =>
    p.categorias.includes(categoryId)
  );

  return (
    <div className="container mx-auto">
      <Seo
        title={categoryDetails.nombre}
        description={
          categoryDetails.descripcion ||
          `Encuentra productos de ${categoryDetails.nombre}`
        }
        image={categoryDetails.imagen}
      />
      <Navbar />

      <div className="px-4">
        <div className="w-full mt-8 mb-5">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder={`Busca en ${categoryDetails.nombre}`}
              type="search"
            />
            <button
              className="absolute top-1 right-1 flex items-center rounded bg-primary py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-blue-700 focus:shadow-none active:bg-blue-700 hover:bg-blue-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 mr-2"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                  clipRule="evenodd"
                />
              </svg>
              Buscar
            </button>
          </div>
        </div>

        <Link
          className="text-primary underline flex items-center gap-2"
          href={"/"}
        >
          <BsArrowLeft /> Todo
        </Link>
        <div
          key={categoryId as string}
          className="flex gap-4 overflow-x-scroll py-5"
        >
          {categoryDetails && (
            <div>
              <div className="bg-primary h-[100px] w-[100px] min-h-[100px] min-w-[100px] max-h-[100px] max-w-[100px] border rounded-full flex items-center justify-center">
                <img className="w-[75%]" src={categoryDetails.logo} alt="" />
              </div>

              <p className="text-xs text-center font-bold text-gray-700 max-w-[80px] mx-auto mt-2">
                {categoryDetails.nombre}
              </p>
            </div>
          )}
          {categories
            .filter((c) => c.id !== categoryId)
            .map((category) => (
              <Link href={`/categorias/${category.id}`} key={category.id}>
                <div className="h-[100px] w-[100px] min-h-[100px] min-w-[100px] max-h-[100px] max-w-[100px] border rounded-full flex items-center justify-center">
                  <img className="w-[75%]" src={category.logo} alt="" />
                </div>

                <p className="text-xs text-center font-bold text-gray-700 max-w-[80px] mx-auto mt-2">
                  {category.nombre}
                </p>
              </Link>
            ))}
        </div>
      </div>

      {filterProducts(categoryProducts, search).length === 0 && (
        <p className="text-gray-500 mt-5 text-center">Sin Resultados</p>
      )}

      <div className="grid grid-cols-2 gap-4 px-4 mt-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filterProducts(categoryProducts, search).map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>

      <div className="opacity-0 h-20">hidden padding</div>
    </div>
  );
}

function filterProducts(productList: any[], param: string) {
  if (!param) return productList;
  return productList.filter(
    (p) =>
      p.nombre?.toLowerCase().includes(param.toLowerCase()) ||
      p.tags?.toLowerCase().includes(param.toLowerCase())
  );
}
