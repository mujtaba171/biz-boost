import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MenuRequest, MenuResponse, AppointmentRequest, AppointmentResponse, EventRequest, EventResponse, SeasonalDishSuggestion } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const menuSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    menuDescription: { type: Type.STRING, description: "A short, appealing description for a menu." },
    socialMediaCaption: { type: Type.STRING, description: "A catchy social media post with emojis and hashtags." },
    imageSuggestion: { type: Type.STRING, description: "A text description of a visual concept for the dish." },
    nutritionalInfo: { type: Type.STRING, description: "Estimated calories and key macros (e.g., 'Approx. 450kcal, High Protein')." },
    promotionalOffer: { type: Type.STRING, description: "A catchy promotional discount phrase (e.g., 'Buy 1 Get 1 Free on Fridays!')." },
  },
  required: ["menuDescription", "socialMediaCaption", "imageSuggestion", "nutritionalInfo", "promotionalOffer"],
};

const seasonalSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    dishName: { type: Type.STRING, description: "Name of the seasonal dish." },
    ingredients: { type: Type.STRING, description: "List of key ingredients." },
    description: { type: Type.STRING, description: "Why it fits the current season." },
  },
  required: ["dishName", "ingredients", "description"],
};

const appointmentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    bookingResponse: { type: Type.STRING, description: "Polite booking confirmation message." },
    reminderMessage: { type: Type.STRING, description: "Follow-up reminder message." },
    reschedulingOption: { type: Type.STRING, description: "A polite message offering rescheduling options." },
    upsellSuggestion: { type: Type.STRING, description: "A subtle suggestion for an additional service." },
    sentimentAnalysis: { type: Type.STRING, description: "Analysis of the customer's tone if provided (e.g., 'Neutral', 'Frustrated')." },
  },
  required: ["bookingResponse", "reminderMessage", "reschedulingOption", "upsellSuggestion", "sentimentAnalysis"],
};

const eventSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    socialMediaCaption: { type: Type.STRING, description: "Engaging caption for social media." },
    bannerText: { type: Type.STRING, description: "Text layout for a poster or banner." },
    imageSuggestion: { type: Type.STRING, description: "Image or illustration idea fitting the event theme." },
    hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of trending/relevant hashtags." },
    engagementQuestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Questions to ask audience to drive engagement." },
    videoScriptConcept: { type: Type.STRING, description: "A short concept or script for a promo video (max 2 sentences)." },
  },
  required: ["socialMediaCaption", "bannerText", "imageSuggestion", "hashtags", "engagementQuestions", "videoScriptConcept"],
};

export const generateMenuContent = async (data: MenuRequest): Promise<MenuResponse> => {
  const prompt = `
    Create menu content for a restaurant dish.
    Ingredients: ${data.ingredients}
    Type: ${data.dishType}
    Cuisine: ${data.cuisine || 'Not specified'}
    Notes: ${data.notes || 'None'}
    Language: ${data.language || 'English'}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: menuSchema,
      systemInstruction: "You are an expert restaurant marketing assistant. Create attractive menu descriptions, nutritional estimates, and promotional offers. Ensure the output language matches the requested Language.",
    }
  });

  return JSON.parse(response.text || '{}') as MenuResponse;
};

export const generateSeasonalSuggestion = async (): Promise<SeasonalDishSuggestion> => {
  const prompt = "Suggest a trending seasonal dish for a restaurant menu based on the current time of year.";
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: seasonalSchema,
      systemInstruction: "You are a creative chef. Suggest a unique, popular seasonal dish.",
    }
  });

  return JSON.parse(response.text || '{}') as SeasonalDishSuggestion;
}

export const generateAppointmentContent = async (data: AppointmentRequest): Promise<AppointmentResponse> => {
  const prompt = `
    Create booking messages for a small business.
    Business Type: ${data.businessType}
    Service: ${data.service}
    Time: ${data.time}
    Customer Language Preference: ${data.language}
    Customer Message Context (if any): ${data.customerMessage || 'None'}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: appointmentSchema,
      systemInstruction: "You are a professional appointment booking assistant. Analyze customer sentiment if a message is provided. Generate polite confirmation, reminder, rescheduling, and upsell messages in the requested language.",
    }
  });

  return JSON.parse(response.text || '{}') as AppointmentResponse;
};

export const generateEventContent = async (data: EventRequest): Promise<EventResponse> => {
  const prompt = `
    Create promotional content for a local event.
    Event Name: ${data.eventName}
    Type: ${data.eventType}
    Date/Time: ${data.dateTime}
    Location: ${data.location}
    Highlights: ${data.highlights || 'None'}
    Target Audience: ${data.targetAudience || 'General Public'}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: eventSchema,
      systemInstruction: "You are an event promoter. Create exciting social media captions, banner texts, hashtags, and engagement hooks suitable for the target audience.",
    }
  });

  return JSON.parse(response.text || '{}') as EventResponse;
};

// Bonus: Generate an actual image from the suggestion
export const generateVisualFromSuggestion = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });
    
    // Find image part
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (e) {
    console.error("Image generation failed", e);
    return null;
  }
}