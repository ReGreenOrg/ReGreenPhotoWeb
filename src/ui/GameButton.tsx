import { motion } from "framer-motion";
import React, { useState } from "react";
type GameButtonProps = {
  children?: React.ReactNode;
  className?: string;
  onClick: () => void;
};

export function GameButton(props: GameButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const press = (isPress: boolean) => {
    setIsPressed(isPress);
  }

  return (
    <motion.button
      onClick={() => props.onClick()}
      className={
        props.className + " duration-100 ease-out " + (isPressed ? "translate-y-2 scale-y-95" : "")
      }
      onMouseDown={() => press(true)}
      onMouseUp={() => press(false)}
      onMouseLeave={() => press(false)}
      onTouchStart={() => press(true)}
      onTouchEnd={() => press(false)}
      onTouchCancel={() => press(false)}
    >
      {props.children}
    </motion.button>
  );
}
