"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ResultPage = () => {
  const [result, setResult] = useState<{
    fortune: string;
    voiceOfHeaven: string;
    analysis: { item: string; advice: string; score: number }[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 初期値を true にする
  const router = useRouter();

  useEffect(() => {
    // localStorage を確認
    const saved = localStorage.getItem("my_fortune");

    if (saved) {
      const { fortune, voiceOfHeaven, analysis } = JSON.parse(saved);
      // setTimeout でラップして、同期的な setState を回避
      setTimeout(() => {
        setResult({ fortune, voiceOfHeaven, analysis });
      }, 0);
      setTimeout(() => {
        setIsLoading(false);
      }, 0);
    } else {
      // localStorage にデータがない場合、少し待ってもう一度確認する（API待ちを考慮）
      const timer = setTimeout(() => {
        const retrySaved = localStorage.getItem("my_fortune");
        if (retrySaved) {
          const { fortune, voiceOfHeaven, analysis } = JSON.parse(retrySaved);
          setResult({ fortune, voiceOfHeaven, analysis });
          setIsLoading(false);
        } else {
          // それでもなければ、ガチャを回していないと判断
          setIsLoading(false);
        }
      }, 5000); // 1秒だけ待ってみる

      return () => clearTimeout(timer);
    }
  }, []);

  // 1. 読み込み中（localStorage確認中）の表示
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <div className="animate-spin h-10 w-10 border-4 border-pink-500 rounded-full border-t-transparent mb-4"></div>
        <p>運勢を読み取っています...</p>
      </div>
    );
  }

  // 2. データがなかった場合の表示
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <p>今日の運勢がまだ占われていません。</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 bg-pink-600 px-4 py-2 rounded-lg"
        >
          おみくじを引きに行く
        </button>
      </div>
    );
  }

  // 3. 結果がある場合の表示
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-white">
      <h1 className="text-2xl font-bold mb-6">今日の結果</h1>
      <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md max-w-lg whitespace-pre-wrap shadow-2xl">
        <p>運勢: {result.fortune}</p>
        <p>天のみこえ: {result.voiceOfHeaven}</p>
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">分析</h3>
          <ul className="list-disc pl-5">
            {result.analysis.map((item) => (
              <li key={item.item}>
                <span className="font-bold">{item.item}:</span> {item.advice} (
                {item.score}/5)
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button
        onClick={() => router.push("/")}
        className="mt-8 text-pink-300 hover:text-pink-100 transition-colors"
      >
        ← 戻る
      </button>
    </div>
  );
};

export default ResultPage;
