"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";

const FortuneTellingPage = () => {
  const [clickCount, setClickCount] = useState(0);
  const [apiFinished, setApiFinished] = useState(false);
  const [fortuneId, setFortuneId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const maxClicks = 10;
  const progressValue = (clickCount / maxClicks) * 100;

  useEffect(() => {
    const fetchFortune = async () => {
      const genre = searchParams?.get("genre");
      const worries = searchParams?.get("worries");

      try {
        const response = await fetch("/api/fortune", {
          method: "POST",
          body: JSON.stringify({
            genre: genre || "その他",
            worries: worries || "特になし",
          }),
        });
        const data = await response.json();

        setFortuneId(data.id);

        // localStorageに今日の日付と結果を保存
        const fortuneData = {
          date: new Date().toLocaleDateString(),
          ...data,
        };
        localStorage.setItem("my_fortune", JSON.stringify(fortuneData));

        setApiFinished(true); // API完了フラグ
      } catch (error) {
        console.error(error);
      }
    };

    fetchFortune();
  }, [searchParams]);

  const handleConfetti = () => {
    confetti({
      // パーティクルの数（デフォルト50)
      particleCount: 200,
      // 発射角度(デフォルト90度)
      angle: 360,
      // 発射範囲(デフォルト45度)
      spread: 360,
      // 失速具合 デフォルト0.9
      // decay: 0.8,
      //重力 (0-1)
      gravity: 0.2,
      // default:0 数値を上げると横に流れる
      drift: 0,
      // confettiが動く長さ (default: 200)
      ticks: 200,
      origin: {
        x: 0.5,
        y: 0.5,
      },
      // 紙吹雪の色を指定。配列でいくつも指定できる
      colors: ["#e13496", "#d262d3", "#d658c2", "#2f125f"],
      // 紙吹雪の形を指定
      shapes: ["square", "circle"],
      // 紙吹雪のサイズを指定
      scalar: 0.8,
      // z-indexを指定(default:100)
      zIndex: 100,
    });
  };

  const handleClick = () => {
    if (clickCount < maxClicks) {
      const nextCount = clickCount + 1;
      setClickCount(nextCount);
      if (nextCount >= maxClicks) {
        handleConfetti();
        // 10回クリックしたら次の画面に遷移
        if (fortuneId) {
          router.push(`/result/${fortuneId}`);
        } else {
          router.push("/result");
        }
      }
    }
  };

  return (
    <div className="relative h-screen w-screen">
      {/* 吹き出し: デスクトップでは右側、モバイルでは上部（CSSで制御） */}
      <div className="speechBubble !absolute top-30 left-40 md:right-80 md:top-70 md:left-auto">
        <p className="text-center font-bold">TAP!</p>
      </div>
      <div className="flex flex-col justify-center items-center h-screen gap-8 px-4">
        <Image
          src="/images/gachapon.png"
          alt="fortune-telling"
          width={300}
          height={300}
          className="cursor-pointer transition-transform duration-150 active:scale-110 hover:scale-105"
          onClick={handleClick}
        />
        <div className="w-full max-w-md">
          <progress
            id="file"
            max="100"
            value={progressValue}
            className="w-full h-6 rounded-full overflow-hidden bg-pink-500/10 border-2 border-pink-400/40 progress-bar"
          >
            {Math.round(progressValue)}%
          </progress>
        </div>
      </div>
    </div>
  );
};

export default FortuneTellingPage;
