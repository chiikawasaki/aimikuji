import FortunetellingForm from "../components/FortunetellingForm";

export default function Home() {
  return (
    <div className="flex flex-col items-center md:p-20 pt-40 " >
      <h1 className="md:text-4xl text-2xl font-bold mb-10">AIみくじへようこそ！</h1>
      <p className="md:text-lg text-sm mb-2">AIがあなたの運勢を占います</p>
      <p className="md:text-lg text-sm mb-10">
        ジャンルと悩みを入力しておみくじを引いてね
      </p>
      <FortunetellingForm />
    </div>
  );
}
