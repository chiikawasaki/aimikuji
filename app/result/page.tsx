"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const ResultPage = () => {
  const [result, setResult] = useState<{
    fortune: string;
    voiceOfHeaven: string;
    overallMessage: string;
    luckyItem: string;
    analysis: { item: string; advice: string; score: number }[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 初期値を true にする
  const router = useRouter();

  useEffect(() => {
    // localStorage を確認
    const saved = localStorage.getItem("my_fortune");

    if (saved) {
      const { fortune, voiceOfHeaven, overallMessage, luckyItem, analysis } =
        JSON.parse(saved);
      // setTimeout でラップして、同期的な setState を回避
      setTimeout(() => {
        setResult({
          fortune,
          voiceOfHeaven,
          overallMessage,
          luckyItem,
          analysis,
        });
      }, 0);
      setTimeout(() => {
        setIsLoading(false);
      }, 0);
    } else {
      // localStorage にデータがない場合、少し待ってもう一度確認する（API待ちを考慮）
      const timer = setTimeout(() => {
        const retrySaved = localStorage.getItem("my_fortune");
        if (retrySaved) {
          const {
            fortune,
            voiceOfHeaven,
            overallMessage,
            luckyItem,
            analysis,
          } = JSON.parse(retrySaved);
          setResult({
            fortune,
            voiceOfHeaven,
            overallMessage,
            luckyItem,
            analysis,
          });
          setIsLoading(false);
        } else {
          // それでもなければ、ガチャを回していないと判断
          setIsLoading(false);
        }
      }, 10000); // 10秒待ってみる

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

  const data = result.analysis.map((item) => ({
    item: item.item,
    score: item.score,
    fullMark: 5,
  }));
  // 3. 結果がある場合の表示
  // 3. 結果がある場合の表示
  return (
    <div className="max-w-8xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">今日の結果</h1>

      {/* Gridコンテナ: スマホは1列、PC(lg以上)は2列 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* --- 左カラム: 運勢とグラフ --- */}
        <div className="space-y-6">
          <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-md shadow-2xl flex flex-col items-center border-2 border-indigo-400/40 shadow-indigo-900">
            <span className="text-indigo-200 text-sm mb-2">今日の運勢</span>
            <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-indigo-300">
              {result.fortune}
            </p>
          </div>

          <div className="h-[400px] p-6 bg-white/10 rounded-2xl backdrop-blur-md shadow-2xl border-2 border-indigo-400/40 shadow-indigo-900">
            <p className="text-lg font-bold mb-2">運勢分析グラフ</p>
            <ResponsiveContainer width="100%" height="90%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                <PolarGrid stroke="#ffffff44" />
                <PolarAngleAxis
                  dataKey="item"
                  stroke="#fff"
                  tick={{ fill: "#fff", fontSize: 12 }}
                />
                <PolarRadiusAxis
                  domain={[0, 5]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  name="運勢"
                  dataKey="score"
                  stroke="#ff88d8"
                  fill="#ff88d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md shadow-2xl border-2 border-indigo-400/40 shadow-indigo-900 flex items-center gap-4">
            <div className="bg-pink-500/20 p-3 rounded-xl text-2xl">🎁</div>
            <div>
              <p className="text-xs text-indigo-200 uppercase tracking-wider">
                Lucky Item
              </p>
              <p className="text-lg font-bold text-pink-100">
                {result.luckyItem}
              </p>
            </div>
          </div>
        </div>
        {/* --- 右カラム: 天のみこえと分析詳細 --- */}
        <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-md shadow-2xl border-2 border-indigo-400/40 shadow-indigo-900 space-y-8">
          <div>
            <p className="text-2xl italic leading-relaxed text-indigo-50 font-bold">
              {result.voiceOfHeaven}
            </p>
            <p className="text-lg italic leading-relaxed text-indigo-50">
              {result.overallMessage}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🔍</span> 詳細分析
            </h3>
            <div className="space-y-6">
              {result.analysis.map((item) => (
                <div key={item.item} className="group">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-pink-200">{item.item}</span>
                  </div>
                  <p className="text-sm text-gray-200 leading-snug">
                    {item.advice}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={() => router.push("/")}
          className="px-8 py-3 bg-gradient-to-r from-pink-600 to-indigo-600 rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
        >
          ← 戻る
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
