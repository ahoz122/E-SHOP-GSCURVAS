import React, { useState } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

type SizeOption = "sm" | "md" | "lg";

interface SmNumberButtonProps {
  min?: number;
  max?: number;
  value?: number;
  size?: SizeOption;
  onChange?: (value: number) => void;
}

const sizeStyles = {
  sm: {
    buttonPadding: "px-2 py-1",
    inputWidth: "w-12",
    text: "text-sm",
  },
  md: {
    buttonPadding: "px-3 py-2",
    inputWidth: "w-16",
    text: "text-base",
  },
  lg: {
    buttonPadding: "px-4 py-3",
    inputWidth: "w-20",
    text: "text-lg",
  },
};

const SmNumberButton: React.FC<SmNumberButtonProps> = ({
  min = 0,
  max = Infinity,
  value = 0,
  size = "md",
  onChange,
}) => {
  const [currentValue, setCurrentValue] = useState<number>(value);

  const handleIncrease = () => {
    if (currentValue < max) {
      const newValue = currentValue + 1;
      setCurrentValue(newValue);
      if (onChange) onChange(newValue);
    }
  };

  const handleDecrease = () => {
    if (currentValue > min) {
      const newValue = currentValue - 1;
      setCurrentValue(newValue);
      if (onChange) onChange(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseInt(e.target.value);
    if (!isNaN(parsedValue)) {
      let newValue = parsedValue;
      if (newValue < min) newValue = min;
      if (newValue > max) newValue = max;
      setCurrentValue(newValue);
      if (onChange) onChange(newValue);
    }
  };

  const { buttonPadding, inputWidth, text } = sizeStyles[size];

  return (
    <div className="inline-flex shadow-sm" role="group">
      <button
        type="button"
        onClick={handleDecrease}
        className={`${buttonPadding} bg-gray-200 hover:bg-gray-300 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out cursor-pointer select-none`}
      >
        <AiOutlineMinus />
      </button>
      <input
        type="number"
        value={currentValue}
        onChange={handleInputChange}
        className={`${inputWidth} ${text} text-center bg-white border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      <button
        type="button"
        onClick={handleIncrease}
        className={`${buttonPadding} bg-gray-200 hover:bg-gray-300 border border-gray-300 rounded-r-md border-l-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out cursor-pointer select-none`}
      >
        <AiOutlinePlus />
      </button>
    </div>
  );
};

export default SmNumberButton;
