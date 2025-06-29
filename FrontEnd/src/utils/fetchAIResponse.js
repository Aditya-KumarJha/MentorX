export const fetchAIResponse = async (messages) => {
    try {
      const res = await fetch("https://mentorx-2koy.onrender.com/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });
  
      const data = await res.json();
  
      if (!res.ok || !data?.response) {
        return "Sorry, I couldn’t understand that.";
      }
  
      return data.response;
    } catch (err) {
      console.error("AI API Error:", err);
      return "Oops! Something went wrong. Try again later.";
    }
  };
  