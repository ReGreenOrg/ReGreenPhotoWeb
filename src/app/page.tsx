"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [progress, setProgress] = useState(0);
  const [captures, setCaptures] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });
    } else {
      console.error("getUserMedia를 지원하지 않는 환경입니다.");
    }
  }, []);

  const capturePhoto = () => {
    console.log("촬영 버튼 클릭됨");
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, 320, 240);
      const dataUrl = canvas.toDataURL("image/png");
      setCaptures((prev) => [...prev, dataUrl]);
      setProgress((p) => p + 1);
    }
  };

  useEffect(() => {
    if (progress === 8) {
      localStorage.setItem("allCaptures", JSON.stringify(captures));
      router.push("/check");
    }
  }, [progress]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-4xl font-extrabold mb-6 text-pink-600 ">{progress}/8</h1>
      <div className="bg-white rounded-3xl shadow-2xl p-8  flex flex-col items-center">
        <video
          ref={videoRef}
          autoPlay
          width={1000}
          height={960}
          className="mx-auto mb-6 rounded-2xl shadow-lg"
          style={{ transform: "scaleX(-1)" }}
        />
        {progress < 8 && (
          <button
            className="mt-2 px-8 py-3 bg-pink-400  text-white text-lg font-bold rounded-full shadow-lg hover:scale-105 transition"
            onClick={capturePhoto}
          >
            {progress === 0 ? "촬영 시작" : "다음 컷 촬영"}
          </button>
        )}
      </div>
    </div>
  );
}
