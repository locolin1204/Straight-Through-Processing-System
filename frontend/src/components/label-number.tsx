import React from 'react';
import { Label } from "@/components/ui/label";
import { clsx } from "clsx";

export default function LabelNumber({
                                        label, formattedNumber
                                    }: { label: string, formattedNumber: string }) {
    return (
        <div>
            <Label className="text-muted-foreground text-sm">{label}</Label>
            <p className={clsx("leading-none font-semibold")}>{formattedNumber}</p>
        </div>
    );
}