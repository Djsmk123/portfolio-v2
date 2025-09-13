"use client";

import Link from "next/link";
import { useContext, useState } from "react";
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
  { label: "Projects", href: "#projects", isLink: false },
  { label: "Experience", href: "#experience", isLink: false },
  { label: "Articles", href: "#blogs", isLink: false },
  { label: "Contact", href: "#contact", isLink: false },
];

export function Navbar() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState<string>(navTabs[0].label);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScroll = (href: string) => {
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false); // Close mobile menu
    }
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
              {navTabs.map((tab) =>
                tab.isLink ? (
                  <TabsTrigger
                    key={tab.label}
                    value={tab.label}
                    asChild
                    className="px-3 py-1.5 rounded-md transition-all duration-200 hover:bg-blue-100 dark:hover:bg-blue-900"
                  >
                    <Link href={tab.href}>{tab.label}</Link>
                  </TabsTrigger>
                ) : (
                  <TabsTrigger
                    key={tab.label}
                    value={tab.label}
                    className="px-3 py-1.5 rounded-md transition-all duration-200 hover:bg-blue-100 dark:hover:bg-blue-900"
                    onClick={() => {
                      setActiveTab(tab.label);
                      handleScroll(tab.href);
                    }}
                  >
                    {tab.label}
                  </TabsTrigger>
                )
              )}
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
            {navTabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => {
                  setActiveTab(tab.label);
                  handleScroll(tab.href);
                }}
                className="text-left px-3 py-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
              >
                {tab.label}
              </button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
