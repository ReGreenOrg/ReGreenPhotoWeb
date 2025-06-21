"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const SavePage = ({ url }: { url: string }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSharing, setIsSharing] = useState(false);

  const handleDownloadImage = () => {
    if (!file) {
      console.log("파일이 없습니다.");
      return;
    }
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "우이미_네컷.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleShare = async () => {
    if (isSharing) {
      console.log("이미 공유 중입니다. 중복 방지.");
      return;
    }
    if (!file) {
      console.log("파일이 없습니다.");
      return;
    }

    if (!navigator.canShare || !navigator.canShare({ files: [file] })) {
      alert("파일 공유를 지원하지 않는 브라우저입니다.");
      return;
    }

    try {
      setIsSharing(true);
      console.log("공유 시작:", file);
      await navigator.share({
        title: "우이미",
        text: "우이미와 함께한 순간을 공유해보세요!",
        files: [file],
      });
    } catch (err) {
      console.error("공유 실패:", err);
    } finally {
      setIsSharing(false);
    }
  };

  const handleGoToWooimi = () => {
    window.location.href = "https://wooimi.com";
  };

  const handleGoToInstagram = () => {
    window.open("https://instagram.com/wooimi_", "_blank");
  };

  useEffect(() => {
    if (!url) return;

    setIsLoading(true);
    const proxyUrl = `/api/proxy/image?url=${encodeURIComponent(url)}`;

    fetch(proxyUrl)
      .then((res) => {
        if (!res.ok) throw new Error("프록시 요청 실패");
        return res.blob();
      })
      .then((blob) => {
        const file = new File([blob], "우이미_네컷.png", { type: "image/png" });
        setFile(file);
      })
      .catch((err) => {
        console.error("프록시 이미지 로드 실패:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [url]);

  return (
    <div className="h-screen flex flex-col justify-between bg-white">
      {/* 상단 버튼 영역 */}
      <div className="flex justify-center gap-3 flex-wrap items-center p-4 bg-gray-100 shadow-md">
        <button
          onClick={handleGoToWooimi}
          className="px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          우이미 이용해보기
        </button>
        <button
          onClick={handleGoToInstagram}
          className="px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          우이미 인스타그램
        </button>
        <button
          disabled={isLoading}
          onClick={handleDownloadImage}
          className="flex items-center px-4 py-2 gap-2 bg-[#A6FFA5] text-[#02A100] rounded-md hover:bg-[#92f892] disabled:opacity-50"
        >
          <Image src="/downloadIcon.svg" alt="다운로드 아이콘" width={20} height={20} />
          다운로드
        </button>
        <button
          disabled={isSharing || isLoading}
          onClick={handleShare}
          className="flex items-center px-4 py-2 gap-2 bg-[#FF759F] text-[#B90D4C] rounded-md hover:bg-[#f96b95] disabled:opacity-50"
        >
          <Image src="/shareIcon.svg" alt="공유 아이콘" width={20} height={20} />
          공유하기
        </button>
      </div>

      {/* 하단 이미지 미리보기 영역 */}
      <div className="flex justify-center items-center p-4 bg-gray-50 ">
        {isLoading ? (
          <div className="w-[320px] h-[240px] bg-gray-200 animate-pulse rounded-md shadow-inner" />
        ) : file ? (
          <Image
            src={url}
            alt="우이미 이미지 미리보기"
            width={320}
            height={240}
            className="rounded-md shadow-lg border border-gray-300"
          />
        ) : (
          <p className="text-red-500">이미지를 불러올 수 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default SavePage;
