/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ModalDialog from "@/components/ModalDialog";
import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import { calcularSubtotal } from "@/constants/prices";
import { productService } from "@/database/config";
import { Producto } from "@/hooks/useAuth";
import { useCartStore } from "@/hooks/useCart";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { BsCartX } from "react-icons/bs";
import { MdDelete } from "react-icons/md";

const CartPage = ({ products }: { products: any[] }) => {
  const router = useRouter();
  const { productsInCart, decrementItem, incrementItem, removeProduct } =
    useCartStore();

  const [toRemove, setToRemove] = useState<Producto | null>(null);

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
    <div>
      <Seo
        title="Carrito de compras | Guateplace"
        description="Revisa los productos que has agregado a tu carrito de compras"
      />
      <Navbar />

      <ModalDialog
        title="Estas apunto de eliminar este producto"
        description="Si ya no deseas este producto puedes continuar"
        onClickBtn={() => {
          if (toRemove) {
            removeProduct(toRemove.id);
            setToRemove(null);
          }
        }}
        open={toRemove ? true : false}
        setOpen={(modalValue) => {
          if (!modalValue) return setToRemove(null);
        }}
        textConfirm="Eliminar"
        btnColor="bg-red-500"
      >
        {toRemove && (
          <div className="flex items-center gap-4 justify-center mt-5">
            <img className="rounded-lg object-cover"
              width={75}
              height={75}
              src={toRemove?.imagenes[0]}
              alt={toRemove?.nombre}
            />
            <p>{toRemove?.nombre}</p>
          </div>
        )}
      </ModalDialog>
      <div
        className="relative z-10"
        aria-labelledby="slide-over-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
              <div className="pointer-events-auto w-screen max-w-md">
                <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="mt-20">
                      <h2
                        className="text-lg font-medium text-gray-900 mb-5"
                        id="slide-over-title"
                      >
                        Carrito de compras
                      </h2>
                      <div className="flow-root">
                        {productsInCart.length === 0 && (
                          <div>
                            <img width={200} height={200}
                              className="w-full object-cover"
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

                            const totalAdded = productsInCart.find(
                              (productInCart) =>
                                productInCart.productId === details.id
                            )?.qty;

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
                                <div
                                  onClick={() =>
                                    router.push(
                                      `/productos/${productInCart.productId}`
                                    )
                                  }
                                  className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200"
                                >
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
                                      {details.out_stock === true ||
                                      +details.cantidad === 0 ? (
                                        <button className="bg-gray-800 font-bold text-white p-2 px-4 rounded-lg text-xs flex gap-4 items-center justify-center">
                                          Agotado{" "}
                                          <BsCartX className="text-lg" />
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
                                                <button
                                                  onClick={() => {
                                                    setToRemove(details);
                                                  }}
                                                  className="flex items-center justify-center h-7 w-7 bg-red-500 rounded-full text-white font-bold"
                                                >
                                                  <MdDelete />
                                                </button>
                                              ) : (
                                                <button
                                                  onClick={() =>
                                                    decrementItem(details.id)
                                                  }
                                                  className="flex items-center justify-center h-7 w-7 bg-primary rounded-full text-white font-bold"
                                                >
                                                  -
                                                </button>
                                              )}
                                              <input
                                                disabled={true}
                                                className="w-[40px] py-2 text-center border outline-none rounded-lg"
                                                type="number"
                                                value={totalAdded}
                                              />
                                              <button
                                                disabled={
                                                  totalAdded &&
                                                  totalAdded <=
                                                    +details.cantidad - 1
                                                    ? false
                                                    : true
                                                }
                                                onClick={() => {
                                                  if (totalAdded) {
                                                    if (
                                                      totalAdded <=
                                                      +details.cantidad - 1
                                                    ) {
                                                      incrementItem(details.id);
                                                    }
                                                  }
                                                }}
                                                className="disabled:bg-gray-700 flex items-center justify-center h-6 w-6 bg-primary rounded-full text-white font-bold"
                                              >
                                                +
                                              </button>
                                            </div>
                                          ) : (
                                            <></>
                                          )}
                                        </>
                                      )}
                                    </div>
                                    <div className="flex">
                                      <button
                                        onClick={() =>
                                          setToRemove(details)
                                        }
                                        type="button"
                                        className="font-medium text-red-400 hover:text-red-500"
                                      >
                                        Eliminar
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
                          <Link href={"/pedido"}>
                            <span className="text-primary">Pedido</span>
                          </Link>
                        </p>
                        <Link
                          href={"/pedido"}
                          className="flex items-center justify-center rounded-md border border-transparent bg-primary py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 mt-6"
                        >
                          <p>Realizar Pedido</p>
                        </Link>
                        <div className="mt-4 flex justify-center text-center text-sm text-gray-500">
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
