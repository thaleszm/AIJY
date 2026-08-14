import React, { useState, useRef, useEffect } from "react";
import {
  Terminal as TerminalIcon,
  Sparkles,
  ShieldAlert,
  Trash2,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Zap,
  PanelLeftOpen,
  PanelLeftClose,
  AlertTriangle,
} from "lucide-react";
import { TerminalLine, PermissionMode, UserLevel, ProjectTemplate } from "../types";
import { DiffViewer } from "./DiffViewer";
import { InteractiveAgentResponse } from "./InteractiveAgentResponse";
import { QuestionBar } from "./QuestionBar";
import { TestRunnerView } from "./TestRunnerView";

interface TerminalViewProps {
  lines: TerminalLine[];
  onSendMessage: (text: string, attachments?: { name: string; type: string; url?: string }[]) => void;
  isLoading: boolean;
  permissionMode: PermissionMode;
  onChangePermission?: (mode: PermissionMode) => void;
  userLevel: UserLevel;
  onChangeUserLevel?: (level: UserLevel) => void;
  currentProject: ProjectTemplate;
  onApplyDiff: (filePath: string, newContent: string) => void;
  onConfirmDangerousTool: (toolId: string, confirmed: boolean) => void;
  onClearTerminal: () => void;
  isWorkspaceOpen?: boolean;
  onToggleWorkspace?: () => void;
}

export const TerminalView: React.FC<TerminalViewProps> = ({
  lines,
  onSendMessage,
  isLoading,
  permissionMode,
  onChangePermission,
  userLevel,
  onChangeUserLevel,
  currentProject,
  onApplyDiff,
  onConfirmDangerousTool,
  onClearTerminal,
  isWorkspaceOpen = false,
  onToggleWorkspace,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedThoughts, setExpandedThoughts] = useState<Record<string, boolean>>({});

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new lines appear
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, isLoading]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleThought = (id: string) => {
    setExpandedThoughts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f4f3ee] dark:bg-[#141210] overflow-hidden select-text transition-colors duration-200">
      {/* Top Header of Terminal View */}
      <div className="h-10 px-4 flex items-center justify-between border-b border-[#b1ada1]/50 dark:border-[#3e3832] bg-[#ffffff]/90 dark:bg-[#1c1917]/90 backdrop-blur-xs select-none text-xs font-mono transition-colors">
        <div className="flex items-center gap-2">
          {/* Collapse/Expand Workspace Toggle */}
          {onToggleWorkspace && (
            <button
              onClick={onToggleWorkspace}
              className="p-1 rounded-lg hover:bg-[#f4f3ee] dark:hover:bg-[#2c2825] text-[#6e6a60] dark:text-[#a8a29e] hover:text-[#2b2724] dark:hover:text-[#f4f3ee] transition-colors cursor-pointer mr-1"
              title={isWorkspaceOpen ? "Ocultar Workspace" : "Exibir Workspace"}
            >
              {isWorkspaceOpen ? (
                <PanelLeftClose className="w-3.5 h-3.5" />
              ) : (
                <PanelLeftOpen className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#c15f3c] animate-pulse" />
            <span className="text-[#2b2724] dark:text-[#f4f3ee] font-semibold">
              aijy-terminal
            </span>
          </div>

          <span className="text-[#b1ada1] dark:text-[#4a433d]">/</span>
          <span className="text-[#6e6a60] dark:text-[#a8a29e] truncate max-w-[200px]">
            {currentProject.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClearTerminal}
            className="flex items-center gap-1 text-[11px] text-[#6e6a60] dark:text-[#a8a29e] hover:text-rose-600 dark:hover:text-rose-400 transition-colors px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
            title="Limpar mensagens do terminal"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">Limpar</span>
          </button>
        </div>
      </div>

      {/* Centered Chat / Terminal Stream Area (ChatGPT & Claude Style) */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 font-mono leading-relaxed custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-4">
          {lines.map((line) => {
            switch (line.type) {
              case "system":
                return (
                  <div
                    key={line.id}
                    className="p-5 rounded-2xl bg-[#ffffff] dark:bg-[#201c19] border border-[#b1ada1]/70 dark:border-[#3e3832] text-[#2b2724] dark:text-[#f4f3ee] space-y-3.5 select-none shadow-sm transition-colors"
                  >
                    {/* Top Status Bar / Protocol Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#b1ada1]/40 dark:border-[#3e3832] pb-2.5 text-[10px] font-mono">
                      <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c15f3c] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c15f3c]"></span>
                        </span>
                        <span className="text-[#c15f3c] font-bold tracking-wider">
                          AIJY ENGINE :: ONLINE
                        </span>
                        <span className="text-[#b1ada1] dark:text-[#665e56]">|</span>
                        <span className="text-[#6e6a60] dark:text-[#a8a29e]">KERNEL v3.7 FLASH</span>
                      </div>

                      <div className="flex items-center gap-2 text-[#6e6a60] dark:text-[#a8a29e]">
                        <span className="px-2 py-0.5 rounded bg-[#c15f3c]/10 text-[#c15f3c] border border-[#c15f3c]/30 font-semibold">
                          SECURE ENCLAVE
                        </span>
                        <span>ST-ID: 0x7F9A</span>
                      </div>
                    </div>

                    {/* Impactful ASCII Banner */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-1">
                      <pre className="text-[#c15f3c] font-mono text-[11px] sm:text-xs font-bold leading-none tracking-tight select-all">
{` █████╗ ██╗     ██╗██╗   ██╗
██╔══██╗██║     ██║╚██╗ ██╔╝
███████║██║     ██║ ╚████╔╝ 
██╔══██║██║██   ██║  ╚██╔╝  
██║  ██║██║╚█████╔╝   ██║   
╚═╝  ╚═╝╚═╝ ╚════╝    ╚═╝   `}
                      </pre>

                      <div className="space-y-1 sm:text-right font-mono">
                        <div className="text-xs font-bold tracking-wide text-[#2b2724] dark:text-[#f4f3ee] flex items-center sm:justify-end gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-[#c15f3c]" />
                          <span>AIJY AUTONOMOUS AGENT</span>
                        </div>
                        <p className="text-[10px] text-[#6e6a60] dark:text-[#a8a29e]">
                          Software Engineering &amp; Systems Agent
                        </p>
                        <div className="text-[9px] text-[#c15f3c] uppercase tracking-widest font-bold">
                          Terminal Interativo • DevOps • Refatoração
                        </div>
                      </div>
                    </div>

                    {/* Welcome line message */}
                    <p className="text-xs text-[#2b2724] dark:text-[#f4f3ee] font-sans leading-relaxed pt-1">
                      {line.content}
                    </p>

                    {/* Telemetry Chips & Environmental State */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono pt-1">
                      <div className="px-2.5 py-1.5 rounded-xl bg-[#f4f3ee] dark:bg-[#171513] border border-[#b1ada1]/60 dark:border-[#3e3832] flex items-center justify-between">
                        <span className="text-[#6e6a60] dark:text-[#a8a29e]">WORKSPACE:</span>
                        <span className="text-[#2b2724] dark:text-[#f4f3ee] font-semibold truncate ml-1">{currentProject.name}</span>
                      </div>

                      <div className="px-2.5 py-1.5 rounded-xl bg-[#f4f3ee] dark:bg-[#171513] border border-[#b1ada1]/60 dark:border-[#3e3832] flex items-center justify-between">
                        <span className="text-[#6e6a60] dark:text-[#a8a29e]">PERMISSION:</span>
                        <span className="text-[#c15f3c] font-bold ml-1">{permissionMode.toUpperCase()}</span>
                      </div>

                      <div className="px-2.5 py-1.5 rounded-xl bg-[#f4f3ee] dark:bg-[#171513] border border-[#b1ada1]/60 dark:border-[#3e3832] flex items-center justify-between">
                        <span className="text-[#6e6a60] dark:text-[#a8a29e]">PROFILE:</span>
                        <span className="text-[#2b2724] dark:text-[#f4f3ee] font-semibold ml-1">{userLevel.toUpperCase()}</span>
                      </div>

                      <div className="px-2.5 py-1.5 rounded-xl bg-[#f4f3ee] dark:bg-[#171513] border border-[#b1ada1]/60 dark:border-[#3e3832] flex items-center justify-between">
                        <span className="text-[#6e6a60] dark:text-[#a8a29e]">FILES:</span>
                        <span className="text-[#c15f3c] font-bold ml-1">{currentProject.files.length} CARREGADOS</span>
                      </div>
                    </div>
                  </div>
                );

              case "user-prompt":
                return (
                  <div key={line.id} className="flex justify-end my-2">
                    <div className="max-w-[85%] rounded-2xl bg-[#ffffff] dark:bg-[#201c19] border border-[#c15f3c]/40 p-3.5 text-[#2b2724] dark:text-[#f4f3ee] shadow-sm">
                      <div className="flex items-center gap-1.5 text-[10px] text-[#c15f3c] font-bold mb-1 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c15f3c]" />
                        <span>VOCÊ</span>
                        <span className="text-[#6e6a60] dark:text-[#a8a29e] font-normal">({line.timestamp})</span>
                      </div>
                      <p className="text-xs font-sans whitespace-pre-wrap leading-relaxed text-[#2b2724] dark:text-[#f4f3ee]">
                        {line.content}
                      </p>
                    </div>
                  </div>
                );

              case "agent-thought":
              case "thought":
                return (
                  <div
                    key={line.id}
                    className="p-3.5 rounded-2xl bg-[#ffffff]/70 dark:bg-[#1c1917]/70 border border-[#b1ada1]/50 dark:border-[#3e3832] text-[#6e6a60] dark:text-[#a8a29e] text-xs font-mono shadow-xs transition-colors"
                  >
                    <button
                      onClick={() => toggleThought(line.id)}
                      className="w-full flex items-center justify-between text-left hover:text-[#2b2724] dark:hover:text-[#f4f3ee] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2 text-[#c15f3c] font-bold">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        <span>Raciocínio Interno do AIJY</span>
                        <span className="text-[10px] text-[#6e6a60] dark:text-[#a8a29e] font-normal">
                          ({line.timestamp})
                        </span>
                      </div>
                      {expandedThoughts[line.id] ? (
                        <ChevronDown className="w-4 h-4 text-[#6e6a60] dark:text-[#a8a29e]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#6e6a60] dark:text-[#a8a29e]" />
                      )}
                    </button>

                    {expandedThoughts[line.id] && (
                      <div className="mt-3 pt-3 border-t border-[#b1ada1]/40 dark:border-[#3e3832] text-xs text-[#2b2724] dark:text-[#d6d3d1] whitespace-pre-wrap font-mono leading-relaxed bg-[#f4f3ee] dark:bg-[#141210] p-3 rounded-xl space-y-1.5">
                        {line.metadata?.thoughtSteps && line.metadata.thoughtSteps.length > 0 ? (
                          <div className="space-y-1">
                            {line.metadata.thoughtSteps.map((step, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span className="text-[#c15f3c] font-bold">›</span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div>{line.content}</div>
                        )}
                      </div>
                    )}
                  </div>
                );

              case "tool-call":
              case "tool-execution":
                return (
                  <div
                    key={line.id}
                    className="p-3.5 rounded-2xl bg-[#ffffff] dark:bg-[#1a1816] border border-[#b1ada1]/60 dark:border-[#3e3832] text-xs font-mono space-y-2 shadow-xs transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                        <span className="text-[#2b2724] dark:text-[#f4f3ee] font-bold">
                          {line.metadata?.toolName ? `Ferramenta: ${line.metadata.toolName}` : "Executando Ferramenta"}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#6e6a60] dark:text-[#a8a29e]">
                        {line.timestamp}
                      </span>
                    </div>

                    {(line.metadata?.toolParams?.command || line.metadata?.toolParams?.path) && (
                      <div className="p-2.5 rounded-xl bg-[#f4f3ee] dark:bg-[#121110] border border-[#b1ada1]/50 dark:border-[#322e2a] text-[#c15f3c] font-mono text-xs flex items-center justify-between">
                        <span className="truncate">
                          $ {line.metadata.toolParams?.command || `${line.metadata.toolName} ${line.metadata.toolParams?.path || ""}`}
                        </span>
                        <button
                          onClick={() => copyToClipboard(line.metadata?.toolParams?.command || "", line.id)}
                          className="text-[#6e6a60] dark:text-[#a8a29e] hover:text-[#2b2724] dark:hover:text-[#f4f3ee] p-1 cursor-pointer"
                        >
                          {copiedId === line.id ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    )}

                    <p className="text-xs text-[#6e6a60] dark:text-[#a8a29e] font-sans">
                      {line.content}
                    </p>
                  </div>
                );

              case "tool-result":
              case "command-output":
                return (
                  <div
                    key={line.id}
                    className="p-3.5 rounded-2xl bg-[#201c19] dark:bg-[#11100e] border border-[#3e3832] text-xs font-mono space-y-2 shadow-xs transition-colors text-[#f4f3ee]"
                  >
                    <div className="flex items-center justify-between border-b border-[#3e3832]/60 pb-2">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-[11px]">
                        <Check className="w-3.5 h-3.5" />
                        <span>Resultado da Execução</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(line.content, line.id)}
                        className="text-[#a8a29e] hover:text-white p-1 cursor-pointer text-[10px] flex items-center gap-1"
                      >
                        {copiedId === line.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedId === line.id ? "Copiado!" : "Copiar"}</span>
                      </button>
                    </div>
                    <pre className="text-[11px] leading-relaxed whitespace-pre-wrap overflow-x-auto text-[#d6d3d1]">
                      {line.content}
                    </pre>
                  </div>
                );

              case "test-runner":
                return (
                  <div key={line.id}>
                    <TestRunnerView
                      suiteName={line.metadata?.testResults?.suiteName || "Suíte de Testes Automatizados (JUnit / MockMvc)"}
                      total={line.metadata?.testResults?.total ?? 10}
                      passed={line.metadata?.testResults?.passed ?? 10}
                      failed={line.metadata?.testResults?.failed ?? 0}
                      skipped={line.metadata?.testResults?.skipped ?? 0}
                      duration={line.metadata?.testResults?.duration || "2.31s"}
                      coverage={line.metadata?.testResults?.coverage || { lines: 94.5, branches: 88.0 }}
                      tests={line.metadata?.testResults?.tests}
                      details={line.metadata?.testResults?.details}
                      rawLog={line.content}
                      onExecuteCommand={(cmd) => onSendMessage(cmd)}
                    />
                  </div>
                );

              case "confirmation-prompt":
              case "tool-danger":
                return (
                  <div
                    key={line.id}
                    className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/60 text-xs font-mono space-y-3 shadow-sm transition-colors"
                  >
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Confirmação de Segurança Requerida</span>
                    </div>

                    <p className="text-xs text-amber-900 dark:text-amber-200 font-sans">
                      {line.content}
                    </p>

                    {(line.metadata?.toolParams?.command || line.metadata?.toolName) && (
                      <div className="p-2 rounded-xl bg-amber-100/70 dark:bg-amber-900/40 font-mono text-amber-900 dark:text-amber-200">
                        $ {line.metadata.toolParams?.command || line.metadata.toolName}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onConfirmDangerousTool(line.metadata?.confirmationId || line.id, true)}
                        className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Permitir Execução</span>
                      </button>
                      <button
                        onClick={() => onConfirmDangerousTool(line.metadata?.confirmationId || line.id, false)}
                        className="px-3 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                );

              case "diff-view":
              case "diff":
                return (
                  <div key={line.id} className="space-y-2">
                    <div className="text-xs text-[#2b2724] dark:text-[#f4f3ee] font-sans font-medium">
                      {line.content}
                    </div>
                    {line.metadata?.diffData?.path && (
                      <DiffViewer
                        filePath={line.metadata.diffData.path}
                        oldCode={line.metadata.diffData.diff}
                        newCode={line.metadata.diffData.newContent || ""}
                        onApply={(newContent) => onApplyDiff(line.metadata!.diffData!.path, newContent)}
                      />
                    )}
                  </div>
                );

              case "error-badge":
              case "error":
                return (
                  <div
                    key={line.id}
                    className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-mono space-y-2 shadow-xs transition-colors"
                  >
                    <div className="flex items-center gap-2 font-bold text-rose-700 dark:text-rose-300">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Falha de Execução / Erro</span>
                    </div>
                    <p className="text-xs font-sans whitespace-pre-wrap leading-relaxed">
                      {line.content}
                    </p>
                  </div>
                );

              case "agent-response":
              default:
                return (
                  <div key={line.id}>
                    <InteractiveAgentResponse
                      cardData={line.metadata?.interactiveCard}
                      rawResponse={line.content}
                      suggestedCommands={line.metadata?.suggestedCommands}
                      stackInfo={line.metadata?.stackInfo}
                      onExecuteCommand={(cmd) => onSendMessage(cmd)}
                      onApplyCode={(filePath, code) => onApplyDiff(filePath, code)}
                      isLoading={isLoading}
                    />
                  </div>
                );
            }
          })}

          {/* Loading Spinner / Thinking Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-[#ffffff] dark:bg-[#201c19] border border-[#c15f3c]/40 text-[#2b2724] dark:text-[#f4f3ee] text-xs shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c15f3c] animate-ping" />
              <span className="font-mono text-[#c15f3c] font-bold">
                AIJY está raciocinando, inspecionando o projeto e acionando ferramentas...
              </span>
            </div>
          )}

          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* Floating Centered QuestionBar Container (Exactly matching ChatGPT / User Request) */}
      <div className="px-4 pb-4 pt-2 bg-gradient-to-t from-[#f4f3ee] via-[#f4f3ee]/95 to-transparent dark:from-[#141210] dark:via-[#141210]/95 select-none shrink-0 z-20">
        <div className="max-w-3xl lg:max-w-4xl mx-auto space-y-2">
          <QuestionBar
            onSendMessage={onSendMessage}
            isLoading={isLoading}
            permissionMode={permissionMode}
            onChangePermission={onChangePermission}
            userLevel={userLevel}
            onChangeUserLevel={onChangeUserLevel}
            placeholder="Pergunte ao AIJY, envie arquivos, drives ou fotos..."
          />

          {/* Footer Disclaimer */}
          <div className="text-center text-[10px] text-[#6e6a60] dark:text-[#8a847b] font-sans">
            AIJY Engineering Agent v3.7 • Execute auditorias, automações e builds no workspace
          </div>
        </div>
      </div>
    </div>
  );
};
