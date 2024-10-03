/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { calcularSubtotal } from "@/constants/prices";
import { productService } from "@/database/config";
import { useCartStore } from "@/hooks/useCart";
import Link from "next/link";
import { useRouter } from "next/router";
import { BsCartX } from "react-icons/bs";
import { MdDelete } from "react-icons/md";

const CartPage = ({ products }: { products: any[] }) => {
  const router = useRouter();
  const { productsInCart, decrementItem, incrementItem, removeProduct } =
    useCartStore();

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
                      Carrito de compras
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
                      <ul
                        role="list"
                        className="-my-6 divide-y divide-gray-200"
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
                              className="flex py-6"
                            >
                              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
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
                                      <h3>
                                        <a href="#">{details.nombre}</a>
                                      </h3>

                                      <div className="flex gap-2">
                                        {details.precio_especial ? (
                                          <>
                                            <p className="font-bold capitalize text-gray-800">
                                              Q{details.precio_especial}
                                            </p>

                                            <p className="line-through font-bold capitalize text-xs text-gray-500">
                                              Q{details.precio}
                                            </p>
                                          </>
                                        ) : (
                                          <p className="font-bold capitalize text-gray-800">
                                            Q{details.precio}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    <p className="ml-4">
                                      Q
                                      {calcularSubtotal(
                                        +details.precio,
                                        +details.precio_especial,
                                        productInCart.qty
                                      )}
                                    </p>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500">
                                    {details.color}{" "}
                                    {/* Asumimos que 'color' es una propiedad */}
                                  </p>
                                </div>
                                <div className="flex flex-1 items-end justify-between text-sm">
                                  <div className="text-gray-500">
                                    <p className="mb-2"> Cantidad </p>
                                    {details.out_stock === true ? (
                                      <button className="bg-gray-800 font-bold text-white p-2 px-4 rounded-lg text-xs flex gap-4 items-center justify-center">
                                        Agotado <BsCartX className="text-lg" />
                                      </button>
                                    ) : (
                                      <>
                                        {productsInCart.find(
                                          (productInCart) =>
                                            productInCart.productId ===
                                            details.id
                                        ) ? (
                                          <div className="flex items-center justify-between gap-4">
                                            {productsInCart.find(
                                              (productInCart) =>
                                                productInCart.productId ===
                                                details.id
                                            )?.qty === 1 ? (
                                              <div
                                                onClick={() =>
                                                  removeProduct(details.id)
                                                }
                                                className="flex items-center justify-center h-7 w-7 bg-red-500 rounded-full text-white font-bold"
                                              >
                                                <MdDelete />
                                              </div>
                                            ) : (
                                              <div
                                                onClick={() =>
                                                  decrementItem(details.id)
                                                }
                                                className="flex items-center justify-center h-7 w-7 bg-primary rounded-full text-white font-bold"
                                              >
                                                -
                                              </div>
                                            )}
                                            <input
                                              disabled={true}
                                              className="w-[40px] py-2 text-center border outline-none rounded-lg"
                                              type="number"
                                              value={
                                                productsInCart.find(
                                                  (productInCart) =>
                                                    productInCart.productId ===
                                                    details.id
                                                )?.qty
                                              }
                                            />
                                            <div
                                              onClick={() =>
                                                incrementItem(details.id)
                                              }
                                              className="flex items-center justify-center h-6 w-6 bg-primary rounded-full text-white font-bold"
                                            >
                                              +
                                            </div>
                                          </div>
                                        ) : (
                                          <></>
                                        )}
                                      </>
                                    )}
                                  </div>
                                  <div className="flex">
                                    <button
                                      onClick={() => removeProduct(details.id)}
                                      type="button"
                                      className="font-medium text-primary hover:text-blue-500"
                                    >
                                      Remove
                                    </button>
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
                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  {productsInCart.length > 0 && (
                    <>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>Q{calcularTotalPedido().toFixed(2)}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Los costos de envío son calculados en el{" "}
                        <span className="text-primary">Checkout</span>
                      </p>
                      <div className="mt-6">
                        <p className="flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700">
                          Checkout
                        </p>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          <button
                            onClick={() => {
                              router.back();
                            }}
                            type="button"
                            className="ml-2font-medium text-blue-600 hover:text-blue-500"
                          >
                            Continuar Comprando
                            <span aria-hidden="true"> →</span>
                          </button>
                        </p>
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

export default CartPage;
