/* eslint-disable @typescript-eslint/no-explicit-any */
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Seo from "@/components/Seo";
import { categoryService, productService } from "@/database/config";
import { useAuthStore } from "@/hooks/useAuth";
import { useCartStore } from "@/hooks/useCart";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BsCartX, BsHeartFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";

/* eslint-disable @next/next/no-img-element */
const ProductoDetails = ({
  products,
}: {
  products: any[];
  categories: any[];
}) => {
  const router = useRouter();

  const productId = router.query.id;

  const productDetails = products.find((p) => p.id === productId);

  const [imageIndex, setImageIndex] = useState(0);

  const {
    addProduct,
    decrementItem,
    incrementItem,
    productsInCart,
    removeProduct,
  } = useCartStore();

  const { addOrRemoveWishList, user } = useAuthStore();

  if (!productDetails) return <p>Producto no encontrado</p>;

  return (
    <div key={productDetails.id}>
      <Seo
        title={productDetails.nombre}
        description={productDetails.detalles}
        image={productDetails.imagenes[0]}
        keywords={productDetails.tags}
      />
      <Navbar />
      <div>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap -mx-4">
            {/* Product Images */}
            <div className="w-full md:w-1/2 px-4 mb-8">
              <img
                src={productDetails.imagenes[imageIndex]}
                alt="Product"
                className="w-[320px] rounded-lg shadow-md mb-4 h-[320px] object-cover mx-auto"
                id="mainImage"
              />
              <div className="flex gap-4 py-4 justify-center overflow-x-auto">
                {productDetails.imagenes.map((image: string, i: number) => (
                  <img
                    onClick={() => setImageIndex(i)}
                    key={i}
                    src={image}
                    alt="Thumbnail 1"
                    className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                  />
                ))}
              </div>
            </div>
            {/* Product Details */}
            <div className="w-full md:w-1/2 px-4">
              <h2 className="text-3xl font-bold mb-2">
                {productDetails.nombre}
              </h2>
              <div className="mb-4">
                <span className="text-2xl font-bold mr-2">
                  Q
                  {productDetails.precio_especial
                    ? productDetails.precio_especial
                    : productDetails.precio}
                </span>

                {productDetails.precio_especial && (
                  <span className="text-gray-500 line-through">
                    Q{productDetails.precio}
                  </span>
                )}
              </div>

              <div
                className="text-gray-700 mb-12"
                dangerouslySetInnerHTML={{
                  __html: productDetails.detalles || "No Data",
                }}
              />

              <div className="flex items-center justify-between mb-6">
                {productDetails.out_stock === true ? (
                  <button className="bg-gray-800 font-bold text-white p-2 px-4 rounded-lg text-xs flex gap-4 items-center justify-center">
                    Agotado <BsCartX className="text-lg" />
                  </button>
                ) : (
                  <>
                    {productsInCart.find(
                      (productInCart) =>
                        productInCart.productId === productDetails.id
                    ) ? (
                      <div className="flex items-center gap-5 justify-between">
                        {productsInCart.find(
                          (productInCart) =>
                            productInCart.productId === productDetails.id
                        )?.qty === 1 ? (
                          <div
                            onClick={() => removeProduct(productDetails.id)}
                            className="flex items-center justify-center h-10 w-10 bg-red-500 rounded-xl text-white font-bold"
                          >
                            <MdDelete />
                          </div>
                        ) : (
                          <div
                            onClick={() => decrementItem(productDetails.id)}
                            className="flex items-center justify-center h-10 w-10 bg-primary rounded-xl text-white font-bold"
                          >
                            -
                          </div>
                        )}
                        <input
                          disabled={true}
                          className="w-[40px] text-xl py-2 text-center border outline-none rounded-lg"
                          type="number"
                          value={
                            productsInCart.find(
                              (productInCart) =>
                                productInCart.productId === productDetails.id
                            )?.qty
                          }
                        />
                        <div
                          onClick={() => incrementItem(productDetails.id)}
                          className="flex items-center justify-center h-10 w-10 bg-primary rounded-xl text-white font-bold"
                        >
                          +
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          addProduct({ qty: 1, productId: productDetails.id })
                        }
                        className="bg-primary text-white p-2 px-4 rounded-lg flex items-center gap-4 justify-center"
                      >
                        <AiOutlineShoppingCart className="text-xl" />
                        <p className="text-base">Agregar al carrito</p>
                      </button>
                    )}
                  </>
                )}
                <button
                  onClick={() => addOrRemoveWishList(productDetails.id)}
                  className="bg-gray-200 flex gap-2 items-center  text-gray-800 px-6 py-2 rounded-md"
                >
                  <BsHeartFill
                    className={`text-xl ${
                      user?.favoritos.includes(productDetails.id)
                        ? "text-red-600"
                        : "text-primary/70"
                    }`}
                  />
                  Favoritos
                </button>
              </div>

              {productDetails.variantes && (
                <>
                  <h2 className="font-bold text-lg mt-8 mb-5">
                    {productDetails.titulo_variantes
                      ? productDetails.titulo_variantes
                      : "Otros Productos"}
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    {productDetails.variantes.map((variantId: string) => {
                      const detailsVariant = products.find(
                        (pv) => pv.id === variantId
                      );

                      return (
                        <div key={variantId}>
                          {detailsVariant ? (
                            <ProductCard p={detailsVariant} />
                          ) : (
                            <div>No encontrado</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const products = await productService.find();
  const categories = await categoryService.find();

  return {
    props: {
      products: products.data || [],
      categories: categories.data || [],
    },
  };
}

export default ProductoDetails;
