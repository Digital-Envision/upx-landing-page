import { clsx } from "clsx";
import { Container } from "./container";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: "default" | "blue" | "cyan" | "indigo" | "mint" | "warm" | "rose";
  id?: string;
}

export function Section({
  children,
  className,
  background = "default",
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={clsx(
        "py-16 md:py-24",
        {
          "bg-background": background === "default",
          "bg-section-blue": background === "blue",
          "bg-section-cyan": background === "cyan",
          "bg-section-indigo": background === "indigo",
          "bg-section-mint": background === "mint",
          "bg-section-warm": background === "warm",
          "bg-section-rose": background === "rose",
        },
        className
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}
