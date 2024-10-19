/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { calcularDescuento } from "@/constants/prices";
import { useAppStore } from "@/hooks/useAppStore";
import { useAuthStore } from "@/hooks/useAuth";
import { useCartStore } from "@/hooks/useCart";
import Link from "next/link";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BsCartX, BsFillSuitHeartFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";

const ProductCard = ({ p }: any) => {
  const {
    addProduct,
    decrementItem,
    incrementItem,
    productsInCart,
    removeProduct,
  } = useCartStore();

  const { user, addOrRemoveWishList } = useAuthStore();
  const { setLoginToContinue } = useAppStore();

  const favoritos = user?.favoritos || [];

  const totalAdded = productsInCart.find(
    (productInCart) => productInCart.productId === p.id
  )?.qty || 0;

  return (
    <div
      className="relative border shadow-sm border-gray-300 rounded-lg overflow-hidden"
      key={p.id}
    >
      {favoritos.includes(p.id) ? (
        <BsFillSuitHeartFill
          className={`z-10 absolute top-5 right-2 text-3xl text-red-500`}
          onClick={() => {
            if (user) {
              addOrRemoveWishList(p.id);
            } else {
              setLoginToContinue({ block: false, value: true });
            }
          }}
        />
      ) : (
        <BsFillSuitHeartFill
          onClick={() => {
            if (user) {
              addOrRemoveWishList(p.id);
            } else {
              setLoginToContinue({ block: false, value: true });
            }
          }}
          className={`z-10 absolute top-5 right-2 text-3xl text-blue-500/70`}
        />
      )}

      <div className="relative">
        <Link href={`/productos/${p.id}`}>
          <img
            className="w-32 h-32 mx-auto md:h-64 md:w-64 object-cover mt-4 rounded-lg"
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
            } absolute bottom-4 left-4 p-1 text-white text-[10px] rounded-lg font-bold`}
          >
            {p.label}
          </p>
        ) : p.precio_especial ? (
          <p className="bg-red-600 absolute bottom-4 left-4 p-1 text-white text-[10px] rounded-lg font-bold">
            - {calcularDescuento(+p.precio, +p.precio_especial)} %
          </p>
        ) : (
          <></>
        )}
      </div>

      <div className="p-3 bg-white overflow-hidden flex flex-col justify-between">
        <Link className="mb-3" href={`/productos/${p.id}`}>
          <p className="h-9 lg:h-16 capitalize text-xs lg:text-base text-gray-800 font-bold text-elipsis-2">
            {p.nombre}
          </p>

          <div className="flex gap-2">
            {p.precio_especial ? (
              <>
                <p className="font-bold capitalize lg:text-base text-gray-800">
                  Q{p.precio_especial}
                </p>

                <p className="line-through capitalize text-xs lg:text-base text-gray-500">
                  Q{p.precio}
                </p>
              </>
            ) : (
              <p className="font-bold capitalize lg:text-base text-gray-800">
                Q{p.precio}
              </p>
            )}
          </div>
        </Link>

        {
               (p.cantidad <= 0 || p.out_stock) ? <span>
         
             </span> : <span className="text-center mb-2 rounded-md bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
             
                <span className="font-bold">{p.cantidad}</span>{" "}
                {+p.cantidad === 1 ? "Unidad" : "Unidades"}  {" "} {+p.cantidad === 1 ? "Disponible" : "Disponibles"}
              </span> 
              }

        {(p.out_stock === true || +p.cantidad <= 0) ? (
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
                  <button
                    onClick={() => removeProduct(p.id)}
                    className="flex items-center justify-center h-7 w-7 bg-red-500 rounded-lg text-white font-bold"
                  >
                    <MdDelete />
                  </button>
                ) : (
                  <button
                    onClick={() => decrementItem(p.id)}
                    className="flex items-center justify-center h-7 w-7 bg-primary rounded-lg text-white font-bold"
                  >
                    -
                  </button>
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
                <button disabled={totalAdded && totalAdded <= +p.cantidad - 1 ? false : true}
                  onClick={() => {                   
                    if(totalAdded){
                      if(totalAdded <= +p.cantidad - 1){
                        incrementItem(p.id)
                      }
                    }
                  }}
                  className="disabled:bg-gray-700 flex items-center justify-center h-7 w-7 bg-primary rounded-lg text-white font-bold"
                >
                  +
                </button>
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
