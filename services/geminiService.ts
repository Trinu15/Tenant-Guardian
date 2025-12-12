import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ListingInputData, RiskAnalysisResult } from "../types";

const client = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeListing = async (data: ListingInputData): Promise<RiskAnalysisResult> => {
  // Use gemini-2.5-flash for the main analysis
  const model = "gemini-2.5-flash";

  const promptParts: any[] = [];
  const targetLanguage = data.language || 'English';

  // 1. System Instruction & Context
  const systemPrompt = `
  You are Tenant Guardian AI Beta v1.1 - a specialized multimodal rental scam detector for tenants.

  Your job is to analyze this rental listing for fraud risk using the following 5 checks. You MUST use Google Search and Google Maps tools to perform these verifications.

  CHECKS:
  1. **ADDRESS**: 
     - Verify if the address exists on Google Maps. 
     - Check for residential vs commercial mismatch (e.g., listing says "Cozy Apartment" but Maps shows a warehouse or industrial zone).
  
  2. **PRICE**: 
     - Compare monthly price vs sq footage vs median price for that specific area.
     - Flag significant anomalies. Typically, scams are priced "too good to be true" (>30% below market). However, also flag if it is >30% above market as a price anomaly.
  
  3. **PHOTO**: 
     - Check if the photo matches the address location style (geotag clues, architectural style, season).
     - Look for "perfect" stock photos or watermarks from other sites.
  
  4. **LANDLORD**: 
     - Search the "Claimed Landlord/Owner Name" + Address.
     - Look for business records, ownership data, or scam complaints associated with the name/address.
     - If the name is generic (e.g., "Private Owner") but the property is owned by a large corporation, flag it.
  
  5. **DESCRIPTION**: 
     - Detect copy-paste patterns from legit sites (generic text, stolen content).
     - Look for high-pressure tactics ("Urgent", "Wire transfer only", "Owner abroad").

  **OUTPUT FORMAT**:
  You must output a valid JSON object matching the structure below. Do not include markdown formatting like \`\`\`json. Just the raw JSON.
  
  IMPORTANT: All text fields (summary, details, actionableSteps) MUST be in ${targetLanguage}.

  {
    "riskScore": number (0-100, where 100 is most risky/scam),
    "verdict": string ("HIGH RISK", "SAFE", "CAUTION"),
    "verdictColor": string ("RED", "YELLOW", "GREEN"),
    "summary": string (A concise summary in ${targetLanguage}. Format: "RISK: [Level]. FLAGS: [List main flags]. VERIFIED: [List verified items]."),
    "geoLog": { 
      "status": "PASS" | "FAIL" | "UNKNOWN", 
      "details": string (in ${targetLanguage}) 
    },
    "priceLog": { 
      "status": "HIGH_RISK" | "MODERATE_RISK" | "LOW_RISK", 
      "details": string (in ${targetLanguage}) 
    },
    "textLog": { 
      "status": "DETECTED" | "CLEAR", 
      "details": string (in ${targetLanguage}), 
      "keywordsFound": string[] 
    },
    "photoLog": { 
      "integrityScore": number (1-10, where 10 is authentic, 1 is fake), 
      "details": string (in ${targetLanguage}) 
    },
    "ownershipLog": { 
      "status": "PLAUSIBLE" | "SUSPICIOUS" | "UNKNOWN", 
      "details": string (in ${targetLanguage}) 
    },
    "actionableSteps": string[] (List 3-5 specific actionable steps for the tenant in ${targetLanguage})
  }
  `;
  
  promptParts.push({ text: systemPrompt });

  // 2. Data Input
  let userPrompt = `
  ANALYZE THIS LISTING (${targetLanguage}):
  - Title: ${data.title}
  - Address: ${data.address}
  - Listed Price: ₹${data.price}
  - Median Area Price: ${data.medianPrice ? `₹${data.medianPrice}` : "Unknown (Estimate based on location)"}
  - Sqft: ${data.sqft}
  - Landlord/Owner Name Claimed: ${data.ownerName || "Not provided"}
  - Description: "${data.description}"
  `;

  promptParts.push({ text: userPrompt });

  // 3. Image Input
  if (data.photoBase64 && data.photoMimeType) {
    promptParts.push({
      inlineData: {
        data: data.photoBase64,
        mimeType: data.photoMimeType
      }
    });
  }

  try {
    const response = await client.models.generateContent({
      model: model,
      contents: [{ parts: promptParts }],
      config: {
        tools: [{ googleSearch: {} }, { googleMaps: {} }],
      }
    });

    let resultText = response.text;
    if (!resultText) throw new Error("No response from AI");

    // Clean up potential Markdown code blocks if the model adds them
    if (resultText.includes("```json")) {
      resultText = resultText.replace(/```json/g, "").replace(/```/g, "");
    } else if (resultText.includes("```")) {
      resultText = resultText.replace(/```/g, "");
    }
    
    return JSON.parse(resultText) as RiskAnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze listing. The AI service may be temporarily unavailable or the input was invalid.");
  }
};

export const verifyDocument = async (base64: string, mimeType: string, language: string) => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
  You are 'Check.AI', a specialized document verification engine. 
  
  Analyze the provided image. Use Google Search to check if this specific image appears on the public internet (reverse image search).
  
  Tasks:
  1. **Identify the Document/Image**: What is it? (Lease agreement, ID card, House photo, Stock photo?)
  2. **Check for Online Presence**: Does this image exist on stock photo websites, other real estate listings, or public templates?
  3. **Verification Verdict**: 
     - If found online on stock sites: "STOLEN/STOCK PHOTO"
     - If found on other listings: "DUPLICATE LISTING"
     - If unique/not found: "UNIQUE/ORIGINAL"
  
  Output a JSON object (no markdown):
  {
    "verdict": "string",
    "details": "string (in ${language})",
    "sources": ["url1", "url2"] (if found)
  }
  `;

  try {
    const response = await client.models.generateContent({
      model: model,
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { data: base64, mimeType: mimeType } }
        ]
      }],
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    let resultText = response.text;
    if (!resultText) throw new Error("No response from AI");

     if (resultText.includes("```json")) {
      resultText = resultText.replace(/```json/g, "").replace(/```/g, "");
    } else if (resultText.includes("```")) {
      resultText = resultText.replace(/```/g, "");
    }

    return JSON.parse(resultText);

  } catch (error) {
    console.error("Check.AI Error:", error);
    throw error;
  }
};

export const getDetailsFromCoordinates = async (lat: number, lng: number, language: string) => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
  I have a location with Coordinates: Latitude ${lat}, Longitude ${lng}.
  
  Use Google Maps and Search to:
  1. Find the precise postal address for this location.
  2. Identify the likely Building Name, Apartment Complex Name, or Business Owner at this exact spot. 
     (e.g., "Prestige Tech Park", "Sunshine Apartments", "McDonald's"). 
     If it's a residential house, check if there is a known house name.
  
  Output a JSON object ONLY (no markdown):
  {
    "address": "Full postal address in ${language}",
    "ownerName": "Name of building/complex/business (or leave empty if unknown)"
  }
  `;

  try {
    const response = await client.models.generateContent({
      model: model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} }, { googleMaps: {} }],
      }
    });

    let resultText = response.text;
    if (!resultText) throw new Error("No response from AI");

    if (resultText.includes("```json")) {
      resultText = resultText.replace(/```json/g, "").replace(/```/g, "");
    } else if (resultText.includes("```")) {
      resultText = resultText.replace(/```/g, "");
    }

    return JSON.parse(resultText);

  } catch (error) {
    console.error("Location Details Error:", error);
    // Fallback to basic coordinate string if AI fails
    return {
      address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      ownerName: ""
    };
  }
};

export const streamChat = async function* (message: string, history: any[], language: string = 'English') {
  // Use gemini-3-pro-preview for the chatbot as per instructions for complex tasks/chats
  const chatModel = "gemini-3-pro-preview";
  
  const chat = client.chats.create({
    model: chatModel,
    history: history,
    config: {
      systemInstruction: `You are Tenant Guardian's AI assistant. You help users understand rental laws, identify red flags in listings, and provide safety advice for renters. Be helpful, concise, and safety-oriented. The user has selected ${language} as their preferred language. Always reply in ${language}.`,
    }
  });

  const result = await chat.sendMessageStream({ message });
  
  for await (const chunk of result) {
    yield chunk.text;
  }
};