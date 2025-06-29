import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export const getAIResponse = async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ response: "No messages array provided" });
  }

  try {
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

    let data;
    try {
      data = await response.json();
    } catch (jsonErr) {
      console.error("🛑 Failed to parse JSON from OpenRouter:", jsonErr.message);
      return res.status(500).json({ response: "Invalid JSON response from AI server." });
    }

    if (!response.ok) {
      console.error("❌ OpenRouter Error Response:", data);
      return res.status(500).json({ response: "AI failed to respond", details: data });
    }

    const aiMessage = data?.choices?.[0]?.message?.content;

    if (!aiMessage) {
      console.error("🛑 No valid AI message received:", data);
      return res.status(500).json({ response: "Empty response from AI" });
    }

    return res.status(200).json({ response: aiMessage });
  } catch (err) {
    console.error("🔥 OpenRouter API Error:", err.message);
    return res.status(500).json({ response: "Something went wrong while fetching AI response." });
  }
};
