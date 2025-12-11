import { format, parseISO, isWithinInterval, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isToday, isSameDay, isAfter, isBefore, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDateBR = (date) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'dd/MM/yyyy', { locale: ptBR });
};

export const formatDateLong = (date) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

export const formatMonthYear = (date) => {
    return format(date, "MMMM 'de' yyyy", { locale: ptBR });
};

export const getMonthDays = (date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
};

export const getCalendarDays = (date) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const startDayOfWeek = getDay(monthStart);
    const prefixDays = Array(startDayOfWeek).fill(null);

    return [...prefixDays, ...days];
};

export const isWeekend = (date) => {
    const day = getDay(date);
    return day === 0 || day === 6;
};

export const isDateInRange = (date, start, end) => {
    const startDate = parseISO(start);
    const endDate = parseISO(end);
    return isWithinInterval(date, { start: startDate, end: endDate });
};

export const getLeaveStatus = (startDate, endDate) => {
    const today = startOfDay(new Date());
    const start = startOfDay(parseISO(startDate));
    const end = startOfDay(parseISO(endDate));

    if (isAfter(start, today)) {
        return 'PLANEJADO';
    }
    if (isBefore(end, today)) {
        return 'ENCERRADO';
    }
    return 'ATIVO';
};

export const nextMonth = (date) => addMonths(date, 1);
export const prevMonth = (date) => subMonths(date, 1);

export { isToday, isSameDay, parseISO, format };
