/* eslint-disable @next/next/no-img-element */

import { BsHandbag, BsSuitHeart } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";
import { productService } from "./database/config";

export async function getServerSideProps() {
  const products = await productService.find();

  console.log(products.data);

  return {
    props: {
      products: products.data || [],
    },
  };
}

export default function Home({ products }: { products: any[] }) {
  return (
    <div>
      <nav
        className={`fixed top-0 left-0 w-full bg-white flex items-center justify-between border-b border-gray-300 py-2 px-3`}
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
        <p className="font-bold text-xs mb-2 mt-5">Buscar</p>
        <input
          className="border p-2 rounded-lg w-full outline-none focus:ring-2 ring-primary"
          type="search"
          placeholder="Buscar producto"
        />
      </div>

      <div className="grid grid-cols-2 gap-1 px-4 mt-5">
        {products.map((p) => (
          <div
            className="relative border shadow-sm border-gray-300 p-2 rounded-lg"
            key={p.id}
          >
            <p className="absolute top-5 right-5 bg-primary text-white font-bold py-1 px-2 rounded-lg">
              Q{p.precio}
            </p>
            <img
              className="w-full h-48 object-cover"
              src={p.imagenes[0]}
              alt={p.nombre}
            />
            <p className="font-bold">{p.nombre}</p>

            <p>
              {p.cantidad} disponible{p.cantidad === "1" ? "" : "s"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
