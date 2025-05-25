"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CheckPage() {
  const router = useRouter();
  const [allImages, setAllImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [frameStyle, setFrameStyle] = useState("white");

  useEffect(() => {
    const raw = localStorage.getItem("allCaptures");
    if (raw) setAllImages(JSON.parse(raw));
  }, []);

  const toggleSelect = (img: string) => {
    setSelectedImages((prev) =>
      prev.includes(img) ? prev.filter((i) => i !== img) : [...prev, img].slice(0, 4)
    );
  };

  const handleNext = () => {
    if (selectedImages.length !== 4) {
      alert("4장을 선택해주세요");
      return;
    }
    localStorage.setItem("selectedImages", JSON.stringify(selectedImages));
    localStorage.setItem("frameStyle", frameStyle);
    router.push("/result");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-blue-100 font-['Cafe24SsurroundAir','sans-serif']">
      <h2 className="text-3xl font-extrabold mb-6 text-pink-600 drop-shadow-lg tracking-wider">
        4장의 사진을 선택하세요
      </h2>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {allImages.map((img, idx) => (
          <Image
            key={idx}
            src={img}
            width={160}
            height={120}
            alt={`shot-${idx}`}
            onClick={() => toggleSelect(img)}
            className={`cursor-pointer border-4 rounded-xl shadow-lg transition-transform duration-200 hover:scale-105 ${
              selectedImages.includes(img)
                ? "border-pink-400 bg-pink-100"
                : "border-gray-200 bg-white"
            }`}
            style={{ transform: "scaleX(-1)" }}
          />
        ))}
      </div>
      <div className="mb-6 flex items-center justify-center gap-4">
        <label className="mr-2 text-lg font-semibold text-blue-500">프레임 색상:</label>
        <select
          value={frameStyle}
          onChange={(e) => setFrameStyle(e.target.value)}
          className="px-3 py-2 rounded-lg border-2 border-blue-200 bg-white text-blue-600 focus:outline-none focus:ring-2 focus:ring-pink-200"
        >
          <option value="white">흰색</option>
          <option value="black">검정</option>
          <option value="skyblue">하늘색</option>
        </select>
      </div>
      <button
        onClick={handleNext}
        className="px-10 py-3 bg-gradient-to-r from-pink-400 to-blue-400 text-white text-lg font-bold rounded-full shadow-lg hover:scale-105 transition"
      >
        다음
      </button>
    </div>
  );
}
