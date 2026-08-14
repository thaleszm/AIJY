import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon, Sparkles } from "lucide-react";

interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
  compact?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onToggle,
  compact = false,
}) => {
  const isDark = theme === "dark";

  return (
    <motion.button
      type="button"
      id="theme-toggle-btn"
      onClick={onToggle}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      aria-label={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
      title={isDark ? "Ativar Modo Claro (Linho & Terracota)" : "Ativar Modo Escuro (Obsidian & Glow)"}
      className={`relative flex items-center gap-2 rounded-xl border transition-colors cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#c15f3c] ${
        compact ? "p-1.5" : "px-2.5 py-1.5"
      } ${
        isDark
          ? "bg-[#282420] hover:bg-[#322e29] border-[#4a433d] text-[#f4f3ee] shadow-sm shadow-black/40"
          : "bg-[#f4f3ee] hover:bg-[#ffffff] border-[#b1ada1]/70 text-[#2b2724] shadow-xs"
      }`}
    >
      {/* Animated Track Container */}
      <div
        className={`relative flex items-center justify-between rounded-lg p-0.5 transition-all duration-300 ${
          compact ? "w-11 h-6" : "w-13 h-6"
        } ${
          isDark
            ? "bg-[#181614] border border-[#3e3832]"
            : "bg-[#e5e3dc] border border-[#b1ada1]/60"
        }`}
      >
        {/* Animated Sliding Pill Thumb */}
        <motion.div
          layout
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          animate={{
            x: isDark ? (compact ? 20 : 26) : 0,
          }}
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-md flex items-center justify-center shadow-md transition-colors ${
            isDark
              ? "bg-[#c15f3c] text-white shadow-[#c15f3c]/30"
              : "bg-[#ffffff] text-[#c15f3c] shadow-black/10"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.div
                key="moon"
                initial={{ rotate: -90, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="flex items-center justify-center"
              >
                <Moon className="w-3 h-3 text-white fill-current" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ rotate: 90, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: -90, scale: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="flex items-center justify-center"
              >
                <Sun className="w-3.5 h-3.5 text-[#c15f3c]" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Background Icons in track */}
        <div className="flex items-center justify-between w-full px-1 text-[9px] pointer-events-none opacity-40">
          <Sun className={`w-3 h-3 ${isDark ? "opacity-30 text-[#a8a29e]" : "opacity-0"}`} />
          <Moon className={`w-3 h-3 ${isDark ? "opacity-0" : "opacity-30 text-[#6e6a60]"}`} />
        </div>
      </div>

      {/* Text Label (shown on standard/non-compact mode) */}
      {!compact && (
        <span className="text-xs font-mono font-semibold hidden sm:inline flex items-center gap-1">
          {isDark ? (
            <>
              <span className="text-[#f4f3ee]">Dark</span>
              <Sparkles className="w-2.5 h-2.5 text-[#c15f3c]" />
            </>
          ) : (
            <>
              <span className="text-[#2b2724]">Light</span>
            </>
          )}
        </span>
      )}
    </motion.button>
  );
};
