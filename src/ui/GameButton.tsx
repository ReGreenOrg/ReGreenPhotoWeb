import { motion } from "framer-motion";
import React, { useState } from "react";
type GameButtonProps = {
  children?: React.ReactNode;
  className?: string;
  onClick: () => void;
};

export function GameButton(props: GameButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.button
      onClick={() => props.onClick()}
      className={
        props.className + " duration-100 ease-out " + (isPressed ? "translate-y-3 scale-y-95" : "")
      }
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onTouchCancel={() => setIsPressed(false)}
    >
      {props.children}
    </motion.button>
  );
}
