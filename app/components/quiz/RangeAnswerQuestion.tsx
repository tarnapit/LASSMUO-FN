"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import "../../styles/range-slider.css";

interface RangeAnswerQuestionProps {
  question: string;
  minValue: number;
  maxValue: number;
  correctRange: {
    min: number;
    max: number;
  };
  unit?: string;
  step?: number;
  labels?: {
    min?: string;
    max?: string;
  };
  onAnswer: (isCorrect: boolean, userAnswer: { min: number; max: number }) => void;
  showResult: boolean;
  userAnswer?: { min: number; max: number } | null;
  disabled?: boolean;
}

export default function RangeAnswerQuestion({
  question,
  minValue,
  maxValue,
  correctRange,
  unit = "",
  step = 1,
  labels,
  onAnswer,
  showResult,
  userAnswer,
  disabled = false
}: RangeAnswerQuestionProps) {
  const [selectedMin, setSelectedMin] = useState(userAnswer?.min ?? Math.round((minValue + maxValue) / 4));
  const [selectedMax, setSelectedMax] = useState(userAnswer?.max ?? Math.round((minValue + maxValue) * 3 / 4));
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    if (userAnswer) {
      setSelectedMin(userAnswer.min);
      setSelectedMax(userAnswer.max);
      setHasAnswered(true);
    }
  }, [userAnswer]);

  // Update CSS variables when slider values change
  useEffect(() => {
    const container = document.querySelector('.range-slider-container') as HTMLElement;
    if (container) {
      const minPercent = ((selectedMin - minValue) / (maxValue - minValue)) * 100;
      const maxPercent = ((selectedMax - minValue) / (maxValue - minValue)) * 100;
      
      container.style.setProperty('--min-percent', `${minPercent}%`);
      container.style.setProperty('--max-percent', `${maxPercent}%`);
      container.style.setProperty('--min-position', `${minPercent}%`);
      container.style.setProperty('--max-position', `${maxPercent}%`);
    }
  }, [selectedMin, selectedMax, minValue, maxValue]);

  const handleSubmitAnswer = () => {
    if (disabled || showResult || hasAnswered) return;
    
    const isCorrect = selectedMin >= correctRange.min && 
                     selectedMin <= correctRange.max && 
                     selectedMax >= correctRange.min && 
                     selectedMax <= correctRange.max;
    
    setHasAnswered(true);
    onAnswer(isCorrect, { min: selectedMin, max: selectedMax });
  };

  const handleMinChange = (value: number) => {
    if (disabled || showResult) return;
    const newMin = Math.min(value, selectedMax);
    setSelectedMin(newMin);
  };

  const handleMaxChange = (value: number) => {
    if (disabled || showResult) return;
    const newMax = Math.max(value, selectedMin);
    setSelectedMax(newMax);
  };

  const isCorrect = showResult && 
                   selectedMin >= correctRange.min && 
                   selectedMin <= correctRange.max && 
                   selectedMax >= correctRange.min && 
                   selectedMax <= correctRange.max;

  const getCorrectRangeIndicator = () => {
    if (!showResult) return null;
    
    const correctMinPercent = ((correctRange.min - minValue) / (maxValue - minValue)) * 100;
    const correctMaxPercent = ((correctRange.max - minValue) / (maxValue - minValue)) * 100;
    
    // Set CSS variables for correct range
    useEffect(() => {
      const indicator = document.querySelector('.correct-range-indicator') as HTMLElement;
      if (indicator) {
        indicator.style.setProperty('--correct-left', `${correctMinPercent}%`);
        indicator.style.setProperty('--correct-width', `${correctMaxPercent - correctMinPercent}%`);
      }
    }, [correctMinPercent, correctMaxPercent]);
    
    return (
      <div className="relative mt-4">
        <div className="text-center mb-2">
          <span className="text-green-400 font-semibold">
            🎯 ช่วงที่ถูกต้อง: {correctRange.min}{unit} - {correctRange.max}{unit}
          </span>
        </div>
        <div className="relative h-2 bg-gray-700 rounded-full">
          <div className="absolute h-full bg-green-500 rounded-full opacity-50 correct-range-indicator" />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Question */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          {question}
        </h2>
        <p className="text-gray-300 text-lg">
          เลือกช่วงค่าที่เหมาะสม ({minValue}{unit} - {maxValue}{unit})
        </p>
      </div>

      {/* Range Display */}
      <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
        <div className="space-y-6">
          {/* Current Selection Display */}
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-white">
              ช่วงที่เลือก: {selectedMin}{unit} - {selectedMax}{unit}
            </div>
            <div className="text-gray-300">
              ความกว้างช่วง: {selectedMax - selectedMin}{unit}
            </div>
          </div>

          {/* Range Slider */}
          <div className="relative px-4 range-slider-container">
            <div className="h-4 rounded-full range-slider-track" />
            
            {/* Min Value Slider */}
            <div className="relative -mt-2">
              <input
                type="range"
                min={minValue}
                max={maxValue}
                step={step}
                value={selectedMin}
                onChange={(e) => handleMinChange(Number(e.target.value))}
                disabled={disabled || showResult}
                aria-label="ค่าต่ำสุด"
                title="ค่าต่ำสุด"
                className="absolute w-full h-4 opacity-0 cursor-pointer"
              />
              <div className="absolute w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg transform -translate-x-1/2 -translate-y-1 range-slider-min" />
            </div>
            
            {/* Max Value Slider */}
            <div className="relative -mt-2">
              <input
                type="range"
                min={minValue}
                max={maxValue}
                step={step}
                value={selectedMax}
                onChange={(e) => handleMaxChange(Number(e.target.value))}
                disabled={disabled || showResult}
                aria-label="ค่าสูงสุด"
                title="ค่าสูงสุด"
                className="absolute w-full h-4 opacity-0 cursor-pointer"
              />
              <div className="absolute w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg transform -translate-x-1/2 -translate-y-1 range-slider-max" />
            </div>

            {/* Labels */}
            <div className="flex justify-between mt-4 text-sm text-gray-400">
              <span>{labels?.min || `${minValue}${unit}`}</span>
              <span>{labels?.max || `${maxValue}${unit}`}</span>
            </div>
          </div>

          {/* Numeric Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ค่าต่ำสุด
              </label>
              <input
                type="number"
                min={minValue}
                max={selectedMax}
                step={step}
                value={selectedMin}
                onChange={(e) => handleMinChange(Number(e.target.value))}
                disabled={disabled || showResult}
                aria-label="ค่าต่ำสุด"
                placeholder="ค่าต่ำสุด"
                title="กรอกค่าต่ำสุดของช่วง"
                className="w-full p-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ค่าสูงสุด
              </label>
              <input
                type="number"
                min={selectedMin}
                max={maxValue}
                step={step}
                value={selectedMax}
                onChange={(e) => handleMaxChange(Number(e.target.value))}
                disabled={disabled || showResult}
                aria-label="ค่าสูงสุด"
                placeholder="ค่าสูงสุด"
                title="กรอกค่าสูงสุดของช่วง"
                className="w-full p-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Submit Button */}
          {!showResult && !hasAnswered && (
            <div className="text-center">
              <button
                onClick={handleSubmitAnswer}
                disabled={disabled}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🎯 ยืนยันคำตอบ
              </button>
            </div>
          )}

          {/* Correct Range Indicator */}
          {getCorrectRangeIndicator()}
        </div>
      </div>

      {/* Result feedback */}
      {showResult && (
        <div className="text-center">
          {isCorrect ? (
            <div className="flex items-center justify-center gap-2 text-green-400 text-xl font-bold">
              <CheckCircle className="w-8 h-8" />
              <span>🎉 เยี่ยม! คุณเลือกช่วงที่ถูกต้อง!</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-red-400 text-xl font-bold">
              <XCircle className="w-8 h-8" />
              <span>💪 ช่วงที่เลือกไม่ถูกต้อง ลองดูข้อมูลอีกครั้งนะ!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
