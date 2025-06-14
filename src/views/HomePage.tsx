"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function HomePage({ type }: { type: string }) {
  const [progress, setProgress] = useState(0);
  const [captures, setCaptures] = useState<string[]>([]);
  const [seconds, setSeconds] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  // 캡처 로직: 최대 8컷까지만 동작
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || progress >= 8) return;
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, 320, 240);
      const dataUrl = canvas.toDataURL("image/png");
      setCaptures((prev) => [...prev, dataUrl]);
      setProgress((prev) => prev + 1);
    }
  }, [progress]);

  // 1) 비디오 스트림 초기화
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error("카메라 접근 오류:", err));
    } else {
      console.error("getUserMedia를 지원하지 않는 환경입니다.");
    }
  }, []);

  // 2) 블루투스 리모컨(스페이스키, 볼륨키, 미디어키 등) 입력 시 촬영
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === "Space" ||
        e.key === " " ||
        e.key === "VolumeUp" ||
        e.key === "VolumeDown" ||
        e.key === "MediaPlayPause"
      ) {
        e.preventDefault();
        capturePhoto();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [capturePhoto]);

  // 3) 10초마다 자동 촬영
  useEffect(() => {
    if (progress >= 8) return;
    const interval = setInterval(() => {
      capturePhoto();
    }, 10000);
    return () => clearInterval(interval);
  }, [progress, capturePhoto]);

  // 4) 타이머(초) 증가
  useEffect(() => {
    if (progress >= 8) return;
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [progress]);

  // 5) 8컷 촬영 완료 시 저장 후 다음 페이지로 이동
  useEffect(() => {
    if (progress === 8) {
      localStorage.setItem("allCaptures", JSON.stringify(captures));
      router.push(`/check/${type}`);
    }
  }, [progress, captures, router, type]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center">
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            width={1000}
            height={960}
            className="mx-auto mb-6 rounded-2xl shadow-lg"
            style={{ transform: "scaleX(-1)" }}
          />
          {/* 좌측 상단 타이머 */}
          <div className="absolute top-4 left-4 text-8xl text-white bg-pink-400 bg-opacity-50 px-2 py-1 rounded">
            {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, "0")}
          </div>
          {/* 우측 상단 촬영 횟수 */}
          <div className="absolute top-4 right-4 text-8xl text-white bg-pink-400 bg-opacity-50 px-2 py-1 rounded">
            {progress} / 8
          </div>
        </div>
        {progress < 8 && (
          <button
            className="mt-2 px-8 py-3 bg-pink-400 text-white text-lg font-bold rounded-full shadow-lg hover:scale-105 transition"
            onClick={capturePhoto}
          >
            {progress === 0 ? "촬영 시작" : "다음 컷 촬영"}
          </button>
        )}
      </div>
    </div>
  );
}
