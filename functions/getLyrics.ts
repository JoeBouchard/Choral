import { htmlToText } from "html-to-text";
import { NextApiRequest } from "next";
import { Song } from "./getTop100";
import UserAgent from "user-agents";

const ROOT_URL = "https://www.lyrics.com/";

export interface Lyrics {
  artist: string;
  title: string;
  cover: string;
  lyrics: string;
}

export const getLyrics = async (artist: string, song: string, url?: string) => {
  const lyrics: Lyrics = {
    artist,
    title: song.replaceAll(/ [(\[].*/g, ""),
    cover: "",
    lyrics: "",
  };

  if (!url) return;

  const headers: HeadersInit = new Headers();
  const userAgent = new UserAgent();
  headers.set("user-agent", userAgent.toString());
  const res = await fetch(`${ROOT_URL}${url.replaceAll(/[\[\]]/g, "")}`, {
    headers: headers,
  });
  const html = await res.text();
  const rawText = htmlToText(html).replaceAll(/http[A-Za-z\/\.\-\%\+:]*/g, "");
  let parsedText1 = rawText.split(/[0-9]*.[vV]iews/g);

  if (!parsedText1[1]) return;

  let parsedText = parsedText1[1].replaceAll(/\[.*\]/g, "");
  const sections = parsedText.split("\n\n\n");
  lyrics.cover = "";
  lyrics.lyrics = sections[2];
  let counter = 2;
  console.log(sections);

  if (
    sections[2].match(/[0-9]+(\/[a-zA-Z+]+)+/g) ||
    lyrics.lyrics.match(/artist\/.+\/[0-9]+/g)
  ) {
    console.log("MATCH");
    lyrics.lyrics = sections[1];
    counter = 1;
  }

  if (lyrics.lyrics.includes("LYRICS CURRENTLY UNAVAILABLE…")) return;

  if (lyrics.lyrics.toUpperCase() === lyrics.lyrics) {
    lyrics.lyrics = sections[3];
    counter = 3;
  }

  console.log(lyrics.lyrics);
  if (lyrics.lyrics.includes("LYRICS CURRENTLY UNAVAILABLE…")) return;

  if (!lyrics.lyrics || lyrics.lyrics.endsWith("...")) return;
  return lyrics;
};
