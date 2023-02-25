import { htmlToText } from "html-to-text";
import { Song } from "./getTop100";
import UserAgent from "user-agents";

const ROOT_URL = "https://www.lyrics.com/artist/";

export const getArtistSongs = async (artist: string) => {
  const songs: Song[] = [];

  const headers: HeadersInit = new Headers();
  const userAgent = new UserAgent();
  headers.set("user-agent", userAgent.toString());

  const parsedArtist = artist.replaceAll(/ /g, "-");
  const res = await fetch(`${ROOT_URL}${parsedArtist}`, {
    headers: headers,
  });
  console.log(`${ROOT_URL}${parsedArtist}`);
  const html = await res.text();
  let rawText = htmlToText(html);
  if (rawText.includes("SEARCH RESULTS FOR")) {
    const path = rawText.match(/artist\/.*\/[0-9]*/g);
    if (!path) return [];
    const res2 = await fetch(`https://www.lyrics.com/${path[0]}`);
    const html2 = await res2.text();
    rawText = htmlToText(html2);
    artist = decodeURI(path[0].split("/")[1].replaceAll("-", " "));
  }
  //   \/[0-9]*\/[A-Za-z\+]*\/[A-Za-z0-9\%\+]

  rawText
    .match(/\/lyric.*\/[0-9]*\/[A-Za-z%0-9\+]*\/[A-Za-z0-9\%\+]*/g)
    ?.forEach((rawTitle) => {
      const title = decodeURI(rawTitle.split("/")[4])
        .replaceAll("+", " ")
        .replaceAll("]", "")
        .replaceAll(/[\[(].*/g, "");

      if (!songs.find((s) => s.title === title))
        songs.push({
          artist,
          title,
          url: rawTitle.replaceAll("]", ""),
        });
    });

  // console.log(songs);

  return songs;
};
