import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../chakra/theme";
import { AnimatePresence } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import Loading from "./loading";
import Router from "next/router";
import Script from "next/script";

const App = ({ Component, pageProps }: AppProps) => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    Router.events.on("routeChangeStart", () => setLoading(true));
    Router.events.on("routeChangeComplete", () => setLoading(false));
    Router.events.on("routeChangeError", () => setLoading(false));
    return () => {
      Router.events.off("routeChangeStart", () => setLoading(true));
      Router.events.off("routeChangeComplete", () => setLoading(false));
      Router.events.off("routeChangeError", () => setLoading(false));
    };
  }, [Router.events]);

  return (
    <ChakraProvider theme={theme}>
      <AnimatePresence mode="wait" initial={false}>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-Z698EBHY25"
        ></Script>
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-Z698EBHY25');
            
            window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
            ga('create', 'G-Z698EBHY25', 'auto');
            ga('send', 'pageview');`}
        </Script>
        {loading ? (
          <Loading />
        ) : (
          <Suspense fallback={<Loading />}>
            <Component {...pageProps} />
          </Suspense>
        )}
      </AnimatePresence>
    </ChakraProvider>
  );
};

export default App;
