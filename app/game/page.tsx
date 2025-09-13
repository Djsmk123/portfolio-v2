"use client";

import { useEffect, useRef, useState } from "react";

export default function GamePage() {
  const [score, setScore] = useState(0);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const areaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setPos({ x: Math.random() * 90, y: Math.random() * 90 });
    }, 1200);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="min-h-dvh px-4 py-10 md:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold">Mini Game</h1>
        <p className="text-muted-foreground mt-2">Catch the dot. Mobile friendly.</p>
        <div ref={areaRef} className="mt-6 relative h-[360px] rounded-lg border overflow-hidden touch-none select-none">
          <button
            onClick={() => setScore((s) => s + 1)}
            className="absolute size-6 rounded-full bg-primary"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
            aria-label="target"
          />
        </div>
        <div className="mt-4">Score: <span className="font-semibold">{score}</span></div>
      </div>
    </main>
  );
}

