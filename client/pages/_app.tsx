import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "../i18n/i18n";
import { AppProvider } from "@/context/AppContext";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}
