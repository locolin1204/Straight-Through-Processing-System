import React from 'react';
import { Loader2Icon } from "lucide-react";

export default function LoadingCircle({size = 24}:{ size?: number }) {
    return (
        <div className="flex flex-row justify-center items-center h-full">
            <Loader2Icon className="animate-spin" size={size} />
        </div>
    );
}