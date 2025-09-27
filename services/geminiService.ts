import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseJsonResponse = (jsonText: string) => {
    try {
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse JSON response:", jsonText, e);
        throw new Error("Received malformed JSON from AI model.");
    }
};


export const getRecipeSuggestions = async (foodItem: string): Promise<Recipe[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are an expert chef specializing in reducing food waste. Generate 3 simple and creative recipe ideas for using up the following ingredient: "${foodItem}". For each recipe, provide a name, a brief description, a list of ingredients, and step-by-step instructions.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        recipes: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: {
                                        type: Type.STRING,
                                        description: "The name of the recipe."
                                    },
                                    description: {
                                        type: Type.STRING,
                                        description: "A brief, enticing description of the recipe."
                                    },
                                    ingredients: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING },
                                        description: "A list of ingredients required for the recipe."
                                    },
                                    instructions: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING },
                                        description: "The step-by-step instructions for preparing the recipe."
                                    }
                                },
                                required: ["name", "description", "ingredients", "instructions"]
                            }
                        }
                    },
                    required: ["recipes"]
                },
            },
        });

        const jsonText = response.text.trim();
        const parsedJson = parseJsonResponse(jsonText);
        
        if (parsedJson && parsedJson.recipes) {
            return parsedJson.recipes;
        } else {
            console.error("Unexpected JSON structure:", parsedJson);
            return [];
        }
    } catch (error) {
        console.error("Error fetching recipe suggestions:", error);
        throw new Error("Could not fetch recipes from AI model.");
    }
};

export const getSmartRecipes = async (foodItems: string[]): Promise<Recipe[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are a creative restaurant chef skilled at minimizing waste. Create 3 creative and cohesive recipe ideas that use all of the following ingredients that are about to expire: ${foodItems.join(', ')}. For each recipe, provide a unique name, a short description, a list of ingredients, and step-by-step instructions.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                     type: Type.OBJECT,
                    properties: {
                        recipes: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING, description: "The name of the recipe." },
                                    description: { type: Type.STRING, description: "A brief description of the recipe." },
                                    ingredients: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING },
                                        description: "A list of ingredients for the recipe."
                                    },
                                    instructions: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING },
                                        description: "The step-by-step instructions to make the recipe."
                                    }
                                },
                                required: ["name", "description", "ingredients", "instructions"]
                            }
                        }
                    },
                    required: ["recipes"]
                },
            },
        });
        const jsonText = response.text.trim();
        const parsedJson = parseJsonResponse(jsonText);

        if (parsedJson && parsedJson.recipes) {
            return parsedJson.recipes;
        } else {
            throw new Error("Unexpected structure for smart recipes.");
        }
    } catch (error) {
        console.error("Error fetching smart recipes:", error);
        throw new Error("Could not fetch smart recipes from AI model.");
    }
};

export const getNearbyFoodBanks = async (location: string): Promise<{ name: string; address: string }[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Find 5 real, major food banks or food rescue organizations near the following location: "${location}". Provide their name and address.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        food_banks: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING, description: "The name of the food bank." },
                                    address: { type: Type.STRING, description: "The full address of the food bank." }
                                },
                                required: ["name", "address"]
                            }
                        }
                    },
                    required: ["food_banks"]
                },
            },
        });
        const jsonText = response.text.trim();
        const parsedJson = parseJsonResponse(jsonText);
        
        if (parsedJson && parsedJson.food_banks) {
            return parsedJson.food_banks;
        } else {
             throw new Error("Unexpected structure for food banks.");
        }
    } catch (error) {
        console.error("Error fetching nearby food banks:", error);
        throw new Error("Could not fetch food banks from AI model.");
    }
};