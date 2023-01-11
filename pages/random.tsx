import { NextPage } from "next";
import { Lyrics } from "./api/random";

const Random: NextPage<Lyrics> = ({ lyrics, artist, song, rank }) => {
  return (
    <div>
      <p>
        {song} by {artist}. Currently #{rank}
      </p>
      {lyrics.split("\n").map((l) => (
        <p>{l}</p>
      ))}
    </div>
  );
};

Random.getInitialProps = async (context) => {
  console.log(context.req?.headers, context.asPath);
  const res = await fetch(`http://${context.req?.headers.host}/api/random`);
  const lyrics: Lyrics = await res.json();
  return lyrics;
};

export default Random;
