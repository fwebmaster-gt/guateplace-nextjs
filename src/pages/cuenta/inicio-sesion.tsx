/* eslint-disable @next/next/no-img-element */
import Navbar from "@/components/Navbar";
import { auth } from "@/database/config";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

const LoginAccount = () => {
  return (
    <>
      <Navbar />

      <div className="font-[sans-serif]">
        <div className="min-h-screen flex fle-col items-center justify-center py-6 px-4 ">
          <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full">
            <div className="border border-gray-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
              <form className="space-y-4">
                <div className="mb-8">
                  <div className="relative">
                    <img
                      className="mx-auto w-full h-full mb-4"
                      src="https://dsrsarees.com/public/assets/img/login/forgot.png"
                      alt="Dining Experience"
                    />
                    <img
                      className="absolute top-0 right-0"
                      src="/lanacoin.png"
                      width={75}
                      height={75}
                      alt="lanacoin"
                    />
                  </div>
                  <h3 className="text-gray-800 text-center text-2xl mb-2 font-extrabold">
                    <span className="text-primary">Guate</span>Cuenta
                  </h3>
                  <p className="text-gray-500 text-center text-xs leading-relaxed">
                    Inicia sesión para rastrear tus pedidos y premios
                    fácilmente.
                  </p>
                </div>
                {/* <div className="flex gap-2 mt-5">
                  <div>
                    <label className="text-gray-800 text-sm mb-2 block">
                      Nombre
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-primary"
                        placeholder="Nombre"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-800 text-sm mb-2 block">
                      Apellido
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-primary"
                        placeholder="Apellido"
                      />
                    </div>
                  </div>
                </div> */}

                <div>
                  <label className="text-gray-800 text-sm mb-2 block">
                    Correo Electronico
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="password"
                      type="password"
                      className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-primary"
                      placeholder="Ingresa tu correo electronico"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">
                    Contraseña
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="password"
                      type="password"
                      className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-primary"
                      placeholder="Ingresa tu contraseña"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      className="w-[18px] h-[18px] absolute right-4 cursor-pointer"
                      viewBox="0 0 128 128"
                    >
                      <path
                        d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                        data-original="#000000"
                      />
                    </svg>
                  </div>
                </div>

                <div className="!mt-8">
                  <button
                    type="button"
                    className="w-full font-bold shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-primary hover:bg-blue-600 focus:outline-none"
                  >
                    Iniciar
                  </button>

                  <button
                    onClick={() => auth.loginGoogle()}
                    type="button"
                    className="flex items-center justify-center gap-2 w-full font-bold shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-gray-800 mt-2 bg-white border hover:bg-gray-50 focus:outline-none"
                  >
                    Iniciar Con Google <FcGoogle className="text-2xl" />
                  </button>
                </div>
                <div className="text-center">
                  <Link
                    href={"/cuenta/crear-cuenta"}
                    className="text-sm !mt-8 text-gray-800"
                  >
                    No tienes cuenta?
                    <span className="text-primary font-semibold hover:underline ml-1 whitespace-nowrap">
                      Creala aqui
                    </span>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginAccount;
