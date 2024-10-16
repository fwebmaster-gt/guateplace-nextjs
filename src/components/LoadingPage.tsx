/* eslint-disable @next/next/no-img-element */
import { LOGO } from "./Navbar";
import { CgSpinner } from "react-icons/cg";
interface Props {
  customText?: string;
}

export const MySpinner = () => (
  <div className="mt-5 flex items-center justify-center">
    <CgSpinner className="text-3xl animate-spin text-primary" />
  </div>
);

const LoadingPage = ({ customText }: Props) => {
  return (
    <div className="fixed top-0 left-0 w-full bg-white z-50 min-h-screen px-5 flex flex-col items-start justify-center">
      <div className="w-full relative">
        <img
          className="mx-auto"
          src={LOGO}
          alt="guateplace"
          width={200}
          height={200}
        />

        {customText ? (
          ""
        ) : (
          <h2 className="text-gray-800 capitalize text-xl text-center font-bold">
            Bienvenido a <span className="text-primary">Guate</span>place
          </h2>
        )}

        {customText ? (
          <p className="text-center text-gray-500 text-xs w-[80%] mx-auto">
            {customText}
          </p>
        ) : (
          <p className="text-center text-gray-500 text-xs w-[80%] mx-auto">
            {" "}
            La mejor tienda online en{" "}
            <span className="font-bold">Guatemala</span>
          </p>
        )}

        <MySpinner />
      </div>
    </div>
  );
};

export default LoadingPage;
