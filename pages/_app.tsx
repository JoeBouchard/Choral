import type { AppProps } from "next/app";
import {
  Box,
  Button,
  ChakraProvider,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
} from "@chakra-ui/react";
import { theme } from "../chakra/theme";
import { AnimatePresence } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import Loading from "./loading";
import Router from "next/router";
import Script from "next/script";
import { SessionProvider } from "next-auth/react";
import { motion } from "framer-motion";

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  const [events, setEvents] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
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

  useEffect(() => {
    if (Math.random() * events > 4) {
      setEvents(0);
      setModalOpen(true);
    } else {
      setEvents(events + 1);
    }
  }, [loading]);

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

          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            <ModalOverlay />
            <ModalContent border="8px solid #000" borderRadius="16px">
              <ModalHeader>Support the project!</ModalHeader>
              <ModalBody>
                <p>
                  You seem to be enjoying this! If you have the means, please
                  consider giving a dollar or two on our{" "}
                  <a
                    href="https://www.buymeacoffee.com/chorals"
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "underline" }}
                  >
                    Buy Me A Coffee page
                  </a>{" "}
                  for the support of this project.
                </p>
                <p>
                  Your support helps keep the lights on and support new features
                  and bug fixes.
                </p>
              </ModalBody>
              <ModalFooter>
                <HStack>
                  <Button
                    colorScheme="green"
                    onClick={() =>
                      window.open(
                        "https://www.buymeacoffee.com/chorals",
                        "_blank"
                      )
                    }
                  >
                    Sure!
                  </Button>
                  <motion.button
                    transition={{ delay: 1 }}
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    style={{
                      backgroundColor: "#eee",
                      color: "#555",
                      borderRadius: "8px",
                      padding: "8px",
                    }}
                    onClick={() => setModalOpen(false)}
                  >
                    No thanks
                  </motion.button>
                </HStack>
              </ModalFooter>
            </ModalContent>
          </Modal>
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
        </AnimatePresence>
      </ChakraProvider>
    </SessionProvider>
  );
};

export default App;
