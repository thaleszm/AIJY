import React, { useState } from "react";
import {
  Terminal,
  Shield,
  Brain,
  BookOpen,
  FolderGit2,
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
  HelpCircle,
  Zap,
  Lock,
  Edit3,
  Play,
  Info,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { PermissionMode, UserLevel, ProjectTemplate } from "../types";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  currentProject: ProjectTemplate;
  projects: ProjectTemplate[];
  onSelectProject: (proj: ProjectTemplate) => void;
  permissionMode: PermissionMode;
  onChangePermission: (mode: PermissionMode) => void;
  userLevel: UserLevel;
  onChangeUserLevel: (level: UserLevel) => void;
  onOpenMemory: () => void;
  onOpenSecurity: () => void;
  onOpenDocs: () => void;
  onOpenGeminiStatus?: () => void;
  geminiActive: boolean;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  isWorkspaceOpen?: boolean;
  onToggleWorkspace?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProject,
  projects,
  onSelectProject,
  permissionMode,
  onChangePermission,
  userLevel,
  onChangeUserLevel,
  onOpenMemory,
  onOpenSecurity,
  onOpenDocs,
  onOpenGeminiStatus,
  geminiActive,
  theme,
  onToggleTheme,
  isWorkspaceOpen = false,
  onToggleWorkspace,
}) => {
  return (
    <header className="border-b border-[#b1ada1]/50 dark:border-[#3e3832] bg-[#ffffff]/95 dark:bg-[#1a1715]/95 backdrop-blur-md px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-sm select-none z-30 shadow-xs transition-colors duration-200">
      {/* Left: AIJY Brand & Workspace Toggle */}
      <div className="flex items-center gap-3">
        {/* Brand Icon & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#c15f3c] text-white flex items-center justify-center font-mono font-bold text-sm shadow-sm">
            &gt;_
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold tracking-tight text-[#2b2724] dark:text-[#f4f3ee] text-sm">
              <span className="font-mono tracking-wider font-extrabold text-[#2b2724] dark:text-[#f4f3ee]">AIJY</span>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded-full bg-[#c15f3c]/10 text-[#c15f3c] border border-[#c15f3c]/30 font-bold">
                CLI v3.7
              </span>
            </div>
            <p className="text-[10px] text-[#6e6a60] dark:text-[#a8a29e] font-mono hidden sm:block">
              Engineering &amp; Systems Agent
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-[#b1ada1]/40 dark:bg-[#4a433d] hidden md:block" />

        {/* Toggle Workspace Sidebar Button */}
        {onToggleWorkspace && (
          <button
            onClick={onToggleWorkspace}
            title={isWorkspaceOpen ? "Ocultar Workspace lateral" : "Abrir Workspace"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
              isWorkspaceOpen
                ? "bg-[#f4f3ee] dark:bg-[#282420] hover:bg-[#ffffff] dark:hover:bg-[#322e29] text-[#2b2724] dark:text-[#f4f3ee] border-[#b1ada1]/70 dark:border-[#4a433d] shadow-xs"
                : "bg-[#c15f3c] hover:bg-[#a84e2e] text-white border-[#c15f3c] shadow-sm font-semibold"
            }`}
          >
            {isWorkspaceOpen ? (
              <PanelLeftClose className="w-3.5 h-3.5 text-[#6e6a60] dark:text-[#a8a29e]" />
            ) : (
              <PanelLeftOpen className="w-3.5 h-3.5 text-white" />
            )}
            <span className="hidden sm:inline">
              {isWorkspaceOpen ? "Workspace" : "Abrir Workspace"}
            </span>
          </button>
        )}

        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#f4f3ee] dark:bg-[#201c19] border border-[#b1ada1]/50 dark:border-[#3e3832] text-xs font-mono text-[#6e6a60] dark:text-[#a8a29e]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c15f3c]" />
          <span>{currentProject.name}</span>
        </div>
      </div>

      {/* Right: Modules + Animated Theme Toggle Button */}
      <div className="flex items-center flex-wrap gap-2.5">
        {/* Module Modals: Memory, Security Guard, Docs */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenMemory}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#f4f3ee] dark:bg-[#282420] hover:bg-[#ffffff] dark:hover:bg-[#322e29] border border-[#b1ada1]/70 dark:border-[#4a433d] text-[#2b2724] dark:text-[#f4f3ee] rounded-xl text-xs font-medium transition-colors shadow-xs cursor-pointer"
            title="Abrir Memória Contextual do AIJY (Sessão, Projeto e Usuário)"
          >
            <Brain className="w-3.5 h-3.5 text-[#c15f3c]" />
            <span className="hidden md:inline">Memória</span>
          </button>

          <button
            onClick={onOpenSecurity}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#f4f3ee] dark:bg-[#282420] hover:bg-[#ffffff] dark:hover:bg-[#322e29] border border-[#b1ada1]/70 dark:border-[#4a433d] text-[#2b2724] dark:text-[#f4f3ee] rounded-xl text-xs font-medium transition-colors shadow-xs cursor-pointer"
            title="Políticas de Segurança do Sandbox"
          >
            <Shield className="w-3.5 h-3.5 text-[#c15f3c]" />
            <span className="hidden md:inline">Segurança</span>
          </button>

          <button
            onClick={onOpenDocs}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#f4f3ee] dark:bg-[#282420] hover:bg-[#ffffff] dark:hover:bg-[#322e29] border border-[#b1ada1]/70 dark:border-[#4a433d] text-[#2b2724] dark:text-[#f4f3ee] rounded-xl text-xs font-medium transition-colors shadow-xs cursor-pointer"
            title="Guia Oficial de Comandos e Atalhos do AIJY"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#c15f3c]" />
            <span className="hidden lg:inline">Docs</span>
          </button>

          {/* Engine Status Diagnostic Button */}
          {onOpenGeminiStatus && (
            <button
              onClick={onOpenGeminiStatus}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-mono border transition-all cursor-pointer shadow-xs ${
                geminiActive
                  ? "bg-[#c15f3c]/10 hover:bg-[#c15f3c]/20 border-[#c15f3c]/40 text-[#c15f3c] font-semibold"
                  : "bg-[#f4f3ee] dark:bg-[#282420] hover:bg-[#ffffff] dark:hover:bg-[#322e29] border-[#b1ada1]/70 dark:border-[#4a433d] text-[#6e6a60] dark:text-[#a8a29e] hover:text-[#2b2724] dark:hover:text-[#f4f3ee]"
              }`}
              title="Diagnóstico da Conexão com a Engine Gemini AI"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  geminiActive ? "bg-[#c15f3c] animate-pulse" : "bg-[#b1ada1]"
                }`}
              />
              <span className="font-semibold">
                {geminiActive ? "Gemini AI" : "AIJY Engine"}
              </span>
              <span className="text-[10px] text-[#6e6a60] dark:text-[#a8a29e] hidden sm:inline font-sans">
                ({geminiActive ? "Online" : "Configurar"})
              </span>
            </button>
          )}
        </div>

        {/* Dark Mode Animated Toggle Button */}
        <ThemeToggle
          theme={theme}
          onToggle={onToggleTheme}
        />
      </div>
    </header>
  );
};

