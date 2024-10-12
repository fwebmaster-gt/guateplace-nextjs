/* eslint-disable @typescript-eslint/no-explicit-any */
import { Nit, useAuthStore } from "@/hooks/useAuth";
import { useState } from "react";
import Modal from "./Modal";
import { customerService } from "@/database/config";
import toast from "react-hot-toast";

const defaultData: Nit = {
  nombre: "",
  numero: "",
};

const CreateNit = ({
  close,
  setSelectedNit,
}: {
  close: () => void;
  setSelectedNit: (nit: Nit) => void;
}) => {
  const { user, setUser } = useAuthStore();

  const [formData, setFormData] = useState<Nit>(defaultData);

  const handleChange = (key: string, value: any) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  return (
    <Modal
      title={"Datos facturacion"}
      confirmButton={{
        action: async () => {
          await customerService.addInArray(user?.id || "", "nits", {
            ...formData,
          });

          if (user) {
            setUser({
              ...user,
              nits: [...user.nits, { ...formData }],
            });
          }

          close();

          toast.success("NIT Guardado");

          setSelectedNit({
            ...formData,
          });
        },
        disabled: false,
        text: "Guardar NIT",
      }}
      close={close}
    >
      <>
        <div>
          <label className="font-bold text-gray-800 text-sm block mb-2">
            Numero de nit
            <span className="text-red-600">*</span>
          </label>

          <div className="relative flex items-center">
            <input
              type="number"
              className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-primary"
              placeholder="No. NIT"
              value={formData.numero}
              onChange={(e) => handleChange("numero", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="font-bold text-gray-800 text-sm mb-2 block">
            Nombre de la persona o empresa{" "}
            <span className="text-red-600">*</span>
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-primary"
              placeholder="Nombre de la persona"
              value={formData.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
            />
          </div>
        </div>
      </>
    </Modal>
  );
};

export default CreateNit;
