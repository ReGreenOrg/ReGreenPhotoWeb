"use client";

import {AnimatePresence, motion} from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Aurora from "@/ui/Aurora";
import Ballpit_t from "@/ui/Ballpit_t";
import GradientText from "@/ui/GradientText";
import { GameButton } from "@/ui/GameButton";
import { CircularGameButton } from "@/ui/CircularGameButton";
import { DATA } from "@/lib/activityData";
import { db } from "@/app/api/firebase/firebase-sdk";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  increment,
  setDoc,
  updateDoc,
} from "@firebase/firestore";

const getRandomPrize = (): // modifier: number = 1
number => {
  return Math.floor(Math.random() * DATA.activities.length);
};

const getUserData = async (uid: string) => {
  const snapshot = await getDoc(doc(db, "pretotype-1", uid));
  return snapshot.data();
};

const RandomPage = () => {
  const today = new Date();
  const [isNowCancel, setIsNowCancel] = useState(false);

  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [resultData, setResultData] = useState("");
  const [weekData, setWeekData] = useState([]);
  const [nearUser, setNearUser] = useState<string[]>([]);

  const [cycle, setCycle] = useState<2 | 1 | 0 | -1 | -2>(-2);
  const [actionState, setActionState] = useState<"최초"|"뽑기"|"행동버튼"|"완료">("최초");

  useEffect(() => {
    function getVh() {
      setTimeout(() => {
        let vh = window.innerHeight * 0.01;
        if (vh > 10) vh = 10; // 과도한 값 제한
        document.documentElement.style.setProperty("--vh", `${vh}px`);
      }, 150);
    }

    getVh();
    window.addEventListener("resize", getVh);
    window.addEventListener("orientationchange", getVh);

    return () => {
      window.removeEventListener("resize", getVh);
      window.removeEventListener("orientationchange", getVh);
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    function uuidv4(): string {
      return ([1e7] + "-1e3-4e3-8e3-1e11").replace(/[018]/g, (c) => {
        const random = crypto.getRandomValues(new Uint8Array(1))[0];
        return (+c ^ (random & (15 >> (+c / 4)))).toString(16);
      });
    }

    const uid = window.localStorage.getItem("uid");

    (async () => {
      let realId = "";
      console.log("uid 발급 중");
      if (!uid) {
        // localStorage UID가 발급되지 않았으면, 최초 사용자로 인식하고 새로운 UID 발급 후 Server에 등록.
        const guid = uuidv4();
        window.localStorage.setItem("uid", guid);
        await addUser(serverTime, guid);
        const userData = await getUserData(guid);
        if (userData) {
          setUserId(guid);
          realId = guid;
        }
      } else {
        const serverData = await getUserData(uid);
        if (!serverData) {
          // localStorage UID가 Server에 존재하지 않으면 비정상적인 UID로 판별.
          const guid = uuidv4();
          console.error(
            "비정상적인 사용자 ID입니다. 기존 데이터는 초기화하고 새로 발급합니다.",
            guid
          );
          window.localStorage.setItem("uid", guid);
          await addUser(serverTime, guid);
          const userData = await getUserData(guid);
          if (userData) {
            setUserId(guid);
            realId = guid;
          }
        } else {
          // localStorage UID가 Server에 있으면 정상적인 UID로 판별.
          setUserId(uid);
          realId = uid;
        }
      }
      console.log("uid 발급 완료: ", realId);

      const todayData = await getTodayActioned(realId);
      if (todayData.length >= 1) {
        if (todayData[0].split("__")[2] === "완료") {
          // setCycle(2);
          setActionState("완료")
          setCycle(-1);
        } else {
          // setCycle(1);
          setActionState("뽑기")
          setCycle(-1);
        }
        setResultData(todayData[0].split("__")[1]);
      } else {
        setCycle(-1);
        setActionState("최초")
        setResultData("");
      }
    })();
    setIsLoading(false);
  }, []);

  useEffect(function drawNearUser() {
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    const randN = Math.floor(Math.random() * 5);

    for (let i = 0; i < randN; i++) {
      const randX = Math.floor(Math.random() * vw);
      const randY = Math.floor(Math.random() * vh);
      const randIcon = Math.floor(Math.random() * 5);
      setNearUser(prev => [...prev, `${vw * 0.2 + randX*0.6},${vh * 0.2 + randY*0.6},${["😎", "🥹", "🥲", "😔", "🥰"][randIcon]}`]);
    }
  }, []);

  const serverTime = new Date();

  const addUser = async (serverTime: Date, uid: string) => {
    console.log("addUser", serverTime);
    try {
      await setDoc(doc(db, "pretotype-1", uid), {
        createdAt: new Date(),
        actioned: [],
        share: 0,
      });
      console.log("사용자 등록 성공!", uid);
    } catch (error) {
      console.error("사용자 등록 실패!", error);
    }
  };

  const completeToday = async () => {
    try {
      const todayData = await getTodayActioned(userId);
      console.log(todayData);
      if (todayData.length >= 1) {
        await updateAction(userId, "완료", serverTime);
      } else {
        console.error("뽑기를 먼저 해야 합니다.");
      }
    } catch (error) {
      console.error("행동 완료를 전송하지 못했어요.", error);
    }
  };

  const addShare = async () => {
    try {
      const userRef = doc(db, "pretotype-1", userId);

      await updateDoc(userRef, {
        share: increment(1),
      });
    } catch (err) {
      console.error("공유 횟수를 추가하지 못했어요.", err);
    }
  };

  const getTodayActioned = async (uid: string): Promise<string[]> => {
    const actioned = (await getUserData(uid))?.actioned;
    console.log("userActioned:", actioned);
    return actioned.filter((a: string) => {
      const savedYear = Number(a.split("__")[0].split(".")[0]);
      const savedMonth = Number(a.split("__")[0].split(".")[1]);
      const savedDay = Number(a.split("__")[0].split(".")[2]);
      return (
        new Date(savedYear, savedMonth - 1, savedDay).getTime() ===
        new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
      );
    });
  };

  const updateAction = async (uid: string, type: string, date: Date, action: string = "") => {
    try {
      const userRef = doc(db, "pretotype-1", uid);

      const todayData = await getTodayActioned(uid);

      if (todayData.length >= 1) {
        await updateDoc(userRef, {
          actioned: arrayRemove(todayData[0]),
        });

        await updateDoc(userRef, {
          actioned: arrayUnion(
            date.getFullYear() +
              "." +
              Number(date.getMonth() + 1) +
              "." +
              date.getDate() +
              "__" +
              todayData[0].split("__")[1] +
              "__" +
              type
          ),
        });
      } else {
        if (action !== "") {
          await updateDoc(userRef, {
            actioned: arrayUnion(
              date.getFullYear() +
                "." +
                Number(date.getMonth() + 1) +
                "." +
                date.getDate() +
                "__" +
                action +
                "__" +
                type
            ),
          });
        } else {
          console.error("값을 추가하려면 action을 전달하세요.");
        }
      }
    } catch (error) {
      console.error("값을 제대로 업데이트하지 못했습니다.", error);
    }
  };

  const handleDraw = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const todayProgress = await getTodayActioned(userId);
    if (todayProgress.length >= 1) {
      // 오늘 한 게 아무것도 없으면?
      console.error("오늘 이미 행동을 뽑았습니다.");
      setIsAnimating(false);
      return;
    }

    setCycle(0);

    setTimeout(() => {
      const result = getRandomPrize();
      console.log(result);
      setResultData(result.toString());
      (async () => {
        try {
          await updateAction(userId, "뽑기", serverTime, result.toString());
          setActionState("뽑기");
        } catch (err) {
          console.error("뽑기 결과를 저장하는 중 문제가 생겼어요.", err);
        }
      })();

      setIsAnimating(false);
    }, 4000);
  };

  return isLoading || !userId || cycle === -2 ? (
    <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-center text-center bg-gray-950 text-white text-2xl overflow-hidden">
      잠시만 기다려주세요.
    </div>
  ) : cycle === -1 ? (<div className="w-[100vw] h-screen-safe flex flex-col items-center justify-center text-center bg-gray-200 text-white overflow-hidden">
      <div className={"overflow-hidden h-screen-safe"}>
        <motion.div
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring", // 스프링 애니메이션
            stiffness: 100, // 스프링 강도 (높을수록 빠르게 복원)
            damping: 15, // 감쇠 계수 (낮을수록 많이 튕김)
            mass: 1, // 질량 (크면 더 느리게, 묵직하게 움직임)
            delay: 0.2, // 시작 지연
            duration: 0.2
          }}
          className={"w-[80vh] h-[80vh] border-2 border-black/5 rounded-full flex items-center justify-center"}>
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring", // 스프링 애니메이션
              stiffness: 100, // 스프링 강도 (높을수록 빠르게 복원)
              damping: 15, // 감쇠 계수 (낮을수록 많이 튕김)
              mass: 1, // 질량 (크면 더 느리게, 묵직하게 움직임)
              delay: 0.3, // 시작 지연
              duration: 0.2,
            }}
            className={"w-[60vh] h-[60vh] border-2 border-black/10 rounded-full flex items-center justify-center"}>
            <motion.div
              initial={{ scale: 0.3 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring", // 스프링 애니메이션
                stiffness: 100, // 스프링 강도 (높을수록 빠르게 복원)
                damping: 15, // 감쇠 계수 (낮을수록 많이 튕김)
                mass: 1, // 질량 (크면 더 느리게, 묵직하게 움직임)
                delay: 0.4, // 시작 지연
                duration: 0.2
              }}
              className={"w-[40vh] h-[40vh] border-2 border-black/15 rounded-full flex items-center justify-center"}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring", // 스프링 애니메이션
                  stiffness: 100, // 스프링 강도 (높을수록 빠르게 복원)
                  damping: 15, // 감쇠 계수 (낮을수록 많이 튕김)
                  mass: 1, // 질량 (크면 더 느리게, 묵직하게 움직임)
                  delay: 0.5, // 시작 지연
                  duration: 0.2
                }}
                className={"w-[20vh] h-[20vh] border-2 border-black/20 rounded-full flex items-center justify-center"}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring", // 스프링 애니메이션
                    stiffness: 100, // 스프링 강도 (높을수록 빠르게 복원)
                    damping: 15, // 감쇠 계수 (낮을수록 많이 튕김)
                    mass: 1, // 질량 (크면 더 느리게, 묵직하게 움직임)
                    delay: 0, // 시작 지연
                    duration: 0.2
                  }}
                  className={"w-[7vh] h-[7vh] bg-gray-800 rounded-full flex items-center justify-center font-bold z-100"}>
                  <motion.div
                    className="relative w-[3vh] h-[3vh] md:w-10 md:h-10 flex flex-col items-center"
                  >
                    <Image
                      src={"map-pin.svg"}
                      alt="추첨 이미지"
                      fill
                      className="object-contain z-0 md:w-40 md:h-40"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
        {
          nearUser.map((user, index) =>
            <motion.div
              key={index}
              style={{
                position: "absolute",
                top: Number(user.split(",")[1]),
                left: Number(user.split(",")[0])
              }}
              initial={{ scale: 0, opacity: 0, filter: "blur(10px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{
                type: "spring", // 스프링 애니메이션
                stiffness: 100, // 스프링 강도 (높을수록 빠르게 복원)
                damping: 15, // 감쇠 계수 (낮을수록 많이 튕김)
                mass: 1, // 질량 (크면 더 느리게, 묵직하게 움직임)
                delay: 0.7 + 0.1 * index, // 시작 지연
                duration: 0.2
              }}
              className={`w-16 h-16 bg-white rounded-full z-20 border-2 border-gray-600 flex items-center justify-center text-xl md:text-2xl`}>{user.split(",")[2]}</motion.div>
          )
        }
      </div>
      <motion.div
        className={"z-100 bottom-0 w-[100vw] bg-gradient-to-t from-white/100 to-white/0 p-5 flex flex-col items-center"}
        initial={{ opacity: 0, bottom: -50 }}
        animate={{ opacity: 1, bottom: 0 }}
        transition={{
          type: "spring", // 스프링 애니메이션
          stiffness: 100, // 스프링 강도 (높을수록 빠르게 복원)
          damping: 15, // 감쇠 계수 (낮을수록 많이 튕김)
          mass: 1, // 질량 (크면 더 느리게, 묵직하게 움직임)
          duration: 0.3
        }}
      >
        <motion.div className={"mb-5"}>
          <GradientText
            colors={["#9e1a4c", "#2d44ba", "#681893"]}
            animationSpeed={5}
            showBorder={false}
            className="custom-class bg-transparent"
          >
            <div className={"text-sm md:text-xl font-semibold break-keep"}>
              {
                actionState === "최초" || actionState === "뽑기" || actionState === "행동버튼"
                ? `지금 당신 근처에서 ${nearUser.length}명이 미션을 하고 있어요!`
                : "오늘의 미션을 완료했어요!"
              }
            </div>
          </GradientText>
        </motion.div>
        <GameButton
          onClick={async () => {
            if (actionState === "최초") {
              await handleDraw();
            } else if (actionState === "뽑기") {
              setCycle(1);
            } else if (actionState === "완료") {
              setCycle(2);
            }
          }}
          className={
            "w-full md:w-fit justify-center min-w-30 px-3 md:px-7 py-5 md:py-7 md:text-xl text-white bg-gray-700 rounded-full flex gap-1 items-center"
          }
        >
          <span>{
            actionState === "최초"
              ? "버튼 눌러서 무기력함 떨쳐내기"
              : actionState === "뽑기" || actionState === "행동버튼"
                ? DATA.activities[Number(resultData)]!.title
                : actionState === "완료"
                  ? "이번 주 미션 현황 보기"
                  : ""
          }</span>
        </GameButton>
      </motion.div>
    </div>)
    : cycle === 2 ? (
    <div className="w-[100vw] flex flex-col items-center justify-center text-center bg-gray-950 text-white text-2xl h-screen-safe p-10">
      <motion.div className={"absolute -z-0 w-[100vw] h-screen-safe"}>
        <Aurora colorStops={["#4b4c1e", "#233a56", "#bd63ed"]} />
      </motion.div>
      <div className={"z-10 flex flex-col items-center"}>
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          className={"flex items-center justify-center gap-2"}>
          {
            [0, 1, 0, 0, 1, 1, 0].map((item, index) => <motion.div
              key={index}
              className={`w-12 h-12 rounded-lg border-2 ${item === 1 ? "bg-white border-white" : "bg-white/10 border-white/20"}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring", // 스프링 애니메이션
                stiffness: 100, // 스프링 강도 (높을수록 빠르게 복원)
                damping: 15, // 감쇠 계수 (낮을수록 많이 튕김)
                mass: 1, // 질량 (크면 더 느리게, 묵직하게 움직임)
                delay: 0.05 * index, // 시작 지연
              }}
            >

            </motion.div>)
          }
          {/*<img src={"festival.gif"} alt={"폭죽"} className={"w-full"} />*/}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.05 }}
        >
          <GradientText
            colors={["#f6b9d0", "#ffffff", "#d8acef"]}
            animationSpeed={5}
            showBorder={false}
            className="custom-class"
          >
            <div className={"mt-20 px-10 text-2xl md:text-4xl font-black break-keep"}>
              오늘의 미션을 완료했어요!
            </div>
          </GradientText>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.1 }}
          className={"text-sm mb-20 mt-5"}
        >
          내일은 더 재밌는 미션이 준비되어 있어요.
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.7, filter: "blur(5px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{
            type: "spring", // 스프링 애니메이션
            stiffness: 100, // 스프링 강도 (높을수록 빠르게 복원)
            damping: 15, // 감쇠 계수 (낮을수록 많이 튕김)
            mass: 1, // 질량 (크면 더 느리게, 묵직하게 움직임)
            delay: 0.2, // 시작 지연
            duration: 0.2
          }}
          className={"w-full md:w-72 mt-5"}
        >
          <GameButton
            onClick={async () => {
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: "MURMUR에서 하루 미션 받기",
                    text: "무기력한 일상을 하루 한 개 미션으로 떨쳐내볼까요?",
                    url: window.location.href,
                  });
                  console.log("공유 성공!");
                  await addShare();
                } catch (err) {
                  console.error("공유 취소/실패:", err);
                }
              } else {
                alert("이 브라우저는 공유하기를 지원하지 않습니다.");
              }
            }}
            className={"w-full md:w-72"}
          >
            <div
              className={
                "w-full bg-white py-4 rounded-full text-black text-lg flex gap-2 items-center justify-center"
              }
            >
              <div className="relative w-5 h-5 md:w-7 md:h-7 flex flex-col items-center">
                <Image src={"share.svg"} alt="share" fill className="object-contain z-0" />
              </div>
              친구에게 오늘의 미션 추천하기
            </div>
          </GameButton>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.7, filter: "blur(5px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{
            type: "spring", // 스프링 애니메이션
            stiffness: 100, // 스프링 강도 (높을수록 빠르게 복원)
            damping: 15, // 감쇠 계수 (낮을수록 많이 튕김)
            mass: 1, // 질량 (크면 더 느리게, 묵직하게 움직임)
            delay: 0.3, // 시작 지연
            duration: 0.3
          }}
          className={"w-full md:w-72 mt-5"}
        >
          <GameButton
            onClick={() => {
              window.history.back();
            }}
            className={"w-full md:w-72"}
          >
            <div className={"w-full bg-gray-800 py-4 rounded-full text-white text-lg"}>닫기</div>
          </GameButton>
        </motion.div>
      </div>
    </div>
  ) : (
    <div className="h-screen-safe items-center justify-center text-center bg-gray-950">
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
        className={`absolute top-0 w-[100vw] h-screen-safe z-20 duration-200 ${
          resultData !== "" ? "backdrop-blur-3xl" : ""
        }`}
      >
        <motion.div
          className={`w-full h-full flex flex-col items-center justify-center space-y-10 duration-500 ${
            isNowCancel ? "scale-90 blur-sm" : "scale-100"
          }`}
        >
          {resultData !== "" ? (
            <motion.div className="text-6xl text-gray-50 flex items-center flex-col space-y-10">
              <motion.div
                initial={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.3 }}
                className="relative w-60 h-60 md:w-90 md:h-90 flex flex-col items-center"
              >
                <Image
                  src={DATA.activities[Number(resultData)].imageSrc + ".png"}
                  alt="추첨 이미지"
                  fill
                  className="object-contain rounded-[32px] z-0 bg-white/10 backdrop-blur-3xl backdrop-contrast-200 backdrop-saturate-200"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <GradientText
                  colors={["#f6b9d0", "#ffffff", "#d8acef"]}
                  animationSpeed={5}
                  showBorder={false}
                  className="custom-class"
                >
                  <div className={"px-10 text-2xl md:text-4xl font-black break-keep"}>
                    {DATA.activities[Number(resultData)].title}
                  </div>
                </GradientText>
              </motion.div>
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
              <h1 className="text-white font-semibold text-3xl md:text-5xl mb-20">
                오늘의 미션을 뽑아볼까요!
              </h1>
              <CircularGameButton
                className="w-32 h-32 md:w-64 md:h-64 rounded-full font-extrabold text-3xl md:text-5xl border-gray-300 bg-gray-100 hover:bg-gray-100 transition"
                onClick={() => handleDraw()}
              >
                뽑기
              </CircularGameButton>
            </div>
          ) : (
            <div className="flex gap-5 md:gap-7 flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 justify-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{
                    type: "spring", // 스프링 애니메이션
                    stiffness: 100, // 스프링 강도 (높을수록 빠르게 복원)
                    damping: 15, // 감쇠 계수 (낮을수록 많이 튕김)
                    mass: 1, // 질량 (크면 더 느리게, 묵직하게 움직임)
                    delay: 0.2, // 시작 지연
                  }}
                  className=""
                >
                  <GameButton
                    onClick={async () => {
                      window.open(DATA.activities[Number(resultData)].url);
                      setCycle(1);
                      await updateAction(userId, "행동버튼", serverTime);
                    }}
                    className={`flex justify-center items-center gap-2 backdrop-contrast-200 backdrop-saturate-150 min-w-30 px-3 py-3 md:py-7 md:px-7 md:text-2xl ${
                      cycle === 1 ? "text-white bg-white/10" : "text-black bg-white"
                    } border-2 rounded-full`}
                  >
                    {cycle === 1 ? (
                      <div className="relative w-3 h-3 md:w-5 md:h-5 flex flex-col items-center">
                        <Image
                          src={"arrow-up-right.svg"}
                          alt="check"
                          fill
                          className="object-contain rounded-[32px] z-0"
                        />
                      </div>
                    ) : (
                      <></>
                    )}

                    <span className={"break-keep"}>
                    {DATA.activities[Number(resultData)].activityButtonTitle}
                  </span>
                  </GameButton>
                </motion.div>
              </motion.div>
              {cycle === 1 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{
                    type: "spring", // 스프링 애니메이션
                    stiffness: 100, // 스프링 강도 (높을수록 빠르게 복원)
                    damping: 15, // 감쇠 계수 (낮을수록 많이 튕김)
                    mass: 1, // 질량 (크면 더 느리게, 묵직하게 움직임)
                    delay: 0.4, // 시작 지연
                  }}
                  className=""
                >
                  <GameButton
                    onClick={async () => {
                      // TODO: 했어요를 눌렀을 때 로직. 서버에 uid와 함께 전송.
                      setCycle(2);
                      await completeToday();
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
                </motion.div>
              ) : (
                <></>
              )}
              <motion.div
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 0.5, duration: 1 }}
              >
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
              </motion.div>
            </div>
          )}
        </motion.div>

      </motion.div>
      <AnimatePresence>
        {isNowCancel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              "fixed flex items-center justify-center w-[100vw] h-screen-safe top-0 bg-black/50 z-20"
            }
          >
            <Overlay setIsNowCancel={setIsNowCancel} setCycle={setCycle} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RandomPage;

type overlay = {
  setIsNowCancel: (x: boolean) => void;
  setCycle: (x: -2|-1|0|1|2 ) => void;
};

const Overlay = ({ setIsNowCancel, setCycle }: overlay) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0, filter: "blur(20px)" }}
      transition={{
        type: "spring", // 스프링 애니메이션
        stiffness: 100, // 스프링 강도 (높을수록 빠르게 복원)
        damping: 15, // 감쇠 계수 (낮을수록 많이 튕김)
        mass: 1, // 질량 (크면 더 느리게, 묵직하게 움직임)
        delay: 0, // 시작 지연
        duration: 0.2
      }}
      className={"rounded-xl bg-white/90 backdrop-saturate-200 backdrop-contrast-200 backdrop-brightness-200 backdrop-blur-3xl w-fit px-10 py-10 mx-5"}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.7, filter: "blur(5px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{
          type: "spring", // 스프링 애니메이션
          stiffness: 100, // 스프링 강도 (높을수록 빠르게 복원)
          damping: 15, // 감쇠 계수 (낮을수록 많이 튕김)
          mass: 1, // 질량 (크면 더 느리게, 묵직하게 움직임)
          delay: 0.1, // 시작 지연
          duration: 0.2
        }}
        className={"text-2xl font-bold mb-5 break-keep"}
      >
        정말 안하실건가요?
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.7, filter: "blur(5px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{
          type: "spring", // 스프링 애니메이션
          stiffness: 100, // 스프링 강도 (높을수록 빠르게 복원)
          damping: 15, // 감쇠 계수 (낮을수록 많이 튕김)
          mass: 1, // 질량 (크면 더 느리게, 묵직하게 움직임)
          delay: 0.2, // 시작 지연
          duration: 0.2
        }}
        className={"break-keep"}
      >
        페이지를 나가도 오늘 안에 다시 도전할 수 있어요!
      </motion.div>
      <div className={"flex flex-col gap-5 mt-10"}>
        <motion.div
          initial={{ opacity: 0, scale: 0.7, filter: "blur(5px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{
            type: "spring", // 스프링 애니메이션
            stiffness: 100, // 스프링 강도 (높을수록 빠르게 복원)
            damping: 15, // 감쇠 계수 (낮을수록 많이 튕김)
            mass: 1, // 질량 (크면 더 느리게, 묵직하게 움직임)
            delay: 0.3, // 시작 지연
            duration: 0.2
          }}
        >
          <GameButton
            onClick={() => {
              setIsNowCancel(false);
            }}
            className={"w-full"}
          >
            <div className={"w-full bg-gray-800 py-5 rounded-full text-white"}>계속 할래요</div>
          </GameButton>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.7, filter: "blur(5px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{
            type: "spring", // 스프링 애니메이션
            stiffness: 100, // 스프링 강도 (높을수록 빠르게 복원)
            damping: 15, // 감쇠 계수 (낮을수록 많이 튕김)
            mass: 1, // 질량 (크면 더 느리게, 묵직하게 움직임)
            delay: 0.4, // 시작 지연
            duration: 0.2
          }}
        >
          <GameButton
            onClick={() => {
              setCycle(-1);
              setIsNowCancel(false);
            }}
            className={"w-full"}
          >
            <div className={"w-full bg-transparent rounded-full text-gray-600"}>
              오늘은 안할래요
            </div>
          </GameButton>
        </motion.div>
      </div>
    </motion.div>
  );
};
