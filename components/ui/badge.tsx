import { clsx } from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "accent" | "muted";
}

export function Badge({
  children,
  className,
  variant = "primary",
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        {
          "bg-primary/10 text-primary": variant === "primary",
          "bg-accent/10 text-accent-dark": variant === "accent",
          "bg-border-light text-muted-foreground": variant === "muted",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
