import { htmlToText } from "html-to-text";
import { Song } from "./getTop100";
import UserAgent from "user-agents";

const ROOT_URL = "https://www.azlyrics.com/";

export const getArtistSongs = async (artist: string) => {
  const songs: Song[] = [];

  const headers: HeadersInit = new Headers();
  const userAgent = new UserAgent();
  headers.set("user-agent", userAgent.toString());

  const parsedArtist = artist.replaceAll(/\W/g, "").toLowerCase();
  const res = await fetch(
    `${ROOT_URL}${parsedArtist[0]}/${parsedArtist}.html`,
    {
      headers: headers,
    }
  );
  const html = await res.text();
  const rawText = htmlToText(html);
  rawText.match(/\n\w.* \[\/lyrics/g)?.forEach((title) =>
    songs.push({
      artist,
      title: title.replace("\n", "").replace(" [/lyrics", ""),
    })
  );
  return songs;
};
