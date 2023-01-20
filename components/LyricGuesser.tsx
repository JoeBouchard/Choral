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
} from "@chakra-ui/react";
import { motion } from "framer-motion";

export enum guessTypes {
  guessed = "guessed",
  found = "found",
  invalid = "invalid",
}

const courier = Inconsolata({ weight: "400" });

const LyricGuesser: React.FC<Lyrics> = ({ title, lyrics }) => {
  const [guess, setGuess] = useState("");
  const [titleGuess, setTitleGuess] = useState("");
  const [lastGuess, setLastGuess] = useState<guessTypes>();

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

  useEffect(() => {
    if (
      titleGuess.toLowerCase().replaceAll(/[^A-Za-z 0-9]/g, "") ===
      title.toLowerCase().replaceAll(/[^A-Za-z 0-9]/g, "")
    ) {
      lyrics
        .toLowerCase()
        .replaceAll(/[^A-Za-z \n\-0-9]/g, "")
        .replaceAll(/[\n\-]/g, " ")
        .split(" ")
        .forEach((l) => addGuessed({ word: l, valid: true }));

      title
        .toLowerCase()
        .replaceAll(/[^A-Za-z \n\-0-9]/g, "")
        .replaceAll(/[\n\-]/g, " ")
        .split(" ")
        .forEach((l) => addGuessed({ word: l, valid: true }));
    }
  }, [titleGuess]);

  if (title === "" || lyrics === "")
    return (
      <Box m={4} bg="white" p={4} borderRadius={4}>
        <Skeleton height="45px" my={4} />
        <div
          style={{
            height: "75vh",
            overflowX: "scroll",
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            columnGap: 10,
            rowGap: 5,
          }}
        >
          {new Array(100).fill(undefined).map((p, k) => (
            <Skeleton key={k} height="30px" w="45vw" />
          ))}
        </div>
      </Box>
    );

  return (
    <Box m={4} bg="white" p={4} borderRadius={4}>
      <span>
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
      </span>{" "}
      <Progress
        mb={2}
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
      />
      <HStack spacing={8}>
        <Heading>
          {title.split(" ").map((t, k) => (
            <>
              <motion.span
                key={`${t} ${k}`}
                initial={textVariations.covered}
                variants={textVariations}
                animate={
                  guessed.found.includes(t.toLowerCase().replaceAll(/\W/g, ""))
                    ? "revealed"
                    : "covered"
                }
              >
                {guessed.found.includes(t.toLowerCase().replaceAll(/\W/g, ""))
                  ? t
                  : t.replaceAll(/\w/g, "X")}
              </motion.span>{" "}
            </>
          ))}
        </Heading>

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
            setTitleGuess(title);
          }}
          colorScheme="red"
        >
          Give Up?
        </Button>
      </HStack>
      <HStack mb={2} spacing={24}>
        <Stack>
          <Text>Guess a word</Text>
          <HStack>
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
              Guess
            </Button>
          </HStack>
        </Stack>
        <Stack>
          <Text>Guess the title</Text>
          <Input
            bg="white"
            value={titleGuess}
            onChange={(e) => setTitleGuess(e.target.value)}
            borderColor="blue.700"
            shadow="md"
          />
        </Stack>
      </HStack>
      <div
        style={{
          height: "70vh",
          overflowX: "scroll",
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          columnGap: 10,
          rowGap: 5,
        }}
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
                    )
                      ? "revealed"
                      : "covered"
                  }
                >
                  {guessed.found.includes(w.toLowerCase().replaceAll(/\W/g, ""))
                    ? w
                    : w.replaceAll(/\w/g, "X")}
                </motion.span>{" "}
              </>
            ))}
          </div>
        ))}
      </div>
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
  );
};

export default LyricGuesser;
