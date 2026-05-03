import type { Variants } from "framer-motion";

/** Use with `hidden` / `visible` — matches stagger parents using `whileInView="visible"`. */
export const fadein = (
  direction: "up" | "down" | "left" | "right",
  delay: number
): Variants => {
  let x = 0;
  let y = 0;
  if (direction === "up") y = 40;
  if (direction === "down") y = -40;
  if (direction === "left") x = 40;
  if (direction === "right") x = -40;

  return {
    hidden: {
      y,
      x,
      opacity: 0,
      transition: {
        type: "tween" as const,
        duration: 1.2,
        delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
    visible: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: "tween" as const,
        duration: 1.2,
        delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };
};