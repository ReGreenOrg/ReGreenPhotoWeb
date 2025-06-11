"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { toBlob } from "html-to-image";
import { motion } from "framer-motion";

const FRAME_COLORS: Record<string, string> = {
  white: "bg-[#ffffff]",
  black: "bg-[#000000]",
  skyblue: "bg-[#87ceeb]",
};

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

export default function ResultPage({ type }: { type: string }) {
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
      const node = resultRef.current!;
      try {
        // ✅ html-to-image를 사용한 캡처
        const blob = await toBlob(node, {
          cacheBust: true,
          style: {
            transform: "scale(1)", // 필요시 이미지 뒤틀림 방지
          },
        });

        if (!blob) throw new Error("이미지 캡처 실패");

        const file = new File([blob], "final.png", { type: "image/png" });
        const res = await startUpload([file]);

        const uploaded = res?.[0];
        if (uploaded?.url) {
          setFinalUrl(uploaded.url);
        }
      } catch (err) {
        console.error("이미지 업로드 실패:", err);
      } finally {
        setLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedImages]);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-blue-100  p-2">
      <div className="flex justify-center items-center gap-32">
        <motion.h2
          className="text-3xl  mt-4 font-extrabold mb-6 text-pink-400 "
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          우이미 네컷
        </motion.h2>
        <motion.a
          href="/"
          className="text-lg font-semibold text-pink-400 underline transition-colors"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        >
          홈으로
        </motion.a>
      </div>
      {finalUrl && (
        <motion.div
          className=" left-3 top-3 flex justify-center gap-10 items-center z-10 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
        >
          <QRCodeSVG value={finalUrl} size={64} />
          <span className="mt-1 text-md font-bold">큐알로 인식해 이미지를 다운하세요!</span>
        </motion.div>
      )}
      <motion.div
        ref={resultRef}
        className={`relative mx-auto flex flex-col gap-4 sm:gap-5 p-3 sm:p-6 rounded-3xl shadow-2xl ${FRAME_COLORS[frameStyle]}`}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      >
        {selectedImages.map((src, idx) => (
          <motion.img
            key={idx}
            src={src}
            alt={`선택 이미지 ${idx + 1}`}
            className="w-full h-auto rounded-xl"
            style={{ transform: "scaleX(-1)" }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 + idx * 0.15, ease: "easeOut" }}
          />
        ))}
        <motion.p
          className="text-center text-base font-semibold text-pink-500 mt-2 tracking-wide drop-shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
        >
          {type === "stay" ? (
            <>
              우리는
              <br />
              오늘도
              <br />
              이별을 미뤘다
            </>
          ) : (
            <>
              우리는
              <br />
              이별을
              <br />
              미루기로 했다.
            </>
          )}
        </motion.p>
      </motion.div>
      {loading && <p className="mt-4">이미지를 캡처하고 업로드 중입니다...</p>}
    </div>
  );
}
