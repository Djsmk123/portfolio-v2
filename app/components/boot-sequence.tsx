"use client";

import { useEffect, useState } from "react";

export function BootSequence({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1500 + Math.random() * 1000);
    return () => clearTimeout(t);
  }, []);

  if (!ready) {
    return (
      <div className="fixed inset-0 z-50c grid place-items-center bg-background">
        <div className="w-[90vw] max-w-md rounded-lg border p-6 font-mono text-sm">
          <p> booting portfolio OS...</p>
          <p className="mt-2">loading ui modules... <span className="animate-pulse">█</span></p>
          <p className="mt-2">spawning shaders... ok</p>
          <p className="mt-2">connecting github... ok</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

