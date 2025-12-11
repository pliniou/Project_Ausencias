import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "@/context/DataContext";
import Index from "./pages/Index";
import CalendarPage from "./pages/CalendarPage";
import LeavesPage from "./pages/LeavesPage";
import RegistrationsPage from "./pages/RegistrationsPage";
import NotFound from "./pages/NotFound";

import { ThemeProvider } from "@/context/ThemeContext";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <ThemeProvider>
            <TooltipProvider>
                <DataProvider>
                    <Toaster />
                    <Sonner />
                    <HashRouter>
                        <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/calendario" element={<CalendarPage />} />
                            <Route path="/afastamentos" element={<LeavesPage />} />
                            <Route path="/cadastros" element={<RegistrationsPage />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </HashRouter>
                </DataProvider>
            </TooltipProvider>
        </ThemeProvider>
    </QueryClientProvider>
);

export default App;
