"use client";
import { useState } from "react";
import SelectButton from "./SelectButton";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

const defaultOptions = [
  { value: "1", label: "恋愛" },
  { value: "2", label: "仕事" },
  { value: "3", label: "学業" },
  { value: "4", label: "健康" },
  { value: "5", label: "人生" },
  { value: "6", label: "金運" },
  { value: "7", label: "その他" },
];

const FortunetellingForm = () => {
  const [selected, setSelected] = useState(defaultOptions[0]);
  const router = useRouter();

  return (
    <form className="flex flex-col items-center gap-4">
      <div className="w-100 flex flex-col">
        <p>ジャンルを選択してください</p>
        <SelectButton
          selected={selected}
          setSelected={setSelected}
          defaultOptions={defaultOptions}
        />
      </div>
      <textarea
        placeholder="悩みを入力してください(任意)"
        className="p-2 px-5 rounded-md border-gray-500 border-1 focus:outline-none h-32 w-100 bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border-2 border-indigo-400/40 text-indigo-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400 hover:border-indigo-300/60 transition-all duration-300 shadow-xl shadow-indigo-900/30 backdrop-blur-md"
      />
      <button
        type="button"
        className="bg-gradient-to-br from-purple-400 to-pink-600 text-white font-bold py-2 px-4 rounded-lg cursor-pointer mt-4 shadow-xl shadow-pink-900/30 backdrop-blur-md hover:from-purple-500 hover:to-pink-700 hover:scale-110 active:scale-80 duration-300"
        onClick={() => {
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
              y: 0.7,
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
        }}
      >
        おみくじを引く
      </button>
    </form>
  );
};

export default FortunetellingForm;
