import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const systemInstruction = `
        You are a specialized medical clinic assistant AI. 
        Your sole purpose is to answer medical, health, wellness, and anatomy-related questions.
        
        CRITICAL FORMATTING RULES:
        1. Be extremely concise. Keep your total response under 3 to 4 sentences maximum.
        2. Use simple, non-medical jargon that a regular patient can easily understand.
        3. If listing symptoms or advice, use a maximum of 3 clear bullet points.
        4. Always conclude with a mandatory, brief 1-sentence disclaimer: "Please consult our clinic doctors for an official diagnosis."

        CRITICAL GUARDRAIL RULE: If the user's message is NOT related to health, medicine, medical symptoms, clinic appointments, or lifestyle wellness, you MUST politely refuse to answer using this exact short phrase:
        "I am sorry, but I can only assist with medical or clinic-related questions."
    `;

    const apiKey = process.env.AI_API_KEY; 
    
    // Official Google Gemini API Endpoint (Using gemini-2.5-flash)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          { parts: [{ text: message }] }
        ],
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          temperature: 0.3
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error("Gemini API Error details:", errData);
      return NextResponse.json({ error: "Gemini Service Error" }, { status: response.status });
    }

    const data = await response.json();
    
    // Parsing response text from Gemini format structure safely
    const reply = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 });
  }
}