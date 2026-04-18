
async function generate() {
  const category = document.getElementById("category").value;
  const problem = document.getElementById("problem").value;
  const location = document.getElementById("location").value;
  const output = document.getElementById("output");

  if (!category || !problem || !location) {
    alert("Please fill all fields");
    return;
  }

  output.innerText = "⏳ Generating smart report...";

  const prompt = `
You are a smart civic assistant.

Category: ${category}
Problem: ${problem}
Location: ${location}

Based on category, decide department automatically.

Return:
Title:
Description:
Department:
Priority (Low/Medium/High):
`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await res.json();
    output.innerText = data.choices[0].message.content;

  } catch (e) {
    output.innerText = "❌ Error generating report";
  }
}
