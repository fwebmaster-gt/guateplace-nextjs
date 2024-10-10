/* eslint-disable @typescript-eslint/no-explicit-any */
import { Direccion, useAuthStore } from "@/hooks/useAuth";
import { nanoid } from "nanoid";
import { useState } from "react";
import Modal from "./Modal";
import { customerService } from "@/database/config";
import { guatemala } from "@/constants/country/guatemala";
import toast from "react-hot-toast";

const defaultAddress: Direccion = {
  id: nanoid(10),
  departamento: guatemala[0].title,
  direccion_exacta: "",
  indicaciones: "",
  municipio: guatemala[0].mun[0],
  nombre_direccion: "",
  nombre_receptor: "",
  tel1: "",
  tel2: "",
};

const CreateAddressModal = ({
  close,
}: {
  close: () => void;
  setSelectedAddress: (address: Direccion) => void;
}) => {
  const { user, setUser } = useAuthStore();

  const [formData, setFormData] = useState<Direccion>(defaultAddress);

  const handleChange = (key: string, value: any) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  return (
    <Modal
      title="Nueva Direccion"
      confirmButton={{
        action: async () => {
          const newId = nanoid(15);

          await customerService.addInArray(user?.id || "", "direcciones", {
            ...formData,
            id: newId,
          });

          if (user) {
            setUser({
              ...user,
              direcciones: [...user.direcciones, { ...formData, id: newId }],
            });
          }

          close();

          toast.success("Direccion Creada");
        },
      }}
      close={close}
    >
      <div>
        <label className="font-bold text-gray-800 text-sm mb-2 block">
          Nombre o Alias <span className="text-red-600">*</span>
        </label>
        <div className="relative flex items-center">
          <input
            type="text"
            className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-primary"
            placeholder="Nombre o alias de tu direccion"
            value={formData.nombre_direccion}
            onChange={(e) => handleChange("nombre_direccion", e.target.value)}
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="font-bold text-gray-800 text-sm mb-2 block">
          Departamento <span className="text-red-600">*</span>
        </label>
        <select
          value={formData.departamento}
          onChange={(e) => {
            handleChange("departamento", e.target.value);
            handleChange(
              "municipio",
              guatemala.find((dep) => dep.title === e.target.value)?.mun[0]
            );
          }}
          className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-primary"
        >
          {guatemala.map((departamento) => (
            <option key={departamento.title}>{departamento.title}</option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <label className="font-bold text-gray-800 text-sm mb-2 block">
          Municipio <span className="text-red-600">*</span>
        </label>

        {formData.departamento && (
          <select
            className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-primary"
            value={formData.municipio}
            onChange={(e) => handleChange("municipio", e.target.value)}
          >
            {guatemala
              .find((dep) => dep.title === formData.departamento)
              ?.mun.map((municipio) => (
                <option key={municipio}>{municipio}</option>
              ))}
          </select>
        )}
      </div>

      <div className="mt-5">
        <label className="font-bold text-gray-800 text-sm mb-2 block">
          Dirección Exacta <span className="text-red-600">*</span>
        </label>
        <div className="relative flex items-center">
          <input
            type="text"
            className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-primary"
            placeholder="Nombre o alias de tu direccion"
            value={formData.direccion_exacta}
            onChange={(e) => handleChange("direccion_exacta", e.target.value)}
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="font-bold text-gray-800 text-sm mb-2 block">
          Indicaciones Adicionales
        </label>
        <div className="relative flex items-center">
          <input
            type="text"
            className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-primary"
            placeholder="Indicaciones Adicionales"
            value={formData.indicaciones}
            onChange={(e) => handleChange("indicaciones", e.target.value)}
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="font-bold text-gray-800 text-sm mb-2 block">
          Telefono <span className="text-red-600">*</span>
        </label>
        <div className="relative flex items-center">
          <input
            type="tel"
            className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-primary"
            placeholder="Numero de telefono"
            value={formData.tel1}
            onChange={(e) => handleChange("tel1", e.target.value)}
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="font-bold text-gray-800 text-sm mb-2 block">
          Telefono Secundario
        </label>
        <div className="relative flex items-center">
          <input
            type="tel"
            className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-primary"
            placeholder="Numero de telefono secundario"
            value={formData.tel2}
            onChange={(e) => handleChange("tel2", e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default CreateAddressModal;
