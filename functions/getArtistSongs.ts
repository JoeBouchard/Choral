import { htmlToText } from "html-to-text";
import { Song } from "./getTop100";
import UserAgent from "user-agents";

const ROOT_URL = "https://www.lyrics.com/artist/";

export const getArtistSongs = async (artist: string) => {
  const songs: Song[] = [];

  const headers: HeadersInit = new Headers();
  const userAgent = new UserAgent();
  headers.set("user-agent", userAgent.toString());

  const parsedArtist = artist.replaceAll(/\W/g, "-");
  const res = await fetch(`${ROOT_URL}${parsedArtist}`, {
    headers: headers,
  });
  const html = await res.text();
  const rawText = htmlToText(html);
  //   \/[0-9]*\/[A-Za-z\+]*\/[A-Za-z0-9\%\+]
  rawText
    .match(/\/lyric.*\/[0-9]*\/[A-Za-z\+]*\/[A-Za-z0-9\%\+]*/g)
    ?.forEach((title) =>
      songs.push({
        artist,
        title: decodeURI(title.split("/")[4])
          .replaceAll("+", " ")
          .replaceAll("]", ""),
        url: title.replaceAll("]", ""),
      })
    );
  console.log(songs.length);
  return songs;
};
