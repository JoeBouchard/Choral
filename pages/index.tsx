import Head from "next/head";
import { Inter } from "@next/font/google";
import { NextPage } from "next";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

const Home: NextPage = () => {
  const [artist, setArtist] = useState("");
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Choral</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container bgColor="white" borderRadius={4} p={4} mt={"20vh"} shadow="xl">
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
          <Button
            onClick={() => {
              router.push(`/artist/${artist}`);
            }}
            colorScheme="blue"
          >
            Begin!
          </Button>
        </Stack>
      </Container>
    </>
  );
};

export default Home;
