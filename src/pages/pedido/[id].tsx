/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MySpinner } from "@/components/LoadingPage";
import LoginToContinue from "@/components/LoginToContinue";
import Modal from "@/components/Modal";
import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import { pedidosService, productService } from "@/database/config";
import { Producto, useAuthStore } from "@/hooks/useAuth";
import { Pedido } from "@/types/pedido";
import { useQuery } from "firebase-react-tools";
import { where } from "firebase-react-tools/dist/sdk/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { FaUpload } from "react-icons/fa";

export const estadoColors: any = {
  pendiente: "bg-orange-300 text-white border-orange-500",
};

const PedidoInfo = ({ products }: { products: Producto[] }) => {
  const [data, setData] = useState<Pedido[]>([]);

  const [toUpload, setToUpload] = useState<null | File>(null);

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
      <Seo title={`Pedido #${pedidoId}`} />
      {toUpload && (
        <Modal
          title="Subiendo Evidencia De Pago"
          close={() => setToUpload(null)}
          confirmButton={{
            text: "Subir imagen",
            action: () => {
              console.log("subiendo...");
            },
          }}
        >
          <div className="flex items-center justify-center">
            <img
              className="max-h-72 rounded-lg"
              src={URL.createObjectURL(toUpload)}
              alt="pago"
            />
          </div>
        </Modal>
      )}

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

        <h2 className="text-xl mt-3 font-bold mb-5">Informacion de pago</h2>

        <div className=" border p-4 rounded-lg mt-3">
          <p className="bg-gray-100 uppercase items-center justify-center flex p-2 rounded-lg font-bold text-center text-gray-800">
            {pedido.tipo_pago === "cod"
              ? "Pago contra entrega"
              : "Deposito/Transferencia"}
          </p>

          <div className="text-gray-700 text-center mt-4 text-xs">
            {" "}
            {pedido.tipo_pago === "cod" ? (
              "Genial! tienes que realizar tu pago hasta recibir tu pedido."
            ) : (
              <>
                <p className="mb-4">
                  Gracias por tu compra. Por favor, realiza el pago y luego sube
                  una imagen o captura del comprobante de depósito o
                  transferencia.
                </p>

                <div className="relative">
                  <button className="text-base capitalize font-bold bg-primary text-white p-3 rounded-lg w-full flex items-center justify-center gap-5 mb-5 mt-8">
                    Subir imagen del pago <FaUpload />
                  </button>
                  <input
                    className="bg-red-200 absolute top-0 left-0 w-full h-full opacity-0"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.length) {
                        setToUpload(e.target.files[0]);
                      }
                    }}
                  />
                </div>

                <div className="mt-12">
                  <img
                    className="rounded-lg"
                    src="/cuenta-ahorro.png"
                    alt="lo"
                  />
                </div>
              </>
            )}
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
