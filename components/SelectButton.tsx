"use client";
import { useEffect, useRef, useState } from "react";

interface SelectButtonProps {
  selected: { value: string; label: string };
  setSelected: (selected: { value: string; label: string }) => void;
  defaultOptions: { value: string; label: string }[];
}

const SelectButton = ({
  selected,
  setSelected,
  defaultOptions,
}: SelectButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div ref={dropdownRef} className="relative w-full mt-2 max-w-md mb-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 rounded-xl bg-pink-50 border-2 border-pink-400/30 shadow-xl shadow-pink-700/10 backdrop-blur-md cursor-pointer flex justify-between"
      >
        <span>{selected.label}</span>
        {/* MEMO:矢印マーク 開いているときは180度回転 */}
        <svg
          className={`w-5 h-5 text-pink-300 transition-transform duration-200 ${
            isOpen && "rotate-180"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 rounded-xl bg-pink-50 border-2 border-pink-300/30 shadow-xl shadow-pink-700/10 backdrop-blur-md overflow-hidden">
          {defaultOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
              }}
              className={`w-full p-4 text-left transition-all duration-200 cursor-pointer ${
                selected.value === option.value
                  ? "bg-pink-700/20 font-semibold"
                  : "hover:bg-pink-700/20"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectButton;
