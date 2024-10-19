/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MySpinner } from "@/components/LoadingPage";
import LoginToContinue from "@/components/LoginToContinue";
import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import { pedidosService } from "@/database/config";
import { useAuthStore } from "@/hooks/useAuth";
import { Pedido } from "@/types/pedido";
import { useQuery } from "firebase-react-tools";
import { where } from "firebase-react-tools/dist/sdk/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { estadoColors } from "../pedido/[id]";

const PedidoLista = () => {
  const router = useRouter();

  const [data, setData] = useState<Pedido[]>([]);

  const { user } = useAuthStore();

  const { isLoading, refetch } = useQuery(pedidosService, setData, {
    queryOptions: where("cliente_id", "==", user?.id),
  });

  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user]);

  if (!user) return <LoginToContinue />;

  return (
    <div>
      <Seo title="Mis Pedidos" description="Rastrea todos tus pedidos" />
      <Navbar />

      <div className="p-5">
        <h2 className="text-xl mt-3 font-bold mb-5">Tus pedidos</h2>

        {isLoading && <MySpinner />}
        <div className="flex flex-col gap-5">
          {sortByDate(data).map((pedido) => {
            const firstProduct = pedido.productos_pedidos[0];

            return (
              <div
                onClick={() => router.push(`/pedido/${pedido.id}`)}
                className="flex gap-3 border p-4 rounded-lg"
                key={pedido.id}
              >
                <img
                  className="object-cover border rounded-lg"
                  width={80}
                  height={80}
                  src={
                    firstProduct.imagen ||
                    "https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"
                  }
                  alt={firstProduct.nombre || ""}
                />
                <div>
                  <p>{formatDate(pedido.fecha)}</p>
                  <p>
                    <span className="font-bold">
                      {" "}
                      {pedido.productos_pedidos.length}
                    </span>{" "}
                    Productos -{" "}
                    <span className="font-bold">Q{pedido.total}</span>
                  </p>
                  <div>
                    <p
                      className={`${
                        estadoColors[pedido.estado]
                      } text-center rounded-lg mt-2 capitalize`}
                    >
                    {pedido.estado}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function formatDate(timestamp: string | number | Date) {
  const date = new Date(timestamp);
  // Configuramos el formato: día, mes en palabras y año

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function sortByDate(items: Pedido[]): Pedido[] {
  return items.sort((a, b) => {
    const now = Date.now();

    // Calculate the difference between now and each date, then sort accordingly
    const diffA = Math.abs(now - new Date(a.fecha).getTime());
    const diffB = Math.abs(now - new Date(b.fecha).getTime());

    return diffA - diffB;
  });
}

export default PedidoLista;
