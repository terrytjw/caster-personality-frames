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
import { dummyQuizData, dummyWarpcastData, questions } from "@/app/data";
import { classifyPersonality } from "@/app/lib/openai";
import { getERC721PreparedEncodedData } from "@/app/lib/thirdweb";
import { erc721ContractABI } from "@/app/lib/erc721ContractABI";

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: "NEYNAR_FROG_FM" }),
  // initialState: {
  //   userCastsData: [],
  //   user: {},
  //   qn_one: "",
  //   qn_two: "",
  //   qn_three: "",
  //   qn_four: "",
  // },
});

const quiz = [
  {
    question: "How do you use Warpcast?",
    answer: "I show off my achievements",
  },
  {
    question: "What's your posting style?",
    answer: "Informative threads",
  },
  {
    question: "What's your main content?",
    answer: "Memes and trolls",
  },
  {
    question: "How do others describe you?",
    answer: "The show-off",
  },
];

let result = {
  userCastsData: [],
  user: {},
  qn_one: "",
  qn_two: "",
  qn_three: "",
  qn_four: "",
};

// Uncomment to use Edge Runtime
// export const runtime = 'edge'
app.frame("/", async (c) => {
  const { buttonValue, inputText, status, deriveState } = c;
  // const fruit = inputText || buttonValue;
  console.log(c, "c");
  // const user = (await fetchUser(5650))?.result?.user;
  // console.log(user, "user");
  // const feeds: any = await fetchAndProcessFeeds(5650);

  // result.user = user;
  // result.userCastsData = feeds;
  // TODO: ai stuff

  console.log(c, "c");
  return c.res({
    action: "/user",
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
            fontSize: 70,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            display: "flex",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          What kind of caster are you?
        </div>
      </div>
    ),
    intents: [
      // <Button value="A">A</Button>,
      <Button value={"continue"}>Continue</Button>,
      // status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

app.frame("/user", async (c) => {
  const { buttonValue, inputText, status, deriveState } = c;
  // const fruit = inputText || buttonValue;
  console.log(c, "c");
  const fid = c?.frameData?.fid || 5650;
  const user = (await fetchUser(fid))?.result?.user;
  console.log(user, "user");
  const feeds: any = await fetchAndProcessFeeds(fid);

  result.user = user;
  result.userCastsData = feeds;
  // TODO: ai stuff

  console.log(c, "c");
  return c.res({
    action: "/q1",
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
        {/* <img src="https://i.kym-cdn.com/entries/icons/mobile/000/032/280/meme1.jpg" /> */}
        <div
          style={{
            color: "white",
            fontSize: 32,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            display: "flex",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          Let's go, <br />
          {user.displayName}!
        </div>
        <div
          style={{
            color: "white",
            fontSize: 70,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            display: "flex",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          Let's find out what kind of caster you are!
        </div>
        <div
          style={{
            color: "yellow",
            fontSize: 22,
            fontStyle: "italic",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 120,
            display: "flex",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          (Do wait for your username to appear)
        </div>
      </div>
    ),
    intents: [
      // <Button value="A">A</Button>,
      <Button value={"continue"}>Continue</Button>,
      // status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

app.frame("/q1", (c) => {
  const { buttonValue, inputText, status, deriveState } = c;
  const fruit = inputText || buttonValue;
  console.log(result, "result");

  console.log(c, "c2");
  return c.res({
    action: "/q2",
    image: (
      <div
        style={{
          alignItems: "center",
          backgroundImage: `url("https://i.kym-cdn.com/entries/icons/mobile/000/032/280/meme1.jpg")`,
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          justifyItems: "start",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyItems: "start",
            flexWrap: "nowrap",
            paddingBottom: 50,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
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
              flexDirection: "row",
              padding: "0 120px",
              whiteSpace: "pre-wrap",
            }}
          >
            {questions[0].question}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div
              style={{
                color: "white",
                fontSize: 30,
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                lineHeight: 1.4,
                marginTop: 30,
                display: "flex",
                padding: "0 120px",
                whiteSpace: "pre-wrap",
              }}
            >
              A. {questions[0].options[0]}
            </div>
            <div
              style={{
                color: "white",
                fontSize: 30,
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                lineHeight: 1.4,
                marginTop: 30,
                display: "flex",
                padding: "0 120px",
                whiteSpace: "pre-wrap",
              }}
            >
              B. {questions[0].options[1]}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div
              style={{
                color: "white",
                fontSize: 30,
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                lineHeight: 1.4,
                marginTop: 30,
                display: "flex",
                padding: "0 120px",
                whiteSpace: "pre-wrap",
              }}
            >
              C. {questions[0].options[2]}
            </div>
            <div
              style={{
                color: "white",
                fontSize: 30,
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                lineHeight: 1.4,
                marginTop: 30,
                display: "flex",
                padding: "0 120px",
                whiteSpace: "pre-wrap",
              }}
            >
              D. {questions[0].options[3]}
            </div>
          </div>
        </div>
      </div>
    ),
    intents: [
      <Button value={questions[0]?.options[0]}>A</Button>,
      <Button value={questions[0]?.options[1]}>B</Button>,
      <Button value={questions[0]?.options[2]}>C</Button>,
      <Button value={questions[0]?.options[3]}>D</Button>,
      // status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

app.frame("/q2", (c) => {
  const { buttonValue, inputText, status, deriveState } = c;
  const fruit = inputText || buttonValue;
  console.log(result, "result");
  result.qn_one = buttonValue || "";
  quiz[0].answer = buttonValue || "";
  console.log(c, "c2");
  return c.res({
    action: "/q3",
    image: (
      <div
        style={{
          alignItems: "center",
          backgroundImage: `url("https://preview.redd.it/i-think-doginme-is-a-good-bid-here-v0-p0c1mv36bxsc1.jpeg?auto=webp&s=0cd5c541a3cd2d923184d96b3d1e00ce804ac123")`,
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          justifyItems: "start",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyItems: "start",
            flexWrap: "nowrap",
            paddingBottom: 50,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
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
              flexDirection: "row",
              padding: "0 120px",
              whiteSpace: "pre-wrap",
            }}
          >
            {questions[1].question}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div
              style={{
                color: "white",
                fontSize: 30,
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                lineHeight: 1.4,
                marginTop: 30,
                display: "flex",
                padding: "0 120px",
                whiteSpace: "pre-wrap",
              }}
            >
              A. {questions[1].options[0]}
            </div>
            <div
              style={{
                color: "white",
                fontSize: 30,
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                lineHeight: 1.4,
                marginTop: 30,
                display: "flex",
                padding: "0 120px",
                whiteSpace: "pre-wrap",
              }}
            >
              B. {questions[1].options[1]}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div
              style={{
                color: "white",
                fontSize: 30,
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                lineHeight: 1.4,
                marginTop: 30,
                display: "flex",
                padding: "0 120px",
                whiteSpace: "pre-wrap",
              }}
            >
              C. {questions[1].options[2]}
            </div>
            <div
              style={{
                color: "white",
                fontSize: 30,
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                lineHeight: 1.4,
                marginTop: 30,
                display: "flex",
                padding: "0 120px",
                whiteSpace: "pre-wrap",
              }}
            >
              D. {questions[1].options[3]}
            </div>
          </div>
        </div>
      </div>
    ),
    intents: [
      <Button value={questions[1]?.options[0]}>A</Button>,
      <Button value={questions[1]?.options[1]}>B</Button>,
      <Button value={questions[1]?.options[2]}>C</Button>,
      <Button value={questions[1]?.options[3]}>D</Button>,
      // status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

app.frame("/q3", (c) => {
  const { buttonValue, inputText, status, deriveState } = c;
  const fruit = inputText || buttonValue;
  console.log(result, "result");
  result.qn_two = buttonValue || "";
  quiz[1].answer = buttonValue || "";
  console.log(c, "c2");
  return c.res({
    action: "/q4",
    image: (
      <div
        style={{
          alignItems: "center",
          backgroundImage: `url("https://www.coindesk.com/resizer/IYnjQ1F52nK_Aqpl-XXe5mTFFiI=/800x600/cloudfront-us-east-1.images.arcpublishing.com/coindesk/GCRFABYIGRD3DEBNVM3DZ6Z3DY.png")`,
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          justifyItems: "start",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyItems: "start",
            flexWrap: "nowrap",
            paddingBottom: 50,
            backgroundColor: "rgba(0, 0, 0, 0.9)",
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
              flexDirection: "row",
              padding: "0 120px",
              whiteSpace: "pre-wrap",
            }}
          >
            {questions[2].question}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div
              style={{
                color: "white",
                fontSize: 30,
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                lineHeight: 1.4,
                marginTop: 30,
                display: "flex",
                padding: "0 120px",
                whiteSpace: "pre-wrap",
              }}
            >
              A. {questions[2].options[0]}
            </div>
            <div
              style={{
                color: "white",
                fontSize: 30,
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                lineHeight: 1.4,
                marginTop: 30,
                display: "flex",
                padding: "0 120px",
                whiteSpace: "pre-wrap",
              }}
            >
              B. {questions[2].options[1]}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div
              style={{
                color: "white",
                fontSize: 30,
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                lineHeight: 1.4,
                marginTop: 30,
                display: "flex",
                padding: "0 120px",
                whiteSpace: "pre-wrap",
              }}
            >
              C. {questions[2].options[2]}
            </div>
            <div
              style={{
                color: "white",
                fontSize: 30,
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                lineHeight: 1.4,
                marginTop: 30,
                display: "flex",
                padding: "0 120px",
                whiteSpace: "pre-wrap",
              }}
            >
              D. {questions[2].options[3]}
            </div>
          </div>
        </div>
      </div>
    ),
    intents: [
      <Button value={questions[2]?.options[0]}>A</Button>,
      <Button value={questions[2]?.options[1]}>B</Button>,
      <Button value={questions[2]?.options[2]}>C</Button>,
      <Button value={questions[2]?.options[3]}>D</Button>,
      // status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

app.frame("/q4", (c) => {
  const { buttonValue, inputText, status, deriveState } = c;
  const fruit = inputText || buttonValue;
  console.log(result, "result");
  result.qn_four = buttonValue || "";
  quiz[2].answer = buttonValue || "";
  console.log(c, "c2");
  return c.res({
    action: "/result",
    image: (
      <div
        style={{
          alignItems: "center",
          backgroundImage: `url("https://i.pinimg.com/736x/4a/8c/9b/4a8c9b9955a61c1458bbb3b1fe8c0902.jpg")`,
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          justifyItems: "start",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyItems: "start",
            flexWrap: "nowrap",
            paddingBottom: 50,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
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
              flexDirection: "row",
              padding: "0 120px",
              whiteSpace: "pre-wrap",
            }}
          >
            {questions[2].question}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div
              style={{
                color: "white",
                fontSize: 30,
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                lineHeight: 1.4,
                marginTop: 30,
                display: "flex",
                padding: "0 120px",
                whiteSpace: "pre-wrap",
              }}
            >
              A. {questions[2].options[0]}
            </div>
            <div
              style={{
                color: "white",
                fontSize: 30,
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                lineHeight: 1.4,
                marginTop: 30,
                display: "flex",
                padding: "0 120px",
                whiteSpace: "pre-wrap",
              }}
            >
              B. {questions[2].options[1]}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div
              style={{
                color: "white",
                fontSize: 30,
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                lineHeight: 1.4,
                marginTop: 30,
                display: "flex",
                padding: "0 120px",
                whiteSpace: "pre-wrap",
              }}
            >
              C. {questions[2].options[2]}
            </div>
            <div
              style={{
                color: "white",
                fontSize: 30,
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                lineHeight: 1.4,
                marginTop: 30,
                display: "flex",
                padding: "0 120px",
                whiteSpace: "pre-wrap",
              }}
            >
              D. {questions[2].options[3]}
            </div>
          </div>
        </div>
      </div>
    ),
    intents: [
      <Button value={questions[3]?.options[0]}>A</Button>,
      <Button value={questions[3]?.options[1]}>B</Button>,
      <Button value={questions[3]?.options[2]}>C</Button>,
      <Button value={questions[3]?.options[3]}>D</Button>,
      // status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

function extractContentFromXML(xmlString: string): Record<string, string> {
  const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
  const parser = new XMLParser();
  let result = parser.parse(xmlString);
  console.log(result, "result");
  return result;
}

// Get the encoded data
async function createTransactionFrame(accountAddress: any, res: any) {
  const data = await getERC721PreparedEncodedData(accountAddress);
  return res.status(200).json({
    chainId: "eip155:10",
    method: "eth_sendTransaction",
    params: {
      abi: erc721ContractABI,
      to: process.env.CONTRACT_ADDRESS_1,
      data: data,
      value: "0",
    },
  });
}

app.frame("/result", async (c) => {
  const { buttonValue, inputText, status, deriveState } = c;
  const fruit = inputText || buttonValue;
  console.log(result, "result");
  result.qn_four = buttonValue || "";
  quiz[3].answer = buttonValue || "";

  console.log(result, "result");
  console.log(quiz, "quiz");
  const personalityInfo = await classifyPersonality(
    JSON.stringify(result.userCastsData),
    JSON.stringify(quiz),
  );
  // console.log(c, "c2");
  const jsonResult = extractContentFromXML(personalityInfo);
  return c.res({
    action: "/result",
    image: (
      <div
        style={{
          alignItems: "center",
          backgroundImage:
            jsonResult.personalitytype === "gm Officer"
              ? `url("https://i.pinimg.com/736x/4a/8c/9b/4a8c9b9955a61c1458bbb3b1fe8c0902.jpg")`
              : jsonResult.personalitytype === "Flex Monster"
                ? `url("https://i.pinimg.com/736x/4a/8c/9b/4a8c9b9955a61c1458bbb3b1fe8c0902.jpg")`
                : jsonResult.personalitytype === "Information Guru"
                  ? `url("https://i.pinimg.com/736x/4a/8c/9b/4a8c9b9955a61c1458bbb3b1fe8c0902.jpg")`
                  : `url("https://i.pinimg.com/736x/4a/8c/9b/4a8c9b9955a61c1458bbb3b1fe8c0902.jpg")`, //TODO: replace this
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          justifyItems: "start",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyItems: "center",
            flexWrap: "nowrap",
            justifyContent: "center",
            textAlign: "center",
            paddingBottom: 50,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: 40,
              fontWeight: "bold",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              marginTop: 30,
              display: "flex",
              justifyContent: "center",
              justifyItems: "center",
              flexDirection: "row",

              textAlign: "center",
              whiteSpace: "pre-wrap",
            }}
          >
            {jsonResult.personalitytype}
          </div>
          <div
            style={{
              color: "white",
              fontSize: 30,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              display: "flex",
              justifyContent: "center",
              justifyItems: "center",
              lineHeight: 1.4,
              marginTop: 30,

              whiteSpace: "pre-wrap",
            }}
          >
            {jsonResult.reasoning}
          </div>
          <div
            style={{
              color: "yellow",
              fontSize: 25,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              display: "flex",
              justifyContent: "center",
              justifyItems: "center",
              marginTop: 30,

              whiteSpace: "pre-wrap",
            }}
          >
            {jsonResult.example}
          </div>
        </div>
      </div>
    ),
    intents: [
      <Button value={questions[3]?.options[0]}>Mint (coming soon)</Button>,
      // <Button value={questions[3]?.options[0]}>Share</Button>,
      // status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
