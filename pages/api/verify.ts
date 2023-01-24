import type { NextApiRequest, NextApiResponse } from "next";
import { getArtistSongs } from "../../functions/getArtistSongs";
import { getLyrics } from "../../functions/getLyrics";
import { getChart, Song } from "../../functions/getTop100";
import { Lyrics } from "../../functions/getLyrics";
import seedrandom from "seedrandom";
import { red } from "@mui/material/colors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ valid: boolean }>
) {
  let songs: Song[] = [];
  let seedRandom = seedrandom();
  if (req.query.challenge)
    seedRandom = seedrandom(
      `${
        new Date().getUTCDay() +
        new Date().getUTCFullYear() +
        new Date().getUTCMonth()
      }`
    );

  if (req.query) {
    const artist = req.query.artist as string;

    if (artist) songs = await getArtistSongs(artist);
    if (songs.length === 0) res.send({ valid: false });
    console.log(songs[0].artist);
    res.send({ valid: true });
  }
  res.send({ valid: false });
}
