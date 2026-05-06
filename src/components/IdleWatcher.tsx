import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";
import { useLocation } from "react-router-dom";

const IDLE_MS = 60_000;

export const IdleWatcher = ({ children }: { children: React.ReactNode }) => {
  const { setIdle, isIdle, cart } = useStore();
  const location = useLocation();
  const timer = useRef<number>();

  useEffect(() => {
    // Disable idle on admin routes
    if (location.pathname.startsWith("/gerir")) {
      window.clearTimeout(timer.current);
      if (isIdle) setIdle(false);
      return;
    }

    const reset = () => {
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        if (cart.length === 0) setIdle(true);
      }, IDLE_MS);
    };
    const events = ["mousemove", "touchstart", "keydown", "click"];
    events.forEach((e) => window.addEventListener(e, reset));
    reset();
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      window.clearTimeout(timer.current);
    };
  }, [location.pathname, cart.length, isIdle, setIdle]);

  return <>{children}</>;
};
