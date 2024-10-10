/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { LOGO } from "./Navbar";
import { useAppStore } from "@/hooks/useAppStore";

const LoginToContinue = () => {
  const router = useRouter();

  const currentRoute = router.asPath;

  const { setLoginToContinue, showLoginToContinue } = useAppStore();

  return (
    <div className="fixed top-0 left-0 w-full bg-white z-40 min-h-screen px-5 flex flex-col items-start justify-center">
      <div className="w-full relative">
        <img
          className="mx-auto"
          src={LOGO}
          alt="guateplace"
          width={200}
          height={200}
        />
        <h2 className="text-gray-800 capitalize text-xl text-center font-bold">
          Bienvenido a <span className="text-primary">Guate</span>place
        </h2>

        <p className="text-center text-gray-500 text-sm w-[80%] mx-auto mt-2">
          Inicia sesion y accede a todas las funcionalidades que tenemos para
          ti!
        </p>
        <div className="mt-8">
          <button
            onClick={() => {
              router.push(`/cuenta/inicio-sesion?backto=${currentRoute}`);
              setLoginToContinue({ block: false, value: false });
            }}
            className="w-full flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Ya tengo cuenta
          </button>

          <button
            onClick={() => {
              router.push(`/cuenta/crear-cuenta?backto=${currentRoute}`);
              setLoginToContinue({ block: false, value: false });
            }}
            className="mt-5 w-full flex items-center justify-center rounded-md border border-transparent bg-pink-500 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-pink-700"
          >
            Crear Nueva Cuenta
          </button>

          {!showLoginToContinue.block && (
            <button
              onClick={() => setLoginToContinue({ block: false, value: false })}
              className="text-gray-500 underline text-sm mt-8 text-center mx-auto w-full"
            >
              Mas Tarde
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginToContinue;
