"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const DEFAULT_IMG = "/random/default.png";
const FIRST_IMG = "/random/first.png";
const SECOND_IMG = "/random/second.png";
const THIRD_IMG = "/random/third.png";

type Prize = "first" | "second" | "third";

const PRIZE_TEXT: Record<Prize, string> = {
  first: "🎉 1등! 괄사테라피 스크럽 샴푸바 제오숯 95g 당첨!",
  second: "🎁 2등! 미놉 미니 지갑 당첨!",
  third: "🌿 3등! 우이미 로고 각인 대나무 칫솔 당첨!",
};

const getRandomPrize = (modifier: number = 1): Prize => {
  const first = parseFloat(process.env.NEXT_PUBLIC_RANDOM_RATIO_FIRST || "0.1") * modifier;
  const second = parseFloat(process.env.NEXT_PUBLIC_RANDOM_RATIO_SECOND || "0.2") * modifier;

  const rand = Math.random();
  if (rand < first) return "first";
  if (rand < first + second) return "second";
  return "third";
};

const saveToLocalStorage = (prize: Prize) => {
  const key = prize;
  const current = parseInt(localStorage.getItem(key) || "0", 10);
  localStorage.setItem(key, (current + 1).toString());
};

const RandomPage = () => {
  const [imageSrc, setImageSrc] = useState(DEFAULT_IMG);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shine, setShine] = useState(false);
  const [resultText, setResultText] = useState("");

  const handleDraw = (modifier: number) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setShine(true);
    setResultText("");
    setImageSrc(DEFAULT_IMG);

    setTimeout(() => {
      const result = getRandomPrize(modifier);
      saveToLocalStorage(result);

      setImageSrc(result === "first" ? FIRST_IMG : result === "second" ? SECOND_IMG : THIRD_IMG);
      setResultText(PRIZE_TEXT[result]);
      setShine(false);
      setIsAnimating(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 gap-10 bg-white text-center">
      {resultText ? (
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800"
        >
          {resultText}
        </motion.h1>
      ) : isAnimating ? (
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold text-gray-500"
        >
          추첨 중...
        </motion.h1>
      ) : null}

      <div className="relative w-64 h-64">
        <AnimatePresence>
          {shine && (
            <motion.div
              key="shine"
              initial={{ opacity: 0, scale: 1 }}
              animate={{
                opacity: [0, 1, 0.8, 0],
                scale: [1, 1.4, 1.1, 1],
                rotate: [0, 15, -15, 0],
              }}
              transition={{ duration: 2 }}
              className="absolute inset-0 z-10 rounded-[32px] bg-white mix-blend-screen blur-sm"
            />
          )}
        </AnimatePresence>
        <Image
          src={imageSrc}
          alt="추첨 이미지"
          fill
          className="object-contain rounded-[32px] z-0"
        />
      </div>

      <div className="flex flex-col gap-4 mt-6 w-full max-w-xs">
        <button
          className="py-3 rounded-lg  border-gray-300 bg-gray-100 hover:bg-gray-100 transition"
          onClick={() => handleDraw(1)}
        >
          🎲 기본 추첨
        </button>
        <button
          className="py-3 rounded-lg border border-green-400 bg-green-50 hover:bg-green-100 transition"
          onClick={() => handleDraw(1.2)}
        >
          📸 인스타 완료 (확률 UP)
        </button>
        <button
          className="py-3 rounded-lg border border-purple-400 bg-purple-50 hover:bg-purple-100 transition"
          onClick={() => handleDraw(1.5)}
        >
          📊 인스타, 설문 완료 (확률 UP UP)
        </button>
        <button
          className="py-3 rounded-lg border border-red-400 bg-red-50 hover:bg-red-100 transition"
          onClick={() => handleDraw(2)}
        >
          🔥 인스타, 설문, 가입 완료 (확률 UP UP UP)
        </button>
      </div>
    </div>
  );
};

export default RandomPage;
