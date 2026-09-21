import type { NextConfig } from "next";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
}

const nextConfig: NextConfig = {
  // msedge-tts opens a WebSocket to Microsoft from Node. It must be loaded by Node itself:
  // bundled, its `isomorphic-ws` dependency can resolve to the browser build, which has no WebSocket here.
  serverExternalPackages: ["msedge-tts"],
  env: {
    DATABASE_URL: process.env.DATABASE_URL || "file:./dev.db",
  },
};

export default nextConfig;
