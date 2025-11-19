import OpenAI from "openai";

export const openai = new OpenAI({
    apiKey: process.env.OPEN_ROUTER_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});