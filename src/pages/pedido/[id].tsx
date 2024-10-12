/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MySpinner } from "@/components/LoadingPage";
import LoginToContinue from "@/components/LoginToContinue";
import Navbar from "@/components/Navbar";
import { pedidosService, productService } from "@/database/config";
import { Producto, useAuthStore } from "@/hooks/useAuth";
import { Pedido } from "@/types/pedido";
import { useQuery } from "firebase-react-tools";
import { where } from "firebase-react-tools/dist/sdk/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";

export const estadoColors: any = {
  pendiente: "bg-orange-300 text-white border-orange-500",
};

const PedidoInfo = ({ products }: { products: Producto[] }) => {
  const [data, setData] = useState<Pedido[]>([]);

  const { user } = useAuthStore();

  const router = useRouter();

  const pedidoId = router.query.id as string;

  const { isLoading, refetch } = useQuery(pedidosService, setData, {
    queryOptions: where("cliente_id", "==", user?.id),
  });

  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user]);

  if (!user) return <LoginToContinue />;

  const pedido = data.find((p) => p.id === pedidoId);

  if (!pedido) return <></>;

  return (
    <div>
      <Navbar />

      <div className="p-5">
        <Link
          className="text-primary underline flex items-center gap-2"
          href={"/cuenta/pedidos"}
        >
          <BsArrowLeft /> Pedidos
        </Link>

        <h2 className="text-xl mt-3 font-bold mb-5">Resumen De Pedido</h2>

        {isLoading && <MySpinner />}

        <div className=" border p-4 rounded-lg">
          <div>
            <p className="text-xl text-gray-700">{formatDate(pedido.fecha)}</p>
            <p></p>

            <div className="w-[80%] mx-auto my-5">
              <div className="flex justify-between items-center">
                <p className="whitespace-nowrap">
                  {" "}
                  {pedido.productos_pedidos.length} productos
                </p>

                <div className="min-w-[30%] overflow-hidden whitespace-nowrap">
                  ................................
                </div>
                <p>Q{pedido.sub_total}</p>
              </div>

              <div className="flex justify-between items-center">
                <p className="whitespace-nowrap">Total Envio</p>

                <div className="min-w-[30%] overflow-hidden whitespace-nowrap">
                  ................................
                </div>
                <p>Q{pedido.total_envio}</p>
              </div>

              <div className="font-bold flex justify-between items-center">
                <p className="whitespace-nowrap">Total a pagar</p>

                <div className="min-w-[30%] overflow-hidden whitespace-nowrap">
                  ................................
                </div>
                <p>Q{pedido.total}</p>
              </div>
            </div>
            <p
              className={`${
                estadoColors[pedido.estado]
              } p-1 text-center rounded-lg font-bold mt-2 capitalize`}
            >
              {pedido.estado}
            </p>
          </div>
        </div>

        <h2 className="text-xl mt-3 font-bold mb-5">Info De Envio</h2>

        <div className=" border p-4 rounded-lg">
          <div>
            <p className="mb-3">
              <b> Nombre de receptor</b>: {pedido.info_envio.nombre_receptor}
            </p>

            <p className="mb-3">
              <b> Telefono</b>: {pedido.info_envio.tel1}
            </p>

            <p className="mb-3">
              <b> Destino</b>: {pedido.info_envio.municipio},{" "}
              {pedido.info_envio.departamento}
            </p>
            <p className="mb-3">
              <b>Direccion Exacta: </b>
              {pedido.info_envio.direccion_exacta},{" "}
              {pedido.info_envio.municipio} , {pedido.info_envio.departamento}
            </p>

            <p className="mb-3">
              <b> Precio Envio</b>: Q{pedido.total_envio}
            </p>
          </div>
        </div>

        <h2 className="text-xl mt-3 font-bold mb-5">Productos pedidos</h2>

        <div>
          <ul role="list" className={`divide-y divide-gray-200`}>
            {pedido.productos_pedidos.map((productInCart) => {
              const details = products.find(
                (p) => p.id === productInCart.producto_id
              );

              if (!details)
                return (
                  <p key={productInCart.producto_id}>Producto no válido</p>
                );

              return (
                <li key={productInCart.producto_id} className="flex py-3">
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={details.imagenes[0]}
                      alt={details.nombre} // Asumimos que 'nombre' es una propiedad
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <div>
                          <h3 className="text-sm font-bold">
                            <a href="#">{details.nombre}</a>
                          </h3>

                          <div className="flex gap-2 text-gray-500 text-xs">
                            <p>
                              {
                                pedido.productos_pedidos.find(
                                  (productInCart) =>
                                    productInCart.producto_id === details.id
                                )?.cantidad
                              }{" "}
                              X
                            </p>
                            <p>Q{productInCart.precio_final_unitario}</p>={" "}
                            <p>Q{productInCart.subtotal}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
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

export default PedidoInfo;
