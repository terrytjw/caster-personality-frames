/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { neynar } from "frog/hubs";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: "NEYNAR_FROG_FM" }),
});

let qna = [{
    question: "How do you use Warpcast?",
    answer:""
  },
  {
    question: "What's your posting style?",
    answer:""
  },
  {
    question: "What's your main content?",
    answer:""
  },
  {
    question: "How do others describe you?",
    answer:""
  }];

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame("/", (c) => {
  const { buttonValue, status } = c;

  return c.res({
    action: "/q1",
    image: (<div
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
          hello
        </div>
      </div>),
    intents: [
      <Button value="A">Yes</Button>,
      // status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

app.frame("/q1", (c) => {
  const { buttonValue, status } = c;

  qna[1].answer = buttonValue || "";

  return c.res({
    action: "/q2",
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
          Quiz #1
        </div>
      </div>
    ),
    intents: [
      <Button value="oranges">O1</Button>,
      <Button value="pear" >O2</Button>,
      <Button value="bananas">O3</Button>,
      <Button value="bananas">O4</Button>,
    ],
  });
});

app.frame("/q2", (c) => {
  const { buttonValue, status } = c;
  const answer = buttonValue;

  qna[1].answer = answer || "";
  
  // console.log("context ->", c);

  console.log("qna ->", qna);

  return c.res({
    action: "/q3",
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
          hello {answer || ""}
          {buttonValue === "page2" && "this is page 2"}
          {buttonValue === "page3" && "this is page 3"}
          {buttonValue === "page4" && "this is page 4"}
        </div>
      </div>
    ),
    intents: [
      <Button value="oranges">Oranges HELLO</Button>,
      <Button value="bananas">Bananas</Button>,
      status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
