import { useStore } from "@/store/useStore";
import { useEffect, useState } from "react";
import { SettingsService } from "@/services";
import logo from "@/assets/logo.png";
import type { IdleMedia } from "@/types";

export const IdleScreen = () => {
  const { setIdle } = useStore();
  const [media, setMedia] = useState<IdleMedia[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    SettingsService.get().then((s) => setMedia(s.idleMedia));
  }, []);

  useEffect(() => {
    if (media.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % media.length), 6000);
    return () => clearInterval(t);
  }, [media.length]);

  const wake = () => setIdle(false);
  const current = media[idx];

  return (
    <div
      onClick={wake}
      onTouchStart={wake}
      className="fixed inset-0 z-[100] gradient-hero cursor-pointer overflow-hidden"
    >
      {current ? (
        current.type === "video" ? (
          <video src={current.url} autoPlay muted loop playsInline className="w-full h-full object-cover" />
        ) : (
          <img src={current.url} alt="Promo" className="w-full h-full object-cover" />
        )
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
          <img src={logo} alt="Frutos de Goiás" className="h-64 md:h-96 animate-float drop-shadow-2xl" />
            <div className="absolute inset-0 overflow-hidden bg-black">
              <iframe
                className="
                  absolute
                  top-1/2 left-1/2
                  h-[100vh] w-[177.77vh]
                  min-h-full min-w-full
                  -translate-x-1/2 -translate-y-1/2
                  pointer-events-none
                "
                src="https://www.youtube.com/embed/5eBU7wxBbQY?autoplay=1&mute=1&loop=1&playlist=5eBU7wxBbQY&controls=0&rel=0&modestbranding=1"
                title="Background Video"
                frameBorder="0"
                allow="autoplay; fullscreen"
              />
            </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mt-8 drop-shadow-lg"></h1>
          <p className="text-2xl md:text-4xl text-white/95 mt-4 font-light">
            Produtos artesanais, feitos com paixão e dedicação para proporcionar momentos únicos.
          </p>
          <div className="mt-12 px-8 py-4 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/40 animate-pulse-glow">
            <p className="text-white text-xl font-semibold">👆 Toque para começar</p>
          </div>
        </div>
      )}
    </div>
  );
};
