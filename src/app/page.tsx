"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-pink-100 px-4 py-8">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-16 flex flex-col items-center space-y-8 max-w-xl w-full border border-pink-200">
        <h1 className="text-5xl font-extrabold text-pink-500 text-center tracking-tight leading-tight drop-shadow-md">
          우이미 네컷사진
        </h1>
        <p className="text-center text-xl text-gray-800 leading-relaxed">
          <span className="font-semibold text-pink-600">퀴즈 푸느라 고생하셨어요!</span> <br />
          이별을 막아내셨나요?
        </p>
        <p className="text-center text-lg text-gray-600 leading-relaxed">
          우이미와 함께한 순간을 <span className="font-semibold text-pink-500">네컷</span>으로
          남겨보세요!
          <br />
          <span className="font-medium">10초마다 한 장씩 자동 촬영 🎞️</span> <br />
          또는, <span className="underline decoration-pink-400 decoration-2">직접 촬영</span>도
          가능해요!
        </p>

        <div className="flex space-x-6 mt-4">
          <button
            className="px-8 py-4 bg-gradient-to-r from-pink-400 to-pink-500 text-2xl text-white font-bold rounded-full shadow-xl hover:scale-110 hover:brightness-110 transition-transform duration-200"
            onClick={() => router.push("/home/bye")}
          >
            이별존
          </button>
          <button
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-2xl text-white font-bold rounded-full shadow-xl hover:scale-110 hover:brightness-110 transition-transform duration-200"
            onClick={() => router.push("/home/stay")}
          >
            유지존
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
