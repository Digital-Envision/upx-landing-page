import { clsx } from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  as?: "button" | "a";
  href?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  as = "button",
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = clsx(
    "inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    {
      // Variants
      "bg-primary text-primary-foreground hover:bg-primary-dark shadow-sm hover:shadow-md":
        variant === "primary",
      "bg-accent text-accent-foreground hover:bg-accent-dark shadow-sm hover:shadow-md":
        variant === "secondary",
      "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground":
        variant === "outline",
      "text-foreground hover:bg-border-light": variant === "ghost",

      // Sizes
      "px-4 py-2 text-sm rounded-lg gap-1.5": size === "sm",
      "px-6 py-3 text-sm rounded-xl gap-2": size === "md",
      "px-8 py-4 text-base rounded-xl gap-2.5": size === "lg",
    },
    className
  );

  if (as === "a" && href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
