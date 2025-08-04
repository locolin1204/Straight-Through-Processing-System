'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- 1. Date Context Setup ---
// The DateContext provides the selected date and the function to set it.
interface DateContextType {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
}

export const DateContext = createContext<DateContextType | undefined>(undefined);

// A custom hook to use the DateContext.
// Throws an error if used outside of the DateProvider.
export function useDateContext() {
    const context = useContext(DateContext);
    if (!context) {
        throw new Error('useDateContext must be used within a DateProvider');
    }
    return context;
}

export function DateProvider({ children }: { children: ReactNode }) {
    const [date, setDate] = useState<Date | undefined>(undefined);


    useEffect(() => {
        setDate(new Date('2025-08-05T13:00:00.000Z'));
    }, []);

    const value = { date, setDate };

    return <DateContext.Provider value={value}>{children}</DateContext.Provider>;
}
