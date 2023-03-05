import React, { useState, useEffect } from "react";
import Router from "next/router";
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const HelpPopup = () => {
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
    <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
      <ModalOverlay />
      <ModalContent border="8px solid #000" borderRadius="16px">
        <ModalHeader>Support the project!</ModalHeader>
        <ModalBody>
          <p>
            You seem to be enjoying this! If you have the means, please consider
            giving a dollar or two on our{" "}
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
            Your support helps keep the lights on and support new features and
            bug fixes.
          </p>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button
              colorScheme="green"
              onClick={() =>
                window.open("https://www.buymeacoffee.com/chorals", "_blank")
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
  );
};

export default HelpPopup;
