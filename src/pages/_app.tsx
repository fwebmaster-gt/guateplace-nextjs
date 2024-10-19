/* eslint-disable react-hooks/exhaustive-deps */
import CreateProfile from "@/components/CreateProfile";
import LoadingPage from "@/components/LoadingPage";
import LoginToContinue from "@/components/LoginToContinue";
import { app, customerService } from "@/database/config";
import { useAppStore } from "@/hooks/useAppStore";
import { Customer, useAuthStore } from "@/hooks/useAuth";
import { useAuth } from "firebase-react-tools";
import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import "@/styles/globals.css";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  const { user, loading } = useAuth(app);

  const { setUser, user: profile } = useAuthStore();

  const [loadingProfile, setLoadingProfile] = useState(true);

  const { showLoginToContinue, setLoginToContinue } = useAppStore();

  async function FetchProfile() {
    if (!user) return setLoadingProfile(false);

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
    // validar si no hay usuario o esta cargando para apagar todo

    if (!user && !loading) {
      setUser(null);
      setLoadingProfile(false);
    }

    if (user) {
      FetchProfile();

      setLoginToContinue({ block: false, value: false });
    }
  }, [user, loading]);

  useEffect(() => {
    const handlePopState = () => {
      setLoginToContinue({ block: false, value: false });
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  if (user && !profile && !loadingProfile && !loading) return <CreateProfile />;

  return (
    <>
    <Head>
    <meta name="viewport" content="width=device-width, user-scalable=no" />
    </Head>
      <Toaster />

      {(loadingProfile === true || loading === true) && <LoadingPage />}

      {showLoginToContinue.value && !loading && !loadingProfile && (
        <LoginToContinue />
      )}

      <NextNProgress />
      <Component {...pageProps} />
    </>
  );
}
