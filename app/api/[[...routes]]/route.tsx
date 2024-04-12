/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { neynar } from "frog/hubs";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import {
  fetchAllFollowing,
  fetchUser,
  fetchFeedByFids,
  fetchAndProcessFeeds,
} from "@/app/lib/farcaster";

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: "NEYNAR_FROG_FM" }),
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame("/", async (c) => {
  const { buttonValue, inputText, status } = c;
  const fruit = inputText || buttonValue;
  const user = await fetchUser(5650);
  const feeds = await fetchAndProcessFeeds(5650);
  console.log(feeds, "feeds");
  // TODO: ai stuff

  console.log(c, "c");
  return c.res({
    action: "/picker",
    image: "https://i.kym-cdn.com/entries/icons/mobile/000/032/280/meme1.jpg",
    intents: [
      <Button value="A">A</Button>,
      <Button value="B">B</Button>,
      // status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

app.frame("/picker", (c) => {
  const { buttonValue, inputText, status } = c;
  const fruit = inputText || buttonValue;
  console.log(c, "c2");
  return c.res({
    // action: "/picker",
    image: (
      <div
        style={{
          alignItems: "center",
          background:
            status === "response"
              ? "linear-gradient(to right, #432889, #17101F)"
              : "black",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            display: "flex",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          hello {fruit || ""}
          {buttonValue === "page2" && "this is page 2"}
          {buttonValue === "page3" && "this is page 3"}
          {buttonValue === "page4" && "this is page 4"}
        </div>
      </div>
    ),
    intents: [
      <Button value="oranges">Oranges</Button>,
      <Button value="bananas">Bananas</Button>,
      status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
