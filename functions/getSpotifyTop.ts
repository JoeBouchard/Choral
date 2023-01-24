import { NextApiRequest } from "next";
import { Song } from "./getTop100";

export const getSpotifyTop: (req: NextApiRequest) => Promise<Song[]> = async (
  req: NextApiRequest
) => {
  if (!req.headers.authorization) return [];

  const spotifyResp = await fetch(
    "https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term",
    {
      headers: {
        authorization: req.headers.authorization,
      },
    }
  );
  if (spotifyResp.status > 310) {
    console.error(spotifyResp.statusText);
    console.error(await spotifyResp.blob());
    return [];
  }
  const spotifyData = await spotifyResp.json();

  const songArray: Song[] = spotifyData.items.map((s: any) => ({
    title: s.name,
    artist: s.artists[0].name,
    albumCover: s.album.images[1].url,
  }));
  return songArray;
};
