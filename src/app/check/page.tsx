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
    <div className="p-4 text-center">
      <h2 className="text-xl font-semibold mb-4">4장의 사진을 선택하세요</h2>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {allImages.map((img, idx) => (
          <Image
            key={idx}
            src={img}
            width={320}
            height={240}
            alt={`shot-${idx}`}
            onClick={() => toggleSelect(img)}
            className={`cursor-pointer border-4 rounded ${
              selectedImages.includes(img) ? "border-blue-500" : "border-transparent"
            }`}
          />
        ))}
      </div>
      <div className="mb-4">
        <label className="mr-2">프레임 색상:</label>
        <select value={frameStyle} onChange={(e) => setFrameStyle(e.target.value)}>
          <option value="white">흰색</option>
          <option value="black">검정</option>
          <option value="skyblue">하늘색</option>
        </select>
      </div>
      <button onClick={handleNext} className="px-6 py-2 bg-green-600 text-white rounded">
        다음
      </button>
    </div>
  );
}
