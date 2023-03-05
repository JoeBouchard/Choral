import { useState, useEffect, useReducer, useRef } from "react";
import { Lyrics } from "../functions/getLyrics";
import { Inconsolata } from "@next/font/google";
import {
  Box,
  Input,
  Stack,
  Text,
  HStack,
  Button,
  Heading,
  Skeleton,
  Progress,
  Grid,
  Flex,
  Spacer,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  Table,
  Tbody,
  Tr,
  Td,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Router, { useRouter } from "next/router";
import Loading from "../pages/loading";

export enum guessTypes {
  guessed = "guessed",
  found = "found",
  invalid = "invalid",
}

const courier = Inconsolata({ weight: "400" });

const LyricGuesser: React.FC<Lyrics> = ({ title, lyrics, artist }) => {
  const [guess, setGuess] = useState("");
  const [titleGuess, setTitleGuess] = useState("");
  const [lastGuess, setLastGuess] = useState<guessTypes>();
  const [isTitleGuessed, setIsTitleGuessed] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [allWords] = useState(
    lyrics
      .toLowerCase()
      .replaceAll(/[^A-Za-z \n\-0-9]/g, "")
      .replaceAll(/[\n\-]/g, " ")
      .split(" ")
      .filter((value, index, array) => array.indexOf(value) === index)
  );

  const router = useRouter();

  const guessBtn = useRef<HTMLInputElement>(null);

  const [guessed, addGuessed] = useReducer(
    (
      state: { found: string[]; invalid: string[] },
      action: { word: string; valid: boolean }
    ) => {
      if (
        state.found.includes(action.word) ||
        state.invalid.includes(action.word)
      )
        return state;
      if (action.valid) {
        return {
          found: [...state.found, action.word].sort(),
          invalid: [...state.invalid],
        };
      }
      return {
        found: [...state.found],
        invalid: [...state.invalid, action.word].sort(),
      };
    },
    {
      found: [],
      invalid: [],
    }
  );

  const textVariations = {
    covered: {
      color: "var(--chakra-colors-red-700)",
      backgroundColor: "var(--chakra-colors-red-700)",
    },
    revealed: {
      color: "#000",
      backgroundColor: "#00000000",
    },
  };

  const inputVariations = {
    guessed: {
      borderColor: "#333",
      boxShadow: "#333 0 0 5px",
    },
    found: {
      borderColor: "#070",
      boxShadow: "#070 0 0 5px",
    },
    invalid: {
      borderColor: "#700",
      boxShadow: "#700 0 0 5px",
    },
  };

  const guessWord = () => {
    const formattedGuess = guess.toLowerCase().replaceAll(/[^A-Za-z 0-9]/g, "");
    const formattedLyrics = lyrics
      .toLowerCase()
      .replaceAll(/[^A-Za-z \n\-0-9]/g, "")
      .replaceAll(/[\n\-]/g, " ")
      .split(" ");

    const formattedTitle = title
      .toLowerCase()
      .replaceAll(/[^A-Za-z \n\-0-9]/g, "")
      .replaceAll(/[\n\-]/g, " ")
      .split(" ");

    if (
      guessed.found.includes(formattedGuess) ||
      guessed.invalid.includes(formattedGuess)
    ) {
      setLastGuess(guessTypes.guessed);
    } else {
      const valid =
        formattedLyrics.includes(formattedGuess) ||
        formattedTitle.includes(formattedGuess);
      addGuessed({ word: formattedGuess, valid });
      setLastGuess(valid ? guessTypes.found : guessTypes.invalid);
    }

    setGuess("");

    if (guessBtn.current) {
      guessBtn.current.focus();
    }
  };

  // useEffect(() => {
  //   Router.events.on("routeChangeStart", () => setLoading(true));
  //   Router.events.on("routeChangeComplete", () => setLoading(false));
  //   Router.events.on("routeChangeError", () => setLoading(false));
  //   return () => {
  //     Router.events.off("routeChangeStart", () => setLoading(true));
  //     Router.events.off("routeChangeComplete", () => setLoading(false));
  //     Router.events.off("routeChangeError", () => setLoading(false));
  //   };
  // }, [Router.events]);

  useEffect(() => {
    console.log("resetting");
    setGaveUp(false);
    setGuess("");
    setLastGuess(undefined);
    setIsTitleGuessed(false);
    setTitleGuess("");
    setModalOpen(false);
  }, [lyrics]);

  useEffect(() => {
    if (
      titleGuess.toLowerCase().replaceAll(/\W/g, "") ===
      title.toLowerCase().replaceAll(/\W/g, "")
    ) {
      setIsTitleGuessed(true);
      setModalOpen(true);
    }
  }, [titleGuess]);

  useEffect(() => {
    if (gaveUp) setModalOpen(true);
  }, [gaveUp]);

  useEffect(() => {
    console.log(isTitleGuessed, gaveUp, modalOpen);
  }, [modalOpen]);

  if (loading || title === "" || lyrics === "") return <Loading />;

  return (
    <>
      <Box display="block" m={4} bg="white" p={4} borderRadius={4}>
        <Stack height="92vh" overflowY="clip">
          <Text fontSize="sm" m={0}>
            {Math.floor(
              (lyrics
                .toLowerCase()
                .replaceAll(/[^A-Za-z \n\-0-9]/g, "")
                .replaceAll(/[\n\-]/g, " ")
                .split(" ")
                .filter((word) => guessed.found.includes(word)).length /
                lyrics
                  .toLowerCase()
                  .replaceAll(/[^A-Za-z \n\-0-9]/g, "")
                  .replaceAll(/[\n\-]/g, " ")
                  .split(" ").length) *
                100
            )}
            % of words guessed
          </Text>
          <Progress
            mt={0}
            borderRadius={20}
            colorScheme="green"
            value={
              (lyrics
                .toLowerCase()
                .replaceAll(/[^A-Za-z \n\-0-9]/g, "")
                .replaceAll(/[\n\-]/g, " ")
                .split(" ")
                .filter((word) => guessed.found.includes(word)).length /
                lyrics
                  .toLowerCase()
                  .replaceAll(/[^A-Za-z \n\-0-9]/g, "")
                  .replaceAll(/[\n\-]/g, " ")
                  .split(" ").length) *
              100
            }
            style={{
              marginTop: 0,
            }}
          />
          <Flex>
            <Stack>
              <Heading size={{ base: "lg", md: "xl" }} mb={0}>
                {title.split(" ").map((t, k) => (
                  <>
                    <motion.span
                      key={`${t} ${k}`}
                      initial={textVariations.covered}
                      variants={textVariations}
                      animate={
                        guessed.found.includes(
                          t.toLowerCase().replaceAll(/\W/g, "")
                        ) || isTitleGuessed
                          ? "revealed"
                          : "covered"
                      }
                    >
                      {guessed.found.includes(
                        t.toLowerCase().replaceAll(/\W/g, "")
                      ) || isTitleGuessed
                        ? t
                        : t.replaceAll(/\w/g, "X")}
                    </motion.span>{" "}
                  </>
                ))}
              </Heading>
              <Text style={{ margin: 0 }}>by {artist}</Text>
            </Stack>
            <Spacer />
            <Grid templateColumns={{ sm: "100px", md: "100px 100px" }} gap={2}>
              <Button
                onClick={() => {
                  const formattedLyrics = lyrics
                    .toLowerCase()
                    .replaceAll(/[^A-Za-z \n\-0-9]/g, "")
                    .replaceAll(/[\n\-]/g, " ")
                    .split(" ")
                    .filter((word) => !guessed.found.includes(word));

                  let choice = "";
                  let counter = 0;

                  while (guessed.found.includes(choice) && counter < 20) {
                    choice =
                      formattedLyrics[
                        Math.floor(Math.random() * formattedLyrics.length)
                      ];
                    counter += 1;
                  }

                  addGuessed({ word: choice, valid: true });
                  guessBtn.current?.focus();
                }}
                colorScheme="purple"
              >
                Hint?
              </Button>
              <Button
                onClick={() => {
                  setGaveUp(true);
                  setIsTitleGuessed(true);
                }}
                colorScheme="red"
              >
                Give Up?
              </Button>
            </Grid>
          </Flex>
          <HStack my={2} spacing={12}>
            <Stack spacing={0}>
              <Input
                bg="white"
                _focus={lastGuess && inputVariations[lastGuess]}
                ref={guessBtn}
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                boxShadow="none"
                borderWidth="2px"
                onKeyDown={(e) => {
                  if (e.code === "Enter") {
                    guessWord();
                  }
                }}
              />
              <Button colorScheme="green" onClick={guessWord}>
                Guess a word
              </Button>
            </Stack>
            <Stack spacing={0}>
              <Input
                bg="white"
                value={titleGuess}
                onChange={(e) => setTitleGuess(e.target.value)}
                borderColor="blue.700"
                shadow="md"
              />
              <Button colorScheme="purple">Guess the title</Button>
            </Stack>
          </HStack>
          <Flex
            overflowX="scroll"
            flexDirection="column"
            flexWrap="wrap"
            height="inherit"
            overflowY="clip"
            columnGap="4vw"
          >
            {lyrics.split("\n").map((l, k) => (
              <div
                key={k}
                style={{
                  maxWidth: "75vw",
                }}
              >
                {l.split(/[ \-]/).map((w, wk) => (
                  <>
                    <motion.span
                      className={courier.className}
                      initial={textVariations.covered}
                      variants={textVariations}
                      animate={
                        guessed.found.includes(
                          w.toLowerCase().replaceAll(/\W/g, "")
                        ) || isTitleGuessed
                          ? "revealed"
                          : "covered"
                      }
                    >
                      {guessed.found.includes(
                        w.toLowerCase().replaceAll(/\W/g, "")
                      ) || isTitleGuessed
                        ? w
                        : w.replaceAll(/\w/g, "X")}
                    </motion.span>{" "}
                  </>
                ))}
              </div>
            ))}
          </Flex>
        </Stack>
        <Box p={4} mt={2} border="1px solid #222" borderRadius={12}>
          <Heading size="sm">Guessed Words:</Heading>
          <hr
            style={{
              color: "#000",
              border: "0.5px solid #999",
            }}
          />
          <Text my={2} size="lg">
            Valid Words:
          </Text>
          {guessed.found.map((w) => (
            <span key={w}>{w} </span>
          ))}
          <hr
            style={{
              color: "#000",
              border: "0.5px solid #999",
              margin: "16px 0px",
            }}
          />
          <Text my={2} size="lg">
            Invalid Words:
          </Text>
          {guessed.invalid.map((w) => (
            <span key={w}>{w} </span>
          ))}
        </Box>
      </Box>
      <Modal isOpen={gaveUp && modalOpen} onClose={() => setModalOpen(false)}>
        <ModalOverlay />
        <ModalContent
          borderColor="red.700"
          borderRadius="16px"
          borderWidth="8px"
        >
          <ModalHeader>You gave up!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box p={4}>
              <p>
                The song was <b>{title}</b> by {artist}.
              </p>
              <p>
                It has {allWords.length} distinct words, of which you guessed{" "}
                {guessed.found.length}, or{" "}
                {Math.round((guessed.found.length * 10000) / allWords.length) /
                  100}
                %
              </p>
              <p>Your score was:</p>
            </Box>
            <Table size="sm">
              <Tbody>
                <Tr>
                  <Td>Unguessed words</Td>
                  <Td>
                    {
                      allWords.filter(
                        (a) =>
                          !guessed.found.includes(a) &&
                          !guessed.invalid.includes(a)
                      ).length
                    }
                  </Td>
                  <Td>x-200</Td>
                  <Td fontWeight="600">
                    {allWords.filter(
                      (a) =>
                        !guessed.found.includes(a) &&
                        !guessed.invalid.includes(a)
                    ).length * 200}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Correct Guesses</Td>
                  <Td>{guessed.found.length}</Td>
                  <Td>x100</Td>
                  <Td fontWeight="600">{guessed.found.length * 100}</Td>
                </Tr>
                <Tr>
                  <Td>Incorrect Guesses</Td>
                  <Td>{guessed.invalid.length}</Td>
                  <Td>x-50</Td>
                  <Td fontWeight="600">{guessed.invalid.length * -50}</Td>
                </Tr>
                <Tr fontWeight="800" borderTop="2px solid #000">
                  <Td>Total</Td>
                  <Td></Td>
                  <Td></Td>
                  <Td>
                    {allWords.filter(
                      (a) =>
                        !guessed.found.includes(a) &&
                        !guessed.invalid.includes(a)
                    ).length *
                      -200 +
                      guessed.found.length * 100 +
                      guessed.invalid.length * -50}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Stack m="0 auto" w="100%">
              {window && !window.location.href.includes("challenge") && (
                <Button
                  colorScheme="green"
                  onClick={() => window.location.reload()}
                >
                  Try again!
                </Button>
              )}
              <Button
                colorScheme="blue"
                onClick={() => router.push(`/artist/${artist}`)}
              >
                Play another {artist} song!
              </Button>
              <Button onClick={() => router.push("/")} colorScheme="purple">
                Return home
              </Button>
            </Stack>
          </ModalFooter>{" "}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isTitleGuessed && !gaveUp && modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent
          borderColor="green.800"
          borderRadius="16px"
          borderWidth="8px"
          w="80vw"
          maxW="80vw"
        >
          <ModalHeader>Congratulations!</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={0}>
            <Box p={4}>
              <p>
                The song was <b>{title}</b> by {artist}.
              </p>
              <p>
                It has {allWords.length} distinct words, of which you guessed{" "}
                {guessed.found.length}, or{" "}
                {Math.round((guessed.found.length * 10000) / allWords.length) /
                  100}
                %
              </p>
              <p>Your score was:</p>
            </Box>
            <Table size="sm" p={0}>
              <Tbody>
                <Tr>
                  <Td>Unguessed words</Td>
                  <Td>
                    {
                      allWords.filter(
                        (a) =>
                          !guessed.found.includes(a) &&
                          !guessed.invalid.includes(a)
                      ).length
                    }
                  </Td>
                  <Td>x200</Td>
                  <Td fontWeight="600">
                    {allWords.filter(
                      (a) =>
                        !guessed.found.includes(a) &&
                        !guessed.invalid.includes(a)
                    ).length * 200}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Correct Guesses</Td>
                  <Td>{guessed.found.length}</Td>
                  <Td>x100</Td>
                  <Td fontWeight="600">{guessed.found.length * 100}</Td>
                </Tr>
                <Tr>
                  <Td>Incorrect Guesses</Td>
                  <Td>{guessed.invalid.length}</Td>
                  <Td>x-50</Td>
                  <Td fontWeight="600">{guessed.invalid.length * -50}</Td>
                </Tr>
                <Tr fontWeight="800" borderTop="2px solid #000">
                  <Td>Total</Td>
                  <Td></Td>
                  <Td></Td>
                  <Td>
                    {allWords.filter(
                      (a) =>
                        !guessed.found.includes(a) &&
                        !guessed.invalid.includes(a)
                    ).length *
                      200 +
                      guessed.found.length * 100 +
                      guessed.invalid.length * -50}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Stack m="0 auto" w="100%">
              {window && !window.location.href.includes("challenge") && (
                <Button
                  colorScheme="green"
                  onClick={() => window.location.reload()}
                >
                  Play again!
                </Button>
              )}
              <Button
                colorScheme="blue"
                onClick={() => router.push(`/artist/${artist}`)}
              >
                Play another {artist} song!
              </Button>
              <Button onClick={() => router.push("/")} colorScheme="purple">
                Return home
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LyricGuesser;
