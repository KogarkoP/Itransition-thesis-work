import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "../i18n/i18n";
import { ThemeProvider } from "@/context/themeContext";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
