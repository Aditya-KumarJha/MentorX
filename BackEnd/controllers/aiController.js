import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export const getAIResponse = async (req, res) => {
  const { messages } = req.body;

  // Validate input
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ response: "No messages array provided" });
  }

  try {
    // Call OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://mentorx-2koy.onrender.com/",
        "X-Title": "MentorX-AI",
      },
      body: JSON.stringify({
        model: "gryphe/mythomax-l2-13b",
        messages,
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (jsonErr) {
      console.error("❌ JSON Parse Error from OpenRouter:", jsonErr.message);
      console.warn("🧾 Raw text received:", text);
      return res.status(500).json({ response: "Invalid JSON response from AI server." });
    }

    if (!response.ok) {
      console.error("⚠️ OpenRouter returned error:", data);
      return res.status(500).json({ response: "AI server error", details: data });
    }

    const aiMessage = data?.choices?.[0]?.message?.content;
    if (!aiMessage) {
      console.error("🛑 No message content in AI response:", data);
      return res.status(500).json({ response: "AI did not return a valid message." });
    }

    return res.status(200).json({ response: aiMessage });
  } catch (err) {
    console.error("🔥 Fetch to OpenRouter failed:", err.message);
    return res.status(500).json({ response: "Something went wrong while contacting the AI server." });
  }
};
