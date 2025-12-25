import FortunetellingForm from "../components/FortunetellingForm";

export default function Home() {
  return (
    <div className="flex flex-col items-center p-20">
      <h1 className="text-4xl font-bold mb-10">AIみくじへようこそ！</h1>
      <p className="text-lg mb-2">AIがあなたの運勢を占います</p>
      <p className="text-lg mb-10">
        ジャンルと悩みを入力しておみくじを引いてね
      </p>
      <FortunetellingForm />
    </div>
  );
}
