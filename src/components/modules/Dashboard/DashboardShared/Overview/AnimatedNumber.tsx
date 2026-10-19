"use client";

import { useEffect, useState, useRef } from "react";

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  className?: string;
  isCurrency?: boolean;
}

export function AnimatedNumber({
  value,
  prefix = "",
  className = "",
  isCurrency = false,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Track the actual live value without re-triggering the useEffect
  const currentDisplayRef = useRef(0);

  useEffect(() => {
    const startValue = currentDisplayRef.current;
    const endValue = value;

    if (startValue === endValue) return;

    const duration = 450;
    let animationFrameId: number;
    let startTime: number | null = null;

    function updateNumber(now: number) {
      if (!startTime) {
        startTime = now;
        setIsTransitioning(true);
      }

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeProgress = progress * (2 - progress); // Ease out quad
      const current = startValue + (endValue - startValue) * easeProgress;

      currentDisplayRef.current = current;
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateNumber);
      } else {
        // Force snap exactly to the target value at the final frame
        currentDisplayRef.current = endValue;
        setDisplayValue(endValue);
        setIsTransitioning(false);
      }
    }

    animationFrameId = requestAnimationFrame(updateNumber);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value]); // Removed displayValue from dependencies

  const formattedValue = isCurrency
    ? displayValue.toLocaleString("en-BD", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : Math.floor(displayValue).toLocaleString("en-BD");

  return (
    <span
      className={`inline-block transition-all duration-300 transform ${
        isTransitioning ? "opacity-75 scale-[0.99]" : "opacity-100 scale-100"
      } ${className}`}
    >
      {prefix}
      {formattedValue}
    </span>
  );
}
