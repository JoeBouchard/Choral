import Head from "next/head";
import { Inter } from "@next/font/google";
import { NextPage } from "next";
import { Lyrics } from "../../functions/getLyrics";
import LyricGuesser from "../../components/LyricGuesser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const Artist: NextPage = () => {
  const router = useRouter();
  const { artist } = router.query;
  const [lyrics, setLyrics] = useState<Lyrics>({
    title: "",
    lyrics: "",
    artist: "",
    cover: "",
  });

  useEffect(() => {
    if (artist && lyrics.title === "")
      fetch(`/api/random?artist=${artist}`)
        .then((r) => r.json())
        .then((l: Lyrics) => setLyrics(l));
  }, [artist]);

  return (
    <>
      <Head>
        <title>Choral</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LyricGuesser {...lyrics} />
    </>
  );
};

export default Artist;
