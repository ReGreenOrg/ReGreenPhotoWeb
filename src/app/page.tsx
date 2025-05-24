"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [progress, setProgress] = useState(0);
  const [captures, setCaptures] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
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
    <div className="text-center py-8">
      <h1 className="text-2xl font-bold mb-4">촬영 중: {progress}/8</h1>
      <video ref={videoRef} autoPlay width={800} height={800} className="mx-auto border" />
      {progress < 8 && (
        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded" onClick={capturePhoto}>
          촬영 시작
        </button>
      )}
    </div>
  );
}
