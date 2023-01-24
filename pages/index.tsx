import Head from "next/head";
import { Inter } from "@next/font/google";
import { NextPage } from "next";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

const Home: NextPage = () => {
  const [artist, setArtist] = useState("");
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setValid(false);
    setLoading(true);
    const newArtist = artist
      .split(" ")
      .map((n) => n.charAt(0).toUpperCase() + n.slice(1))
      .join(" ");

    if (artist !== newArtist) setArtist(newArtist);
    const i = setTimeout(() => {
      fetch(`/api/verify?artist=${artist}`)
        .then((d) => d.json())
        .then((r) => {
          console.log(r);
          setValid(r.valid);
          setLoading(false);
        });
    }, 500);

    return () => clearInterval(i);
  }, [artist]);

  useEffect(() => {
    console.log(!valid, loading);
  }, [valid, loading]);

  return (
    <>
      <Head>
        <title>Choral</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container bgColor="white" borderRadius={4} p={4} mt={"10vh"} shadow="xl">
        <Stack spacing="24px">
          <Heading textAlign="center" size="2xl">
            Welcome to Choral
          </Heading>
          <Heading textAlign="center" size="lg" fontStyle="italic">
            The song guessing game
          </Heading>
          <Text align="center">
            Enter the name of an artist or band below to get started
          </Text>
          <Input
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            borderColor="blue.700"
          />
          {(artist.length === 0 && (
            <Button colorScheme={"purple"}>Enter a name to get started!</Button>
          )) ||
            (!loading && (
              <>
                <Button
                  onClick={() => {
                    router.push(`/challenge/${artist}`);
                  }}
                  colorScheme={"purple"}
                  isDisabled={!valid}
                >
                  {!valid ? "Artist not found" : `${artist} Daily Challenge`}
                </Button>
                <Button
                  onClick={() => {
                    router.push(`/artist/${artist}`);
                  }}
                  colorScheme={"green"}
                  isDisabled={!valid}
                >
                  {!valid ? "Artist not found" : `${artist} Free play`}
                </Button>
                <Button
                  onClick={() => {
                    router.push(`/artist/${artist}`);
                  }}
                  colorScheme={"red"}
                  isDisabled={true}
                >
                  {!valid
                    ? "Artist not found"
                    : `${artist} Multiplayer (coming soon)`}
                </Button>
              </>
            )) ||
            (loading && (
              <>
                <Button colorScheme={valid ? "blue" : "gray"}>
                  <Spinner />{" "}
                </Button>
                <Button colorScheme={valid ? "blue" : "gray"}>
                  <Spinner />{" "}
                </Button>
                <Button colorScheme={valid ? "blue" : "gray"}>
                  <Spinner />{" "}
                </Button>
              </>
            ))}
        </Stack>
      </Container>
    </>
  );
};

export default Home;
