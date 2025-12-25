"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

const FortuneTellingPage = () => {
  const [clickCount, setClickCount] = useState(0);
  const router = useRouter();
  const maxClicks = 10;
  const progressValue = (clickCount / maxClicks) * 100;

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
        router.push("/");
      }
    }
  };

  return (
    <div className="relative h-screen w-screen">
      <div className="speechBubble !absolute top-70 right-80">
        <p className="text-black">TAP!</p>
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
            className="w-full h-6 rounded-full overflow-hidden bg-gradient-to-r from-indigo-950/50 to-purple-950/50 border-2 border-indigo-400/40 shadow-xl shadow-indigo-900/30 backdrop-blur-md progress-bar"
          >
            {Math.round(progressValue)}%
          </progress>
        </div>
      </div>
    </div>
  );
};

export default FortuneTellingPage;
