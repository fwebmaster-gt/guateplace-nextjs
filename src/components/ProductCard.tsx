/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { calcularDescuento } from "@/constants/prices";
import { useCartStore } from "@/hooks/useCart";
import Link from "next/link";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BsCartX, BsFillSuitHeartFill } from "react-icons/bs";
import { MdDelete, MdStar } from "react-icons/md";

const ProductCard = ({ p }: any) => {
  const {
    addProduct,
    decrementItem,
    incrementItem,
    productsInCart,
    removeProduct,
  } = useCartStore();
  return (
    <div
      className="relative border shadow-sm border-gray-300 rounded-lg overflow-hidden"
      key={p.id}
    >
      {p.rating && (
        <p className="absolute z-30 flex items-center text-sm font-bold top-5 right-5 bg-primary text-white py-1 px-2 rounded-lg">
          <MdStar className="text-yellow-400 text-xl" />
          {p.rating}
        </p>
      )}

      {false ? (
        <BsFillSuitHeartFill
          className={`z-10 absolute top-5 left-5 text-3xl text-red-500`}
        />
      ) : (
        <BsFillSuitHeartFill
          className={`z-10 absolute top-5 left-5 text-3xl text-blue-500/50`}
        />
      )}

      <div className="relative">
        <Link href={`/productos/${p.id}`}>
          <img
            className="w-full h-44 object-cover"
            src={p.imagenes[0]}
            alt={p.nombre}
          />
        </Link>
        {p.label ? (
          <p
            style={{
              backgroundColor: p.label_color || "",
            }}
            className={`${
              p.label_color ? "" : "bg-red-600"
            } absolute bottom-4 left-4 p-2 text-white text-xs rounded-lg font-bold`}
          >
            {p.label}
          </p>
        ) : p.precio_especial ? (
          <p className="bg-red-600 absolute bottom-4 left-4 p-2 text-white text-xs rounded-lg font-bold">
            - {calcularDescuento(+p.precio, +p.precio_especial)} %
          </p>
        ) : (
          <></>
        )}
      </div>

      <div className="p-3 bg-white h-[150px] overflow-hidden flex flex-col justify-between">
        <Link href={`/productos/${p.id}`}>
          <div className="flex gap-2">
            {p.precio_especial ? (
              <>
                <p className="font-bold text-xl capitalize lg:text-base text-gray-800">
                  Q{p.precio_especial}
                </p>

                <p className="line-through font-boldcapitalize text-sm lg:text-base font-bold text-gray-500">
                  Q{p.precio}
                </p>
              </>
            ) : (
              <p className="font-bold text-xl capitalize lg:text-base text-gray-800">
                Q{p.precio}
              </p>
            )}
          </div>

          <p className="capitalize text-xs lg:text-base text-gray-900">
            {p.nombre}
          </p>
        </Link>

        {p.out_stock === true ? (
          <button className="bg-gray-800 font-bold text-white p-2 px-4 rounded-lg text-xs flex gap-4 items-center justify-center">
            Agotado <BsCartX className="text-lg" />
          </button>
        ) : (
          <>
            {productsInCart.find(
              (productInCart) => productInCart.productId === p.id
            ) ? (
              <div className="flex items-center justify-between">
                {productsInCart.find(
                  (productInCart) => productInCart.productId === p.id
                )?.qty === 1 ? (
                  <div
                    onClick={() => removeProduct(p.id)}
                    className="flex items-center justify-center h-7 w-7 bg-red-500 rounded-lg text-white font-bold"
                  >
                    <MdDelete />
                  </div>
                ) : (
                  <div
                    onClick={() => decrementItem(p.id)}
                    className="flex items-center justify-center h-7 w-7 bg-primary rounded-lg text-white font-bold"
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
                      (productInCart) => productInCart.productId === p.id
                    )?.qty
                  }
                />
                <div
                  onClick={() => incrementItem(p.id)}
                  className="flex items-center justify-center h-7 w-7 bg-primary rounded-lg text-white font-bold"
                >
                  +
                </div>
              </div>
            ) : (
              <button
                onClick={() => addProduct({ qty: 1, productId: p.id })}
                className="bg-primary text-white p-2 px-4 rounded-lg flex items-center gap-4 justify-center"
              >
                <p className="text-[8px] font-bold uppercase">
                  Agregar al carrito
                </p>
                <AiOutlineShoppingCart className="text-2xl" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
