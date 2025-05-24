"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "../api/uploadthing/core";
import html2canvas from "html2canvas";

const FRAME_COLORS: Record<string, string> = {
  white: "#ffffff",
  black: "#000000",
  skyblue: "#87ceeb",
};

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

export default function ResultPage() {
  const resultRef = useRef<HTMLDivElement>(null);
  const [finalUrl, setFinalUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { startUpload } = useUploadThing("photoUploader");

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [frameStyle, setFrameStyle] = useState("white");

  useEffect(() => {
    const images = JSON.parse(localStorage.getItem("selectedImages") || "[]") as string[];
    const frame = localStorage.getItem("frameStyle") || "white";
    setSelectedImages(images);
    setFrameStyle(frame);
  }, []);

  useEffect(() => {
    if (!resultRef.current || selectedImages.length !== 4) return;

    const timer = setTimeout(async () => {
      const canvas = await html2canvas(resultRef.current!, { useCORS: true, scale: 2 });
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b as Blob), "image/png")
      );

      const file = new File([blob], "final.png", { type: "image/png" });
      const res = await startUpload([file]);

      const uploaded = res?.[0];
      if (uploaded?.url) {
        setFinalUrl(uploaded.url);
      }
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedImages]);

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-semibold mb-4">최종 결과</h2>

      <div
        ref={resultRef}
        className="mx-auto flex flex-col gap-5 p-5 rounded-md"
        style={{
          backgroundColor: FRAME_COLORS[frameStyle],
          width: "320px",
          height: "auto",
        }}
      >
        {selectedImages.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`선택 이미지 ${idx + 1}`}
            className="w-full h-auto rounded"
          />
        ))}
        <p className="text-center text-xs text-black mt-2">
          우이미와 함께 <br /> 환경 지켜요
        </p>
      </div>

      {loading && <p className="mt-4">이미지를 캡처하고 업로드 중입니다...</p>}
      {finalUrl && (
        <div className="mt-4 w-full  flex flex-col items-center gap-4 justify-center">
          <p className="mb-2">QR로 결과 공유</p>
          <QRCodeSVG value={finalUrl} size={128} />
        </div>
      )}
    </div>
  );
}
