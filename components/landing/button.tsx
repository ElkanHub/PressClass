import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'dark' | 'link';
    icon?: React.ElementType;
}

const Button = ({ children, variant = 'primary', className = '', icon: Icon, ...props }: ButtonProps) => {
    const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-full font-medium transition-all duration-200 text-sm md:text-base";

    const variants = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
        secondary: "bg-card text-card-foreground border border-border hover:bg-muted shadow-sm",
        // Dark variant is typically used in the already-dark CTA section
        dark: "bg-background text-foreground hover:bg-muted",
        link: "text-muted-foreground hover:text-primary px-0 py-0 bg-transparent"
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            {children}
            {Icon && <Icon className="ml-2 w-4 h-4" />}
        </button>
    );
};

export default Button;
