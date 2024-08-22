import { HfInference } from "@huggingface/inference";
import TestAI from "@/components/TestAI";

const inference = new HfInference("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");

export async function getQuestionsBasedOnNotes(notes, setResponse) {
  let response = '';

  for await (const chunk of inference.chatCompletionStream({
    model: "microsoft/Phi-3-mini-4k-instruct",
    messages: [{ role: "user", content: "Generate questions based on the following paragraph: " + notes }],
    max_tokens: 500,
  })) {
    response += chunk.choices[0]?.delta?.content || "";
  }

  setResponse(response);
}
