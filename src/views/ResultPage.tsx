"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toBlob } from "html-to-image";
import Link from "next/link";
import Image from "next/image";
import { postFile } from "@/lib/postFile";

export default function ResultPage({ type }: { type: string }) {
  const resultRef = useRef<HTMLDivElement>(null);
  const [finalUrl, setFinalUrl] = useState<string | null>(null);
  const [mobileUrl, setMobileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  useEffect(() => {
    const images = JSON.parse(localStorage.getItem("selectedImages") || "[]") as string[];
    setSelectedImages(images);
  }, []);

  useEffect(() => {
    setLoading(true);
    if (!resultRef.current || selectedImages.length !== 4) return;

    const timer = setTimeout(async () => {
      const node = resultRef.current!;
      try {
        // html-to-image를 사용한 캡처
        const blob = await toBlob(node, {
          cacheBust: true,
          style: {
            transform: "scale(1)",
          },

          pixelRatio: 3,
        });

        if (!blob) throw new Error("이미지 캡처 실패");

        const file = new File([blob], "우이미_네컷.png", { type: "image/png" });
        const res = await postFile([file]);

        if (res.code === 2000) {
          setFinalUrl(res.data.imageUrl);
          const encodedUrl = encodeURIComponent(res.data.imageUrl);
          setMobileUrl(`${process.env.NEXT_PUBLIC_VERCEL_URL}/save/${encodedUrl}`);
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
    <div className="h-screen w-full flex  bg-white ">
      {/* 좌측 화면 */}
      <div
        className={`w-[50%] h-screen flex justify-center items-center ${
          type === "stay" ? "bg-[#FFEAF7]" : "bg-[#EAEEFF]"
        }`}
      >
        <div
          ref={resultRef}
          className={`relative  flex flex-col gap-4 sm:gap-5 p-3 sm:p-6 bg-white w-fit shadow-2xl`}
        >
          {selectedImages.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`선택 이미지 ${idx + 1}`}
              className="w-[240px] h-auto transform scale-x-[-1]"
            />
          ))}
          <div className="flex flex-col items-center mb-4">
            <Image src="/photoLogo.svg" alt="Photo Logo" width={64} height={84} />
            <p className="text-center font-line font-normal text-sm">
              {type === "stay" ? (
                <>우리는 오늘도 이별을 미뤘다</>
              ) : (
                <>우리는 이별을 미루기로 했다.</>
              )}
            </p>
          </div>
        </div>
      </div>
      {/* 우측 화면 */}
      <div className="w-[50%] relative h-screen flex justify-center items-center bg-white">
        <Link href="/" className="absolute top-10 left-10 z-10">
          <Image src="/homeLogo.svg" alt="Home" width={180} height={68} />
        </Link>
        <div className="flex flex-col gap-[90px]">
          <div className="font-mapo text-[43px] text-center">
            {type === "stay" ? (
              <p className="">
                우리는
                <br /> 오늘도 <br />
                이별을 미뤘다
              </p>
            ) : (
              <p>
                우리는
                <br />
                이별을 <br />
                미루기로 했다.
              </p>
            )}
          </div>
          {loading && !finalUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-400 border-solid"></div>
            </div>
          )}
          {mobileUrl && (
            <div className=" flex flex-col justify-center gap-10 items-center">
              <QRCodeSVG value={mobileUrl} size={167} />
              <span className=" font-regular text-[28px]">QR코드를 통해 사진 저장</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
