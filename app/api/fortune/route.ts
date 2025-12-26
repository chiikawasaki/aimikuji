// app/api/fortune/route.ts
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const fortuneSchema = z.object({
  fortune: z.string(), // 運勢（大吉、中吉、吉、末吉、凶、大凶など）
  voiceOfHeaven: z.string(), // 天のみこえ（短く神秘的なメッセージ）
  overallMessage: z.string(), // 全体のメッセージ
  luckyItem: z.string(), // ラッキーアイテム
  analysis: z
    .array(
      z.object({
        item: z.string(), // 項目名（例：恋愛なら「出会い」「誠実さ」などAIが決定）
        advice: z.string(), // その項目への具体的なアドバイス
        score: z.number().min(1).max(5), // 5点満点中何点か
      })
    )
    .length(5), // 常に5つの項目を出力させる
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { genre, worries } = await request.json();

    const prompt = `
    ジャンル: ${genre}
    悩み: ${worries || "特になし"}
    
    上記の内容を参考にして占ってください。
    特に「analysis」の5つの項目は、選択されたジャンル「${genre}」に最も適したものをあなたが選定してください。
  `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction: `
        あなたは凄腕の占い師です。
        以下の構造で厳密にJSONを出力してください：
        - fortune: 運勢 大吉、中吉、小吉、吉、末吉、凶、のいずれかが同じくらいの確率で出るようにしてください
        - voiceOfHeaven: ユーザーの心に響く、短く神秘的な一言メッセージ
        - overallMessage: 全体のメッセージ（悩みに対するアドバイスや、運勢に対するメッセージ）
        - luckyItem: ラッキーアイテム その日持っていると運勢が上がるアイテムを記述してください 単語のみ ジャンル関係なく幅広いアイテムを記述してください
        - analysis: ジャンルに関連する5つの詳細な診断項目。各項目には名前(item)、アドバイス(advice)、5点満点のスコア(score)を含めること。アドバイスは現状の状態と運勢をなるべく詳細に記述してください。

      `,
        thinkingConfig: {
          thinkingBudget: 0,
        },
        responseMimeType: "application/json",
        responseJsonSchema: zodToJsonSchema(fortuneSchema),
      },
    });

    const text = response.text;
    if (!text) throw new Error("APIからの応答が空です");

    const parsedData = JSON.parse(text);
    return NextResponse.json(fortuneSchema.parse(parsedData));
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "占いに失敗しました" }, { status: 500 });
  }
}
