/* eslint-disable @next/next/no-img-element */
import LoginToContinue from "@/components/LoginToContinue";
import Navbar from "@/components/Navbar";
import { auth } from "@/database/config";
import { useAuthStore } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import { FaMedal } from "react-icons/fa";
import { calculateUserLevel } from "../pedido";
import { FaArrowTrendUp } from "react-icons/fa6";
import Seo from "@/components/Seo";

const MyAccount = () => {
  const { user } = useAuthStore();

  const router = useRouter();

  if (!user) return <LoginToContinue />;

  return (
    <div>
      <Navbar />
      <Seo title="Mi Perfil" description="Detalles de tu cuenta como usuario" />

      <div className="px-8 mt-4">
        <h3 className=" font-bold text-2xl mx-5 mb-5">Perfil</h3>

        <div className="shadow border p-4 rounded-lg flex gap-2 items-center">
          <div>
            <img
              src={user.avatar}
              alt="Avatar-profile"
              width={75}
              height={75}
              className="rounded-lg border mx-auto mb-2"
            />
            <div className="flex border p-2 rounded-lg gap-1">
              <FaMedal
                className={`${calculateUserLevel(user.xp || 0).color} text-xs`}
              />
              <p className="text-[8px] whitespace-nowrap font-bold text-gray-700">
                Cliente {calculateUserLevel(user.xp || 0).nombre}
              </p>
            </div>
          </div>

          <div className="pl-5 w-[60%] mx-auto">
            <p className="font-bold mb-2">
              {user.nombre} {user.apellido}
            </p>
            <div className="flex text-xs items-center gap-5 w-[70%]">
              <img
                className="w-[22px] h-[22px]"
                src="/lanacoin.png"
                alt="lanacoin"
              />
              <p className="text-xs whitespace-nowrap">
                <span className="font-bold">
                  {user.lanacoins.toFixed(2) || 0}
                </span>{" "}
                Lanacoins
              </p>
            </div>
            <div className="flex text-xs items-center mt-1 justify-between w-[70%]">
              <FaArrowTrendUp className="text-green-600 w-[20px] h-[20px]" />
              <p className="text-xs whitespace-nowrap">
                <span className="font-bold">{user.xp || 0}</span> Puntos
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 px-8">
        <button
          onClick={() => router.push(`/cuenta/pedidos`)}
          className="text-sm shadow border p-4 rounded-lg flex flex-col items-center justify-center"
        >
          <img
            className="mb-2"
            width={30}
            height={30}
            src="/truck.png"
            alt="truck"
          />
          Pedidos
        </button>

        <button
          onClick={() => router.push(`/cuenta/direcciones`)}
          className="text-sm shadow border p-4 rounded-lg flex flex-col items-center justify-center"
        >
          <img
            className="mb-2"
            width={30}
            height={30}
            src="/address.png"
            alt="truck"
          />{" "}
          Direcciones
        </button>

        <button className="text-sm shadow border p-4 rounded-lg flex flex-col items-center justify-center">
          <img
            className="mb-2"
            width={30}
            height={30}
            src="/factura.png"
            alt="truck"
          />{" "}
          Facturacion
        </button>

        <button className="text-sm shadow border p-4 rounded-lg flex flex-col items-center justify-center">
          <img
            className="mb-2"
            width={30}
            height={30}
            src="/tienda.png"
            alt="truck"
          />{" "}
          Vender
        </button>
      </div>

      <div className="px-8 mt-12">
        <button
          onClick={() => {
            auth.closeSession();

            router.push("/");
          }}
          type="button"
          className="w-full font-bold shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-red-500 hover:bg-red-600 focus:outline-none"
        >
          Cerrar sesion
        </button>
      </div>
    </div>
  );
};

export default MyAccount;
