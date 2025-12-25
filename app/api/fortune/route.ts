// app/api/fortune/route.ts
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { genre, worries } = await request.json();

    const prompt = `あなたは凄腕の占い師です。
      ジャンル: ${genre}
      悩み: ${worries || "特になし"}
      について、おみくじ形式（大吉、中吉など）で結果とアドバイスを日本語で生成してください。`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "占いに失敗しました" }, { status: 500 });
  }
}
