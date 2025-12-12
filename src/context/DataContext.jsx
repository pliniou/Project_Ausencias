import React, { createContext, useContext, useState } from 'react';
import { employees as initialEmployees, leaves as initialLeaves, holidays as initialHolidays, companyEvents as initialEvents } from '@/lib/mockData';
import { getLeaveStatus } from '@/lib/dateUtils';

const DataContext = createContext(undefined);

export function DataProvider({ children }) {
    // Initialize state from localStorage or fallback to mock data
    const [employees, setEmployees] = useState(() => {
        const saved = localStorage.getItem('employees');
        return saved ? JSON.parse(saved) : initialEmployees;
    });
    const [leaves, setLeaves] = useState(() => {
        const saved = localStorage.getItem('leaves');
        return saved ? JSON.parse(saved) : initialLeaves;
    });
    const [holidays, setHolidays] = useState(() => {
        const saved = localStorage.getItem('holidays');
        return saved ? JSON.parse(saved) : initialHolidays;
    });
    const [companyEvents, setCompanyEvents] = useState(() => {
        const saved = localStorage.getItem('companyEvents');
        return saved ? JSON.parse(saved) : initialEvents;
    });

    // Save to localStorage whenever state changes
    React.useEffect(() => {
        localStorage.setItem('employees', JSON.stringify(employees));
    }, [employees]);

    React.useEffect(() => {
        localStorage.setItem('leaves', JSON.stringify(leaves));
    }, [leaves]);

    React.useEffect(() => {
        localStorage.setItem('holidays', JSON.stringify(holidays));
    }, [holidays]);

    React.useEffect(() => {
        localStorage.setItem('companyEvents', JSON.stringify(companyEvents));
    }, [companyEvents]);

    const generateId = () => Math.random().toString(36).substr(2, 9);

    const addEmployee = (employee) => {
        setEmployees(prev => [...prev, { ...employee, id: generateId() }]);
    };

    const updateEmployee = (id, updates) => {
        setEmployees(prev => prev.map(emp =>
            emp.id === id ? { ...emp, ...updates } : emp
        ));
    };

    const deleteEmployee = (id) => {
        setEmployees(prev => prev.filter(emp => emp.id !== id));
    };

    const addLeave = (leave) => {
        const status = getLeaveStatus(leave.startDate, leave.endDate);
        setLeaves(prev => [...prev, { ...leave, id: generateId(), status }]);
    };

    const updateLeave = (id, updates) => {
        setLeaves(prev => prev.map(leave => {
            if (leave.id === id) {
                const updated = { ...leave, ...updates };
                if (updates.startDate || updates.endDate) {
                    updated.status = getLeaveStatus(
                        updates.startDate || leave.startDate,
                        updates.endDate || leave.endDate
                    );
                }
                return updated;
            }
            return leave;
        }));
    };

    const validateVacationRule = (employeeId, startDate, daysOff, acquisitiveStart, acquisitiveEnd) => {
        // Find other vacations in the same acquisitive period
        const employeeVacations = leaves.filter(l =>
            l.employeeId === employeeId &&
            l.type === 'FERIAS' &&
            l.acquisitivePeriodStart === acquisitiveStart
        );

        const totalDaysTaken = employeeVacations.reduce((sum, l) => sum + l.daysOff, 0);
        const newTotal = totalDaysTaken + daysOff;

        if (newTotal > 30) {
            return { valid: false, message: `Limite de 30 dias excedido. Saldo atual: ${30 - totalDaysTaken} dias.` };
        }

        if (daysOff < 5) {
            return { valid: false, message: 'Nenhum período de férias pode ser inferior a 5 dias corridos (CLT).' };
        }

        // Check the 14-day rule
        // We need to simulate the set of periods including the new one
        const allPeriods = [...employeeVacations.map(l => l.daysOff), daysOff];
        const hasFourteenDays = allPeriods.some(d => d >= 14);

        // If this is the last chunk (total near 30), ensure one was >= 14
        if (newTotal >= 30 && !hasFourteenDays) {
            return { valid: false, message: 'Pelo menos um dos períodos de férias deve ter 14 dias ou mais (CLT).' };
        }

        return { valid: true };
    };

    const deleteLeave = (id) => {
        setLeaves(prev => prev.filter(leave => leave.id !== id));
    };

    const addHoliday = (holiday) => {
        setHolidays(prev => [...prev, { ...holiday, id: generateId() }]);
    };

    // ... validateVacationRule to be added to return value ...

    const updateHoliday = (id, updates) => {
        setHolidays(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
    };

    const deleteHoliday = (id) => {
        setHolidays(prev => prev.filter(h => h.id !== id));
    };

    const addCompanyEvent = (event) => {
        setCompanyEvents(prev => [...prev, { ...event, id: generateId() }]);
    };

    const updateCompanyEvent = (id, updates) => {
        setCompanyEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    };

    const deleteCompanyEvent = (id) => {
        setCompanyEvents(prev => prev.filter(e => e.id !== id));
    };

    const getEmployeeById = (id) => employees.find(emp => emp.id === id);

    const getActiveLeaves = () => leaves.filter(leave => leave.status === 'ATIVO');

    const getPlannedLeaves = () => leaves.filter(leave => leave.status === 'PLANEJADO');

    const getTodayLeaves = () => {
        const today = new Date().toISOString().split('T')[0];
        return leaves.filter(leave => {
            return leave.startDate <= today && leave.endDate >= today;
        });
    };

    return (
        <DataContext.Provider value={{
            employees,
            leaves,
            holidays,
            companyEvents,
            addEmployee,
            updateEmployee,
            deleteEmployee,
            addLeave,
            updateLeave,
            deleteLeave,
            addHoliday,
            updateHoliday,
            deleteHoliday,
            addCompanyEvent,
            updateCompanyEvent,
            deleteCompanyEvent,
            getEmployeeById,
            getActiveLeaves,
            getPlannedLeaves,
            getTodayLeaves,
            validateVacationRule,
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
