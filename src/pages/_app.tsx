/* eslint-disable react-hooks/exhaustive-deps */
import CreateProfile from "@/components/CreateProfile";
import LoadingPage from "@/components/LoadingPage";
import LoginToContinue from "@/components/LoginToContinue";
import { app, customerService } from "@/database/config";
import { useAppStore } from "@/hooks/useAppStore";
import { Customer, useAuthStore } from "@/hooks/useAuth";
import "@/styles/globals.css";
import { useAuth } from "firebase-react-tools";
import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  const { user, loading } = useAuth(app);

  const { setUser, user: profile } = useAuthStore();

  const [loadingProfile, setLoadingProfile] = useState(true);

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

      setLoginToContinue({ block: false, value: false });
    } else {
      setUser(null);
    }
  }, [user]);

  if (user && !profile && !loadingProfile && !loading) return <CreateProfile />;

  return (
    <>
      <Toaster />
      {(loadingProfile || loading) && <LoadingPage />}

      {showLoginToContinue.value && !loading && !loadingProfile && (
        <LoginToContinue />
      )}

      <NextNProgress />
      <Component {...pageProps} />
    </>
  );
}
