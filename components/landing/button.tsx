import React from 'react';

type ButtonVariants = 'primary' | 'secondary' | 'dark' | 'link';

interface BaseProps {
    variant?: ButtonVariants;
    icon?: React.ElementType;
    className?: string;
    children: React.ReactNode;
}

type ButtonProps<T extends React.ElementType> = BaseProps & {
    as?: T;
} & React.ComponentPropsWithoutRef<T>;

const Button = <T extends React.ElementType = 'button'>({
    as,
    children,
    variant = 'primary',
    className = '',
    icon: Icon,
    ...props
}: ButtonProps<T>) => {
    const Component = as || 'button';

    const baseStyles =
        "inline-flex items-center justify-center px-6 py-3 rounded-full font-medium transition-all duration-200 text-sm md:text-base";

    const variants = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
        secondary: "bg-card text-card-foreground border border-border hover:bg-muted shadow-sm",
        // Dark variant is typically used in the already-dark CTA section
        dark: "bg-background text-foreground hover:bg-muted",
        link: "text-muted-foreground hover:text-primary px-0 py-0 bg-transparent"
    };

    return (
        <Component
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
            {Icon && <Icon className="ml-2 w-4 h-4" />}
        </Component>
    );
};

export default Button;
