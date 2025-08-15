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
  const [isAnimating, setIsAnimating] = useState(false);
  const [resultData, setResultData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("todaySelection");
      if (saved) return saved;
    }
    return "";
  });

  useEffect(() => {
    const guid = crypto.randomUUID();
    if (!window.localStorage.getItem("uid")) {
      window.localStorage.setItem("uid", guid);
    }
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
    <div className="items-center justify-center h-[100vh] text-center bg-gray-950">
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
          className={"z-10 h-[100vh] w-[100vw]  "}
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
            <div className="relative w-120 h-120 flex flex-col items-center">
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
              <div className={"text-7xl font-black"}>{DATA.activities[Number(resultData)].title}</div>
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
              <div className={"text-3xl font-black"}>두근두근, 무엇이 나올까요?</div>
            </GradientText>
          </motion.div>
        ) : resultData === "" ? (
          <CircularGameButton
            className="w-64 h-64 rounded-full font-extrabold text-5xl border-gray-300 bg-gray-100 hover:bg-gray-100 transition"
            onClick={() => handleDraw()}
          >
            뽑기
          </CircularGameButton>
        ) : (
          <div className="flex gap-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="">
              <GameButton
                onClick={() => {
                  // TODO: 서버에 저장.
                  localStorage.setItem("todaySelection", "-1");
                }}
                className={
                  "backdrop-contrast-200 backdrop-saturate-150 min-w-40 px-10 py-10 font-bold text-3xl text-white border-2 border-white/20 bg-white/10 rounded-full"
                }
              >
                안할래요
              </GameButton>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="">
              <GameButton
                onClick={() => {
                  window.open(DATA.activities[Number(resultData)].url);
                }}
                className={
                  "backdrop-contrast-200 backdrop-saturate-150 min-w-96 px-10 py-10 font-bold text-3xl text-black border-2 border-white/20 bg-white rounded-full"
                }
              >
                {DATA.activities[Number(resultData)].activityButtonTitle}
              </GameButton>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RandomPage;
