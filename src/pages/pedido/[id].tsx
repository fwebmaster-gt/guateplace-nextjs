/* eslint-disable prefer-const */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import LoadingPage, { MySpinner } from "@/components/LoadingPage";
import LoginToContinue from "@/components/LoginToContinue";
import Modal from "@/components/Modal";
import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import { app, pedidosService } from "@/database/config";
import { useAuthStore } from "@/hooks/useAuth";
import { Pago, Pedido } from "@/types/pedido";
import { useQuery, useStorage } from "firebase-react-tools";
import { where } from "firebase-react-tools/dist/sdk/firestore";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsArrowLeft } from "react-icons/bs";
import { FaUpload } from "react-icons/fa";

export const paymentStatus: any = {
  verificando: "bg-blue-50 text-blue-600 ring-blue-600/10",
  "anulado por usuario": "bg-orange-50 text-orange-600 ring-orange-600/10",
  rechazado: "bg-red-50 text-red-600 ring-red-600/10",
  aceptado: "bg-green-50 text-green-600 ring-green-600/10",
};

export const estadoColors: any = {
  pendiente: "bg-orange-50 text-orange-600 ring-orange-600/10",
  confirmado: "bg-indigo-50 text-indigo-500 border-indigo-500 border",
  "verificando pago": "bg-blue-50 text-blue-600 ring-blue-600/10",
  enviado: "bg-green-50 text-green-600 ring-green-600/10",
  "pago pendiente": "bg-orange-50 text-orange-600 ring-orange-600/10"
};

const PedidoInfo = () => {
  const [data, setData] = useState<Pedido[]>([]);

  const [toUpload, setToUpload] = useState<null | File>(null);

  const { uploadFile } = useStorage(app);

  const { user } = useAuthStore();

  const router = useRouter();

  const pedidoId = router.query.id as string;

  let pedido = data.find((p) => p.id === pedidoId);

  const { isLoading, refetch } = useQuery(pedidosService, setData, {
    queryOptions: where("cliente_id", "==", user?.id),
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user]);

  if (!user) return <LoginToContinue />;

  if (!pedido) return <></>;

  if (uploading) return <LoadingPage customText="Subiendo comprobante" />;

  return (
    <div>
      <Seo title={`Pedido #${pedidoId}`} />

      {toUpload && (
        <Modal
          title="Subiendo Evidencia De Pago"
          close={() => setToUpload(null)}
          confirmButton={{
            text: "Subir imagen",
            action: async () => {
              setUploading(true);

              try {
                const res = await uploadFile(
                  `pedidos/${pedidoId}/${nanoid(5)}.png`,
                  toUpload
                );

                const currentPays = pedido.pagos ? pedido.pagos : [];

                if (!res.error && res.file) {
                  const newPayment: Pago = {
                    id: "pay-" + nanoid(5),
                    fecha: Date.now(),
                    estado: "verificando",
                    imagen: res.file?.url,
                    nota_rechazo: "",
                  };

                  await pedidosService.update(
                    pedidoId,
                    {
                      estado: "verificando pago",
                      pagos: [...currentPays, newPayment],
                    },
                    true
                  );

                  pedido.pagos = [...currentPays, newPayment];

                  pedido.estado = "verificando pago";

                  toast.success("Comprobante subido");
                } else {
                  toast.error("Ops... No se subio la imagen");
                }
                setUploading(false);

                setToUpload(null);
              } catch {
                setUploading(false);
                toast.error("Ops... No se subio la imagen");
              }
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
          <BsArrowLeft /> Mis Pedidos
        </Link>

        <div className="border p-3 rounded-lg mt-5 bg-white shadow-sm">
          <h2 className="text-2xl font-bold mb-6">
            Pedido <span className="text-gray-700 text-lg">#{pedido.id}</span>
          </h2>
          <div>
            <p className="text-xl text-gray-700">{formatDate(pedido.fecha)}</p>
            <p></p>

            <div className="w-[80%] mx-auto my-5">
              <div className="flex justify-between items-center">
                <p className="whitespace-nowrap">
                  {" "}
                  {pedido.productos_pedidos.length}{" "}
                  {pedido.productos_pedidos.length === 1
                    ? "producto"
                    : "productos"}
                </p>

                <div className="min-w-[30%] overflow-hidden whitespace-nowrap">
                  ................................................................
                </div>
                <p>Q{pedido.sub_total}</p>
              </div>

              <div className="flex justify-between items-center mt-1">
                <p className="whitespace-nowrap">Envio</p>

                <div className="min-w-[30%] overflow-hidden whitespace-nowrap">
                  ................................................................
                </div>
                <p>Q{pedido.total_envio}</p>
              </div>

              <div className="font-bold flex justify-between items-center mt-1">
                <p className="whitespace-nowrap">Total a pagar</p>

                <div className="min-w-[30%] overflow-hidden whitespace-nowrap">
                  ................................................................
                </div>
                <p>Q{pedido.total}</p>
              </div>
            </div>
          </div>
          <p
            className={`${
              estadoColors[pedido.estado]
            } p-1 text-center rounded-lg mt-2 capitalize`}
          >
            {pedido.estado}
          </p>


          {
            pedido.estado === "pendiente" &&  <p className="text-center text-gray-700 mt-5">Gracias por realizar tu pedido. Te contactaremos pronto para confirmarlo.</p>
          }

          {
            pedido.estado === "confirmado" &&  <p className="text-center text-gray-700 mt-5">Gracias por confirmar tu pedido. Estamos preparando todo para su envío.</p>
          }

         
        </div>

        <div className="border rounded-lg mt-5">
          <h2 className="text-xl font-bold mb-3 mx-4 mt-4">
            Informacion de pagos
          </h2>
          <p className="bg-blue-100 mx-4 my-4 uppercase items-center justify-center flex p-1 rounded-lg text-primary text-center border border-primary">
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
                {pedido.pagos && pedido.pagos.length >= 1 ? (
                  <div className="p-4">
                    {pedido.pagos.map((pago) => (
                      <div
                        className="relative flex gap-4 border-b border-gray-500 py-5"
                        key={pago.id}
                      >
                        <div className="w-20 h-20 overflow-hidden rounded-lg flex items-center justify-center bg-gray-300">
                          <img
                            className="object-cover"
                            src={pago.imagen}
                            alt="imagen-pago"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-lg">Pago #{pago.id}</p>
                          <p>{formatDate(pago.fecha)}</p>
                          <p
                            className={`mt-2 capitalize inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                              paymentStatus[pago.estado]
                            }`}
                          >
                            {pago.estado}
                          </p>

                          {pago.estado === "rechazado" && (
                            <p className="mt-2 w-[80%] mx-auto inline-block">
                              <span className="font-bold">Motivo:</span>{" "}
                              {pago.nota_rechazo}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    {
                      pedido.pagos.find(p => p.estado === "aceptado") ? <></> :      <div className="relative">
                      <button className="py-10 text-base capitalize font-bold border-2 text-primary bg-blue-50 border-dashed border-primary p-3 rounded-lg w-full flex flex-col items-center gap-5 mb-5 mt-8">
                        <FaUpload className="text-4xl" /> Subir otro pago
                      </button>
                      <p>Si ya has subido tu pago, no te precupes, lo vamos a verificar pronto</p>
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
                    }
               
                  </div>
                ) : (
                  <>
                    <div className="relative px-4">
                      <p className="mb-4">
                        Gracias por tu compra. Por favor, realiza el pago y
                        luego sube una imagen o captura del comprobante de
                        depósito o transferencia.
                      </p>
                      <button className="py-10 text-base capitalize font-bold border-2 text-primary bg-blue-50 border-dashed border-primary p-3 rounded-lg w-full flex flex-col items-center gap-5 mb-5 mt-8">
                        <FaUpload className="text-4xl" /> Subir comprobante de
                        pago
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

                    <div className="mt-5">
                      <img
                        className="rounded-lg min-h-[200px] mb-3"
                        src="/deposito-banrural.png"
                        alt="deposito"
                      />

                      <img
                        className="rounded-lg min-h-[200px]"
                        src="/banrural-cuik.png"
                        alt="deposito"
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {isLoading && <MySpinner />}

        <div className="mt-5 shadow border rounded-lg p-4">
          <h2 className="text-xl mt-1 font-bold mb-5">Productos pedidos</h2>
          <ul role="list" className={`divide-y divide-gray-200`}>
            {pedido.productos_pedidos.map((productoPedido) => {
              return (
                <li
                  key={productoPedido.producto_id + "productdetails"}
                  className="flex py-3"
                >
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={
                        productoPedido.imagen ||
                        "https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"
                      }
                      alt={productoPedido.nombre || "noimage"} // Asumimos que 'nombre' es una propiedad
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <div>
                          <h3 className="text-sm font-bold">
                            {productoPedido.nombre || "Eliminado"}
                          </h3>

                          <div className="flex gap-2 text-gray-500 text-xs">
                            <p>{productoPedido.cantidad} X</p>
                            <p>Q{productoPedido.precio_final_unitario}</p>={" "}
                            <p>Q{productoPedido.subtotal}</p>
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

        <div className="shadow mt-5 border p-4 rounded-lg">
          <h2 className="text-xl mt-3 font-bold mb-5">Info De Envio</h2>
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

export function formatDate(timestamp: string | number | Date) {
  const date = new Date(timestamp);
  // Configuramos el formato: día, mes en palabras y año

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default PedidoInfo;
