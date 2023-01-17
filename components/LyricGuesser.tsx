import { useState, useEffect, useReducer } from "react";
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
} from "@chakra-ui/react";

const courier = Inconsolata({ weight: "400" });

const LyricGuesser: React.FC<Lyrics> = ({ title, lyrics }) => {
  const [guess, setGuess] = useState("");
  const [guessed, addGuessed] = useReducer(
    (state: String[], word: string) => [...state, word],
    [""]
  );
  const [titleGuess, setTitleGuess] = useState("");

  useEffect(() => {
    console.log(guess);
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

    console.log(formattedLyrics);
    if (
      !guessed.includes(formattedGuess) &&
      (formattedLyrics.includes(formattedGuess) ||
        formattedTitle.includes(formattedGuess))
    ) {
      addGuessed(formattedGuess);
      setGuess("");
    }
  }, [guess]);

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
        .forEach((l) => addGuessed(l));

      title
        .toLowerCase()
        .replaceAll(/[^A-Za-z \n\-0-9]/g, "")
        .replaceAll(/[\n\-]/g, " ")
        .split(" ")
        .forEach((l) => addGuessed(l));
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
      <HStack spacing={8}>
        <Heading>
          {title.split(" ").map((t, k) => (
            <>
              <span
                key={`${t} ${k}`}
                style={{
                  color: guessed.includes(t.toLowerCase().replaceAll(/\W/g, ""))
                    ? "#070"
                    : "#700",
                  backgroundColor: guessed.includes(
                    t.toLowerCase().replaceAll(/\W/g, "")
                  )
                    ? "#00000000"
                    : "#700",
                }}
              >
                {t}
              </span>{" "}
            </>
          ))}
        </Heading>
        <Button
          onClick={() => {
            const formattedLyrics = lyrics
              .toLowerCase()
              .replaceAll(/[^A-Za-z \n\-0-9]/g, "")
              .replaceAll(/[\n\-]/g, " ")
              .split(" ");

            let choice = "";
            let counter = 0;

            while (guessed.includes(choice) && counter < 10) {
              choice =
                formattedLyrics[
                  Math.floor(Math.random() * formattedLyrics.length)
                ];
              counter += 1;
            }

            setGuess(choice);
          }}
          colorScheme="blue"
        >
          Hint?
        </Button>
      </HStack>
      <HStack spacing={24}>
        <Stack>
          <Text>Guess a word</Text>
          <Input
            bg="white"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            borderColor="blue.700"
            shadow="md"
          />
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
          height: "75vh",
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
                <Text
                  className={courier.className}
                  display="inline-block"
                  color={
                    guessed.includes(w.toLowerCase().replaceAll(/\W/g, ""))
                      ? "black"
                      : "red.700"
                  }
                  backgroundColor={
                    guessed.includes(w.toLowerCase().replaceAll(/\W/g, ""))
                      ? "none"
                      : "red.700"
                  }
                  key={`${k} ${wk}`}
                >
                  {guessed.includes(w.toLowerCase().replaceAll(/\W/g, ""))
                    ? w
                    : w.replaceAll(/\w/g, "X")}
                </Text>{" "}
              </>
            ))}
          </div>
        ))}
      </div>
    </Box>
  );
};

export default LyricGuesser;
