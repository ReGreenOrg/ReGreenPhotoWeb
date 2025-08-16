"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React, {
  useEffect,
  useState,
  // useEffect
} from "react";
import Aurora from "@/ui/Aurora";
import Ballpit_t from "@/ui/Ballpit_t";
import GradientText from "@/ui/GradientText";
import { GameButton } from "@/ui/GameButton";
import { CircularGameButton } from "@/ui/CircularGameButton";
import {DATA} from "@/lib/activityData";
import SplitText from "@/ui/SplitText";

const getRandomPrize = (): // modifier: number = 1
number => {
  return Math.floor(Math.random() * DATA.activities.length);
};

const RandomPage = () => {
  const today = new Date();
  const [isNowCancel, setIsNowCancel] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isActionButtonClicked, setIsActionButtonClicked] = useState(false);
  const [resultData, setResultData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("todaySelection");
      const lastDate = localStorage.getItem("lastDate");
      const savedMonth = Number(lastDate ? lastDate!.split(".")[0] : 0);
      const savedDay = Number(lastDate ? lastDate!.split(".")[1] : 0);
      if (!lastDate) return "";
      if (saved && (new Date(2025, savedMonth - 1, savedDay)).getTime() === (new Date(2025, today.getMonth(), today.getDate())).getTime()) return saved;
    }
    return "";
  });
  const [isComplete, setIsComplete] = useState(() => {
    if (typeof window !== "undefined") {
      const complete = localStorage.getItem("complete");
      if (complete == "1") {
        return 1;
      } else {
        return 0;
      }
    }
  });

  useEffect(() => {
    function setVh() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    setVh();
    window.addEventListener('resize', setVh);
  }, []);

  useEffect(() => {
    function uuidv4(): string {
      return ([1e7] + "-1e3-4e3-8e3-1e11").replace(/[018]/g, (c) => {
        const random = crypto.getRandomValues(new Uint8Array(1))[0];
        return (
          (+c ^ (random & (15 >> (+c / 4)))).toString(16)
        );
      });
    }

    const guid = uuidv4();
    if (!window.localStorage.getItem("uid")) {
      window.localStorage.setItem("uid", guid);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const actionButtonClicked = window.localStorage.getItem("actionButtonClicked");
    if (actionButtonClicked == "1") {
      setIsActionButtonClicked(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {

  }, []);

  const handleDraw = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const lastDate = localStorage.getItem("lastDate");
    const savedMonth = Number(lastDate ? lastDate!.split(".")[0] : 0);
    const savedDay = Number(lastDate ? lastDate!.split(".")[1] : 0);
    if ((new Date(2025, savedMonth - 1, savedDay)).getTime() === (new Date(2025, today.getMonth(), today.getDate())).getTime()) {
      console.error("오늘 이미 행동을 뽑았습니다.");
      return;
    }

    setTimeout(() => {
      const result = getRandomPrize();
      console.log(result);
      setResultData(result.toString());
      window.localStorage.setItem("todaySelection", result.toString());
      window.localStorage.setItem("lastDate", Number(today.getMonth() + 1) + "." + today.getDate());
      window.localStorage.setItem("complete", "0");

      setIsAnimating(false);
    }, 4000);
  };

  return (
    isLoading
    ? <div className="w-[100vw] flex flex-col items-center justify-center text-center bg-gray-950 text-white text-2xl h-screen-safe">
        <SplitText
          text="조금만 기다려주세요!"
          className="text-2xl font-semibold text-center"
          delay={100}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
        />
        <div className={"text-sm"}>당신의 하루를 재밌게 만들어 줄 미션을 만들고 있어요.</div>
    </div>
    : isComplete && resultData !== ""
      ? <div className="w-[100vw] flex flex-col items-center justify-center text-center bg-gray-950 text-white text-2xl h-screen-safe p-10">
          <motion.div className={"absolute -z-0 w-[100vw] h-screen-safe"}>
            <Aurora colorStops={["#4b4c1e", "#233a56", "#bd63ed"]} />
          </motion.div>
          <div className={"z-10 flex flex-col items-center"}>
            <img src={"festival.gif"} alt={"폭죽"} className={"w-full"} />
            <GradientText
              colors={["#f6b9d0", "#ffffff", "#d8acef"]}
              animationSpeed={5}
              showBorder={false}
              className="custom-class"
            >
              <div className={"mt-20 px-10 text-2xl md:text-4xl font-black break-keep"}>오늘의 미션을 완료했어요!</div>
            </GradientText>
            <div className={"text-sm mb-20 mt-5"}>내일은 더 재밌는 미션이 준비되어 있어요.</div>
            <GameButton onClick={async () => {
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: "MURMUR에서 하루 미션 받기",
                    text: "답답했던 하루를 MURMUR가 환기시켜 줄게요!",
                    url: window.location.href,
                  });
                  console.log("공유 성공!");
                } catch (err) {
                  console.error("공유 취소/실패:", err);
                }
              } else {
                alert("이 브라우저는 공유하기를 지원하지 않습니다.");
              }
            }} className={"w-full md:w-72"}>
              <div className={"w-full bg-white py-4 rounded-full text-black text-lg"}>친구에게 오늘의 미션 추천하기</div>
            </GameButton>
            <GameButton onClick={() => {
              window.history.back();
            }} className={"w-full md:w-72 mt-5"}>
              <div className={"w-full bg-gray-800 py-4 rounded-full text-white text-lg"}>닫기</div>
            </GameButton>
          </div>
        </div>
      : <div className="h-screen-safe items-center justify-center text-center bg-gray-950">
      <motion.div className={"absolute -z-0 w-[100vw] h-screen-safe"}>
        <Aurora colorStops={["#4b4c1e", "#233a56", "#bd63ed"]} />
      </motion.div>
      <motion.div className={"h-screen-safe absolute z-10 w-[100vw]"}>
        <Ballpit_t
          key={isAnimating ? "anotherballpit" : ""}
          count={20}
          gravity={isAnimating ? 0 : 0.5}
          friction={isAnimating ? 2 : 1}
          wallBounce={0.95}
          followCursor={false}
          size0={0}
          maxSize={1.2}
          minSize={1.2}
          colors={["#ed5a8e", "#e2145c", "#bd63ed"]}
          lightIntensity={0}
          className={"z-10 h-screen-safe w-[100vw]"}
        />
      </motion.div>
      <motion.div
        className={`absolute top-0 w-[100vw] h-screen-safe z-20 flex flex-col items-center justify-center space-y-10 duration-200 ${
          resultData !== "" ? "backdrop-blur-3xl" : ""
        }`}
      >
        {" "}
        {resultData !== "" ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl text-gray-50 flex items-center flex-col space-y-10"
          >
            <div className="relative w-60 h-60 md:w-90 md:h-90 flex flex-col items-center">
              <Image
                src={DATA.activities[Number(resultData)].imageSrc + ".png"}
                alt="추첨 이미지"
                fill
                className="object-contain rounded-[32px] z-0"
              />
            </div>
            <GradientText
              colors={["#f6b9d0", "#ffffff", "#d8acef"]}
              animationSpeed={5}
              showBorder={false}
              className="custom-class"
            >
              <div className={"px-10 text-2xl md:text-4xl font-black break-keep"}>{DATA.activities[Number(resultData)].title}</div>
            </GradientText>
          </motion.div>
        ) : null}
        {isAnimating ? (
          <motion.div
            className={
              "absolute bottom-10 px-10 py-5 rounded-full bg-gray-900 border-2 border-gray-800 text-white font-bold text-3xl"
            }
            initial={{
              y: 30,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
          >
            <GradientText
              colors={["#ed5a8e", "#ffffff", "#bd63ed"]}
              animationSpeed={5}
              showBorder={false}
              className="custom-class"
            >
              <div className={"text-xl md:text-3xl font-black"}>두근두근, 무엇이 나올까요?</div>
            </GradientText>
          </motion.div>
        ) : resultData === "" ? (
          <div className={""}>
            <h1 className="text-white font-semibold text-3xl md:text-5xl mb-20">오늘의 미션을 뽑아볼까요!</h1>
            <CircularGameButton
              className="w-32 h-32 md:w-64 md:h-64 rounded-full font-extrabold text-3xl md:text-5xl border-gray-300 bg-gray-100 hover:bg-gray-100 transition"
              onClick={() => handleDraw()}
            >
              뽑기
            </CircularGameButton>
          </div>
        ) : (
          <div className="flex gap-5 md:gap-7 flex-col">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 justify-center">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="">
                <GameButton
                  onClick={() => {
                    window.open(DATA.activities[Number(resultData)].url);
                    setIsActionButtonClicked(true);
                    window.localStorage.setItem("actionButtonClicked", "1");
                  }}
                  className={
                    `flex justify-center items-center gap-2 backdrop-contrast-200 backdrop-saturate-150 min-w-30 px-3 py-3 md:py-7 md:px-7 md:text-2xl ${isActionButtonClicked ? "text-white bg-white/10" : "text-black bg-white"} border-2 rounded-full`
                  }
                >
                  {
                    isActionButtonClicked
                      ? <div className="relative w-3 h-3 md:w-5 md:h-5 flex flex-col items-center">
                        <Image
                          src={"arrow-up-right.svg"}
                          alt="check"
                          fill
                          className="object-contain rounded-[32px] z-0"
                        />
                      </div>
                      : <></>
                  }

                  <span className={"break-keep"}>{DATA.activities[Number(resultData)].activityButtonTitle}</span>
                </GameButton>
              </motion.div>
            </motion.div>
            {
              isActionButtonClicked
                ? <GameButton
                  onClick={() => {
                    // TODO: 했어요를 눌렀을 때 로직. 서버에 uid와 함께 전송.
                    window.localStorage.setItem("complete", "1");
                    setIsComplete(1);
                  }}
                  className={
                    "justify-center backdrop-contrast-200 backdrop-saturate-150 min-w-30 px-3 md:px-7 py-3 md:py-7 md:text-2xl text-black border-2 border-white/20 bg-white rounded-full flex gap-1 items-center"
                  }
                >
                  <div className="relative w-5 h-5 md:w-7 md:h-7 flex flex-col items-center">
                    <Image
                      src={"check-badge.svg"}
                      alt="check"
                      fill
                      className="object-contain rounded-[32px] z-0"
                    />
                  </div>
                  <span>완료했어요</span>
                </GameButton>
                : <></>
            }
            <GameButton
              onClick={() => {
                setIsNowCancel(true);
              }}
              className={
                "backdrop-contrast-200 backdrop-saturate-150 mt-10 min-w-30 px-3 py-3 md:py-7 md:px-7 md:text-2xl text-white/50 border-2 border-white/20 rounded-full"
              }
            >
              오늘은 안할래요
            </GameButton>
          </div>
        )}
      </motion.div>
        {
          isNowCancel
          ? <motion.div
              className={"fixed flex items-center justify-center w-[100vw] h-screen-safe top-0 bg-black/50 z-20"}>
              <Overlay setIsNowCancel={setIsNowCancel} /> : <></>
            </motion.div>
          : <></>
        }

    </div>
  );
};

export default RandomPage;

type overlay = {
  setIsNowCancel: (x:boolean)=>void;
}

const Overlay = ({ setIsNowCancel }: overlay) => {
  return <motion.div
          initial={{
            scale: 0,
            opacity: 0
          }}
          animate={{
            scale: 1,
            opacity: 1
          }}
          className={"rounded-xl bg-white w-fit px-10 py-10 mx-5"}>
          <div className={"text-2xl font-bold mb-5"}>정말 안하실건가요?</div>
          <div className={"break-keep"}>페이지를 나가도 오늘 안에 다시 도전할 수 있어요!</div>
          <div className={"flex flex-col gap-5 mt-10"}>
            <GameButton onClick={() => {
              setIsNowCancel(false);
            }} className={"w-full"}>
              <div className={"w-full bg-gray-800 py-5 rounded-full text-white"}>계속 할래요</div>
            </GameButton>
            <GameButton onClick={() => {
              // TODO: 서버에 저장.
              window.history.back();
            }} className={"w-full"}>
              <div className={"w-full bg-transparent rounded-full text-gray-600"}>오늘은 안할래요</div>
            </GameButton>
          </div>
        </motion.div>
}
