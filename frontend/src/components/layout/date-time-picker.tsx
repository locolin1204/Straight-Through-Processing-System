"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDateContext } from "@/contexts/date-context"
import { enGB } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils";
import { format, subHours } from "date-fns";

export function DateTimePicker() {
    const { currentTime, userSelectedDate, setUserSelectedDate } = useDateContext()
    const [isMounted, setIsMounted] = React.useState(false)

    React.useEffect(() => {
        setIsMounted(true)
    }, [])

    const formatTime = (date: Date | undefined): string => {
        if (!date) return ''
        const hours = date.getUTCHours().toString().padStart(2, '0')
        const minutes = date.getUTCMinutes().toString().padStart(2, '0')
        const seconds = date.getUTCSeconds().toString().padStart(2, '0')
        return `${hours}:${minutes}:${seconds}`
    }

    function formatCurrentTime (date: number | undefined) {
        if (!date) return ''
        return format(subHours(date, 8), 'dd MMM yyyy HH:mm')
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const timeValue = e.target.value // e.g., "14:30:00" or "14:30"
        if (!timeValue || !userSelectedDate) return

        // Split time value, handle cases where seconds might be missing
        const [hoursStr, minutesStr, secondsStr = '0'] = timeValue.split(':').map(str => str.trim())
        const hours = parseInt(hoursStr, 10)
        const minutes = parseInt(minutesStr, 10)
        const seconds = parseInt(secondsStr, 10)

        // Validate parsed values
        if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return

        // Update userSelectedDate with new time in UTC
        const combinedDate = new Date(userSelectedDate)
        combinedDate.setUTCHours(hours, minutes, seconds, 0)
        setUserSelectedDate(combinedDate)
    }


    const handleDateChange = (newDate: Date | undefined) => {
        if (!newDate) return
        const combinedDate = new Date(newDate)
        if (userSelectedDate) {
            combinedDate.setHours(
                userSelectedDate.getHours(),
                userSelectedDate.getMinutes(),
                userSelectedDate.getSeconds(),
                userSelectedDate.getMilliseconds()
            )
        }
        setUserSelectedDate(combinedDate)
    }

    if (!isMounted) {
        return null
    }

    return (
        <div className="flex flex-col gap-4 mx-4 pb-20">
            <Badge variant="outline" className="w-full text-base">{formatCurrentTime(currentTime?.getTime())}</Badge>
            <div className="flex flex-col gap-2">
                <div className="mx-1 flex flex-row justify-between items-center">
                    <Label htmlFor="date-picker" className="px-1">
                        Date
                    </Label>
                    <div className="text-sm font-light">
                        <Badge variant="secondary">
                            {userSelectedDate ? userSelectedDate.toLocaleDateString('en-GB', { timeZone: 'UTC' }) : "Select date"}
                        </Badge>
                    </div>
                </div>
                <Calendar
                    className="-mb-10 mx-1 transform scale-85 origin-top-left border border-input dark:bg-input/30 rounded-md"
                    mode="single"
                    selected={userSelectedDate}
                    captionLayout="dropdown"
                    locale={enGB}
                    weekStartsOn={0}
                    onSelect={handleDateChange}
                />
            </div>
            <div className="flex flex-col gap-3">
                <Label htmlFor="time-picker" className="px-1">
                    Time
                </Label>
                <Input
                    type="time"
                    id="time-picker"
                    step="1"
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    value={userSelectedDate ? formatTime(userSelectedDate) : ''}
                    // onChange={handleTimeChange}
                    onChange={handleTimeChange}
                />
            </div>
        </div>
    )
}