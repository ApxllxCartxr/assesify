import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
    size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        const variants = {
            primary: "bg-brand-green border-brand-green-dark text-white hover:bg-brand-green/90",
            secondary: "bg-brand-blue border-brand-blue-dark text-white hover:bg-brand-blue/90",
            danger: "bg-brand-red border-brand-red-dark text-white hover:bg-brand-red/90",
            ghost: "bg-transparent border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700 shadow-none border-b-0",
            outline: "bg-transparent border-slate-200 text-slate-500 hover:bg-slate-50 border-2 border-b-4",
        };

        const sizes = {
            sm: "h-9 px-4 text-sm",
            md: "h-11 px-6 text-base",
            lg: "h-14 px-8 text-lg",
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-xl font-bold uppercase tracking-wider transition-all active:border-b-0 active:translate-y-1",
                    variant !== "ghost" && "border-b-4",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";
