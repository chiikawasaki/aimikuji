interface ButtonProps {
  buttonType?: "submit" | "button" | "reset";
  text: string;
  onClick?: () => void;
}

const Button = ({ buttonType = "button", text, onClick }: ButtonProps) => {
  return (
    <button
      type={buttonType}
      className="bg-pink-700 text-white font-bold py-3 px-5 md:py-4 md:px-6 rounded-full cursor-pointer mt-4 shadow-xl shadow-pink-900/30 backdrop-blur-md hover:from-purple-500 hover:to-pink-700 hover:scale-110 active:scale-80 duration-300 text-sm md:text-base w-full max-w-xs"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
