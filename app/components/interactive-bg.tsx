"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useCallback, useMemo } from "react";

// Optimized code snippets with better categorization
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
    "class DataProcessor:",
    "async def fetch_data():",
    "list_comprehension = [x for x in range(10)]",
    "with open('file.txt') as f:",
  ],
} as const;

type Language = keyof typeof codeSnippets;
const languages = Object.keys(codeSnippets) as Language[];

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
  baseOpacity: number;
}

interface FloatingCode {
  text: string;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  opacity: number;
  fontSize: number;
  lang: Language;
  rotationSpeed: number;
  rotation: number;
  birthTime: number;
  lifespan: number;
  depth: number;
  driftRadiusX: number;
  driftRadiusY: number;
  driftSpeedX: number;
  driftSpeedY: number;
  baseOpacity: number;
}

const PERFORMANCE_CONFIG = {
  TARGET_FPS: 30,
  MAX_DOTS: 80,
  MAX_CODE_ELEMENTS: 30,
  CULLING_MARGIN: 300,
  SCROLL_THROTTLE: 16, // ~60fps for scroll updates
  RESIZE_DEBOUNCE: 150,
} as const;

export function InteractiveBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  
  // Performance refs
  const animationFrameRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const scrollYRef = useRef(0)
  const isAnimatingRef = useRef(false)
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Animation state refs
  const dotsRef = useRef<Dot[]>([])
  const floatingCodeRef = useRef<FloatingCode[]>([])
  const canvasDimensionsRef = useRef({ width: 0, height: 0 });
  
  // Memoized color schemes
  const colorSchemes = useMemo(() => ({
    dark: {
      background: {
        primary: "hsla(220, 70%, 60%, 0.03)",
        secondary: "hsla(280, 60%, 50%, 0.02)",
      },
      languages: {
        flutter: "hsla(195, 95%, 60%, 0.7)",
        typescript: "hsla(211, 60%, 55%, 0.7)",
        cpp: "hsla(290, 90%, 70%, 0.7)",
        python: "hsla(120, 90%, 70%, 0.7)",
      },
      dots: "rgba(255, 255, 255, 0.4)",
    },
    light: {
      background: {
        primary: "hsla(330, 80%, 80%, 0.15)",
        secondary: "hsla(300, 70%, 75%, 0.1)",
        overlay: "hsla(340, 85%, 92%, 0.12)",
      },
      languages: {
        flutter: "hsla(195, 90%, 40%, 0.8)",
        typescript: "hsla(211, 70%, 35%, 0.8)",
        cpp: "hsla(290, 70%, 38%, 0.8)",
        python: "hsla(120, 70%, 30%, 0.8)",
      },
      dots: "rgba(100, 100, 100, 0.5)",
    },
  }), []);

  const getIsDarkMode = useCallback((): boolean => {
    return document.documentElement.classList.contains("dark") ||
           window.matchMedia("(prefers-color-scheme: dark)").matches;
  }, []);

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    scrollYRef.current = window.scrollY;
  }, []);

  // Throttled scroll handler
  const throttledScrollHandler = useCallback(() => {
    let ticking = false;
    
    const updateScroll = () => {
      handleScroll();
      ticking = false;
    };

    return () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };
  }, [handleScroll])();

  // Optimized particle creation
  const createDot = useCallback((canvasWidth: number, canvasHeight: number): Dot => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    radius: Math.random() * 1.5 + 0.5,
    opacity: 0,
    baseOpacity: Math.random() * 0.4 + 0.2,
    pulseSpeed: Math.random() * 0.015 + 0.005,
    pulseOffset: Math.random() * Math.PI * 2,
    depth: Math.random(),
  }), []);

  const createFloatingCode = useCallback((canvasWidth: number, canvasHeight: number): FloatingCode => {
    const lang = languages[Math.floor(Math.random() * languages.length)];
    const snippets = codeSnippets[lang];
    const text = snippets[Math.floor(Math.random() * snippets.length)];
    const x = Math.random() * canvasWidth;
    const y = Math.random() * canvasHeight;
    
    return {
      text,
      x,
      y,
      baseX: x,
      baseY: y,
      opacity: 0,
      baseOpacity: Math.random() * 0.3 + 0.1,
      fontSize: Math.random() * 6 + 8,
      lang,
      rotationSpeed: (Math.random() - 0.5) * 0.003,
      rotation: 0,
      birthTime: Date.now(),
      lifespan: Math.random() * 12000 + 8000,
      depth: Math.random(),
      driftRadiusX: 10 + Math.random() * 20,
      driftRadiusY: 5 + Math.random() * 15,
      driftSpeedX: 0.0001 + Math.random() * 0.0002,
      driftSpeedY: 0.0001 + Math.random() * 0.0002,
    };
  }, []);

  // Optimized initialization
  const initializeElements = useCallback((canvasWidth: number, canvasHeight: number) => {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const area = (canvasWidth * canvasHeight) / (devicePixelRatio * devicePixelRatio);
    const dotCount = Math.min(Math.floor(area / 15000), PERFORMANCE_CONFIG.MAX_DOTS);
    const codeCount = Math.min(Math.floor(area / 25000), PERFORMANCE_CONFIG.MAX_CODE_ELEMENTS);

    // Initialize dots
    dotsRef.current = Array.from({ length: dotCount }, () => 
      createDot(canvasWidth, canvasHeight)
    );

    // Initialize floating code
    floatingCodeRef.current = Array.from({ length: codeCount }, () => 
      createFloatingCode(canvasWidth, canvasHeight)
    );
  }, [createDot, createFloatingCode]);

  // Optimized resize handler with debouncing
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    resizeTimeoutRef.current = setTimeout(() => {
      const rect = canvas.getBoundingClientRect();
      const devicePixelRatio = window.devicePixelRatio || 1;
      
      const documentHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        window.innerHeight
      );

      const newWidth = rect.width * devicePixelRatio;
      const newHeight = documentHeight * devicePixelRatio;

      // Only reinitialize if dimensions changed significantly
      if (Math.abs(newWidth - canvasDimensionsRef.current.width) > 10 ||
          Math.abs(newHeight - canvasDimensionsRef.current.height) > 10) {
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        canvas.style.width = rect.width + "px";
        canvas.style.height = documentHeight + "px";

        canvasDimensionsRef.current = { width: newWidth, height: newHeight };
        initializeElements(newWidth, newHeight);
      }
    }, PERFORMANCE_CONFIG.RESIZE_DEBOUNCE);
  }, [initializeElements]);

  // Optimized animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isAnimatingRef.current) return;

    const currentTime = performance.now();
    const frameInterval = 1000 / PERFORMANCE_CONFIG.TARGET_FPS;
    
    if (currentTime - lastFrameTimeRef.current < frameInterval) {
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    lastFrameTimeRef.current = currentTime;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width: canvasWidth, height: canvasHeight } = canvasDimensionsRef.current;
    const devicePixelRatio = window.devicePixelRatio || 1;
    const scrollY = scrollYRef.current;
    const isDarkMode = getIsDarkMode();
    const colorScheme = isDarkMode ? colorSchemes.dark : colorSchemes.light;

    // Calculate visible area for culling
    const visibleTop = scrollY * devicePixelRatio;
    const visibleBottom = (scrollY + window.innerHeight) * devicePixelRatio;
    const cullingMargin = PERFORMANCE_CONFIG.CULLING_MARGIN * devicePixelRatio;

    // Clear only the visible area
    ctx.clearRect(0, visibleTop - cullingMargin, canvasWidth, window.innerHeight * devicePixelRatio + 2 * cullingMargin);

    // Background overlay for light mode
    if (!isDarkMode) {
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillRect(0, visibleTop - cullingMargin, canvasWidth, window.innerHeight * devicePixelRatio + 2 * cullingMargin);
    }

    // Background gradient
    const gradient = ctx.createRadialGradient(
      canvasWidth / 2,
      (scrollY + window.innerHeight / 2) * devicePixelRatio,
      0,
      canvasWidth / 2,
      (scrollY + window.innerHeight / 2) * devicePixelRatio,
      Math.max(canvasWidth, window.innerHeight * devicePixelRatio) / 1.5
    );

    const scrollProgress = Math.min(scrollY / Math.max(canvasHeight / devicePixelRatio - window.innerHeight, 1), 1);
    const hueShift = scrollProgress * 30;

    if (isDarkMode) {
      gradient.addColorStop(0, `hsla(${220 + hueShift}, 70%, 60%, 0.04)`);
      gradient.addColorStop(1, `hsla(${280 + hueShift}, 60%, 50%, 0.02)`);
    } else {
      gradient.addColorStop(0, `hsla(${330 + hueShift * 0.3}, 80%, 80%, 0.12)`);
      gradient.addColorStop(1, `hsla(${300 + hueShift * 0.3}, 70%, 75%, 0.08)`);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, visibleTop - cullingMargin, canvasWidth, window.innerHeight * devicePixelRatio + 2 * cullingMargin);

    // Update and render dots with culling
    dotsRef.current.forEach((dot) => {
      // Update position
      dot.x += dot.vx;
      dot.y += dot.vy;

      // Boundary wrapping
      if (dot.x < 0) dot.x = canvasWidth;
      if (dot.x > canvasWidth) dot.x = 0;
      if (dot.y < 0) dot.y = canvasHeight;
      if (dot.y > canvasHeight) dot.y = 0;

      // Culling check
      if (dot.y < visibleTop - cullingMargin || dot.y > visibleBottom + cullingMargin) {
        return;
      }

      // Update opacity with pulsing
      const pulse = Math.sin(currentTime * dot.pulseSpeed + dot.pulseOffset) * 0.3 + 0.7;
      dot.opacity = dot.baseOpacity * pulse;

      // Render dot
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.radius * devicePixelRatio, 0, Math.PI * 2);
      ctx.fillStyle = isDarkMode 
        ? `rgba(255, 255, 255, ${dot.opacity})` 
        : `rgba(100, 100, 100, ${dot.opacity})`;
      ctx.fill();
    });

    // Update and render floating code with culling
    floatingCodeRef.current.forEach((code) => {
      const now = Date.now();
      const age = now - code.birthTime;

      // Respawn if expired
      if (age > code.lifespan) {
        const newCode = createFloatingCode(canvasWidth, canvasHeight);
        Object.assign(code, newCode);
        return;
      }

      // Update drift position
      const driftX = Math.sin(age * code.driftSpeedX) * code.driftRadiusX;
      const driftY = Math.cos(age * code.driftSpeedY) * code.driftRadiusY;
      code.x = code.baseX + driftX;
      code.y = code.baseY + driftY;
      code.rotation += code.rotationSpeed;

      // Parallax effect
      const parallaxY = scrollY * code.depth * 0.1 * devicePixelRatio;
      const adjustedY = code.y - parallaxY;

      // Culling check
      if (adjustedY < visibleTop - cullingMargin || adjustedY > visibleBottom + cullingMargin) {
        return;
      }

      // Fade in/out based on age
      const fadeInDuration = 1000;
      const fadeOutDuration = 2000;
      let ageFactor = 1;
      
      if (age < fadeInDuration) {
        ageFactor = age / fadeInDuration;
      } else if (age > code.lifespan - fadeOutDuration) {
        ageFactor = (code.lifespan - age) / fadeOutDuration;
      }

      code.opacity = code.baseOpacity * ageFactor;

      // Render floating code
      ctx.save();
      ctx.translate(code.x, adjustedY);
      ctx.rotate(code.rotation);
      ctx.font = `${code.fontSize * devicePixelRatio}px 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', Consolas, monospace`;
      ctx.fillStyle = colorScheme.languages[code.lang];
      ctx.globalAlpha = code.opacity;

      if (isDarkMode) {
        ctx.shadowColor = ctx.fillStyle as string;
        ctx.shadowBlur = 8 * devicePixelRatio;
      } else {
        ctx.lineWidth = 1.5 * devicePixelRatio;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        const textMetrics = ctx.measureText(code.text);
        const textX = -textMetrics.width / 2;
        ctx.strokeText(code.text, textX, 0);
      }

      const textMetrics = ctx.measureText(code.text);
      const textX = -textMetrics.width / 2;
      ctx.fillText(code.text, textX, 0);
      
      ctx.shadowBlur = 0;
      ctx.restore();
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [getIsDarkMode, colorSchemes, createFloatingCode]);

  // Main effect
  useEffect(() => {
    if (pathname?.startsWith("/admin")) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    isAnimatingRef.current = true;

    // Initial setup
    handleResize();

    // Event listeners
    window.addEventListener("scroll", throttledScrollHandler, { passive: true });
    window.addEventListener("resize", handleResize);

    // Observe document changes
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(document.body);

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      isAnimatingRef.current = false;
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      window.removeEventListener("scroll", throttledScrollHandler);
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, [pathname, throttledScrollHandler, handleResize, animate]);

  // Don't render in admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 opacity-75"
      aria-hidden="true"
      style={{
        backgroundColor: "transparent",
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}