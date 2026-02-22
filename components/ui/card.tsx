import { clsx } from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "bordered" | "elevated" | "pastel";
  pastelColor?: "blue" | "cyan" | "indigo" | "mint" | "warm" | "rose";
  padding?: "sm" | "md" | "lg";
}

export function Card({
  children,
  className,
  variant = "default",
  pastelColor,
  padding = "md",
}: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl transition-all duration-200",
        {
          // Variants
          "bg-card-bg": variant === "default",
          "bg-card-bg border border-card-border": variant === "bordered",
          "bg-card-bg shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10":
            variant === "elevated",
          "bg-section-blue": variant === "pastel" && pastelColor === "blue",
          "bg-section-cyan": variant === "pastel" && pastelColor === "cyan",
          "bg-section-indigo": variant === "pastel" && pastelColor === "indigo",
          "bg-section-mint": variant === "pastel" && pastelColor === "mint",
          "bg-section-warm": variant === "pastel" && pastelColor === "warm",
          "bg-section-rose": variant === "pastel" && pastelColor === "rose",

          // Padding
          "p-4": padding === "sm",
          "p-6": padding === "md",
          "p-8 md:p-10": padding === "lg",
        },
        className
      )}
    >
      {children}
    </div>
  );
}
