import Head from "next/head";
import { Inter } from "@next/font/google";
import { NextPage } from "next";
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Input,
  Spacer,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { eraseCookie, setCookie } from "../functions/cookieFunctions";
import { AiOutlineLogout as Logout } from "react-icons/ai";

const inter = Inter({ subsets: ["latin"] });

const Home: NextPage = () => {
  const [artist, setArtist] = useState("");
  const [loadedArtist, setLoadedArtist] = useState("");
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { data: session } = useSession();

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
          setLoadedArtist(r.artist);
          setLoading(false);
        });
    }, 500);

    return () => clearInterval(i);
  }, [artist]);

  useEffect(() => {
    //@ts-ignore
    setCookie("spotifyToken", session?.accessToken || "", 2);
  }, [session]);

  return (
    <>
      <Head>
        <title>Chorals</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container bgColor="white" borderRadius={4} p={4} mt={"10vh"} shadow="xl">
        <Stack spacing="24px">
          <Heading textAlign="center" size="2xl">
            Welcome to Chorals!
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
                    router.push(`/challenge/${loadedArtist}`);
                  }}
                  colorScheme={"purple"}
                  isDisabled={!valid}
                >
                  {!valid
                    ? "Artist not found"
                    : `${loadedArtist} Daily Challenge`}
                </Button>
                <Button
                  onClick={() => {
                    router.push(`/artist/${loadedArtist}`);
                  }}
                  colorScheme={"green"}
                  isDisabled={!valid}
                >
                  {!valid ? "Artist not found" : `${loadedArtist} Free play`}
                </Button>
                <Button colorScheme={"red"} isDisabled={true}>
                  {!valid
                    ? "Artist not found"
                    : `${loadedArtist} Multiplayer (coming soon)`}
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
          <hr />

          {!session && (
            <Text
              bg="green.400"
              color="black"
              align="center"
              fontWeight="semibold"
              size="lg"
              p={2}
              borderRadius={10}
              _hover={{ bg: "green.500" }}
            >
              <Link href="/api/auth/signin">
                Log in with Spotify for challenges made just for you!
              </Link>
            </Text>
          )}
          {session && session.user && (
            <Stack>
              <HStack alignSelf="center">
                <Text fontSize="xl">Challenges for {session.user?.name}</Text>
                <img
                  src={session.user.image || ""}
                  alt="pfp"
                  width={64}
                  height={64}
                  style={{ borderRadius: "100%" }}
                />
                <Button
                  ml={20}
                  bg="blue.800"
                  color="gray.50"
                  _hover={{ bg: "blue.900", color: "white" }}
                  onClick={() => {
                    eraseCookie("spotifyToken");
                    router.push("/api/auth/signout");
                  }}
                >
                  Log out
                </Button>
              </HStack>
              <Button
                onClick={() => {
                  router.push(`/spotify/top50`);
                }}
                colorScheme={"green"}
              >
                Your Top 50 Challenge
              </Button>
              <Button colorScheme={"red"} isDisabled={true}>
                Pick a Playlist challenge{" (Coming soon)"}
              </Button>
              <Button colorScheme={"red"} isDisabled={true}>
                Top Album Challenge{" (Coming soon)"}
              </Button>
              <Button colorScheme={"red"} isDisabled={true}>
                Top Artist Challenge{" (Coming soon)"}
              </Button>
            </Stack>
          )}
        </Stack>
      </Container>
    </>
  );
};

export default Home;
