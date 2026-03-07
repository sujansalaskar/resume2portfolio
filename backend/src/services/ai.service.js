const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

async function parseResumeWithAI(resumeText) {

  const prompt = `
Extract detailed, structured data from the following resume.

Return ONLY valid JSON with no extra text, no comments, and no markdown.

Use this exact JSON structure and field names:

{
  "name": "",
  "role": "",
  "summary": "",
  "email": "",
  "phone": "",
  "skills": [],
  "projects": [
    {
      "title": "",
      "description": "",
      "techStack": [],
      "githubUrl": "",
      "liveUrl": "",
      "screenshotUrl": ""
    }
  ],
  "experience": [
    {
      "company": "",
      "role": "",
      "duration": "",
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": ""
    }
  ]
}

Filling instructions:
- "role": the person's current or most recent job title/role (e.g. "Full Stack Developer", "Data Scientist"). If not explicitly stated, infer it from the resume content.
- "summary": a concise professional summary (2–4 sentences) describing the person's expertise, years of experience, and key strengths. If the resume has an objective/summary section, use that. Otherwise, generate one from the resume content.
- "skills": array of individual skills/technologies as short strings.
- For each project "description": write a detailed summary (3–5 sentences) covering the problem, responsibilities, key achievements, and impact.
- For each project "techStack": array of technologies used (e.g. ["React", "Node.js", "MongoDB"]). Do not include prose here.
- For each experience item "description": write a detailed summary (3–5 sentences) of responsibilities, achievements, impact, and key technologies/tools used.
- "duration" should be a concise human-readable range if possible (e.g. "Jan 2022 – Mar 2024").

If some fields are missing in the resume, still include them in the JSON with an empty string "" or empty array [] as appropriate.

Resume text:
${resumeText}
`;

  const completion = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "user", content: prompt }
    ],
    temperature: 0.2
  });

  return completion.choices[0].message.content;

}

module.exports = { parseResumeWithAI };