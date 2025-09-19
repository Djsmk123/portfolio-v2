"use client";

import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ThemeContext } from "@/app/providers";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

type NavTab = {
  label: string;
  href: string;
  isLink: boolean;
};

const navTabs: NavTab[] = [
  { label: "Home", href: "/", isLink: true },
  { label: "Projects", href: "/projects", isLink: true },
  { label: "Experience", href: "/experience", isLink: true },
  { label: "Articles", href: "/blogs", isLink: true },
  { label: "Contact", href: "/contact", isLink: true },
];

// Route to tab mapping for direct navigation
const routeToTabMap: Record<string, string> = {
  '/': 'Home',
  '/projects': 'Projects',
  '/experience': 'Experience',
  '/blogs': 'Articles',
  '/contact': 'Contact',
};

export function Navbar() {
  const { theme, setTheme } = useContext(ThemeContext);
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>(navTabs[0].label);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Route-based active tab detection
  useEffect(() => {
    const currentRoute = pathname || '/';
    const tabForRoute = routeToTabMap[currentRoute];
    if (tabForRoute) {
      setActiveTab(tabForRoute);
    }
  }, [pathname]);

  // Scroll detection to update active tab (only on home page)
  useEffect(() => {
    // Only run scroll detection on home page
    if (pathname !== '/') return;
    
    const sections = [
      { id: 'projects', label: 'Projects' },
      { id: 'experience', label: 'Experience' },
      { id: 'blogs', label: 'Articles' },
      { id: 'contact', label: 'Contact' }
    ];

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Trigger when section is 20% from top
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Check if home section is visible (at top of page)
      const homeSection = document.getElementById('home');
      if (homeSection) {
        const homeRect = homeSection.getBoundingClientRect();
        if (homeRect.top >= 0 && homeRect.top <= 100) {
          setActiveTab('Home');
          return;
        }
      }

      // Check other sections
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const correspondingTab = sections.find(section => section.id === sectionId);
          if (correspondingTab) {
            setActiveTab(correspondingTab.label);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    // Also observe the home section
    const homeSection = document.getElementById('home');
    if (homeSection) {
      observer.observe(homeSection);
    }

    // Add scroll listener for home section detection
    const handleScrollDetection = () => {
      if (homeSection) {
        const homeRect = homeSection.getBoundingClientRect();
        if (homeRect.top >= 0 && homeRect.top <= 100) {
          setActiveTab('Home');
        }
      }
    };

    window.addEventListener('scroll', handleScrollDetection);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScrollDetection);
    };
  }, [pathname]);

  const handleNavigation = (href: string) => {
    // For home page sections, scroll to them
    if (pathname === '/' && href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    // For direct routes, navigation is handled by Link component
    setMobileMenuOpen(false); // Close mobile menu
  };

  return (
    <header className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-full max-w-5xl px-4 md:px-0">
      <div className="flex items-center justify-between gap-4 rounded-full border bg-background/70 px-6 py-2 shadow-lg backdrop-blur-lg supports-[backdrop-filter]:bg-background/50">
        {/* Logo */}
        <Link href="/" className="font-bold text-lg md:text-xl">
          MD. Mobin
        </Link>

        {/* Desktop Tabs */}
        <nav className="hidden md:flex items-center gap-2 text-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="bg-transparent shadow-none gap-1">
              {navTabs.map((tab) => {
                // For home page, use hash links for sections
                const href = pathname === '/' && tab.label !== 'Home' 
                  ? `#${tab.label.toLowerCase()}` 
                  : tab.href;
                
                return (
                  <TabsTrigger
                    key={tab.label}
                    value={tab.label}
                    asChild
                    className="px-3 py-1.5 rounded-md transition-all duration-200 hover:bg-blue-100 dark:hover:bg-blue-900"
                  >
                    <Link 
                      href={href}
                      onClick={() => handleNavigation(href)}
                    >
                      {tab.label}
                    </Link>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <button
            className="h-9 w-9 flex items-center justify-center rounded-full border hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "🌞" : "🌙"}
          </button>

          {/* Mobile menu button */}
          <button
            className="md:hidden h-9 w-9 flex items-center justify-center rounded-full border hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 w-full max-w-sm rounded-xl border bg-background/90 p-4 flex flex-col gap-3 shadow-lg backdrop-blur-lg supports-[backdrop-filter]:bg-background/80 md:hidden"
          >
            {navTabs.map((tab) => {
              // For home page, use hash links for sections
              const href = pathname === '/' && tab.label !== 'Home' 
                ? `#${tab.label.toLowerCase()}` 
                : tab.href;
              
              return (
                <Link
                  key={tab.label}
                  href={href}
                  onClick={() => {
                    setActiveTab(tab.label);
                    handleNavigation(href);
                  }}
                  className="text-left px-3 py-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                >
                  {tab.label}
                </Link>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
