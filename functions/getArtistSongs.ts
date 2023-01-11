import { htmlToText } from "html-to-text";
import { Song } from "./getTop100";

const ROOT_URL = "https://www.azlyrics.com/";

export const getArtistSongs = async (artist: string) => {
  const songs: Song[] = [];

  const parsedArtist = artist.replaceAll(/\W/g, "").toLowerCase();
  const res = await fetch(`${ROOT_URL}${parsedArtist[0]}/${parsedArtist}.html`);
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
