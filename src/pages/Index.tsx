import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Clock, TrendingUp, Plus, CalendarDays, Settings, ArrowRight, Info, User } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { LeaveBadge } from '@/components/ui/LeaveBadge';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

function BrasiliaClock() {
    const [time, setTime] = useState<Date>(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedTime = time.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const formattedDate = time.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

    return (
        <div className="flex flex-col items-center bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur rounded-xl p-6 border-2 border-border shadow-lg">
            <span className="text-4xl font-bold text-foreground font-mono tracking-wider">{formattedTime}</span>
            <span className="text-sm text-muted-foreground capitalize mt-2">{formattedDate}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Horário de Brasília</span>
        </div>
    );
}

interface HolidayData {
    id: string;
    date: string;
    description: string;
}

function MiniCalendar({ holidays }: { holidays: HolidayData[] }) {
    const today = new Date();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [currentMonth, _setCurrentMonth] = useState(today);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const lastDay = new Date(year, month + 1, 0);
        return lastDay.getDate();
    };

    const getFirstDayOfMonth = (date: Date): number => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        return firstDay.getDay();
    };

    const daysInMonth = getDaysInMonth(currentMonth);
    const startDay = getFirstDayOfMonth(currentMonth);

    const days: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const isHoliday = (day: number | null): boolean => {
        if (!day) return false;
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const dateString = date.toISOString().split('T')[0];
        return holidays.some(h => h.date === dateString);
    };

    const isWeekend = (dayIndex: number): boolean => {
        const day = days[dayIndex];
        if (!day) return false;
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        return date.getDay() === 0 || date.getDay() === 6;
    };

    const isToday = (day: number | null) => {
        if (!day) return false;
        return day === today.getDate() &&
            currentMonth.getMonth() === today.getMonth() &&
            currentMonth.getFullYear() === today.getFullYear();
    };

    const monthName = currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    return (
        <div className="bg-card rounded-xl border-2 border-border p-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-foreground capitalize">{monthName}</h3>
            </div>
            <div className="grid grid-cols-7 gap-1">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, i) => (
                    <div key={day} className={`text-center text-xs font-bold py-1 ${i === 0 || i === 6 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {day}
                    </div>
                ))}
                {days.map((day, index) => (
                    <div
                        key={index}
                        className={`
                            aspect-square flex items-center justify-center text-sm rounded-lg transition-all duration-200
                            ${day ? 'cursor-default' : ''}
                            ${isToday(day) ? 'bg-primary text-primary-foreground font-bold shadow-md ring-2 ring-primary/50' : ''}
                            ${!isToday(day) && isHoliday(day) ? 'bg-warning/30 text-warning-foreground font-semibold border border-warning' : ''}
                            ${!isToday(day) && !isHoliday(day) && isWeekend(index) ? 'bg-destructive/20 text-destructive font-medium' : ''}
                            ${!isToday(day) && !isHoliday(day) && !isWeekend(index) && day ? 'text-foreground hover:bg-muted' : ''}
                            ${!day ? 'text-transparent' : ''}
                        `}
                    >
                        {day || ''}
                    </div>
                ))}
            </div>
            <div className="mt-4 space-y-1 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-primary" />
                    <span className="text-muted-foreground">Hoje</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-warning/30 border border-warning" />
                    <span className="text-muted-foreground">Feriado</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-destructive/20" />
                    <span className="text-muted-foreground">Fim de semana</span>
                </div>
            </div>
        </div>
    );
}

function VacationProgressCard({ employee }: { employee: any }) {
    const usedDays = 30 - (employee.vacationBalance || 0);
    const percentage = (usedDays / 30) * 100;

    return (
        <div className="p-4 bg-card rounded-lg border-2 border-border hover:shadow-lg hover:border-primary/30 transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center ring-1 ring-primary/20">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm text-foreground">{employee.name}</h4>
                        <p className="text-xs text-muted-foreground font-medium">{employee.role}</p>
                    </div>
                </div>
                <span className="text-xs font-bold text-foreground px-2.5 py-1 bg-primary/10 text-primary rounded-md border border-primary/20">
                    {employee.vacationBalance || 0} dias
                </span>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Utilizados: {usedDays} dias</span>
                    <span className="text-foreground font-bold">{percentage.toFixed(0)}%</span>
                </div>
                <Progress value={percentage} className="h-2" />
            </div>
        </div>
    );
}

export default function Index() {
    const { employees, leaves, holidays, getTodayLeaves } = useData();

    const todayLeaves = getTodayLeaves();
    const activeEmployees = employees.filter((e: any) => e.status === 'ATIVO');
    const plannedLeaves = leaves.filter((l: any) => l.status === 'PLANEJADO');

    // Employees away today
    const employeesAwayToday = useMemo(() => {
        return todayLeaves.map(leave => {
            const employee = employees.find((e: any) => e.id === leave.employeeId);
            return { ...leave, employee };
        }).filter((item: any) => item.employee);
    }, [todayLeaves, employees]);

    return (
        <div className="space-y-6 animate-fade-in pb-8">
            {/* Header with Clock */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            Dashboard
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Visão geral do sistema de gestão de ausências
                        </p>
                    </div>
                </div>
                <div>
                    <BrasiliaClock />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total de Colaboradores"
                    value={activeEmployees.length}
                    subtitle="ativos no sistema"
                    icon={<Users className="h-6 w-6" />}
                    variant="default"
                    className=""
                />
                <StatCard
                    title="Ausentes Hoje"
                    value={todayLeaves.length}
                    subtitle="em afastamento"
                    icon={<Clock className="h-6 w-6" />}
                    variant="warning"
                    className=""
                />
                <StatCard
                    title="Afastamentos Futuros"
                    value={plannedLeaves.length}
                    subtitle="planejados"
                    icon={<Calendar className="h-6 w-6" />}
                    variant="primary"
                    className=""
                />
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="cursor-help">
                                <StatCard
                                    title={<div className="flex items-center gap-2">Aproveitamento <Info className="h-3 w-3 text-muted-foreground" /></div>}
                                    value={`${leaves.length > 0 ? Math.round(leaves.reduce((acc: any, l: any) => acc + l.efficiency, 0) / leaves.length) : 0}%`}
                                    subtitle="dias úteis / total"
                                    icon={<TrendingUp className="h-6 w-6" />}
                                    variant="success"
                                    className=""
                                />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="w-[200px] text-xs">Média da proporção de dias de afastamento em relação aos dias trabalhados.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {/* Main 3-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Main Content - Vacation Progress */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-2">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Saldo de Férias</span>
                                <Link to="/cadastros" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
                                    Ver todos <ArrowRight className="h-4 w-4" />
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                            {activeEmployees.slice(0, 6).map((employee: any) => (
                                <VacationProgressCard key={employee.id} employee={employee} />
                            ))}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="border-2 bg-gradient-to-br from-primary/5 to-secondary/5">
                        <CardHeader>
                            <CardTitle className="text-base">Ações Rápidas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Link to="/afastamentos" className="block">
                                <Button className="w-full justify-start gap-3 h-11 shadow-md">
                                    <Plus className="h-4 w-4" />
                                    Novo Afastamento
                                </Button>
                            </Link>
                            <Link to="/calendario" className="block">
                                <Button variant="outline" className="w-full justify-start gap-3 h-11">
                                    <CalendarDays className="h-4 w-4" />
                                    Ver Calendário
                                </Button>
                            </Link>
                            <Link to="/cadastros" className="block">
                                <Button variant="outline" className="w-full justify-start gap-3 h-11">
                                    <Settings className="h-4 w-4" />
                                    Gerenciar Cadastros
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Column 2: Employees Away Today */}
                <div className="lg:col-span-1">
                    <Card className="border-2 h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Afastados Hoje</span>
                                <span className="text-sm font-normal text-muted-foreground">
                                    {employeesAwayToday.length} {employeesAwayToday.length === 1 ? 'pessoa' : 'pessoas'}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                            {employeesAwayToday.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                                        <Users className="h-8 w-8 text-success" />
                                    </div>
                                    <h3 className="font-bold text-lg text-foreground mb-2">
                                        Equipe Completa!
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        Nenhum colaborador está ausente hoje.
                                    </p>
                                </div>
                            ) : (
                                employeesAwayToday.map((item: any) => (
                                    <div key={item.id} className="p-4 bg-muted/30 rounded-lg border-2 border-border hover:shadow-lg hover:border-warning/40 transition-all duration-200">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-warning/15 flex items-center justify-center flex-shrink-0 ring-1 ring-warning/30">
                                                <User className="h-5 w-5 text-warning" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm text-foreground truncate">
                                                    {item.employee.name}
                                                </h4>
                                                <p className="text-xs text-muted-foreground font-medium truncate">
                                                    {item.employee.role}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <LeaveBadge type={item.type} />
                                            <div className="text-xs">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground font-medium">Início:</span>
                                                    <span className="font-semibold text-foreground">
                                                        {new Date(item.startDate).toLocaleDateString('pt-BR')}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground font-medium">Término:</span>
                                                    <span className="font-semibold text-foreground">
                                                        {new Date(item.endDate).toLocaleDateString('pt-BR')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Column 3: Mini Calendar */}
                <div className="lg:col-span-1">
                    <MiniCalendar holidays={holidays as HolidayData[]} />
                </div>
            </div>
        </div>
    );
}
