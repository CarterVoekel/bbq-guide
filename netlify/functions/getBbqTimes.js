exports.handler = async function(event) {
  const { foodQuery } = JSON.parse(event.body);
  const apiKey = process.env.OPENAI_API_KEY;

  const systemPrompt = `You are a master BBQ and grilling expert. Your task is to provide cooking times and temperatures for a given food. You MUST respond ONLY with a valid JSON object. Do not include any other text, explanations, or markdown formatting. The JSON object must have this exact structure: {"food_name": "A corrected or clarified name of the food", "recommendations": [{"grill_type": "Gas Grill", "temperature": "A temperature range or setting", "time": "A time range per side or total", "notes": "A brief, essential tip for this method."}, {"grill_type": "Charcoal Grill", "temperature": "...", "time": "...", "notes": "..."}, {"grill_type": "Pellet Grill (Smoker)", "temperature": "...", "time": "...", "notes": "..."}]}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: foodQuery }],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) throw new Error(`OpenAI API error: ${response.statusText}`);
    const aiData = await response.json();
    return { statusCode: 200, body: aiData.choices[0].message.content };

  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch AI response.' }) };
  }
};