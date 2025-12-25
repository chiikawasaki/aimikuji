"use client";
import { useState } from "react";
import SelectButton from "./SelectButton";
import { useRouter } from "next/navigation";

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
          router.push("/fortune-telling");
        }}
      >
        おみくじを引く
      </button>
    </form>
  );
};

export default FortunetellingForm;
