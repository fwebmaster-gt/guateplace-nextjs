/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MySpinner } from "@/components/LoadingPage";
import LoginToContinue from "@/components/LoginToContinue";
import Navbar from "@/components/Navbar";
import { pedidosService, productService } from "@/database/config";
import { useAuthStore } from "@/hooks/useAuth";
import { Pedido } from "@/types/pedido";
import { useQuery } from "firebase-react-tools";
import { where } from "firebase-react-tools/dist/sdk/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const estadoColors: any = {
  pendiente: "bg-orange-300 text-white border-orange-500",
};

const PedidoLista = ({ products }: { products: any[] }) => {
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
      <Navbar />

      <div className="p-5">
        <h2 className="text-xl mt-3 font-bold mb-5">Tus pedidos</h2>

        {isLoading && <MySpinner />}
        <div className="flex flex-col gap-5">
          {data.map((pedido) => {
            const firstProduct = products.find(
              (p) => p.id === pedido.productos_pedidos[0].producto_id
            );

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
                  src={firstProduct ? firstProduct.imagenes[0] : ""}
                  alt=""
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
                  <p
                    className={`${
                      estadoColors[pedido.estado]
                    } p-1 text-center rounded-lg font-bold mt-2 capitalize`}
                  >
                    {pedido.estado}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const products = await productService.find();

  return {
    props: {
      products: products.data || [],
    },
  };
}

function formatDate(timestamp: string | number | Date) {
  const date = new Date(timestamp);
  // Configuramos el formato: día, mes en palabras y año

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default PedidoLista;
