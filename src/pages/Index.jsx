import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Clock, TrendingUp, Plus, CalendarDays, Settings, ArrowRight, Info } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { StatCard } from '@/components/ui/StatCard';
import { LeaveCard } from '@/components/leaves/LeaveCard';
import { LeaveBadge } from '@/components/ui/LeaveBadge';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

function BrasiliaClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedTime = time.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });
    const formattedDate = time.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', weekday: 'long', day: '2-digit', month: 'long' });

    return (
        <div className="flex flex-col items-start bg-black/20 backdrop-blur rounded-lg px-4 py-2 border border-white/10">
            <span className="text-2xl font-bold text-white font-mono tracking-wider">{formattedTime}</span>
            <span className="text-xs text-white/80 capitalize">{formattedDate}</span>
            <span className="text-[10px] text-white/60 uppercase tracking-widest mt-1">Horário de Brasília</span>
        </div>
    );
}

export default function Index() {
    const { employees, leaves, getActiveLeaves, getPlannedLeaves, deleteLeave } = useData();

    const activeLeaves = getActiveLeaves();
    const plannedLeaves = getPlannedLeaves();
    const activeEmployees = employees.filter(e => e.status === 'ATIVO');

    // Calculate most common leave types
    const leaveTypeCount = leaves.reduce((acc, leave) => {
        acc[leave.type] = (acc[leave.type] || 0) + 1;
        return acc;
    }, {});

    const topLeaveTypes = Object.entries(leaveTypeCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4);

    return (
        <Layout>
            <div className="space-y-8 animate-fade-in relative">
                {/* Hero Section with Quick Actions */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 to-slate-900 p-8 md:p-12 shadow-2xl border border-white/5">
                    {/* Background Mesh */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 flex flex-col justify-between h-full space-y-8">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white bg-white/10 backdrop-blur-md rounded-full ring-1 ring-white/20">
                                        Versão 2.4.0
                                    </span>
                                </div>

                                <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight max-w-2xl">
                                    Gestão Inteligente de <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                                        Jornadas e Ausências
                                    </span>
                                </h1>

                                <p className="text-white/70 text-lg leading-relaxed max-w-xl">
                                    Acompanhe o fluxo de trabalho, gerencie escalas e garanta a conformidade com as diretrizes da empresa.
                                </p>
                            </div>

                            <BrasiliaClock />
                        </div>

                        {/* Quick Actions - Compact */}
                        <div className="lg:col-span-1 self-center">
                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
                                <h3 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" />
                                    Acesso Rápido
                                </h3>
                                <div className="space-y-2">
                                    <Link to="/afastamentos" className="block">
                                        <Button size="sm" className="w-full justify-start gap-3 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md border-0 h-10">
                                            <Plus className="h-4 w-4" />
                                            Novo Afastamento
                                        </Button>
                                    </Link>
                                    <Link to="/calendario" className="block">
                                        <Button size="sm" variant="outline" className="w-full justify-start gap-3 border-white/20 text-white hover:bg-white/10 hover:text-white h-10 bg-transparent">
                                            <CalendarDays className="h-4 w-4" />
                                            Calendário
                                        </Button>
                                    </Link>
                                    <Link to="/cadastros" className="block">
                                        <Button size="sm" variant="outline" className="w-full justify-start gap-3 border-white/20 text-white hover:bg-white/10 hover:text-white h-10 bg-transparent">
                                            <Settings className="h-4 w-4" />
                                            Cadastros
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total de Colaboradores"
                        value={activeEmployees.length}
                        subtitle="ativos no sistema"
                        icon={<Users className="h-6 w-6" />}
                        variant="default"
                    />
                    <StatCard
                        title="Ausentes Hoje"
                        value={activeLeaves.length}
                        subtitle="em afastamento"
                        icon={<Clock className="h-6 w-6" />}
                        variant="warning"
                    />
                    <StatCard
                        title="Afastamentos Futuros"
                        value={plannedLeaves.length}
                        subtitle="planejados"
                        icon={<Calendar className="h-6 w-6" />}
                        variant="primary"
                    />
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="cursor-help">
                                    <StatCard
                                        title={<div className="flex items-center gap-2">Aproveitamento <Info className="h-3 w-3 text-muted-foreground" /></div>}
                                        value={`${leaves.length > 0 ? Math.round(leaves.reduce((acc, l) => acc + l.efficiency, 0) / leaves.length) : 0}%`}
                                        subtitle="dias úteis / total"
                                        icon={<TrendingUp className="h-6 w-6" />}
                                        variant="success"
                                    />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="w-[200px] text-xs">Média da proporção de dias de afastamento em relação aos dias trabalhados.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Active Leaves */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-display font-bold text-foreground">
                                Afastamentos Ativos
                            </h2>
                            <Link to="/afastamentos" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">
                                Ver todos <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        {activeLeaves.length === 0 ? (
                            <div className="bg-card rounded-2xl border border-border p-12 text-center shadow-sm">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-primary/10 flex items-center justify-center">
                                    <Users className="h-10 w-10 text-primary" />
                                </div>
                                <h3 className="font-display font-bold text-xl text-foreground mb-3">
                                    Equipe completa!
                                </h3>
                                <p className="text-muted-foreground">
                                    Nenhum colaborador está ausente hoje.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activeLeaves.slice(0, 4).map((leave) => (
                                    <LeaveCard
                                        key={leave.id}
                                        leave={leave}
                                        onDelete={deleteLeave}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Stats Sidebar - Empty for now or reserved for other widgets */}
                    <div className="space-y-6">

                    </div>
                </div>
            </div>
        </Layout>
    );
}
