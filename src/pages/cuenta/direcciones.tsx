import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/hooks/useAuth";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";

const MisDirecciones = () => {
  const { user } = useAuthStore();

  return (
    <div>
      <Navbar />

      <div className="p-5">
        <Link
          className="text-primary underline flex items-center gap-2"
          href={"/cuenta/perfil"}
        >
          <BsArrowLeft /> Mi Cuenta
        </Link>

        <h2 className="text-xl font-bold mb-5 mt-6">Mis direcciones</h2>

        <div>
          {user?.direcciones.map((direccion) => (
            <div className="border p-3 rounded-lg" key={direccion.id}>
              <p className="font-bold text-lg">
                {direccion.departamento}, {direccion.municipio}
              </p>

              <p>
                Recibe{" "}
                <span className="text-primary">
                  {direccion.nombre_receptor}
                </span>{" "}
                en:{" "}
              </p>

              <p>{direccion.direccion_exacta}</p>
              <p className="mt-5">
                <b>Tel: </b> {direccion.tel1}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MisDirecciones;
