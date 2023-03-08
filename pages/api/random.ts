// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getArtistSongs } from "../../functions/getArtistSongs";
import { getLyrics } from "../../functions/getLyrics";
import { getChart, Song } from "../../functions/getTop100";
import { Lyrics } from "../../functions/getLyrics";
import seedrandom from "seedrandom";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Lyrics>
) {
  let songs: Song[] = [];
  let seedRandom = seedrandom();
  if (req.query?.challenge)
    seedRandom = seedrandom(
      `${
        new Date().getUTCDay() +
        new Date().getUTCFullYear() +
        new Date().getUTCMonth()
      }`
    );

  if (!req.query) return res.status(404);

  const artist = req.query.artist as string;

  if (artist) songs = await getArtistSongs(artist);
  if (songs.length === 0) return res.status(404);

  let lyrics: Lyrics | undefined;
  while (!lyrics || (lyrics.lyrics.length === 0 && songs.length > 0)) {
    const choice = songs[Math.floor(seedRandom.quick() * songs.length)];
    songs = songs.filter((val) => val.title !== choice.title);
    // console.log(songs);
    lyrics = await getLyrics(choice.artist, choice.title, choice.url);
  }

  if (lyrics.lyrics.length === 0) return res.status(404);

  console.log(lyrics.title.replaceAll(/%[0-9A-Za-z]{2}/g, ""));

  return res
    .status(200)
    .json({
      ...lyrics,
      title: lyrics.title.replaceAll(/%[0-9A-Za-z]{2}/g, ""),
    });
}
