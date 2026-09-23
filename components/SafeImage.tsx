"use client";

import { useState } from "react";
import Image from "next/image";
import { HelpCircle } from "lucide-react";

export default function SafeImage({ src, alt, ...props }: { src: string; alt: string;[key: string]: any }) {
    const [hasError, setHasError] = useState(false);

    const isValidUrl = src && src.trim() !== "" && src !== "undefined" && src !== "null";

    if (hasError || !isValidUrl) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-100 text-black/40 min-h-[180px]">
                <HelpCircle className="w-10 h-10 mb-1 stroke-[1.5]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">No Image</span>
            </div>
        );
    }

    return (
        <Image
            {...props}
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            unoptimized
            referrerPolicy="no-referrer"
        />
    );
}