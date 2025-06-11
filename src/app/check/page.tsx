"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CheckPage() {
  const router = useRouter();
  const [allImages, setAllImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("allCaptures");
    if (raw) setAllImages(JSON.parse(raw));
  }, []);

  const toggleSelect = (img: string) => {
    setSelectedImages((prev) =>
      prev.includes(img) ? prev.filter((i) => i !== img) : [...prev, img].slice(0, 4)
    );
  };

  const handleNext = (type: string) => {
    if (selectedImages.length !== 4) {
      alert("4장을 선택해주세요");
      return;
    }

    // 추후 아래와 같이 이미지를 서버에 업로드하는 로직을 추가할 수 있습니다.
    // const images = JSON.parse(localStorage.getItem("selectedImages") || "[]") as string[];

    localStorage.setItem("selectedImages", JSON.stringify(selectedImages));

    if (type === "이별") {
      router.push("/result/bye");
      return;
    }
    if (type === "유지") {
      router.push("/result/stay");
      return;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white ">
      <h2 className="text-3xl font-extrabold mb-6 text-pink-600  tracking-wider">
        4장의 사진을 선택하세요
      </h2>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {allImages.map((img, idx) => (
          <Image
            key={idx}
            src={img}
            width={160 * 2}
            height={120 * 2}
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
        <button
          onClick={() => handleNext("유지")}
          className="px-10 py-3 bg-pink-400  text-white text-lg font-bold rounded-full shadow-lg hover:scale-105 transition"
        >
          유지존
        </button>
        <button
          onClick={() => handleNext("이별")}
          className="px-10 py-3 bg-white text-pink-400 text-lg font-bold rounded-full shadow-lg hover:scale-105 transition"
        >
          이별존
        </button>
      </div>
    </div>
  );
}
