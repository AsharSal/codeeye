import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function reviewCode(diffText,userConfig,isSummaryOnly) {
  const basePrompt = isSummaryOnly
    ? `
You are a senior engineer. Provide a high-level executive summary of the following code changes:
- Mention purpose of the changes.
- Highlight any potential risks, bugs, or architectural concerns.
- Keep it short and professional.

--- START DIFF ---
${diffText}
--- END DIFF ---
`
    : `
You are a strict and experienced code reviewer.

Analyze the following Git diff and provide actionable, inline suggestions.

🔍 What to include:
- Logical bugs, anti-patterns
- Performance, readability, and style improvements
- Missing error handling or validations
- Test or documentation gaps

✍️ Format (unless --summary is passed):

File: <relative/path.js>, Line: <number>
- Suggestion: <clear improvement>

User preferences:
- Tone: ${userConfig.tone || 'professional'}
- Strictness: ${userConfig.strictness || 'high'}

--- START DIFF ---
${diffText}
--- END DIFF ---
`;

  const result = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{ role: 'user', parts: [{ text: basePrompt }] }]
  });

  return result.text;
}

export async function fixCode(diffText) {
  const prompt = `
    You're a senior software engineer.

    Your task is to FIX the following staged code diff.
    Apply best practices, error handling, type safety (if applicable), and improve readability.

    Respond ONLY with the fully corrected files in this format:
    Return paths relative to the current working directory only. Do not prefix with backend/ or repo folder name.

    File: relative/path/to/file.js
    \`\`\`js
    <corrected content here>
    \`\`\`

    --- START DIFF ---
    ${diffText}
    --- END DIFF ---
      `;

  const result = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }]
  });

  return result.text;
}