// This is the code for our Netlify serverless function

exports.handler = async function(event) {
    // Get the user's food query from the request sent by the frontend
    const { foodQuery } = JSON.parse(event.body);
  
    // Get our secret OpenAI API key from the environment variables
    const apiKey = process.env.OPENAI_API_KEY;
  
    // --- THIS IS THE UPDATED PROMPT ---
    const systemPrompt = `
      You are a master BBQ and grilling expert. Your task is to provide cooking times and temperatures for a given food.
      You MUST provide four separate recommendations, one for each of these exact grill types: Gas Grill, Charcoal Grill, Pellet Grill, and Smoker. Note that a Pellet Grill is distinct from a dedicated Smoker.
      You MUST respond ONLY with a valid JSON object. Do not include any other text, explanations, or markdown formatting.
      The JSON object must have this exact structure with four items in the recommendations array:
      {
        "food_name": "A corrected or clarified name of the food",
        "recommendations": [
          {
            "grill_type": "Gas Grill",
            "temperature": "A temperature range or setting",
            "time": "A time range per side or total",
            "notes": "A brief, essential tip for this method."
          },
          {
            "grill_type": "Charcoal Grill",
            "temperature": "...",
            "time": "...",
            "notes": "..."
          },
          {
            "grill_type": "Pellet Grill",
            "temperature": "...",
            "time": "...",
            "notes": "..."
          },
          {
            "grill_type": "Smoker",
            "temperature": "...",
            "time": "...",
            "notes": "..."
          }
        ]
      }
    `;
  
    try {
      // Use the built-in 'fetch' to call the OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: foodQuery }
          ],
          response_format: { type: "json_object" }
        })
      });
  
      if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.statusText}`);
      }
  
      const aiData = await response.json();
  
      // Return the AI's response to the user's browser
      return {
        statusCode: 200,
        body: aiData.choices[0].message.content
      };
  
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to fetch AI response.' })
      };
    }
  };