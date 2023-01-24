import Head from "next/head";
import { Inter } from "@next/font/google";
import { NextPage } from "next";
import { Lyrics } from "../../functions/getLyrics";
import LyricGuesser from "../../components/LyricGuesser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";

const inter = Inter({ subsets: ["latin"] });

const Artist: NextPage<Lyrics> = (lyrics) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Choral {lyrics.artist} Challenge</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LyricGuesser {...lyrics} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Lyrics> = async (
  context
) => {
  if (context.query.artist) {
    const lyricsRequest = await fetch(
      `http://${context.req.headers.host}/api/random?artist=${context.query.artist}&challenge=true`
    );
    try {
      const lyrics = (await lyricsRequest.json()) as Lyrics;
      return { props: lyrics };
    } catch (e) {
      return { notFound: true };
    }
  }
  return { notFound: true };
};

export default Artist;
