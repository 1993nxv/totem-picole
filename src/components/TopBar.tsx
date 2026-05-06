import { useStore } from "@/store/useStore";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

interface Props {
  onCart?: () => void;
  rightSlot?: React.ReactNode;
}

export const TopBar = ({ rightSlot }: Props) => {
  const { theme, toggleTheme } = useStore();
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-card/80 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Frutos de Goiás" className="h-14 w-auto drop-shadow-md" />
        <div className="hidden md:block">
          <h1 className="text-xl font-bold text-primary leading-tight">Frutos de Goiás</h1>
          <p className="text-xs text-muted-foreground">Produtos artesanais, feitos com paixão e dedicação para proporcionar momentos únicos.</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {rightSlot}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full h-12 w-12"
          aria-label="Alternar tema"
        >
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
};
