
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { HealthProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getBaseContext = (profile: HealthProfile) => {
  return `[USER PROFILE]
  Name: ${profile.name || 'Anonymous'}
  Age: ${profile.age}
  Gender: ${profile.gender}
  Weight: ${profile.weight}kg
  Existing Conditions: ${profile.conditions.join(', ') || 'None'}
  Current Medications: ${profile.medications.join(', ') || 'None'}
  Allergies: ${profile.allergies.join(', ') || 'None'}
  
  [STRICT PROTOCOL]
  Language: Must respond entirely in ${profile.language}.
  Bias Resistance: Neutral, evidence-based, culturally sensitive.`;
};

export const analyzeMedicalImage = async (base64Image: string, mimeType: string, prompt: string, profile: HealthProfile) => {
  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: mimeType,
    },
  };
  const textPart = {
    text: `${prompt}. ${getBaseContext(profile)}. Analyze this document/image and provide medical insights, ensuring no bias and strictly following the user's language preference.`
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: [imagePart, textPart] },
    config: {
      systemInstruction: "You are the 'Drishti' module of Aarogya-Vedha. You specialize in medical vision analysis. Your task is to extract data from prescriptions, lab reports, or medical photos with extreme precision. Identify medications, dosages, lab values, and potential warnings. Be unbiased and culturally sensitive."
    }
  });

  return response.text;
};

export const getDiagnosis = async (symptoms: string, profile: HealthProfile) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Symptom Report: "${symptoms}". ${getBaseContext(profile)}`,
    config: {
      systemInstruction: "You are Dr. Vedha. Specialist in high-precision medical diagnostics. Synthesis of Western medicine and indigenous holistic wisdom. Bias-neutral. Safety first."
    }
  });
  return response.text;
};

export const getDietaryAdvice = async (query: string, profile: HealthProfile) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Dietary Inquiry: "${query}". ${getBaseContext(profile)}`,
    config: {
      systemInstruction: "You are Aarogya Aahar. Expert clinical nutritionist specializing in local/indigenous food systems."
    }
  });
  return response.text;
};

export const getMedicationInfo = async (query: string, profile: HealthProfile) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Inquiry: "${query}". ${getBaseContext(profile)}`,
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: "You are Bheshaj Guru. Master of Pharmacology using real-time grounding to verify interactions and safety."
    }
  });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const generateSpeech = async (text: string, language: string = 'English') => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Read this medical diagnosis in ${language}: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};
