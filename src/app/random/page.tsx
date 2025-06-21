"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import Aurora from "../ui/Aurora";
import Ballpit_t from "@/app/ui/Ballpit_t";
import GradientText from "@/app/ui/GradientText";
import CircularText from "@/app/ui/CircularText";

const DEFAULT_IMG = "/random/default.png";
const FIRST_IMG = "/random/item-minop.png";
const SECOND_IMG = "/random/item-donggubat.png";
const THIRD_IMG = "/random/item-wooimi.png";

type Prize = "first" | "second" | "third";

const PRIZE_TEXT: Record<Prize, string> = {
  first: "1등 당첨!/*/미놉 미니 지갑",
  second: "2등 당첨!/*/괄사테라피 스크럽 샴푸바 제오숯 95g",
  third: "3등 당첨!/*/우이미 로고 각인 대나무 칫솔",
};

const VERSION_TEXT = [
  "기본",
  "인스타",
  "인스타+설문",
  "인스타+설문+가입",
];

const getRandomPrize = (modifier: number = 1): Prize => {
  const first = parseFloat(process.env.NEXT_PUBLIC_RANDOM_RATIO_FIRST || "0.1") * modifier;
  const second = parseFloat(process.env.NEXT_PUBLIC_RANDOM_RATIO_SECOND || "0.2") * modifier;

  const rand = Math.random();
  if (rand < first) return "first";
  if (rand < first + second) return "second";
  return "third";
};

const saveToLocalStorage = (prize: Prize) => {
  const key = prize;
  const current = parseInt(localStorage.getItem(key) || "0", 10);
  localStorage.setItem(key, (current + 1).toString());
};

const RandomPage = () => {
  const [imageSrc, setImageSrc] = useState(DEFAULT_IMG);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shine, setShine] = useState(false);
  const [resultText, setResultText] = useState("");
  const [version, setVersion] = useState(1);

  const handleDraw = (modifier: number) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setShine(true);
    setResultText("");
    setImageSrc(DEFAULT_IMG);

    setTimeout(() => {
      const result = getRandomPrize(modifier);
      saveToLocalStorage(result);
      setImageSrc(result === "first" ? FIRST_IMG : result === "second" ? SECOND_IMG : THIRD_IMG);
      setResultText(PRIZE_TEXT[result]);
      setShine(false);
      setIsAnimating(false);
    }, 4000);
  };

  return (
    <div className="items-center justify-center h-[100vh] text-center bg-gray-950">
      <motion.div className={"absolute -z-0 w-[100vw] h-[100vh]"}>
        <Aurora
          colorStops={["#4b4c1e", "#233a56", "#bd63ed"]}
        />
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
      {
        isAnimating || resultText !== "" ? <></>:
          <div className={"absolute z-30 top-10 right-10 font-bold"}>
            <GameButton
              onClick={()=>{
                setVersion(version > 3 ? 1 : version + 1);
              }}
              className={"px-10 h-20 rounded-full bg-black opacity-20 text-white text-3xl"}
            >
              {version} · {VERSION_TEXT[version - 1]}
            </GameButton>
          </div>
      }
      <motion.div
        className={`absolute top-0 w-[100vw] h-[100vh] z-20 flex flex-col items-center justify-center space-y-10 duration-200 ${resultText ? "backdrop-blur-3xl" : ""}`}
      > {resultText ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-black text-gray-50 flex items-center flex-col space-y-10"
        >
          <div className="relative w-64 h-64 flex flex-col items-center">
            <Image
              src={imageSrc}
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
            <div className={"text-7xl font-black"}>{resultText.split("/*/")[0]}</div>
          </GradientText>
          <motion.h1 className={"text-4xl font-medium opacity-80 mt-5"}>
            {resultText.split("/*/")[1]}
          </motion.h1>
        </motion.div>
      ) : null}
      {/*<div className="relative w-64 h-64 flex flex-col items-center">*/}
      {/*  <Image*/}
      {/*    src={imageSrc}*/}
      {/*    alt="추첨 이미지"*/}
      {/*    fill*/}
      {/*    className="object-contain rounded-[32px] z-0"*/}
      {/*  />*/}
      {/*</div>*/}

        {
          isAnimating
            ? <motion.div
                className={"absolute bottom-10 px-10 py-5 rounded-full bg-gray-900 border-2 border-gray-800 text-white font-bold text-3xl"}
                initial={{
                  y: 30,
                  opacity: 0
                }}
                animate={{
                  y: 0,
                  opacity: 1
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
            : (resultText == "") ?
                <CircularGameButton
                  className="w-64 h-64 rounded-full font-extrabold text-5xl border-gray-300 bg-gray-100 hover:bg-gray-100 transition"
                  onClick={()=>handleDraw(version)}
                >
                  뽑기
                </CircularGameButton>
                :
                <motion.div
                  initial={{opacity: 0, y: 30}}
                  animate={{opacity: 1, y: 0}}
                  className=""
                >
                  <GameButton
                    onClick={() => {
                      location.reload();
                    }}
                    className={"backdrop-contrast-200 backdrop-saturate-150 min-w-96 px-10 py-10 font-bold text-3xl text-white border-2 border-white/20 bg-white/10 rounded-full"}
                  >
                    운영진에게 화면을 보여주세요
                  </GameButton>
                </motion.div>
        }

        {/*<button*/}
        {/*  className="py-3 rounded-lg border border-green-400 bg-green-50 hover:bg-green-100 transition"*/}
        {/*  onClick={() => handleDraw(1.2)}*/}
        {/*>*/}
        {/*  📸 인스타 완료 (확률 UP)*/}
        {/*</button>*/}
        {/*<button*/}
        {/*  className="py-3 rounded-lg border border-purple-400 bg-purple-50 hover:bg-purple-100 transition"*/}
        {/*  onClick={() => handleDraw(1.5)}*/}
        {/*>*/}
        {/*  📊 인스타, 설문 완료 (확률 UP UP)*/}
        {/*</button>*/}
        {/*<button*/}
        {/*  className="py-3 rounded-lg border border-red-400 bg-red-50 hover:bg-red-100 transition"*/}
        {/*  onClick={() => handleDraw(2)}*/}
        {/*>*/}
        {/*  🔥 인스타, 설문, 가입 완료 (확률 UP UP UP)*/}
        {/*</button>*/}
    </motion.div>
    </div>
  );
};

type GameButtonProps = {
  children?: React.ReactNode,
  className?: string,
  onClick: () => void
}

export function GameButton(props: GameButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.button
      onClick={()=>props.onClick()}
      className={props.className + " duration-100 ease-out " + (isPressed ? "translate-y-3 scale-y-95" : "")}
      onMouseDown={()=>setIsPressed(true)}
      onMouseUp={()=>setIsPressed(false)}
      onMouseLeave={()=>setIsPressed(false)}
    >{props.children}</motion.button>
  )
}

type CircularGameButtonProps = {
  children?: React.ReactNode,
  className?: string,
  onClick: () => void
}

export function CircularGameButton(props: CircularGameButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.button
      onClick={() => props.onClick()}
      className={props.className + " duration-100 ease-out " + (isPressed ? "scale-90" : "")}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {/* 이 div가 절대 위치 자식의 기준점이 됩니다. */}
      <div className={"relative"}>
        <CircularText
          text="WOOIMI*DRAW*EVENT*"
          spinDuration={20}
          onHover={""}
          className="relative top-0 w-64 h-64 text-gray-300 scale-90"
        />
        {/* "뽑기" 텍스트에 절대 위치를 적용합니다. */}
        <div className={"absolute inset-0 flex items-center justify-center"}>뽑기</div>
      </div>
    </motion.button>
  )
}

export default RandomPage;
