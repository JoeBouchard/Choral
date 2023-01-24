import NextAuth from "next-auth";

import SpotifyProvider from "next-auth/providers/spotify";

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: "6f5b7e4004ed451dba11502dca0ed78e",
      clientSecret: "9871d058e3034b3d94a468e9063f3f12",
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-email user-top-read playlist-read-private playlist-read-collaborative user-read-recently-played user-library-read user-read-private",
    }),
  ],
  //@ts-ignore
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session(props) {
      console.log(props);
      //@ts-ignore
      props.session.user.id = props.token.id;
      //@ts-ignore
      props.session.accessToken = props.token.accessToken;
      return props.session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
});
