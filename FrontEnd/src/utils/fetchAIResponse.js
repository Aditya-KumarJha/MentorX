export const fetchAIResponse = async (messages) => {
  try {
    const res = await fetch("https://mentorx-backend.onrender.com/api/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    const text = await res.text(); 
    let data = {};

    try {
      data = JSON.parse(text);
    } catch (jsonErr) {
      console.error("❌ AI API JSON Parse Error:", jsonErr);
      console.warn("⚠️ Raw response text received:", text);
      return "Oops! Something went wrong. Try again later.";
    }

    if (!res.ok) {
      console.error("❌ AI API Response Error:", res.status, res.statusText, data);
      return "Sorry, the AI couldn't respond properly.";
    }

    if (!data?.response) {
      console.warn("⚠️ AI API returned no usable response:", data);
      return "Sorry, I couldn’t understand that.";
    }

    return data.response;

  } catch (err) {
    console.error("🔥 AI API Network Error:", err);
    return "Oops! Something went wrong. Try again later.";
  }
};