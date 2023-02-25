import type { NextApiRequest, NextApiResponse } from "next";
import { getArtistSongs } from "../../functions/getArtistSongs";
import { getLyrics } from "../../functions/getLyrics";
import { getChart, Song } from "../../functions/getTop100";
import { Lyrics } from "../../functions/getLyrics";
import seedrandom from "seedrandom";
import { red } from "@mui/material/colors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ valid: boolean; artist?: string }>
) {
  let songs: Song[] = [];

  if (req.query) {
    const artist = req.query.artist as string;

    if (artist) songs = (await getArtistSongs(artist)).filter((s) => s);
    if (songs.length === 0) return res.send({ valid: false });
    return res.send({ valid: true, artist: songs[0].artist });
  }
  return res.send({ valid: false });
}
