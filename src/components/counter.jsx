"use client";

import { useEffect, useState } from "react";

export default function Counter({
  end,
  duration = 2000,
  suffix = "",
  prefix = "",
  decimals = 0,
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrameId;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Ease-out quad animation for smooth slowing near the end
      const easeOut = 1 - (1 - progress) * (1 - progress);
      setCount(easeOut * end);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration]);

  return (
    <span>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}