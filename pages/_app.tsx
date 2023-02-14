import type { AppProps } from "next/app";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { theme } from "../chakra/theme";
import { AnimatePresence } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import Loading from "./loading";
import Router from "next/router";
import Script from "next/script";
import { SessionProvider } from "next-auth/react";

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
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
    <SessionProvider session={session}>
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
          <Box
            mt={40}
            pt={10}
            height="300px"
            bg="blackAlpha.50"
            textColor="gray.500"
            textAlign="center"
          >
            <p>Choral &copy;{new Date().getFullYear()}</p>
            <p>
              Enjoying the game? Support me on{" "}
              <a
                style={{ textDecoration: "underline" }}
                href="https://www.buymeacoffee.com/chorals"
              >
                Buy Me A Coffee!
              </a>
            </p>
            <p>
              Found a bug? Contact me at{" "}
              <a
                style={{ textDecoration: "underline" }}
                href="mailto:choral.io.dev@gmail.com"
              >
                choral.io.dev@gmail.com
              </a>
            </p>
          </Box>
        </AnimatePresence>
      </ChakraProvider>
    </SessionProvider>
  );
};

export default App;
