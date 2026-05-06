import { useStore } from "@/store/useStore";
import neutro from "@/assets/mascote-neutro.png";
import feliz from "@/assets/mascote-feliz.png";
import triste from "@/assets/mascote-triste.png";

const moodImg = {
  neutral: neutro,
  happy: feliz,
  excited: feliz,
  sad: triste,
};

export const Mascot = () => {
  const { mascotMood, mascotMessage } = useStore();
  const src = moodImg[mascotMood];

  return (
    <div className="fixed bottom-4 right-4 z-40 pointer-events-none flex items-end gap-2 max-w-[380px]">
      <div className="bg-card/95 backdrop-blur-sm border-2 border-primary/30 rounded-2xl rounded-br-sm px-4 py-2 shadow-elegant animate-slide-up mb-16">
        <p className="text-sm font-medium text-card-foreground">{mascotMessage}</p>
      </div>
      <img
        key={mascotMood}
        src={src}
        alt="Mascote Frutos de Goiás"
        className="w-[25vh] h-[25vh] object-contain animate-bounce-in drop-shadow-2xl"
      />
    </div>
  );
};
