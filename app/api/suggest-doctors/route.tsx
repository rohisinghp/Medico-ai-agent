import { geminiModel } from "@/config/OpenAiModel";
import { AIDoctorAgents } from "@/shared/list";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { notes } = await req.json();
    try {
        const prompt = `
            ${JSON.stringify(AIDoctorAgents)}
            User Notes/Symptoms: ${notes}
            Based on user notes and symptoms, suggest a list of doctors.
            Return JSON only, no extra text.
        `
        const result = await geminiModel.generateContent(prompt);
        const text = result.response.text();

        // Clean and parse response
        const cleaned = text.trim()
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim()

        const jsonRes = JSON.parse(cleaned);
        return NextResponse.json(jsonRes);

    } catch (e: any) {
        console.error("API Error:", e)
        return NextResponse.json(
            { error: e?.message || "Something went wrong" },
            { status: 500 }
        )
    }
}