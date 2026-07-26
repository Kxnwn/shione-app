import { ai } from "../config/gemini.js";
import { MemoryCategory } from "@prisma/client";
import { saveMemory } from "./memory.service.js";


export const extractMemory = async (
    userId: number,
    message: string
) => {

    const prompt = `
You are an AI memory extraction system.

Extract long-term memories from the conversation.

Return ONLY valid JSON.

The category MUST be EXACTLY one of these values:

PROFILE
PREFERENCE
GOAL
EDUCATION
HOBBY

Never use any other category.
Never pluralize categories.

Only save information that will still matter weeks or months later.

Good memories include:

- Birthday
- Age
- Name
- Nickname
- School
- Favorite Color
- Favorite Food
- Favorite Game
- Favorite Music
- Hobbies
- Career Goal
- Dream Job
- Pets
- Family Members
- Important Preferences

DO NOT SAVE:

- Temporary emotions
- Today's activities
- Weather
- Temporary plans
- One-time events
- Random conversations

Return ONLY JSON.

If there are no memories:

{
  "memories":[]
}

Otherwise:

{
  "memories":[
      {
          "category":"PROFILE",
          "key":"birthday",
          "value":"July 10"
      }
  ]
}

User Message:

${message}
`;

 const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
    })

    const cleaned = (response.text ?? "")
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

    try {
    const result = JSON.parse(cleaned);

    for (const memory of result.memories ?? []) {
        await saveMemory(
            userId,
            memory.category as MemoryCategory,
            memory.key,
            memory.value
        );
    }
    } catch (error) {
    console.error("Failed to extract memories:", error);
}
}
