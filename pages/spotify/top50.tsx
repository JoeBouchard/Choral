import Head from "next/head";
import { Inter } from "@next/font/google";
import { NextPage } from "next";
import { Lyrics } from "../../functions/getLyrics";
import LyricGuesser from "../../components/LyricGuesser";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { Heading } from "@chakra-ui/react";
import { decodeCookie } from "../../functions/cookieFunctions";

const inter = Inter({ subsets: ["latin"] });

const Artist: NextPage<Lyrics> = (lyrics) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Choral Spotify Top 50 Challenge</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Heading textAlign="center">From your Spotify Top 50</Heading>
      <LyricGuesser {...lyrics} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Lyrics> = async ({
  req,
  res,
  query,
}) => {
  let token: string | null = "";
  if (req.headers.cookie)
    token = decodeCookie(req.headers.cookie, "spotifyToken");

  if (token) {
    const lyricsRequest = await fetch(
      `http://${req.headers.host}/api/spotify/top100`,
      { headers: { authorization: `Bearer ${token}` } }
    );
    const lyrics = (await lyricsRequest.json()) as Lyrics;
    return { props: lyrics };
  }
  return { notFound: true };
};

export default Artist;
