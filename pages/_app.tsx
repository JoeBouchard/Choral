import type { AppProps } from "next/app";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { theme } from "../chakra/theme";
import { AnimatePresence } from "framer-motion";
import { Suspense } from "react";
import Loading from "./loading";
import Script from "next/script";
import { SessionProvider } from "next-auth/react";
import HelpPopup from "../components/HelpPopup";
import InstallPrompt from "../components/InstallPrompt";

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
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
          <Suspense fallback={<Loading />}>
            <Component {...pageProps} />
          </Suspense>
          <Box
            mt={40}
            pt={5}
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
                href="mailto:choral.io.devs@gmail.com"
              >
                choral.io.devs@gmail.com
              </a>
            </p>
          </Box>
          <InstallPrompt />
          <HelpPopup />
        </AnimatePresence>
      </ChakraProvider>
    </SessionProvider>
  );
};

export default App;
