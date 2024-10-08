/* eslint-disable @next/next/no-img-element */
import { useAppStore } from "@/hooks/useAppStore";
import { useAuthStore } from "@/hooks/useAuth";
import { useCartStore } from "@/hooks/useCart";
import { useRouter } from "next/router";
import { AiOutlineUser } from "react-icons/ai";
import { BsHandbag, BsSuitHeart } from "react-icons/bs";

export const LOGO =
  "https://firebasestorage.googleapis.com/v0/b/lanayamor-b666f.appspot.com/o/images%2FLogo_Boutique_de_Ropa_Moderno_Rosa__1_-removebg-preview.png0?alt=media&token=4914ee50-e885-4ee2-8c38-29c748a10ade";

const Navbar = () => {
  const router = useRouter();

  const { user } = useAuthStore();

  const { productsInCart } = useCartStore();

  const { setLoginToContinue } = useAppStore();

  return (
    <>
      <nav
        className={`z-40 fixed top-0 left-0 w-full bg-white flex items-center justify-between border-b border-gray-300 py-2 px-3`}
      >
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-1 cursor-pointer"
        >
          <img width={60} height={60} src={LOGO} alt="guateplace-logo" />
          <h2 className="font-bold text-lg">
            <span className="text-primary">Guate</span>place
          </h2>
        </div>

        <div className="flex items-center gap-5">
          <button
            onClick={() => {
              if (!user) {
                setLoginToContinue({ block: false, value: true });
              }
            }}
          >
            <BsSuitHeart className="text-3xl text-gray-700" />
          </button>

          <div
            onClick={() => router.push("/carrito")}
            className="relative cursor-pointer"
          >
            <BsHandbag className="text-3xl text-gray-700" />

            {productsInCart.length > 0 && (
              <div className="absolute text-xs top-0 right-0 bg-primary text-white font-bold w-4 h-4 rounded-full flex items-start justify-center">
                {productsInCart.length}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (!user) {
                setLoginToContinue({ block: false, value: true });
              } else {
                router.push(`/cuenta/${user.id}`);
              }
            }}
          >
            <AiOutlineUser className="text-3xl text-gray-700" />
          </button>
        </div>
      </nav>

      <div className="opacity-0 h-20">hidden padding</div>
    </>
  );
};

export default Navbar;
