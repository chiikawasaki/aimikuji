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
  Text,
} from "recharts";
import Button from "@/components/Button";
import { ChartPieIcon, GiftIcon, MessageCircleIcon } from "lucide-react";

const ResultPage = () => {
  const [result, setResult] = useState<{
    fortune: string;
    voiceOfHeaven: string;
    overallMessage: string;
    luckyItem: string;
    analysis: { item: string; advice: string; score: number }[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 初期値を true にする
  const [isMobile, setIsMobile] = useState(false);
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 640px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMobile(e.matches);
    handler(mql);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // 1. 読み込み中（localStorage確認中）の表示
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-pink-500 rounded-full border-t-transparent mb-4"></div>
        <p>運勢を読み取っています...</p>
      </div>
    );
  }

  // 2. データがなかった場合の表示
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>今日の運勢がまだ占われていません。</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 rounded-lg"
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

  // カスタムラベルコンポーネント（Textコンポーネントを使って簡潔に）
  const renderCustomTick = (props: {
    payload: { value: string };
    x?: number | string;
    y?: number | string;
    textAnchor?: "start" | "middle" | "end" | "inherit";
  }) => (
    <Text
      {...props}
      width={isMobile ? 90 : undefined}
      breakAll
      verticalAnchor="middle"
      fontSize={12}
      fill="#4b2e2c"
    >
      {props.payload.value}
    </Text>
  );

  // 3. 結果がある場合の表示
  // 3. 結果がある場合の表示
  return (
    <div className="max-w-8xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">今日の結果</h1>

      {/* Gridコンテナ: スマホは1列、PC(lg以上)は2列 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* --- 左カラム: 運勢とグラフ --- */}
        <div className="space-y-6">
          <div className="bg-pink-50 p-8 rounded-2xl backdrop-blur-md shadow-lg flex flex-col items-center border-2 border-pink-400/30 shadow-pink-700/30">
            <span className="text-sm mb-2">今日の運勢</span>
            <p className="text-5xl font-extrabold">{result.fortune}</p>
          </div>
          <div className="h-[400px] p-6 bg-pink-50 rounded-2xl backdrop-blur-md shadow-lg border-2 border-pink-400/30 shadow-pink-700/30">
            <div className="flex items-center gap-2">
              <ChartPieIcon />
              <p className="text-lg font-bold">運勢分析グラフ</p>
            </div>
            <ResponsiveContainer width="100%" height="90%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="70%"
                data={data}
                margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
              >
                <PolarGrid stroke="#814f4b" />
                <PolarAngleAxis dataKey="item" tick={renderCustomTick} />
                <PolarRadiusAxis
                  domain={[0, 5]}
                  tickCount={6}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  name="運勢"
                  dataKey="score"
                  stroke="#ff88d8"
                  fill="#ff88d8"
                  fillOpacity={0.6}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="p-4 bg-pink-50 rounded-2xl backdrop-blur-md shadow-lg border-2 border-pink-400/30 shadow-pink-700/30 flex items-center gap-4">
            <div className="bg-pink-500/20 p-3 rounded-xl text-2xl">
              <GiftIcon />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider">Lucky Item</p>
              <p className="text-lg font-bold">{result.luckyItem}</p>
            </div>
          </div>
        </div>
        {/* --- 右カラム: 天のみこえと分析詳細 --- */}
        <div className="bg-pink-50 p-8 rounded-2xl backdrop-blur-md shadow-lg border-2 border-pink-400/30 shadow-pink-700/30 space-y-8">
          <div>
            <p className="text-2xl italic leading-relaxed font-bold mb-4">
              {result.voiceOfHeaven}
            </p>
            <p className="text-lg italic leading-relaxed">
              {result.overallMessage}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="flex items-center gap-2">
                <MessageCircleIcon />
                <span>アドバイス</span>
              </div>
            </h3>
            <div className="space-y-6">
              {result.analysis.map((item) => (
                <div key={item.item} className="group">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold">{item.item}</span>
                  </div>
                  <p className="text-sm leading-snug">{item.advice}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Button
          buttonType="button"
          text="← 戻る"
          onClick={() => router.push("/")}
        />
      </div>
    </div>
  );
};

export default ResultPage;
