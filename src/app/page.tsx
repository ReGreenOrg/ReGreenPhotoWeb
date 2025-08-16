"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
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

const getRandomPrize = (): // modifier: number = 1
number => {
  return Math.floor(Math.random() * DATA.activities.length);
};

const RandomPage = () => {
  const [isNowCancel, setIsNowCancel] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isActionButtonClicked, setIsActionButtonClicked] = useState(false);
  const [resultData, setResultData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("todaySelection");
      if (saved) return saved;
    }
    return "";
  });

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

  const handleDraw = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (window.localStorage.getItem("todaySelection")) {
      console.error("오늘 이미 행동을 뽑았습니다.");
      return;
    }

    setTimeout(() => {
      const result = getRandomPrize();
      // saveToLocalStorage(result);
      // id: "activity-1",
      // title: "친구·가족에게 '잘 지내?' 한 줄 보내기",
      // imageSrc: "activity/activity-1",
      console.log(result);
      setResultData(result.toString());
      window.localStorage.setItem("todaySelection", result.toString());

      setIsAnimating(false);
    }, 4000);
  };

  return (
    isLoading
    ? <div className="w-[100vw] flex flex-col items-center justify-center h-[100vh] text-center bg-gray-950 text-white text-2xl">
        <div>조금만 기다려주세요!</div>
        <div className={"text-sm"}>당신의 하루를 재밌게 만들어 줄 미션을 만들고 있어요.</div>
    </div>
    : <div className="items-center justify-center h-[100vh] text-center bg-gray-950">
      <motion.div className={"absolute -z-0 w-[100vw] h-[100vh]"}>
        <Aurora colorStops={["#4b4c1e", "#233a56", "#bd63ed"]} />
      </motion.div>
      <motion.div className={"absolute z-10 h-[100vh] w-[100vw]"}>
        <Ballpit_t
          key={isAnimating ? "anotherballpit" : ""}
          count={30}
          gravity={isAnimating ? 0 : 0.5}
          friction={isAnimating ? 2 : 1}
          wallBounce={0.95}
          followCursor={false}
          size0={0}
          maxSize={1.2}
          minSize={1.2}
          colors={["#ed5a8e", "#e2145c", "#bd63ed"]}
          lightIntensity={0}
          className={"z-10 h-[100vh] w-[100vw]"}
        />
      </motion.div>
      <motion.div
        className={`absolute top-0 w-[100vw] h-[100vh] z-20 flex flex-col items-center justify-center space-y-10 duration-200 ${
          resultData !== "" ? "backdrop-blur-3xl" : ""
        }`}
      >
        {" "}
        {resultData !== "" ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-black text-gray-50 flex items-center flex-col space-y-10"
          >
            <div className="relative w-60 h-60 md:w-120 md:h-120 flex flex-col items-center">
              <Image
                src={DATA.activities[Number(resultData)].imageSrc + ".png"}
                alt="추첨 이미지"
                fill
                className="object-contain rounded-[32px] z-0"
              />
            </div>
            <GradientText
              colors={["#ed5a8e", "#ffffff", "#bd63ed"]}
              animationSpeed={5}
              showBorder={false}
              className="custom-class"
            >
              <div className={"text-2xl md:text-7xl font-black"}>{DATA.activities[Number(resultData)].title}</div>
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
          <CircularGameButton
            className="w-32 h-32 md:w-64 md:h-64 rounded-full font-extrabold text-3xl md:text-5xl border-gray-300 bg-gray-100 hover:bg-gray-100 transition"
            onClick={() => handleDraw()}
          >
            뽑기
          </CircularGameButton>
        ) : (
          <div className="flex gap-5 md:gap-7 flex-col">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 justify-center">
              <GameButton
                onClick={() => {
                  setIsNowCancel(true);
                }}
                className={
                  "backdrop-contrast-200 backdrop-saturate-150 min-w-30 px-5 py-5 md:py-10 md:px-10 font-bold text-lg md:text-3xl text-white border-2 border-white/20 bg-white/10 rounded-full"
                }
              >
                오늘은 안할래요
              </GameButton>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="">
                <GameButton
                  onClick={() => {
                    window.open(DATA.activities[Number(resultData)].url);
                    setIsActionButtonClicked(true);
                    window.localStorage.setItem("actionButtonClicked", "1");
                  }}
                  className={
                    "flex items-center gap-2 backdrop-contrast-200 backdrop-saturate-150 min-w-30 px-5 py-5 md:py-10 md:px-10 font-bold text-lg md:text-3xl text-white border-2 border-white/20 bg-white/10 rounded-full"
                  }
                >
                  {
                    isActionButtonClicked
                      ? <div className="relative w-5 h-5 md:w-7 md:h-7 flex flex-col items-center">
                        <Image
                          src={"arrow-up-right.svg"}
                          alt="check"
                          fill
                          className="object-contain rounded-[32px] z-0"
                        />
                      </div>
                      : <></>
                  }

                  <span>{DATA.activities[Number(resultData)].activityButtonTitle}</span>
                </GameButton>
              </motion.div>
            </motion.div>
            {
              isActionButtonClicked
                ? <GameButton
                  onClick={() => {
                    // TODO: 했어요를 눌렀을 때 로직. 서버에 uid와 함께 전송.
                  }}
                  className={
                    "justify-center backdrop-contrast-200 backdrop-saturate-150 min-w-30 px-5 md:px-10 py-5 md:py-10 font-bold text-lg md:text-3xl text-black border-2 border-white/20 bg-white rounded-full flex gap-1 items-center"
                  }
                >
                  <div className="relative w-5 h-5 md:w-10 md:h-10 flex flex-col items-center">
                    <Image
                      src={"check-badge.svg"}
                      alt="check"
                      fill
                      className="object-contain rounded-[32px] z-0"
                    />
                  </div>
                  <span>했어요</span>
                </GameButton>
                : <></>
            }
          </div>
        )}
        {
          isNowCancel ? <motion.div
              className={"fixed flex items-center justify-center w-[100vw] h-[100vh] bg-black/50 z-10"}>
            <motion.div
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
              <div className={""}>페이지를 나가도 오늘 안에 다시 도전할 수 있어요!</div>
              <div className={"flex gap-5 mt-10"}>
                <GameButton onClick={() => {
                  // TODO: 서버에 저장.
                  window.history.back();
                }} className={"w-full"}>
                  <div className={"w-full bg-red-100 py-5 rounded-full text-red-800"}>오늘은 안할래요</div>
                </GameButton>
                <GameButton onClick={() => {
                  setIsNowCancel(false);
                }} className={"w-full"}>
                  <div className={"w-full bg-gray-200 py-5 rounded-full"}>계속 할래요</div>
                </GameButton>
              </div>
            </motion.div>
          </motion.div>
          : <></>
        }
      </motion.div>
    </div>
  );
};

export default RandomPage;
