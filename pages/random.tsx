import { NextPage } from "next";
import { Lyrics } from "../functions/getLyrics";

const Random: NextPage<Lyrics> = ({ lyrics, artist, title, cover }) => {
  return (
    <div>
      <p>
        {title} by {artist}
      </p>
      {lyrics.split("\n").map((l) => (
        <p key={l}>{l}</p>
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
