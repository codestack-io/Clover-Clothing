/**
 * faqAssistant.js
 * -----------------------------------------------------------------------
 * Not wired up yet — this is scaffolding so a future "ask the AI" fallback
 * can be dropped in without restructuring FAQSearch/FAQSection.
 *
 * Intended usage once implemented:
 *
 *   import { getAIAnswer } from "@/lib/ai/faqAssistant";
 *
 *   const reply = await getAIAnswer({
 *     question: query,
 *     context: faqs,          // pass the existing faqData as grounding context
 *     provider: "claude",     // "openai" | "gemini" | "claude"
 *   });
 *
 * Suggested wiring, per provider (all called from a Next.js Route Handler,
 * e.g. app/api/faq-assistant/route.js, never directly from the client —
 * API keys must stay server-side):
 *
 *   OpenAI:  POST https://api.openai.com/v1/chat/completions
 *            Authorization: Bearer process.env.OPENAI_API_KEY
 *
 *   Gemini:  POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
 *            key=process.env.GEMINI_API_KEY
 *
 *   Claude:  POST https://api.anthropic.com/v1/messages
 *            x-api-key: process.env.ANTHROPIC_API_KEY
 *
 * A good system prompt keeps answers grounded in `faqData.js` (pass the
 * relevant entries as context) so the assistant doesn't invent shipping
 * times, prices, or policies that don't exist on the real site.
 */

/**
 * @param {Object} params
 * @param {string} params.question - The user's free-text question.
 * @param {Array}  params.context  - Relevant FAQ entries to ground the answer.
 * @param {"openai"|"gemini"|"claude"} [params.provider="claude"]
 * @returns {Promise<string>} the assistant's answer
 */
export async function getAIAnswer({ question, context = [], provider = "claude" }) {
  // Intentionally unimplemented. Wire this to a server-side API route
  // once an API key and provider have been chosen. Throwing (rather than
  // silently returning a canned string) makes it obvious at call sites
  // that this still needs to be connected.
  throw new Error(
    `getAIAnswer() is not implemented yet. Connect a "${provider}" API route in ` +
      "app/api/faq-assistant/route.js and call it from here."
  );
}