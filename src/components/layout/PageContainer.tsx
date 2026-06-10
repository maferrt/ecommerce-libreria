import type { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
  eyebrow?: string;
  title?: string;
  description?: string;
};

export function PageContainer({
  children,
  eyebrow,
  title,
  description,
}: PageContainerProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {(eyebrow || title || description) && (
        <header className="mx-auto mb-12 max-w-3xl text-center page-header-enter">
          {eyebrow && (
            <span className="inline-flex rounded-full border border-[rgba(82,31,18,0.16)] bg-[rgba(246,235,217,0.72)] px-4 py-2 font-sans text-xs font-bold uppercase tracking-[0.25em] text-[var(--mel-caramel)]">
              {eyebrow}
            </span>
          )}

          {title && (
            <h1 className="mt-5 font-serif text-5xl font-bold leading-tight text-[var(--mel-brown)] sm:text-6xl lg:text-7xl">
              {title}
            </h1>
          )}

          {description && (
            <p className="mx-auto mt-5 max-w-2xl font-sans text-base leading-7 text-[var(--mel-brown-soft)] sm:text-lg">
              {description}
            </p>
          )}
        </header>
      )}

      <div className="content-enter">{children}</div>
    </section>
  );
}