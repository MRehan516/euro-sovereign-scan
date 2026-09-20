import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="mb-10 max-w-3xl">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-3 font-display text-[40px] leading-[1.08] font-semibold text-foreground">{title}</h1>
      {intro ? <p className="mt-4 text-body text-muted-foreground">{intro}</p> : null}
    </header>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return <main className="mx-auto w-full max-w-5xl px-6 py-12 lg:px-12 lg:py-16">{children}</main>;
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="max-w-3xl space-y-5 text-body text-foreground/85">{children}</div>;
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mt-12 mb-4 font-display text-[30px] leading-tight font-semibold">{children}</h2>;
}

export function SubTitle({ children }: { children: ReactNode }) {
  return <h3 className="mt-8 mb-2 text-[21px] font-bold text-foreground">{children}</h3>;
}
