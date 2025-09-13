"use client";
import { useEffect, useRef, useCallback } from "react";

const codeSnippets = {
  flutter: [
    "Widget build(BuildContext context)",
    "class MyApp extends StatelessWidget",
    "Navigator.pushNamed(context, '/home')",
    "setState(() => counter++)",
    "AnimationController controller",
    "FutureBuilder<List<Data>>",
    "Theme.of(context).primaryColor",
    "MediaQuery.of(context).size",
    "StreamBuilder<String>",
    "Container(child: Text('Hello'))",
    "Scaffold(appBar: AppBar())",
    "ListView.builder(itemCount: 10)",
    "GestureDetector(onTap: () {})",
    "Material(child: InkWell())",
  ],
  typescript: [
    "interface User { name: string }",
    "const fetchData = async () => {}",
    "type ApiResponse<T> = Promise<T>",
    "useEffect(() => {}, [deps])",
    "React.FC<Props> = ({ children })",
    "const [state, setState] = useState()",
    "export default function Component()",
    "Array<T>.filter(item => item.id)",
    "Promise.all([api1(), api2()])",
    "Record<string, unknown>",
    "const router = useRouter()",
    "import { NextApiRequest } from 'next'",
    "typeof window !== 'undefined'",
    "React.memo(() => <div />)",
  ],
  cpp: [
    "std::vector<int> numbers;",
    "class GameObject : public Entity",
    "template<typename T> void sort()",
    "std::unique_ptr<Data> ptr;",
    "for (auto& item : collection)",
    "virtual void update() override",
    "#include <iostream>",
    "std::make_shared<Component>()",
    "constexpr size_t MAX_SIZE = 100",
    "namespace Engine { class Renderer }",
    "std::mutex data_mutex;",
    "std::thread worker_thread;",
    "lambda: [](auto x) { return x * 2; }",
    "std::optional<Result> result;",
  ],
  python: [
    "def main():",
    "import requests",
    "print('Hello, World!')",
    "if __name__ == '__main__':",
    "import numpy as np",
    "import pandas as pd",
  ],
};

const languages = Object.keys(codeSnippets) as Array<
  keyof typeof codeSnippets
>;

export function InteractiveBg() {
  const ref = useRef<HTMLCanvasElement>(null);

  // 🔥 Use refs instead of state
  const scrollYRef = useRef(0);
  const documentHeightRef = useRef(0);

  const handleScroll = useCallback(() => {
    scrollYRef.current = window.scrollY;
  }, []);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let currentHeight = window.innerHeight;
    interface Dot {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
      pulseSpeed: number;
      pulseOffset: number;
      depth: number;
    }

    interface FloatingCode {
      text: string;
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      opacity: number;
      fontSize: number;
      lang: string;
      rotationSpeed: number;
      rotation: number;
      birthTime: number;
      lifespan: number;
      depth: number;
      scrollInfluence: number;
      driftRadiusX: number;
      driftRadiusY: number;
      driftSpeedX: number;
      driftSpeedY: number;
    }

    let dots: Dot[] = [];
    let floatingCode: FloatingCode[] = [];

    const getIsDarkMode = () =>
      document.documentElement.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initializeDots = (height: number, append = false) => {
      const baseCount = 60;
      const scrollFactor = Math.min(scrollYRef.current / 1000, 2);
      const targetCount = Math.floor(baseCount + scrollFactor * 40);

      if (!append) dots = [];

      const currentCount = dots.length;
      if (targetCount > currentCount) {
        const newDots = Array.from(
          { length: targetCount - currentCount },
          () => ({
            x: Math.random() * canvas.width,
            y: append
              ? Math.random() * height + currentHeight * 0.8
              : Math.random() * height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            radius: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.3,
            pulseSpeed: Math.random() * 0.02 + 0.01,
            pulseOffset: Math.random() * Math.PI * 2,
            depth: Math.random(),
          })
        );
        dots.push(...newDots);
      }
    };

    const initializeFloatingCode = (height: number, append = false) => {
      const baseCount = 25;
      const scrollFactor = Math.min(scrollYRef.current / 1000, 2);
      const targetCount = Math.floor(baseCount + scrollFactor * 20);

      if (!append) floatingCode = [];

      const currentCount = floatingCode.length;
      if (targetCount > currentCount) {
        const newCode = Array.from(
          { length: targetCount - currentCount },
          () => {
            const lang =
              languages[Math.floor(Math.random() * languages.length)];
            const snippets = codeSnippets[lang];
            return {
              text: snippets[Math.floor(Math.random() * snippets.length)],
              x: Math.random() * canvas.width,
              y: append
                ? Math.random() * height + currentHeight * 0.8
                : Math.random() * height,
              // Base position for scroll-friendly drift
              baseX: 0, // will be set after object creation
              baseY: 0,
              // Velocity (kept but not primary driver)
              vx: 0,
              vy: 0,
              opacity: Math.random() * 0.4 + 0.1,
              fontSize: Math.random() * 8 + 10,
              lang,
              rotationSpeed: (Math.random() - 0.5) * 0.005,
              rotation: 0,
              birthTime: Date.now(),
              lifespan: Math.random() * 15000 + 10000,
              depth: Math.random(),
              scrollInfluence: Math.random() * 0.5 + 0.5,
              // Smooth drift parameters
              driftRadiusX: 20 + Math.random() * 60,
              driftRadiusY: 10 + Math.random() * 40,
              driftSpeedX: 0.0003 + Math.random() * 0.0007,
              driftSpeedY: 0.0003 + Math.random() * 0.0007,
            };
          }
        );
        // Initialize base positions equal to initial x/y
        newCode.forEach((c) => {
          c.baseX = c.x;
          c.baseY = c.y;
        });
        floatingCode.push(...newCode);
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();

      // ✅ Always track document height
      const newHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        window.innerHeight
      );

      canvas.width = rect.width * devicePixelRatio;
      canvas.height = newHeight * devicePixelRatio;
      canvas.style.width = rect.width + "px";
      canvas.style.height = newHeight + "px";

      if (newHeight > currentHeight) {
        initializeDots(newHeight * devicePixelRatio, true);
        initializeFloatingCode(newHeight * devicePixelRatio, true);
      }

      currentHeight = newHeight;
      documentHeightRef.current = newHeight;
    };

    // ✅ ResizeObserver for dynamic content growth
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(document.body);

    resize();

    let raf = 0;

    const loop = () => {
      raf = requestAnimationFrame(loop);

      const scrollY = scrollYRef.current;
      const documentHeight = documentHeightRef.current;
      const scrollProgress =
        scrollY / Math.max(documentHeight - window.innerHeight, 1);
      const isDarkMode = getIsDarkMode();

      // Only clear the visible viewport band for better scroll perf
      const visibleTop = scrollY * devicePixelRatio;
      const visibleHeight = window.innerHeight * devicePixelRatio;
      ctx.clearRect(0, visibleTop - 2 * devicePixelRatio, canvas.width, visibleHeight + 4 * devicePixelRatio);

      // 🌀 Update floating code positions using smooth drift (scroll-friendly)
      const now = Date.now();
      floatingCode.forEach((code) => {
        // Lazily ensure base positions exist for legacy items
        if (code.baseX === undefined) code.baseX = code.x;
        if (code.baseY === undefined) code.baseY = code.y;

        const t = now - code.birthTime;
        const driftX = Math.sin(t * code.driftSpeedX) * code.driftRadiusX;
        const driftY = Math.cos(t * code.driftSpeedY) * code.driftRadiusY;
        code.x = code.baseX + driftX;
        code.y = code.baseY + driftY;
        code.rotation += code.rotationSpeed;

        // Keep base within bounds softly over time
        if (code.baseX < 0 || code.baseX > canvas.width) {
          code.baseX = Math.random() * canvas.width;
        }
        if (code.baseY < 0 || code.baseY > canvas.height) {
          code.baseY = Math.random() * canvas.height;
        }

        // Respawn after lifespan to keep variety
        if (now - code.birthTime > code.lifespan) {
          code.birthTime = now;
          code.baseX = Math.random() * canvas.width;
          code.baseY = Math.random() * canvas.height;
          code.rotation = 0;
        }
      });

      // 🌸 Light-mode pinkish underlay for better contrast
      if (!isDarkMode) {
        ctx.fillStyle = "hsla(340, 85%, 92%, 0.14)";
        ctx.fillRect(0, visibleTop - 2 * devicePixelRatio, canvas.width, visibleHeight + 4 * devicePixelRatio);
      }

      // 🌈 Background gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        (scrollY + window.innerHeight / 2) * devicePixelRatio,
        0,
        canvas.width / 2,
        (scrollY + window.innerHeight / 2) * devicePixelRatio,
        Math.max(canvas.width, window.innerHeight * devicePixelRatio) / 1.2
      );
      const scrollHue = scrollProgress * 60;
      if (isDarkMode) {
        gradient.addColorStop(0, `hsla(${220 + scrollHue}, 70%, 60%, 0.05)`);
        gradient.addColorStop(1, `hsla(${280 + scrollHue}, 60%, 50%, 0.03)`);
      } else {
        // Shift hues toward pink/purple in light mode for contrast
        gradient.addColorStop(0, `hsla(${330 + scrollHue * 0.3}, 80%, 80%, 0.18)`);
        gradient.addColorStop(1, `hsla(${300 + scrollHue * 0.3}, 70%, 75%, 0.12)`);
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, visibleTop - 2 * devicePixelRatio, canvas.width, visibleHeight + 4 * devicePixelRatio);

      // 💡 Floating code
      floatingCode.forEach((code) => {
        const parallaxY =
          scrollY * code.depth * code.scrollInfluence * devicePixelRatio;
        const adjustedY = code.y - parallaxY;

        if (
          adjustedY < (scrollY - 200) * devicePixelRatio ||
          adjustedY > (scrollY + window.innerHeight + 200) * devicePixelRatio
        ) {
          return;
        }

        const alpha = isDarkMode
          ? 0.7 + scrollProgress * 0.3
          : 0.55 + scrollProgress * 0.25;

        const langColors = isDarkMode
          ? {
              flutter: `hsla(195, 95%, 60%, ${alpha})`,
              typescript: `hsla(211, 60%, 55%, ${alpha})`,
              cpp: `hsla(290, 90%, 70%, ${alpha})`,
              python: `hsla(120, 90%, 70%, ${alpha})`,
            }
          : {
              flutter: `hsla(195, 90%, 40%, ${alpha})`,
              typescript: `hsla(211, 70%, 35%, ${alpha})`,
              cpp: `hsla(290, 70%, 38%, ${alpha})`,
              python: `hsla(120, 70%, 30%, ${alpha})`,
            };

        ctx.save();
        ctx.translate(code.x, adjustedY);
        ctx.rotate(code.rotation);
        ctx.font = `${code.fontSize * devicePixelRatio}px 'SF Mono', Consolas, monospace`;
        ctx.fillStyle =
          langColors[code.lang as keyof typeof langColors] ??
          "rgba(255,255,255,0.6)";
        ctx.globalAlpha = code.opacity * (1 - code.depth * 0.2);

        ctx.shadowColor = isDarkMode
          ? typeof ctx.fillStyle === "string"
            ? (ctx.fillStyle as string)
            : "rgba(255,255,255,0.6)"
          : "rgba(0,0,0,0.18)";
        ctx.shadowBlur = isDarkMode
          ? 12 * devicePixelRatio
          : 6 * devicePixelRatio;

        const textX = -ctx.measureText(code.text).width / 2;
        const textY = 0;
        // Outline in light mode for contrast
        if (!isDarkMode) {
          ctx.lineWidth = 2 * devicePixelRatio;
          ctx.strokeStyle = "rgba(0,0,0,0.25)";
          ctx.strokeText(code.text, textX, textY);
        }
        ctx.fillText(code.text, textX, textY);
        ctx.shadowBlur = 0;
        ctx.restore();
      });
    };

    loop();

    window.addEventListener("scroll", handleScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [handleScroll]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 -z-10 opacity-80 w-full block"
      aria-hidden
      style={{ backgroundColor: "dark" }}
    />
  );
}
