'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- 1. Date Context Setup ---
interface DateContextType {
    userSelectedDate: Date | undefined;
    setUserSelectedDate: (date: Date | undefined) => void;
    currentTime: Date | undefined;
}

export const DateContext = createContext<DateContextType | undefined>(undefined);

// Custom hook to use the DateContext
export function useDateContext() {
    const context = useContext(DateContext);
    if (!context) {
        throw new Error('useDateContext must be used within a DateProvider');
    }
    return context;
}

export function DateProvider({ children }: { children: ReactNode }) {
    const [userSelectedDate, setUserSelectedDateState] = useState<Date | undefined>(undefined);
    const [currentTime, setCurrentTime] = useState<Date | undefined>(undefined);

    // Wrap setUserSelectedDate to also update currentTime synchronously
    const setUserSelectedDate = (date: Date | undefined) => {
        setUserSelectedDateState(date);
        if (date) {
            setCurrentTime(new Date(date));
        }
    };

    // Initialize date and time
    useEffect(() => {
        const initialDate = new Date('2025-08-05T13:00:00.000Z');
        setUserSelectedDateState(initialDate);
        setCurrentTime(initialDate);
    }, []);

    // Timer to update currentTime every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(prevTime => {
                const newTime = prevTime ? new Date(prevTime) : new Date();
                newTime.setMinutes(newTime.getMinutes() + 1);
                return newTime;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const value = { userSelectedDate, setUserSelectedDate, currentTime };

    return <DateContext.Provider value={value}>{children}</DateContext.Provider>;
}