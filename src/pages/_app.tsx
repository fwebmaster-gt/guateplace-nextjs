/* eslint-disable react-hooks/exhaustive-deps */
import CreateProfile from "@/components/CreateProfile";
import LoginToContinue from "@/components/LoginToContinue";
import { app, customerService } from "@/database/config";
import { useAppStore } from "@/hooks/useAppStore";
import { Customer, useAuthStore } from "@/hooks/useAuth";
import "@/styles/globals.css";
import { useAuth } from "firebase-react-tools";
import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const { user, loading } = useAuth(app);

  const { setUser, user: profile } = useAuthStore();

  const [loadingProfile, setLoadingProfile] = useState(false);

  const { showLoginToContinue, setLoginToContinue } = useAppStore();

  async function FetchProfile() {
    if (!user) return;

    try {
      setLoadingProfile(true);
      const res = await customerService.findById(user?.uid);

      if (res.data) {
        setUser(res.data as Customer);
      }
      setLoadingProfile(false);
    } catch (error) {
      console.log("Error on fetch profile", error);
      setLoadingProfile(false);
    }
  }

  useEffect(() => {
    if (user) {
      FetchProfile();
    } else {
      setUser(null);
    }
  }, [user]);

  useEffect(() => {
    const handlePopState = () => {
      console.log("Se presionó el botón de retroceso");
      // Puedes agregar aquí la lógica que desees ejecutar

      setLoginToContinue({ block: false, value: false });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  if (user && !profile && !loading && !loadingProfile) return <CreateProfile />;

  return (
    <>
      {showLoginToContinue.value && <LoginToContinue />}

      <NextNProgress />
      <Component {...pageProps} />
    </>
  );
}
