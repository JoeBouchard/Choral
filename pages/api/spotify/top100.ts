// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getArtistSongs } from "../../../functions/getArtistSongs";
import { getLyrics } from "../../../functions/getLyrics";
import { Song } from "../../../functions/getTop100";
import { Lyrics } from "../../../functions/getLyrics";
import { getSpotifyTop } from "../../../functions/getSpotifyTop";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Lyrics>
) {
  console.error(req.headers.authorization);
  let songs = await getSpotifyTop(req);

  console.error(songs, songs.length);
  if (songs.length === 0) {
    console.error("403");
    return res.status(403).end();
  }

  let artistSongs: { [artist: string]: Song[] } = {};
  let choice: Song | undefined = undefined;
  let lyrics: Lyrics | undefined = undefined;
  while ((choice === undefined || lyrics === undefined) && songs.length > 0) {
    choice = songs[Math.floor(Math.random() * songs.length)];
    if (!artistSongs[choice.artist])
      artistSongs[choice.artist] = await getArtistSongs(choice.artist);

    const artistSong = artistSongs[choice.artist].filter(
      (s) =>
        s.title
          .replaceAll(/[\(\[].*/g, "")
          .replaceAll(/\W/g, "")
          .toLowerCase() ===
        choice?.title
          .replaceAll(/[\(\[].*/g, "")
          .replaceAll(/\W/g, "")
          .toLowerCase()
    );
    if (artistSong.length === 0) {
      songs = songs.filter(
        (s) => s.title !== choice?.title && s.artist !== choice?.artist
      );
      console.error(
        choice?.title
          .replaceAll(/[\(\[].*/g, "")
          .replaceAll(/\W/g, "")
          .toLowerCase(),
        "not found"
      );
      choice = undefined;
    } else {
      choice.url = artistSong[0].url;
      lyrics = await getLyrics(choice.artist, choice.title, choice.url);
    }
  }

  if (!choice || !lyrics) return res.status(404);
  lyrics.cover = choice.albumCover || "";

  return res.json(lyrics);
}
