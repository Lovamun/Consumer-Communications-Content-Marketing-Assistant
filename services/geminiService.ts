
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { BrandDNA, CampaignType, ToneSettings } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const toneToString = (settings: ToneSettings) => {
  return `Formality: ${settings.formality}/100, Enthusiasm: ${settings.enthusiasm}/100, Humour: ${settings.humour}/100`;
};

export const extractBrandDNA = async (input: string): Promise<BrandDNA> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following brand information and extract a "Business DNA Profile" in JSON format.
    Input: ${input}
    
    The response must strictly follow this JSON schema:
    {
      "identity": {
        "colors": { "primary": "string (hex)", "secondary": "string (hex)", "accent": "string (hex)" },
        "fonts": "string",
        "tone": "string",
        "toneSettings": { "formality": "number", "enthusiasm": "number", "humour": "number" }
      },
      "visualStyle": {
        "imageStyle": "string",
        "consistencyRules": "string"
      },
      "messaging": {
        "valueProp": "string",
        "ctas": ["string"],
        "contact": { "website": "string", "email": "string", "phone": "string" }
      },
      "keywords": ["string"]
    }
    Ensure UK spelling and marketing nuances.`,
    config: {
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text);
};

export const generateCampaignIdeas = async (dna: BrandDNA, goal: CampaignType, prompt?: string) => {
  const ai = getAI();
  const basePrompt = prompt || `Generate ${goal} campaign ideas for the UK market.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on this Brand DNA: ${JSON.stringify(dna)} and the goal of ${goal}, generate 3 campaign theme ideas.
    Context: ${basePrompt}
    Advanced Tone: ${toneToString(dna.identity.toneSettings)}
    Return an array of objects: [{ "theme": "string", "angle": "string", "hook": "string" }]`,
    config: {
      responseMimeType: "application/json",
    }
  });

  return JSON.parse(response.text);
};

export const generateAssetContent = async (dna: BrandDNA, theme: string, platform: string, goal: CampaignType) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate marketing copy for ${platform} based on:
    Theme: ${theme}
    Campaign Goal: ${goal}
    Advanced Tone Settings: ${toneToString(dna.identity.toneSettings)}
    Target: UK Audience
    
    Return JSON: { "headline": "string", "body": "string", "caption": "string", "imagePrompt": "string" }`,
    config: {
      responseMimeType: "application/json",
    }
  });

  return JSON.parse(response.text);
};

export const generateImage = async (prompt: string, aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" = "1:1") => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: { aspectRatio }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const generateVideo = async (imageB64: string, prompt: string) => {
  const ai = getAI();
  const cleanB64 = imageB64.replace(/^data:image\/(png|jpeg);base64,/, '');
  
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    image: {
      imageBytes: cleanB64,
      mimeType: 'image/png'
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
