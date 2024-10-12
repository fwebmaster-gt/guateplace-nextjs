/* eslint-disable @next/next/no-img-element */

import { auth, customerService } from "@/database/config";
import { useAuthStore } from "@/hooks/useAuth";
import { useState } from "react";
import { BiEdit } from "react-icons/bi";

export const avatars = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png",
  "/avatars/avatar7.png",
];

const CreateProfile = () => {
  const { setUser } = useAuthStore();

  const [creating, setCreating] = useState(false);
  const [pickAvatar, setPickAvatar] = useState(false);
  const [avatarSelected, setAvatarSelected] = useState(avatars[0]);

  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");

  const createProfile = async () => {
    setCreating(true);

    const cUser = await auth.currentUser();

    if (!cUser) return;

    const res = await customerService.add(
      {
        avatar: avatarSelected,
        nombre: name,
        apellido: lastname,
        direcciones: [],
        email: "",
        favoritos: [],
        nits: [],
        pedidos: [],
        id: cUser.uid,
      },
      cUser.uid
    );

    setUser(res.data as never);
  };

  if (creating) return <p>Loading page...</p>;

  return (
    <div className="pb-20 z-50">
      <div className="p-5 mt-8">
        <p className="text-center font-bold text-2xl text-gray-800">
          Bienvenido
        </p>
        <p className="text-gray-600 text-sm text-center">
          Ingresa los datos para completar tu perfil
        </p>

        <div className="relative w-[150px] h-[150px] mx-auto mt-5">
          <div
            onClick={() => setPickAvatar(true)}
            className="cursor-pointer bg-primary absolute bottom-2 right-2 p-2 rounded-lg"
          >
            <BiEdit className="text-xl text-white" />
          </div>
          <img
            className="rounded-lg"
            src={avatarSelected}
            alt="avatar-1"
            width={150}
            height={150}
          />
        </div>

        {pickAvatar && (
          <>
            <div className="grid grid-cols-3 gap-3 mt-8">
              {avatars.map((avatar, i) => (
                <img
                  className={`${
                    avatarSelected === avatar ? "ring-4" : ""
                  } ring-primary rounded-lg`}
                  onClick={() => setAvatarSelected(avatar)}
                  width={100}
                  height={100}
                  key={i}
                  src={avatar}
                  alt={`avatar-${i}`}
                />
              ))}
            </div>

            <div className="fixed bottom-5 left-0 mt-8 w-full px-5">
              <button
                onClick={() => setPickAvatar(false)}
                type="button"
                className="w-full font-bold shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-primary hover:bg-blue-600 focus:outline-none"
              >
                Continuar
              </button>
            </div>
          </>
        )}

        {!pickAvatar && (
          <>
            <div className="mt-6">
              <label className="text-gray-800 text-sm mb-2 block font-bold">
                Nombre
              </label>
              <div className="relative flex items-center">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-primary"
                  placeholder="Ingresa tu nombre"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="text-gray-800 text-sm mb-2 block font-bold">
                Apellido
              </label>
              <div className="relative flex items-center">
                <input
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  type="text"
                  className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-primary"
                  placeholder="Ingresa tu apellido"
                />
              </div>
            </div>
            <button
              onClick={createProfile}
              type="button"
              className="mt-8 w-full font-bold shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-primary hover:bg-blue-600 focus:outline-none"
            >
              Continuar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateProfile;
