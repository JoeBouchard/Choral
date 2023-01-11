import { htmlToText } from "html-to-text";
import { Song } from "./getTop100";

const ROOT_URL = "https://www.azlyrics.com/lyrics/";

export interface Lyrics {
  artist: string;
  title: string;
  cover: string;
  lyrics: string;
}

const getLyrics = async (artist: string, song: string) => {
  const lyrics: Lyrics = {
    artist,
    title: song,
    cover: "",
    lyrics: "",
  };

  const parsedArtist = artist.replaceAll(/\W/g, "").toLowerCase();
  const parsedSong = song.replaceAll(/\W/g, "").toLowerCase();
  const res = await fetch(`${ROOT_URL}${parsedArtist}/${parsedSong}.html`);
  const html = await res.text();
  const rawText = htmlToText(html);
  const parsedText = rawText.split(`"${song}"`)[1].split("\n\n\n\n")[0];
  console.log(parsedText);
  const cover = rawText.match(/\[\/images\/albums\/.*\]/g) || [""];
  lyrics.cover = cover[0].replace("[", "").replace("]", "");
  lyrics.lyrics = parsedText;
  return lyrics;
};

export default getLyrics;
