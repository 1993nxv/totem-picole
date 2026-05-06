import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { Mascot } from "@/components/Mascot";

export const Preparando = () => {
  const navigate = useNavigate();
  const { setMascot } = useStore();

  useEffect(() => {
    setMascot("excited", "Seu picolé está sendo preparado!");
    const t = setTimeout(() => navigate("/"), 5000);
    return () => clearTimeout(t);
  }, [navigate, setMascot]);

  return (
    <div className="fixed inset-0 gradient-hero flex flex-col items-center justify-center text-center p-8 overflow-hidden">
      {/* Decorative floating emojis */}
      <div className="absolute top-10 left-10 text-6xl animate-float">🍦</div>
      <div className="absolute top-20 right-16 text-5xl animate-float" style={{ animationDelay: "0.5s" }}>🍓</div>
      <div className="absolute bottom-32 left-20 text-6xl animate-float" style={{ animationDelay: "1s" }}>🥭</div>
      <div className="absolute bottom-20 right-10 text-7xl animate-float" style={{ animationDelay: "1.5s" }}>🍇</div>

      <div className="animate-bounce-in z-10">
        <div className="text-9xl mb-6 animate-wave">🍦</div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-2xl mb-4">
          Seu picolé está sendo preparado
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-12">Aguarde só um instante...</p>

        <div className="flex justify-center gap-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-4 h-4 bg-white rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
      <Mascot />
    </div>
  );
};

export default Preparando;
