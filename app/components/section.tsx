export function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 md:px-8 py-8 md:py-8">
      {children}
    </section>
  );
}

export function LargeTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-3xl md:text-5xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-2">{children}</h2>;
}

export function SmallTitle({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-sm uppercase tracking-[0.2em] text-muted-foreground animate-in fade-in">{children}</p>;
}

