import React, { useState } from "react";
import { motion } from "framer-motion";
import CircularText from "./CircularText";

type CircularGameButtonProps = {
  children?: React.ReactNode;
  className?: string;
  onClick: () => void;
};

export function CircularGameButton(props: CircularGameButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center gap-14">
      <h1 className="text-white font-semibold text-3xl md:text-5xl">오늘 뭐할래요?</h1>
      <motion.button
        onClick={() => props.onClick()}
        className={props.className + " duration-100 ease-out " + (isPressed ? "scale-90" : "")}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        onTouchCancel={() => setIsPressed(false)}
      >
        {/* 이 div가 절대 위치 자식의 기준점이 됩니다. */}
        <div className={"relative"}>
          <CircularText
            text="MURMUR*ACTIVITY*DRAW*"
            spinDuration={20}
            onHover={""}
            className="relative top-0 w-32 h-32 md:w-64 md:h-64 text-gray-300 scale-90"
          />
          {/* "뽑기" 텍스트에 절대 위치를 적용합니다. */}
          <div className={"absolute inset-0 flex items-center justify-center"}>뽑기</div>
        </div>
      </motion.button>
    </div>
  );
}
