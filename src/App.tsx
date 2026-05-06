import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useStore } from "@/store/useStore";
import { IdleWatcher } from "@/components/IdleWatcher";
import { IdleScreen } from "@/components/IdleScreen";
import Produtos from "./pages/Produtos";
import Pagamento from "./pages/Pagamento";
import Preparando from "./pages/Preparando";
import Gerir from "./pages/Gerir";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Shell = () => {
  const isIdle = useStore((s) => s.isIdle);
  const location = useLocation();
  const showIdle = isIdle && !location.pathname.startsWith("/gerir");

  return (
    <IdleWatcher>
      {showIdle && <IdleScreen />}
      <Routes>
        <Route path="/" element={<Produtos />} />
        <Route path="/pagamento" element={<Pagamento />} />
        <Route path="/preparando" element={<Preparando />} />
        <Route path="/gerir" element={<Gerir />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </IdleWatcher>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
