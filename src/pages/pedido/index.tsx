/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { calcularSubtotal } from "@/constants/prices";
import { productService } from "@/database/config";
import { useAppStore } from "@/hooks/useAppStore";
import { Nit, useAuthStore } from "@/hooks/useAuth";
import { useCartStore } from "@/hooks/useCart";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa";

const CheckoutPage = ({ products }: { products: any[] }) => {
  const router = useRouter();
  const { productsInCart } = useCartStore();
  const { setLoginToContinue } = useAppStore();
  const { user } = useAuthStore();

  const [showProducts, setShowProducts] = useState(true);
  const [showEnvio, setShowEnvio] = useState(true);
  const [showFactura, setShowFactura] = useState(true);

  const [selectedAddress] = useState(null);
  const [selectedFactura] = useState<Nit>({
    nombre: "C/F",
    numero: "",
  });

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

  return (
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
                          router.back();
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
                      {productsInCart.length === 0 && (
                        <div>
                          <img
                            className="max-h-[200px] w-full object-cover"
                            src="/empty-cart.png"
                            alt="empty-cart"
                          />
                          <p className="text-gray-500 text-center mb-16">
                            Sin productos
                          </p>
                          <Link
                            href="/"
                            className="flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700"
                          >
                            Seguir Comprando
                          </Link>
                        </div>
                      )}

                      <div className="border bg-white p-5 shadow rounded-xl mb-5">
                        <div
                          onClick={() => setShowEnvio(!showEnvio)}
                          className="flex gap-2 items-center justify-between cursor-pointer"
                        >
                          <div className="flex gap-2 items-center">
                            <img
                              src={"/truck.png"}
                              alt="bag"
                              className="w-7 h-7"
                            />
                            <h3 className="font-bold text-gray-800 text-lg">
                              Envio
                            </h3>
                          </div>
                          {!showEnvio ? (
                            <FaChevronCircleDown className="text-blue-500 text-xl cursor-pointer" />
                          ) : (
                            <FaChevronCircleUp className="text-blue-500 text-xl cursor-pointer" />
                          )}
                        </div>

                        {showEnvio && (
                          <div>
                            {user.direcciones.length === 0 && (
                              <p className="text-xs text-center text-gray-600 mt-5">
                                Sin direcciones
                              </p>
                            )}
                            <div>
                              <button className="text-xs font-bold mt-5 w-full flex items-center justify-center rounded-md border border-transparent bg-primary p-2 text-white shadow-sm hover:bg-blue-700 disabled:bg-gray-800">
                                Agregar Dirección +
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="border bg-white p-5 shadow rounded-xl mb-5">
                        <div
                          onClick={() => setShowFactura(!showFactura)}
                          className="flex gap-2 items-center justify-between cursor-pointer"
                        >
                          <div className="flex gap-2 items-center">
                            <img
                              src={"/factura.png"}
                              alt="bag"
                              className="w-7 h-7"
                            />
                            <h3 className="font-bold text-gray-800 text-lg">
                              Factura
                            </h3>
                          </div>
                          {!showFactura ? (
                            <FaChevronCircleDown className="text-blue-500 text-xl cursor-pointer" />
                          ) : (
                            <FaChevronCircleUp className="text-blue-500 text-xl cursor-pointer" />
                          )}
                        </div>

                        {showFactura && (
                          <div>
                            <div className="mt-4">
                              <button
                                className={`border p-3 rounded-lg ring-primary ${
                                  selectedFactura.nombre === "C/F"
                                    ? "ring-2"
                                    : ""
                                }`}
                              >
                                CF
                              </button>
                            </div>
                            <div>
                              <button className="text-xs font-bold mt-5 w-full flex items-center justify-center rounded-md border border-transparent bg-primary p-2 text-white shadow-sm hover:bg-blue-700 disabled:bg-gray-800">
                                Agregar Nit +
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="border bg-white p-5 shadow rounded-xl">
                        <div
                          onClick={() => setShowProducts(!showProducts)}
                          className="flex gap-2 items-center justify-between cursor-pointer"
                        >
                          <div className="flex gap-2 items-center">
                            <img
                              src={"/bag.png"}
                              alt="bag"
                              className="w-7 h-7"
                            />
                            <h3 className="font-bold text-gray-800 text-lg">
                              Productos
                            </h3>
                          </div>
                          {!showProducts ? (
                            <FaChevronCircleDown className="text-blue-500 text-xl cursor-pointer" />
                          ) : (
                            <FaChevronCircleUp className="text-blue-500 text-xl cursor-pointer" />
                          )}
                        </div>

                        {showProducts && (
                          <ul
                            role="list"
                            className="divide-y divide-gray-200 mt-8"
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
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-t-lg border-t border-gray-200 px-4 py-4 sm:px-6">
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
                        <p>Q{(calcularTotalPedido() + 35).toFixed(2)}</p>
                      </div>

                      <div className="mt-6">
                        <button
                          disabled={selectedAddress ? false : true}
                          className="w-full flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-gray-500"
                        >
                          Finalizar Pedido
                        </button>
                      </div>

                      <p className="mt-4 text-xs text-gray-500 text-center">
                        Faltan
                        <span className="text-primary mx-1">Q500</span> Para
                        envio gratis
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
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

export default CheckoutPage;
