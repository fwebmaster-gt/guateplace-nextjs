/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

import { BsFillSuitHeartFill, BsHandbag, BsSuitHeart } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";
import { categoryService, productService } from "./database/config";
import { useState } from "react";
import { MdStar } from "react-icons/md";
import { calcularDescuento } from "./constants/prices";

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
  const [blue, setBlue] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  return (
    <div className="container mx-auto">
      <nav
        className={`z-40 fixed top-0 left-0 w-full bg-white flex items-center justify-between border-b border-gray-300 py-2 px-3`}
      >
        <div className="flex items-center gap-1">
          <img
            width={60}
            height={60}
            src="https://firebasestorage.googleapis.com/v0/b/lanayamor-b666f.appspot.com/o/images%2FLogo_Boutique_de_Ropa_Moderno_Rosa__1_-removebg-preview.png0?alt=media&token=4914ee50-e885-4ee2-8c38-29c748a10ade"
            alt="guateplace-logo"
          />
          <h2 className="font-bold text-lg">
            <span className="text-primary">Guate</span>place
          </h2>
        </div>

        <div className="flex items-center gap-5">
          <BsSuitHeart className="text-3xl text-gray-700" />
          <BsHandbag className="text-3xl text-gray-700" />
          <AiOutlineUser className="text-3xl text-gray-700" />
        </div>
      </nav>

      <div className="opacity-0 h-20">hidden padding</div>

      <div className="px-4">
        <div className="w-full mt-8 mb-5">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Busca productos"
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
        <div className="flex gap-4 overflow-x-scroll py-5">
          {categories.map((category) => (
            <div key={category.id}>
              <div className="h-[100px] w-[100px] min-h-[100px] min-w-[100px] max-h-[100px] max-w-[100px] border rounded-full flex items-center justify-center">
                <img className="w-[75%]" src={category.logo} alt="" />
              </div>

              <p className="text-xs text-center font-bold text-gray-700 max-w-[80px] mx-auto mt-2">
                {category.nombre}
              </p>
            </div>
          ))}
        </div>
      </div>

      {filterProducts(products, search).length === 0 && (
        <p className="text-gray-500 mt-5 text-center">Sin Resultados</p>
      )}

      <div className="grid grid-cols-2 gap-4 px-4 mt-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filterProducts(products, search).map((p) => (
          <div
            className="relative border shadow-sm border-gray-300 rounded-lg overflow-hidden"
            key={p.id}
          >
            <p className="absolute z-30 flex items-center text-sm font-bold top-5 right-5 bg-primary text-white py-1 px-2 rounded-lg">
              <MdStar className="text-yellow-400 text-xl" />
              {p.rating}
            </p>

            {blue ? (
              <BsFillSuitHeartFill
                onClick={() => setBlue(!blue)}
                className={`z-10 absolute top-5 left-5 text-3xl text-red-500`}
              />
            ) : (
              <BsFillSuitHeartFill
                onClick={() => setBlue(!blue)}
                className={`z-10 absolute top-5 left-5 text-3xl text-blue-500/50`}
              />
            )}

            <div className="relative">
              <img
                className="w-full h-44 object-cover"
                src={p.imagenes[0]}
                alt={p.nombre}
              />
              {p.label ? (
                <p
                  style={{
                    backgroundColor: p.label_color || "",
                  }}
                  className={`${
                    p.label_color ? "" : "bg-red-600"
                  } absolute bottom-4 left-4 p-2 text-white text-xs rounded-lg font-bold`}
                >
                  {p.label}
                </p>
              ) : p.precio_especial ? (
                <p className="bg-red-600 absolute bottom-4 left-4 p-2 text-white text-xs rounded-lg font-bold">
                  - {calcularDescuento(+p.precio, +p.precio_especial)} %
                </p>
              ) : (
                <></>
              )}
            </div>

            <div className="p-3 bg-white h-[150px] overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex gap-2">
                  {p.precio_especial ? (
                    <>
                      <p className="font-bold text-xl capitalize lg:text-base text-gray-800">
                        Q{p.precio_especial}
                      </p>

                      <p className="line-through font-boldcapitalize text-sm lg:text-base font-bold text-gray-500">
                        Q{p.precio}
                      </p>
                    </>
                  ) : (
                    <p className="font-bold text-xl capitalize lg:text-base text-gray-800">
                      Q{p.precio}
                    </p>
                  )}
                </div>

                <p className="capitalize text-xs lg:text-base text-gray-900">
                  {p.nombre}
                </p>
              </div>

              <button className="bg-primary text-white p-2 px-4 rounded-lg text-xs">
                Agregar al carrito
              </button>
            </div>
          </div>
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
      p.detalles?.toLowerCase().includes(param.toLowerCase()) ||
      p.tags?.toLowerCase().includes(param.toLowerCase())
  );
}
