import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';
import { getCalendarDays, formatMonthYear, nextMonth, prevMonth, isToday, isWeekend, isDateInRange } from '@/lib/dateUtils';
import { leaveTypeColors, leaveTypeLabels } from '@/lib/types';
import { cn } from '@/lib/utils';


const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

interface CalendarViewProps {
    onSelectDate?: (date: Date) => void;
    selectedEmployeeId?: string;
    selectedLeaveType?: string;
}

export function CalendarView({ onSelectDate, selectedEmployeeId, selectedLeaveType }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const { leaves, holidays, companyEvents } = useData();

    const calendarDays = useMemo(() => getCalendarDays(currentDate), [currentDate]);

    const filteredLeaves = useMemo(() => {
        return leaves.filter(leave => {
            if (selectedEmployeeId && leave.employeeId !== selectedEmployeeId) return false;
            if (selectedLeaveType && leave.type !== selectedLeaveType) return false;
            return true;
        });
    }, [leaves, selectedEmployeeId, selectedLeaveType]);

    const getLeavesForDay = (date: Date) => {
        return filteredLeaves.filter(leave =>
            isDateInRange(date, leave.startDate, leave.endDate)
        );
    };

    const getHolidayForDay = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return holidays.find(h => h.date === dateStr);
    };

    const getEventsForDay = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return companyEvents.filter(e => e.date === dateStr);
    };

    return (
        <div className="bg-card/95 backdrop-blur rounded-2xl border border-border/50 p-6 shadow-xl animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-display font-bold text-foreground capitalize tracking-tight flex items-center gap-2">
                    {formatMonthYear(currentDate)}
                </h2>
                <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentDate(prevMonth(currentDate))}
                        className="hover:bg-background shadow-none"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        className="px-4 font-medium hover:bg-background shadow-none"
                        onClick={() => setCurrentDate(new Date())}
                    >
                        Hoje
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentDate(nextMonth(currentDate))}
                        className="hover:bg-background shadow-none"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Week days header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
                {weekDays.map((day, index) => (
                    <div
                        key={day}
                        className={cn(
                            'text-center text-sm font-semibold py-2 uppercase tracking-wider text-xs',
                            index === 0 || index === 6 ? 'text-destructive/70' : 'text-muted-foreground'
                        )}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2 bg-muted/20 p-2 rounded-xl ring-1 ring-border/50">
                {calendarDays.map((day, index) => {
                    if (!day) {
                        return <div key={`empty-${index}`} className="aspect-square bg-transparent" />;
                    }

                    const dayLeaves = getLeavesForDay(day);
                    const holiday = getHolidayForDay(day);
                    const dayEvents = getEventsForDay(day);
                    const isCurrentDay = isToday(day);
                    const isWeekendDay = isWeekend(day);

                    return (
                        <div
                            key={day.toISOString()}
                            onClick={() => onSelectDate?.(day)}
                            className={cn(
                                'group relative aspect-square flex flex-col justify-between p-2 rounded-xl transition-all duration-300 hover:ring-2 hover:ring-primary/50 hover:bg-card hover:shadow-lg cursor-pointer overflow-hidden',
                                isCurrentDay
                                    ? 'bg-primary/10 ring-2 ring-primary shadow-inner'
                                    : 'bg-card/50 hover:scale-105 hover:z-10',
                                isWeekendDay && !isCurrentDay && 'bg-muted/10 opacity-80',
                                holiday && 'bg-destructive/5 ring-1 ring-destructive/20'
                            )}
                        >
                            <div className="flex justify-between items-start">
                                <span className={cn(
                                    'text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full transition-colors',
                                    isCurrentDay
                                        ? 'bg-primary text-white shadow-md'
                                        : 'text-muted-foreground group-hover:text-foreground',
                                    holiday && 'text-destructive'
                                )}>
                                    {day.getDate()}
                                </span>
                                {dayEvents.length > 0 && (
                                    <div className="flex gap-0.5">
                                        {dayEvents.map((ev, i) => (
                                            <div
                                                key={i}
                                                className="w-2 h-2 rounded-full bg-leave-study"
                                                title={`Evento: ${ev.name}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {holiday && (
                                <div className="absolute top-2 right-2" title={holiday.name}>
                                    <span className="flex h-2 w-2 rounded-full bg-destructive animate-pulse" />
                                </div>
                            )}

                            <div className="flex flex-col gap-0.5 w-full mt-1 overflow-hidden flex-1 justify-end">
                                {dayLeaves.slice(0, 4).map((leave) => (
                                    <div
                                        key={leave.id}
                                        className={cn(
                                            'text-[8px] leading-3 px-1 py-0.5 rounded-[3px] truncate font-medium shadow-sm transition-transform hover:scale-105',
                                            leaveTypeColors[leave.type]
                                        )}
                                        title={`${leave.employeeName} - ${leaveTypeLabels[leave.type]}`}
                                    >
                                        {leave.employeeName.split(' ')[0]}
                                    </div>
                                ))}
                                {dayLeaves.length > 4 && (
                                    <span className="text-[9px] text-muted-foreground font-medium pl-1">
                                        +{dayLeaves.length - 4}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-8 flex flex-wrap gap-4 items-center justify-center py-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-leave-vacation" />
                    <span className="text-xs text-muted-foreground">Férias</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-leave-medical" />
                    <span className="text-xs text-muted-foreground">Licença Médica</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-leave-maternity" />
                    <span className="text-xs text-muted-foreground">Maternidade/Paternidade</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-xs text-muted-foreground">Hoje</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-destructive" />
                    <span className="text-xs text-muted-foreground">Feriado</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-leave-study" />
                    <span className="text-xs text-muted-foreground">Evento</span>
                </div>
            </div>
        </div>
    );
}
