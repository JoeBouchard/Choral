/** @type {import('next').NextConfig} */
const withPwa = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});
module.exports = withPwa({
  reactStrictMode: true,
});
