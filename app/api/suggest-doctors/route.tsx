import { openai } from "@/config/OpenAiModel";
import { AIDoctorAgents } from "@/shared/list";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const {notes} = await req.json();
    try {
        const completion = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {role: 'system' , content: JSON.stringify(AIDoctorAgents)},
                { role: "user", content: "User Notes/Symptoms:"+notes+", Depends on user notes and symptoms, please suggest list of doctors, Return object in json only " }
            ],
        })
        // console.log(completion.choices[0].message)
        const rawResp = completion.choices[0].message;
        //@ts-ignore
        const resp = rawResp.content.trim().replace('```json','').replace('```','')
        const jsonres = JSON.parse(resp)
        return NextResponse.json(jsonres);
    }
    catch (e) {
        return NextResponse.json(e);
}

}