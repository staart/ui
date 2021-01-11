import type { TransitionConfig } from "svelte/types/runtime/transition";

export const fadeScale = (
  node: Element,
  {
    delay = 0,
    duration = 200,
    easing = (x) => x,
    baseScale = 0,
    origin = "center",
  }: {
    delay?: TransitionConfig["delay"];
    duration?: TransitionConfig["duration"];
    easing?: TransitionConfig["easing"];
    baseScale?: number;
    origin?: string;
  }
): TransitionConfig => {
  const o = +getComputedStyle(node).opacity;
  const m = getComputedStyle(node).transform.match(/scale\(([0-9.]+)\)/);
  const s = m ? Number(m[1]) : 1;
  const is = 1 - baseScale;

  return {
    delay,
    duration,
    css: (t) => {
      const eased = easing(t);
      return `opacity: ${eased * o}; transform: scale(${
        eased * s * is + baseScale
      }); transform-origin: ${origin}`;
    },
  };
};
