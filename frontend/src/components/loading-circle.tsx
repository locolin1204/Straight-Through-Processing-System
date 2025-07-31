import React from 'react';
import { Loader2Icon } from "lucide-react";

export default function LoadingCircle() {
    return (
        <div className="mx-auto my-auto">
            <Loader2Icon className="animate-spin" />
        </div>
    );
}