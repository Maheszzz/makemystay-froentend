import { ArrowRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'dark' | 'gold';
    icon?: typeof ArrowRight;
}

export function Button({ children, variant = 'primary', className = '', icon: Icon, ...props }: ButtonProps) {
    const baseStyles = "px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2";

    const variants = {
        primary: "bg-red hover:bg-red-hover text-white font-semibold active:scale-95",
        secondary: "bg-white text-ink hover:bg-blush-100 border border-line shadow-sm",
        outline: "border border-ink text-ink hover:border-red hover:bg-red hover:text-white",
        ghost: "text-slate hover:bg-blush-100",
        dark: "bg-red-800 text-white hover:bg-red-900 shadow-glass border border-champagne/30",
        link: "text-red hover:underline p-0 h-auto",
        gold: "bg-red-800 text-white hover:bg-red-900"
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            {Icon && <Icon className="w-4 h-4 mr-2" />}
            {children}
            {/* If icon is passed but not intended as left icon (logic adjustment needed if rigorous, but for now simple) */}
        </button>
    );
}
