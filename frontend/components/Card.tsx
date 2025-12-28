import { HTMLAttributes, forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    noPadding?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, noPadding = false, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm",
                    !noPadding && "p-6",
                    className
                )}
                {...props}
            />
        );
    }
);

Card.displayName = "Card";
