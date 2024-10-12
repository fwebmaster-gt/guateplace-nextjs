/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import CreateAddressModal from "@/components/CreateAddressModal";
import CreateNit from "@/components/CreateNit";
import LoadingPage from "@/components/LoadingPage";
import Navbar from "@/components/Navbar";
import OrderSeccess from "@/components/OrderSeccess";
import { calcularSubtotal } from "@/constants/prices";
import { pedidosService, productService } from "@/database/config";
import { useAppStore } from "@/hooks/useAppStore";
import { Direccion, Nit, useAuthStore } from "@/hooks/useAuth";
import { useCartStore } from "@/hooks/useCart";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiEdit } from "react-icons/bi";
import {
  FaCheckCircle,
  FaChevronCircleDown,
  FaChevronCircleUp,
} from "react-icons/fa";

const MAX_COD_PRICE = 1000;
const TARIFA_ENVIO = 35;

const defaultNit = {
  nombre: "C/F",
  numero: "C/F",
};

const CheckoutPage = ({ products }: { products: any[] }) => {
  const router = useRouter();
  const [orderSucess, setOrderSeccess] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const { productsInCart, clearCart } = useCartStore();
  const { setLoginToContinue } = useAppStore();
  const { user } = useAuthStore();

  const [showProducts, setShowProducts] = useState(false);
  const [showEnvio, setShowEnvio] = useState(true);
  const [showFactura, setShowFactura] = useState(true);
  const [showPagos, setShowPagos] = useState(true);

  const [addingAddress, setAddingAddress] = useState(false);
  const [addingNit, setAddingNit] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "deposito">(
    "deposito"
  );

  const [selectedAddress, setSelectedAddress] = useState<Direccion | null>(
    null
  );

  const [selectedNit, setSelectedNit] = useState<Nit>(defaultNit);

  // Función para calcular el total del pedido
  const calcularTotalPedido = (): number => {
    return productsInCart.reduce((total, productInCart) => {
      const details = products.find((p) => p.id === productInCart.productId);

      if (!details) return total; // Si no se encuentra el producto, continuar

      const subtotal = calcularSubtotal(
        +details.precio,
        +details.precio_especial,
        productInCart.qty
      );

      return total + subtotal; // Sumar el subtotal al total
    }, 0);
  };

  useEffect(() => {
    if (user) {
      setLoginToContinue({ block: false, value: false });
    } else {
      setLoginToContinue({ block: true, value: true });
    }
  }, [user]);

  if (!user) return <></>;

  const sendPedido = async () => {
    const confirmOp = confirm("Estas seguro de finalizar tu pedido?");

    if (confirmOp === false) return;

    setLoading(true);

    const populatedProduct = productsInCart.map((pCart) => {
      const info = products.find((p) => p.id === pCart.productId);

      return {
        producto_id: pCart.productId,
        cantidad: pCart.qty,
        precio_final_unitario: info.precio_especial
          ? info.precio_especial
          : info.precio,
        subtotal: calcularSubtotal(
          info.precio,
          info.precio_especial,
          pCart.qty
        ),
      };
    });

    const pedidoFinal = {
      fecha: Date.now(),
      cliente_id: user.id,
      productos_pedidos: populatedProduct,
      info_envio: selectedAddress,
      info_factura: selectedNit,
      sub_total: calcularTotalPedido(),
      total_envio: TARIFA_ENVIO,
      total: (calcularTotalPedido() + TARIFA_ENVIO).toFixed(2),
      estado: "pendiente",
      guia: null,
      tipo_pago: paymentMethod,
      pago_esta_listo: false,
    };

    const pedidoCreado = await pedidosService.add(pedidoFinal);

    console.log(pedidoFinal);

    if (pedidoCreado.data && !pedidoCreado.error) {
      clearCart();

      setOrderSeccess(`${(pedidoCreado.data as any).id}` || "");
    } else {
      toast.error(`${JSON.stringify(pedidoCreado.error)}`);
      setOrderSeccess(null);
    }

    setLoading(false);
  };

  if (orderSucess) return <OrderSeccess id={orderSucess} />;

  return (
    <>
      {loading && <LoadingPage customText="Realizando Pedido" />}

      <Navbar />
      <div
        className="relative z-10"
        aria-labelledby="slide-over-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
              <div className="pointer-events-auto w-screen max-w-md">
                <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2
                        className="text-lg font-medium text-gray-900"
                        id="slide-over-title"
                      >
                        Finalizando Pedido
                      </h2>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          onClick={() => {
                            router.push("/carrito");
                          }}
                          type="button"
                          className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                        >
                          <span className="absolute -inset-0.5" />
                          <span className="sr-only">Close panel</span>
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="mt-8">
                      <div className="flow-root">
                        <div className="border bg-white p-5 shadow rounded-xl mb-5">
                          <div
                            onClick={() => setShowEnvio(!showEnvio)}
                            className="flex gap-2 items-center justify-between cursor-pointer"
                          >
                            <div className="flex gap-2 items-center">
                              <div className="flex items-center gap-5">
                                <FaCheckCircle
                                  className={
                                    selectedAddress
                                      ? "text-green-600"
                                      : "text-gray-500"
                                  }
                                />
                                <img
                                  src={"/truck.png"}
                                  alt="bag"
                                  className="w-7 h-7"
                                />
                              </div>

                              <h3 className="font-bold text-gray-800 text-lg">
                                Envio
                              </h3>
                            </div>
                            {!showEnvio ? (
                              <FaChevronCircleDown className="text-primary text-xl cursor-pointer" />
                            ) : (
                              <FaChevronCircleUp className="text-primary text-xl cursor-pointer" />
                            )}
                          </div>

                          {showEnvio && (
                            <div>
                              {user.direcciones.length === 0 ? (
                                <p className="text-xs text-center text-gray-600 mt-5">
                                  Sin direcciones
                                </p>
                              ) : (
                                <div className="grid grid-cols-2 gap-4 mt-5">
                                  {user.direcciones.map((direccion, i) => (
                                    <div
                                      className={`relative border p-2 rounded-lg ${
                                        selectedAddress?.id === direccion.id
                                          ? "ring-2 ring-primary"
                                          : ""
                                      }`}
                                      key={i}
                                    >
                                      <div
                                        onClick={() =>
                                          setSelectedAddress(direccion)
                                        }
                                      >
                                        <p className="text-[12px] font-bold">
                                          {direccion.nombre_receptor}
                                        </p>
                                        <p className="text-[10px] text-gray-800 mb-1">
                                          {direccion.departamento},{" "}
                                          {direccion.municipio}
                                        </p>
                                        <p className="text-[8px] text-gray-500">
                                          {direccion.direccion_exacta}
                                        </p>
                                      </div>
                                      <BiEdit className="z-20 absolute top-0 text-primary right-0 text-xl" />
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div>
                                <button
                                  onClick={() => setAddingAddress(true)}
                                  className="text-xs font-bold mt-5 w-full flex items-center justify-center rounded-md border border-transparent bg-primary p-2 text-white shadow-sm hover:bg-blue-700 disabled:bg-gray-800"
                                >
                                  Agregar Dirección +
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="border bg-white p-5 shadow rounded-xl mb-5">
                          <div
                            onClick={() => setShowPagos(!showPagos)}
                            className="flex gap-2 items-center justify-between cursor-pointer"
                          >
                            <div className="flex gap-2 items-center">
                              <div className="flex items-center gap-5">
                                <FaCheckCircle
                                  className={
                                    paymentMethod
                                      ? "text-green-600"
                                      : "text-gray-500"
                                  }
                                />
                                <img
                                  src={"/pagos.png"}
                                  alt="pagos"
                                  className="w-7 h-7"
                                />
                              </div>
                              <h3 className="font-bold text-gray-800 text-lg">
                                Metodo De Pago
                              </h3>
                            </div>
                            {!showPagos ? (
                              <FaChevronCircleDown className="text-primary text-xl cursor-pointer" />
                            ) : (
                              <FaChevronCircleUp className="text-primary text-xl cursor-pointer" />
                            )}
                          </div>

                          {showPagos && (
                            <div className="mt-6 grid grid-cols-2 gap-4 ">
                              <button
                                onClick={() => setPaymentMethod("deposito")}
                                className={`mt-4 text-sm border bg-white p-2 shadow rounded-xl ${
                                  paymentMethod === "deposito"
                                    ? "ring-2 ring-primary"
                                    : ""
                                }`}
                              >
                                Transferencia o Deposito
                              </button>

                              {calcularTotalPedido() < MAX_COD_PRICE ? (
                                <button
                                  onClick={() => setPaymentMethod("cod")}
                                  className={`mt-4 text-sm border bg-white p-2 shadow rounded-xl ${
                                    paymentMethod === "cod"
                                      ? "ring-2 ring-primary"
                                      : ""
                                  }`}
                                >
                                  Pago contra entrega
                                </button>
                              ) : (
                                <div
                                  className={`mt-4 whitespace-nowrap text-center relative text-sm border bg-gray-100 p-2 shadow rounded-xl`}
                                >
                                  Pago contra entrega
                                  <span className="font-bold bg-red-500 text-white p-1 rounded-lg absolute -top-5 -right-3 text-[8px]">
                                    Solo pedidos menores a Q{MAX_COD_PRICE}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="border bg-white p-5 shadow rounded-xl">
                          <div
                            onClick={() => setShowFactura(!showFactura)}
                            className="flex gap-2 items-center justify-between cursor-pointer"
                          >
                            <div className="flex gap-2 items-center">
                              <div className="flex items-center gap-5">
                                <FaCheckCircle
                                  className={
                                    selectedNit
                                      ? "text-green-600"
                                      : "text-gray-500"
                                  }
                                />
                                <img
                                  src={"/factura.png"}
                                  alt="bag"
                                  className="w-7 h-7"
                                />
                              </div>
                              <h3 className="font-bold text-gray-800 text-lg">
                                Factura
                              </h3>
                            </div>
                            {!showFactura ? (
                              <FaChevronCircleDown className="text-primary text-xl cursor-pointer" />
                            ) : (
                              <FaChevronCircleUp className="text-primary text-xl cursor-pointer" />
                            )}
                          </div>

                          {showFactura && (
                            <div>
                              <div className="mt-4 grid grid-cols-2 gap-3">
                                <button
                                  onClick={() => setSelectedNit(defaultNit)}
                                  className={`border p-3 rounded-lg ring-primary ${
                                    selectedNit.numero === "C/F" ? "ring-2" : ""
                                  }`}
                                >
                                  CF
                                </button>

                                {user.nits.map((nit, iNit) => (
                                  <button
                                    onClick={() => setSelectedNit(nit)}
                                    key={iNit}
                                    className={`font-bold capitalize text-[8px] border p-3 rounded-lg ring-primary ${
                                      selectedNit.numero === nit.numero
                                        ? "ring-2"
                                        : ""
                                    }`}
                                  >
                                    {nit.nombre} -{" "}
                                    <span className="text-gray-600 font-light">
                                      {nit.numero}
                                    </span>
                                  </button>
                                ))}
                              </div>
                              <div>
                                <button
                                  onClick={() => setAddingNit(true)}
                                  className="text-xs font-bold mt-5 w-full flex items-center justify-center rounded-md border border-transparent bg-primary p-2 text-white shadow-sm hover:bg-blue-700 disabled:bg-gray-800"
                                >
                                  Agregar Nit +
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="transition duration-300 rounded-t-lg border-t-2 border-gray-600 px-4 py-4 sm:px-6">
                    {
                      <div className="flex items-center justify-center relative">
                        {!showProducts ? (
                          <FaChevronCircleUp
                            onClick={() => setShowProducts(true)}
                            className="text-primary text-3xl cursor-pointer absolute -top-6"
                          />
                        ) : (
                          <FaChevronCircleDown
                            onClick={() => setShowProducts(false)}
                            className="text-primary text-3xl cursor-pointer absolute -top-6"
                          />
                        )}
                      </div>
                    }

                    {showProducts && (
                      <>
                        <p className="font-bold mb-1">Productos</p>

                        <div className="h-[300px] overflow-y-scroll">
                          <ul
                            role="list"
                            className={`divide-y divide-gray-200`}
                          >
                            {productsInCart.map((productInCart) => {
                              const details = products.find(
                                (p) => p.id === productInCart.productId
                              );

                              if (!details)
                                return (
                                  <p key={productInCart.productId}>
                                    Producto no válido
                                  </p>
                                );

                              return (
                                <li
                                  key={productInCart.productId}
                                  className="flex py-3"
                                >
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
                                                productsInCart.find(
                                                  (productInCart) =>
                                                    productInCart.productId ===
                                                    details.id
                                                )?.qty
                                              }{" "}
                                              X
                                            </p>
                                            {details.precio_especial ? (
                                              <>
                                                <p>
                                                  Q{details.precio_especial}
                                                </p>

                                                <p className="line-through font-bold capitalize text-xs text-gray-500">
                                                  Q{details.precio}
                                                </p>
                                              </>
                                            ) : (
                                              <p>Q{details.precio}</p>
                                            )}{" "}
                                            ={" "}
                                            <p>
                                              Q
                                              {calcularSubtotal(
                                                +details.precio,
                                                +details.precio_especial,
                                                productInCart.qty
                                              )}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500">
                                        {details.color}{" "}
                                        {/* Asumimos que 'color' es una propiedad */}
                                      </p>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </>
                    )}

                    {productsInCart.length > 0 && (
                      <>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Subtotal</p>
                          <p>Q{calcularTotalPedido().toFixed(2)}</p>
                        </div>

                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Envio</p>
                          <p>Q35</p>
                        </div>

                        <div className="border w-full my-3"></div>

                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Total A Pagar</p>
                          <p>
                            Q{(calcularTotalPedido() + TARIFA_ENVIO).toFixed(2)}
                          </p>
                        </div>

                        <div className="mt-4">
                          <button
                            onClick={() => sendPedido()}
                            disabled={selectedAddress ? false : true}
                            className="w-full flex items-center justify-center rounded-md border border-transparent bg-primary p-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-gray-500"
                          >
                            Finalizar Pedido
                          </button>

                          {selectedAddress ? (
                            <p className="text-xs text-center px-12 mt-5 text-gray-800">
                              Se enviara este pedido a{" "}
                              <span className="text-primary">
                                {selectedAddress?.direccion_exacta}
                              </span>
                            </p>
                          ) : (
                            <p className="whitespace-nowrap text-xs text-center px-12 mt-5 text-gray-800">
                              Por favor seleccione{" "}
                              <span className="text-red-500">
                                una direccion
                              </span>{" "}
                              de envio
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {addingAddress && (
        <CreateAddressModal
          setSelectedAddress={(newAddress) => setSelectedAddress(newAddress)}
          close={() => setAddingAddress(false)}
        />
      )}

      {addingNit && (
        <CreateNit
          close={() => setAddingNit(false)}
          setSelectedNit={(nitData) => setSelectedNit(nitData)}
        />
      )}
    </>
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

export default CheckoutPage;
