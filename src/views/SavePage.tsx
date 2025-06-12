"use client";
import React from "react";
import Image from "next/image";

const SavePage = ({ url }: { url: string }) => {
  const handleDownloadImage = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "우이미_이미지.png";
    link.click();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "우이미",
        text: "우이미와 함께한 순간을 공유해보세요!",
        url: url,
      });
    } else {
      alert("공유 기능이 지원되지 않는 브라우저입니다.");
    }
  };

  return (
    <div className="h-screen flex flex-col justify-between bg-white">
      {/* 상단 버튼 영역 */}
      <div className="flex justify-between items-center p-4 bg-gray-100 shadow-md">
        <button
          onClick={handleDownloadImage}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          다운로드
        </button>
        <button
          onClick={handleShare}
          className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition"
        >
          공유하기
        </button>
      </div>

      {/* 하단 이미지 미리보기 영역 */}
      <div className="flex justify-center items-center flex-grow">
        <Image
          src={url}
          alt="우이미 이미지 미리보기"
          width={320}
          height={240}
          className="rounded-md shadow-lg border border-gray-300"
        />
      </div>
    </div>
  );
};

export default SavePage;
