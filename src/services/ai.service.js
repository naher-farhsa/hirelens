const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Generate optimized keywords from a Job Description.
 * Returns a JSON object: { "oldKeyword": "newKeyword", ... }
 */
async function generateOptimizedKeywords(jobDescription) {
  const contents = [
    { text: `Job Description:\n${jobDescription}` },
  ];

  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents,
    config: {
      systemInstruction: `You are a resume optimization assistant.
Return ONLY valid JSON with old keywords as keys and improved replacements as values.
Rules:
- Never output markdown, comments, or explanations.
- Replace only if JD requires a specific version, sub-technology, or specialization.
- Do not expand generic terms (❌ Java → Java Development).
- Example: If JD requires Java 18, then "Java" → "Java 18".`,
      textInstruction: "Suggest precise keyword replacements as a JSON object.",
    },
  });

  let text = result?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

  // 🧹 Remove any ```json ... ``` wrappers if present
  text = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("❌ JSON parse error:", err.message);
    return {};
  }
}

module.exports = generateOptimizedKeywords;
