import { useRouter } from "next/router";
import Navbar from "./Navbar";

/* eslint-disable @next/next/no-img-element */
const OrderSeccess = ({ id }: { id: string }) => {
  const router = useRouter();

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center">
        <div className="mt-12">
          <img
            className="mx-auto"
            src="/gracias.gif"
            alt="gracias-por-comprar"
            width={200}
            height={200}
          />

          <h2 className="font-bold text-xl text-center">
            Gracias por tu compra
          </h2>
          <p className="text-xs text-gray-700">
            Pronto nos pondremos en contacto contigo
          </p>

          <button
            onClick={() => router.push(`/pedido/${id}`)}
            type="button"
            className="mt-8 flex items-center justify-center gap-2 w-full font-bold shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-gray-800 bg-white border hover:bg-gray-50 focus:outline-none"
          >
            Ver detalle del pedido
          </button>

          <button
            onClick={() => router.push("/")}
            type="button"
            className="mt-4 flex items-center justify-center gap-2 w-full font-bold shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-gray-50 bg-primary border hover:bg-gray-50 focus:outline-none"
          >
            Seguir comprando
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSeccess;
