import { ChatAnthropic } from "@langchain/anthropic";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export const classifyPersonality = async (
  warpcastData: string,
  quizResult: string,
) => {
  const model = new ChatAnthropic({
    temperature: 0.5,
    model: "claude-3-haiku-20240307",
    maxTokens: 1024,
  });
  const outputParser = new StringOutputParser();

  const prompt = ChatPromptTemplate.fromTemplate(
    `
    You are an expert at classifying personality types on Warpcast. For context, Warpcast is a decentralized social media application built on the Farcaster protocol. It aims to provide users with a social media experience similar to traditional platforms like Twitter, but with the benefits of decentralization. "Casts" are posts on Warpcast.

    We had the user sit through a quiz which will yield some results. You have been given a user's Warpcast data on the user's casts and their quiz results. Your task is to classify their personality type into one of these personality types:
    <4TypesofCasters>
        1. Shitposter
        Description: This type of caster is known for being sarcastic, trolling others, and frequently posting memes.
        - Sarcasm
        - Trolls others
        - Posts memes

        2. Information Guru
        Description: This caster is recognized for sharing the latest news and updates and is likely to write extensive threads.
        - Shares latest news/updates
        - Thread creator

        3. Flex Monster
        Description: Known for flaunting wealth, this caster often posts images of luxury items like Lamborghinis, shares Profit and Loss statements, and talks about their entry prices in investments.
        - Posts images of Lamborghinis
        - Shares Profit and Loss statements
        - Discusses entry prices

        4. gm Officer
        Description: A friendly presence, this caster is always quick to greet with a "gm" (good morning) and engages in conversations by replying to others.
        - Always casts "gm"
        - Engages as a reply person 
    </4TypesofCasters>
    
    You can use the following quiz results and Warpcast data to classify the user's personality type: 
    <warpcastdata>{warpcastData}</warpcastdata>
    <quizresult>{quizResult}</quizresult>

    Respond in the following format:
    <personalitytype>personality_type</personalitytype>
    <reasoning>reasoning (in maximum 3 concise bullet point, each less than 15 words)</reasoning>
    <example>an_example_cast_that_the_user_has_made</example>

    An example of the response is:
    <personalitytype>Shitposter</personalitytype>
    <reasoning>
      Based on the user's profile and quiz results, the user:
        1. Posts memes and is sarcastic
        2. Trolls others
        3. Likes to make fun of others
    </reasoning>
    <example>
        WIF to the moooooon
    </example>
    `,
  );

  const chain = prompt.pipe(model).pipe(outputParser);

  console.log("Classifying personality...");

  const personalityInfo = await chain.invoke({
    warpcastData,
    quizResult,
  });

  return personalityInfo;
};
