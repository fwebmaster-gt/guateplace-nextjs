/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */

import { useRouter } from "next/router";
import Navbar from "./Navbar";
import Seo from "./Seo";

const OrderSeccess = ({
  id,
  lanacoins,
  puntos,
}: {
  id: string;
  lanacoins: number;
  puntos: number;
}) => {
  const router = useRouter();

  return (
    <div>
      <Seo
        title="Pedido Completado"
        description="El pedido finalizo correctamente"
      />
      <Navbar />
      <div className="flex items-center justify-center">
        <div className="mt-32">
          <h2 className="font-bold text-xl text-center">
            Gracias por tu compra
          </h2>
          <p className="text-xs text-gray-700">
            Pronto nos pondremos en contacto contigo
          </p>

          <div className="border p-2 rounded-lg text-center mt-5">
            <img
              className="mx-auto"
              src="/gracias.gif"
              alt="gracias-por-comprar"
              width={150}
              height={150}
            />
            <h2 className="font-bold text-center">Recompensas</h2>

            <p>
              {" "}
              <span className="text-primary">{puntos}</span> Puntos
            </p>
            <p className="flex items-center justify-center gap-1">
              {" "}
              <span className="text-primary">{lanacoins.toFixed(2)}</span>{" "}
              Lanacoins <img width={25} height={25} src={"/lanacoin.png"} />
            </p>
          </div>

          <button
            onClick={() => router.push(`/pedido/${id}`)}
            type="button"
            className="mt-4 flex items-center justify-center gap-2 w-full font-bold shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-gray-50 bg-primary border hover:bg-gray-50 focus:outline-none"

          >
            Detalles del pedido
          </button>

        </div>
      </div>
    </div>
  );
};

export default OrderSeccess;
