"use client";
import { useEffect, useState } from "react";
import SelectButton from "./SelectButton";
import { useRouter } from "next/navigation";
import Button from "./Button";

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
  const [worries, setWorries] = useState("");
  const [isAlreadyDone, setIsAlreadyDone] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // ページ読み込み時に今日占ったかチェック
    const saved = localStorage.getItem("my_fortune");
    if (saved) {
      const { date } = JSON.parse(saved);
      const today = new Date().toLocaleDateString();
      if (date === today) {
        // setTimeout でラップして、同期的な setState を回避
        setTimeout(() => {
          setIsAlreadyDone(true);
        }, 0);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams({
      genre: selected.label,
      worries: worries,
    });
    if (isAlreadyDone) {
      // すでに占っていれば、そのまま結果ページへ
      const saved = localStorage.getItem("my_fortune");
      if (saved) {
        const { id } = JSON.parse(saved);
        router.push(`/result/${id}`);
      } else {
        router.push("/result");
      }
      return;
    }
    router.push(`/fortune-telling?${params.toString()}`);
  };

  return (
    <form className="flex flex-col items-center gap-4" onSubmit={handleSubmit}>
      <div className="md:w-100 w-80 flex flex-col">
        <p className="md:text-base text-sm">ジャンルを選択してください</p>
        <SelectButton
          selected={selected}
          setSelected={setSelected}
          defaultOptions={defaultOptions}
        />
      </div>
      <textarea
        placeholder="悩みを入力してください(任意)"
        value={worries}
        onChange={(e) => setWorries(e.target.value)}
        className="p-2 px-5 rounded-md border-gray-500 border-1 focus:outline-none h-32 md:w-100 bg-pink-50 border-2 border-pink-400/30 font-medium focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400 hover:border-pink-300/60 transition-all duration-300 shadow-xl shadow-pink-700/10 backdrop-blur-md w-80"
      />
      <Button
        buttonType="submit"
        text={isAlreadyDone ? "今日の結果を見る" : "おみくじを引く"}
      />
      {isAlreadyDone && <p>おみくじは1日に一回までです！</p>}
    </form>
  );
};

export default FortunetellingForm;
