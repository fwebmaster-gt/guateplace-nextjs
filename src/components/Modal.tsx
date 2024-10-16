import React, { ReactNode } from "react";

interface Props {
  title: string;
  close: () => void;
  cancelButtonText?: string;
  confirmButton: {
    text?: string;
    action: () => void;
    disabled?: boolean;
  };
  children: ReactNode;
}

export default function Modal({
  title,
  close,
  cancelButtonText,
  confirmButton,
  children,
}: Props) {
  return (
    <>
      <div className="mx-2 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-full my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="max-h-[600px] overflow-y-scroll border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-center justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-xl font-semibold">{title}</h3>
              <button
                className=" p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={close}
              >
                <span className="mb-2 bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                  x
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">{children}</div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={close}
              >
                {cancelButtonText || "Cancelar"}
              </button>
              <button
                disabled={confirmButton.disabled || false}
                className="bg-primary disabled:bg-gray-700 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => {
                  confirmButton.action();
                }}
              >
                {confirmButton.text || "Guardar"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
