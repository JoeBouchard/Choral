import { useState, useEffect, useReducer } from "react";
import { Lyrics } from "../functions/getLyrics";
import { Inconsolata } from "@next/font/google";

const courier = Inconsolata({ weight: "400" });

const LyricGuesser: React.FC<Lyrics> = ({ lyrics, title }) => {
  const [guess, setGuess] = useState("");
  const [guessed, addGuessed] = useReducer(
    (state: String[], word: string) => [...state, word],
    []
  );
  const [titleGuess, setTitleGuess] = useState("");

  useEffect(() => {
    console.log(guess);
    const formattedGuess = guess.toLowerCase().replaceAll(/[^A-Za-z 0-9]/g, "");
    const formattedLyrics = lyrics
      .toLowerCase()
      .replaceAll(/[^A-Za-z \n\-0-9]/g, "")
      .replaceAll(/[\n\-]/g, " ")
      .split(" ");
    console.log(formattedLyrics);
    if (!guessed.includes(guess) && formattedLyrics.includes(formattedGuess)) {
      addGuessed(formattedGuess);
      setGuess("");
    }
  }, [guess]);

  useEffect(() => {
    if (
      titleGuess.toLowerCase().replaceAll(/[^A-Za-z 0-9]/g, "") ===
      title.toLowerCase().replaceAll(/[^A-Za-z 0-9]/g, "")
    ) {
      lyrics
        .toLowerCase()
        .replaceAll(/[^A-Za-z \n\-0-9]/g, "")
        .replaceAll(/[\n\-]/g, " ")
        .split(" ")
        .forEach((l) => addGuessed(l));
    }
  }, [titleGuess]);

  return (
    <>
      <input
        value={titleGuess}
        onChange={(e) => setTitleGuess(e.target.value)}
      ></input>
      <br></br>
      <input value={guess} onChange={(e) => setGuess(e.target.value)}></input>
      <div
        style={{
          height: "75vh",
          overflowX: "scroll",
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          columnGap: 10,
          rowGap: 5,
        }}
      >
        {lyrics.split("\n").map((l, k) => (
          <div
            key={k}
            style={{
              maxWidth: "75vw",
            }}
            className={courier.className}
          >
            {l.split(/[ \-]/).map((w, wk) => (
              <>
                <span
                  style={{
                    color: guessed.includes(
                      w.toLowerCase().replaceAll(/\W/g, "")
                    )
                      ? "#070"
                      : "#700",
                    backgroundColor: guessed.includes(
                      w.toLowerCase().replaceAll(/\W/g, "")
                    )
                      ? "#00000000"
                      : "#700",
                  }}
                  key={`${k} ${wk}`}
                >
                  {w}
                </span>{" "}
              </>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default LyricGuesser;
