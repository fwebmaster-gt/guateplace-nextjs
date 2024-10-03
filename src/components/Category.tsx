/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useRef } from "react";
import Link from "next/link"; // Asegúrate de que estás usando el enrutador correcto

const Category = ({ categoryDetails, categories, categoryId }: any) => {
  const scrollableDivRef = useRef(null); // Crear una referencia para el div

  const handleResetScroll = () => {
    if (scrollableDivRef.current) {
      // @ts-ignore
      scrollableDivRef.current.scrollLeft = 0; // Reinicia el scroll horizontal
    }
  };

  return (
    <div>
      <div
        ref={scrollableDivRef} // Asignar la referencia al div
        className="flex gap-4 overflow-x-scroll py-5"
        id="scrollableDiv"
      >
        {categoryDetails && (
          <div>
            <div className="bg-primary h-[100px] w-[100px] min-h-[100px] min-w-[100px] max-h-[100px] max-w-[100px] border rounded-full flex items-center justify-center">
              <img className="w-[75%]" src={categoryDetails.logo} alt="" />
            </div>

            <p className="text-xs text-center font-bold text-gray-700 max-w-[80px] mx-auto mt-2">
              {categoryDetails.nombre}
            </p>
          </div>
        )}
        {categories
          .filter((c: any) => c.id !== categoryId)
          .map((category: any) => (
            <Link
              onClick={handleResetScroll} // Llamar a la función para reiniciar el scroll
              href={`/categorias/${category.id}`}
              key={category.id}
            >
              <div className="h-[100px] w-[100px] min-h-[100px] min-w-[100px] max-h-[100px] max-w-[100px] border rounded-full flex items-center justify-center">
                <img className="w-[75%]" src={category.logo} alt="" />
              </div>

              <p className="text-xs text-center font-bold text-gray-700 max-w-[80px] mx-auto mt-2">
                {category.nombre}
              </p>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Category;
