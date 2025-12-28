import { HTMLAttributes, forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
    value: number; // 0 to 100
    color?: "green" | "blue" | "yellow" | "red";
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
    ({ className, value, color = "green", ...props }, ref) => {
        const colors = {
            green: "bg-brand-green",
            blue: "bg-brand-blue",
            yellow: "bg-brand-yellow",
            red: "bg-brand-red",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative",
                    className
                )}
                {...props}
            >
                <div
                    className={cn(
                        "h-full transition-all duration-500 ease-out rounded-full",
                        colors[color]
                    )}
                    style={{ width: `${Math.max(5, Math.min(100, value))}%` }}
                />
                {/* Highlight/shine effect - Subtle opacity overlay */}
                <div
                    className="absolute top-0 left-0 h-1/3 w-full bg-white opacity-20"
                    style={{ width: `${Math.max(5, Math.min(100, value))}%` }}
                />
            </div>
        );
    }
);

ProgressBar.displayName = "ProgressBar";
