import { useState, useEffect, useRef } from "react";

export function useCounter(target, duration = 1100) {
  const [val, setVal] = useState(0);
  const raf = useRef();
  useEffect(() => {
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const e = 1 - Math.pow(1 - p, 4);
      setVal(Math.round(target * e));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return val;
}
