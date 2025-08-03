// "use client"
//
// import * as React from "react"
//
// import { Calendar } from "@/components/ui/calendar"
//
// export function DateTimePicker() {
//     const [date, setDate] = React.useState<Date | undefined>(
//         new Date(2025, 5, 12)
//     )
//
//     return (
//         <Calendar
//             mode="single"
//             defaultMonth={date}
//             numberOfMonths={2}
//             selected={date}
//             onSelect={setDate}
//             className="rounded-lg border shadow-sm"
//         />
//     )
// }

"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDateContext } from "@/contexts/date-context";
import { enGB } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export function DateTimePicker() {
    const { date, setDate } = useDateContext();
    const [isMounted, setIsMounted] = React.useState(false);

    // 2. Set isMounted to true after the component mounts
    React.useEffect(() => {
        setIsMounted(true);
    }, []);
    // const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const [hours, minutes, seconds] = e.target.value.split(':').map(Number);
    //
    //     if (date && !isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
    //         const newDate = new Date(date);
    //         newDate.setHours(hours, minutes, seconds, 0); // Assuming milliseconds are 0
    //         setDate(newDate);
    //     }
    // };

    const formatTime = (date: Date | null): string => {
        if (!date) return '';
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };
    const handleTimeChange = (e: any) => {
        const [hours, minutes, seconds] = e.target.value.split(':').map(Number);
        if (date) {
            const combinedDate = new Date(date);
            combinedDate.setHours(
                hours, minutes, seconds, 0
            );
            setDate(combinedDate);
        }
    };

    const handleDateChange = (newDate: Date) => {
        // setDisplayDate(date.toLocaleDateString());
        // setDate()
        const combinedDate = new Date(newDate);
        combinedDate.setHours(
            date?.getHours()!,
            date?.getMinutes(),
            date?.getSeconds(),
            date?.getMilliseconds()
        );

        setDate(combinedDate);
    };

    if (!isMounted) {
        // You can return a loading skeleton here if you want
        return null;
    }

    return (
        <div className="flex flex-col gap-4 mx-4 pb-20">
                <div className="flex flex-col gap-2 ">
                    <div className="mx-1 flex flex-row justify-between items-center">
                        <Label htmlFor="date-picker" className="px-1">
                            Date
                        </Label>
                        <div className="text-sm font-light">
                            <Badge variant="secondary">
                                {date ? date.toLocaleDateString('en-GB') : "Select date"}
                            </Badge>
                        </div>
                    </div>
                    <Calendar
                        className="-mb-10 mx-1 transform scale-85 origin-top-left border border-input dark:bg-input/30  rounded-md"
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        locale={enGB}
                        onSelect={(date) => {
                            if (date) {
                                handleDateChange(date)
                            }
                            // setDate(date)
                            // setOpen(false)
                        }}
                    />
                </div>
                {/*<Popover open={open} onOpenChange={setOpen}>*/}
                {/*    <PopoverTrigger asChild>*/}
                {/*        <Button*/}
                {/*            variant="outline"*/}
                {/*            id="date-picker"*/}
                {/*            className="justify-between font-normal"*/}
                {/*        >*/}
                {/*            {date ? date.toLocaleDateString() : "Select date"}*/}
                {/*            <ChevronDownIcon />*/}
                {/*        </Button>*/}
                {/*    </PopoverTrigger>*/}
                {/*    <PopoverContent className="w-auto overflow-hidden p-0" align="start">*/}
                {/*        <Calendar*/}
                {/*            mode="single"*/}
                {/*            selected={date}*/}
                {/*            captionLayout="dropdown"*/}
                {/*            onSelect={(date) => {*/}
                {/*                if (date) {*/}
                {/*                    handleDateChange(date)*/}
                {/*                }*/}
                {/*                // setDate(date)*/}
                {/*                setOpen(false)*/}
                {/*            }}*/}
                {/*        />*/}
                {/*    </PopoverContent>*/}
                {/*</Popover>*/}
            <div className="flex flex-col gap-3">
                <Label htmlFor="time-picker" className="px-1">
                    Time
                </Label>
                <Input
                    type="time"
                    id="time-picker"
                    step="1"
                    // defaultValue="10:30:00"
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    value={date?.toLocaleTimeString()}
                    onChange={handleTimeChange}
                />
            </div>
        </div>
    )
}
