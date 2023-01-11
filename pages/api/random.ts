// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getArtistSongs } from "../../functions/getArtistSongs";
import lyricsSearcher from "../../functions/getLyrics";
import { getChart, Song } from "../../functions/getTop100";
import { Lyrics } from "../../functions/getLyrics";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Lyrics>
) {
  let songs: Song[] = [];

  if (req.query) {
    const artist = req.query.artist as string;

    if (artist) songs = await getArtistSongs(artist);
  }

  if (songs.length == 0) songs = await getChart(new Date());

  let lyrics: Lyrics = { lyrics: "", title: "", artist: "", cover: "" };
  while (lyrics.lyrics.length === 0) {
    const choice = songs[Math.floor(Math.random() * songs.length)];
    lyrics = await lyricsSearcher(choice.artist, choice.title);
    console.log(lyrics, choice);
  }

  res.status(200).json(lyrics);
}
