import React, { useState } from "react";
import Markdown from "react-markdown";
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Wrench,
  Play,
  Terminal,
  FileCode,
  Shield,
  RefreshCw,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Cpu,
  Layers,
  ArrowRight,
  Gauge,
  Zap,
} from "lucide-react";
import {
  InteractiveCardData,
  DiagnosticItem,
  InteractiveAction,
} from "../types";

interface InteractiveAgentResponseProps {
  cardData?: InteractiveCardData;
  rawResponse: string;
  suggestedCommands?: string[];
  stackInfo?: {
    languages?: string[];
    frameworks?: string[];
    tools?: string[];
    summary?: string;
  };
  onExecuteCommand: (command: string) => void;
  onApplyCode?: (filePath: string, code: string) => void;
  isLoading?: boolean;
}

export const InteractiveAgentResponse: React.FC<InteractiveAgentResponseProps> = ({
  cardData,
  rawResponse,
  suggestedCommands = [],
  stackInfo,
  onExecuteCommand,
  onApplyCode,
  isLoading = false,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [expandedDiagnostics, setExpandedDiagnostics] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"card" | "code" | "raw">("card");

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const toggleDiagnostic = (id: string) => {
    setExpandedDiagnostics((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getSeverityBadge = (severity?: string) => {
    switch (severity) {
      case "critical":
        return {
          bg: "bg-rose-500/10 border-rose-500/30 text-rose-300",
          icon: <XCircle className="w-3.5 h-3.5 text-rose-400" />,
          label: "Crítico",
        };
      case "warning":
        return {
          bg: "bg-amber-500/10 border-amber-500/30 text-amber-300",
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
          label: "Aviso",
        };
      case "optimization":
        return {
          bg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
          icon: <Zap className="w-3.5 h-3.5 text-cyan-400" />,
          label: "Otimização",
        };
      case "success":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
          label: "Sucesso",
        };
      case "info":
      default:
        return {
          bg: "bg-blue-500/10 border-blue-500/30 text-blue-300",
          icon: <Sparkles className="w-3.5 h-3.5 text-blue-400" />,
          label: "Diagnóstico",
        };
    }
  };

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case "wrench":
        return <Wrench className="w-3.5 h-3.5" />;
      case "play":
        return <Play className="w-3.5 h-3.5 fill-current" />;
      case "sparkles":
        return <Sparkles className="w-3.5 h-3.5" />;
      case "terminal":
        return <Terminal className="w-3.5 h-3.5" />;
      case "file-code":
        return <FileCode className="w-3.5 h-3.5" />;
      case "shield":
        return <Shield className="w-3.5 h-3.5" />;
      case "refresh":
        return <RefreshCw className="w-3.5 h-3.5" />;
      default:
        return <Play className="w-3.5 h-3.5" />;
    }
  };

  const hasInteractiveContent = Boolean(
    cardData || (suggestedCommands && suggestedCommands.length > 0) || stackInfo
  );

  return (
    <div className="rounded-2xl bg-[#ffffff] dark:bg-[#201c19] border border-[#b1ada1]/70 dark:border-[#3e3832] shadow-sm overflow-hidden my-2 font-sans transition-all text-[#2b2724] dark:text-[#f4f3ee]">
      {/* Header bar with contextual badges */}
      <div className="px-4 py-2.5 bg-[#f4f3ee] dark:bg-[#1a1715] border-b border-[#b1ada1]/60 dark:border-[#3e3832] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#c15f3c] text-white flex items-center justify-center font-mono font-bold text-[10px] shadow-xs">
            AI
          </div>
          <span className="text-xs font-bold text-[#2b2724] dark:text-[#f4f3ee] tracking-tight flex items-center gap-1.5">
            <span>AIJY Interactive Assistant</span>
            {cardData?.badge && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c15f3c]/10 text-[#c15f3c] border border-[#c15f3c]/30 font-mono font-bold">
                {cardData.badge}
              </span>
            )}
          </span>
        </div>

        {/* Tab switcher if code is present */}
        <div className="flex items-center gap-1 bg-[#ffffff] dark:bg-[#282420] p-0.5 rounded-xl border border-[#b1ada1]/70 dark:border-[#4a433d] text-[11px] font-mono shadow-xs">
          <button
            onClick={() => setActiveTab("card")}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === "card"
                ? "bg-[#c15f3c] text-white font-bold shadow-xs"
                : "text-[#6e6a60] dark:text-[#a8a29e] hover:text-[#2b2724] dark:hover:text-[#f4f3ee]"
            }`}
          >
            Visual
          </button>
          {cardData?.codeSnippet && (
            <button
              onClick={() => setActiveTab("code")}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                activeTab === "code"
                  ? "bg-[#c15f3c] text-white font-bold shadow-xs"
                  : "text-[#6e6a60] dark:text-[#a8a29e] hover:text-[#2b2724] dark:hover:text-[#f4f3ee]"
              }`}
            >
              <FileCode className="w-3 h-3" />
              <span>Código</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab("raw")}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === "raw"
                ? "bg-[#c15f3c] text-white font-bold shadow-xs"
                : "text-[#6e6a60] dark:text-[#a8a29e] hover:text-[#2b2724] dark:hover:text-[#f4f3ee]"
            }`}
          >
            Terminal RAW
          </button>
        </div>
      </div>

      {/* Main Body depending on activeTab */}
      <div className="p-4 space-y-4 text-xs">
        {activeTab === "raw" ? (
          <div className="bg-[#f4f3ee] dark:bg-[#171513] rounded-xl p-3 border border-[#b1ada1]/60 dark:border-[#3e3832] font-mono text-[11px] text-[#2b2724] dark:text-[#f4f3ee] whitespace-pre-wrap leading-relaxed">
            {rawResponse}
          </div>
        ) : activeTab === "code" && cardData?.codeSnippet ? (
          /* Dedicated Code Viewer Tab */
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-[#f4f3ee] dark:bg-[#171513] p-2.5 rounded-xl border border-[#b1ada1]/60 dark:border-[#3e3832]">
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#2b2724] dark:text-[#f4f3ee]">
                <FileCode className="w-4 h-4 text-[#c15f3c]" />
                <span className="font-semibold text-[#2b2724] dark:text-[#f4f3ee]">
                  {cardData.codeSnippet.targetPath || cardData.codeSnippet.title || "Snippet Sugerido"}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#ffffff] dark:bg-[#282420] text-[#6e6a60] dark:text-[#a8a29e] border border-[#b1ada1]/60 dark:border-[#4a433d] uppercase font-semibold">
                  {cardData.codeSnippet.language}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(cardData.codeSnippet!.code)}
                  className="px-2.5 py-1 rounded-lg bg-[#ffffff] dark:bg-[#282420] hover:bg-[#f4f3ee] dark:hover:bg-[#322e29] text-[#2b2724] dark:text-[#f4f3ee] border border-[#b1ada1]/70 dark:border-[#4a433d] flex items-center gap-1 text-[11px] transition-colors cursor-pointer shadow-xs"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-[#c15f3c]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? "Copiado!" : "Copiar"}</span>
                </button>

                {onApplyCode && cardData.codeSnippet.targetPath && (
                  <button
                    onClick={() =>
                      onApplyCode(
                        cardData.codeSnippet!.targetPath!,
                        cardData.codeSnippet!.code
                      )
                    }
                    className="px-3 py-1 rounded-lg bg-[#c15f3c] hover:bg-[#a84e2e] text-white font-medium text-[11px] flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <Wrench className="w-3 h-3" />
                    <span>Aplicar no Arquivo</span>
                  </button>
                )}
              </div>
            </div>

            <div className="bg-[#23201d] dark:bg-[#11100e] rounded-xl p-3.5 border border-[#3e3a36] overflow-x-auto font-mono text-[11px] text-[#f4f3ee] leading-relaxed max-h-96 shadow-inner">
              <pre className="whitespace-pre">{cardData.codeSnippet.code}</pre>
            </div>
          </div>
        ) : (
          /* Visual Interactive Dashboard Card */
          <div className="space-y-4">
            {/* Title & Subtitle / Summary */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                    getSeverityBadge(cardData?.severity || "info").bg
                  }`}
                >
                  {getSeverityBadge(cardData?.severity || "info").icon}
                  {getSeverityBadge(cardData?.severity || "info").label}
                </span>
                <h3 className="text-sm font-bold text-[#2b2724] dark:text-[#f4f3ee]">
                  {cardData?.title || "Resposta & Diagnóstico do Agente AIJY"}
                </h3>
              </div>

              {cardData?.subtitle && (
                <p className="text-xs text-[#6e6a60] dark:text-[#a8a29e] leading-relaxed">
                  {cardData.subtitle}
                </p>
              )}
            </div>

            {/* Didactic and structured response text rendered cleanly with Markdown */}
            <div id="aijy-markdown-container" className="text-[#2b2724] dark:text-[#f4f3ee] text-xs leading-relaxed font-sans bg-[#f4f3ee] dark:bg-[#171513] p-4 rounded-xl border border-[#b1ada1]/60 dark:border-[#3e3832] space-y-3">
              <Markdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-sm font-bold text-[#c15f3c] border-b border-[#b1ada1]/40 dark:border-[#3e3832] pb-1 mt-2 mb-1.5 flex items-center gap-1.5 font-mono">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xs font-bold text-[#2b2724] dark:text-[#f4f3ee] mt-3 mb-1.5 flex items-center gap-1.5 font-mono uppercase tracking-wider text-[#c15f3c]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c15f3c]" />
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xs font-semibold text-[#2b2724] dark:text-[#f4f3ee] mt-2 mb-1">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-2 leading-relaxed text-[#2b2724] dark:text-[#dcd8d0] last:mb-0">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-1 my-2 text-[#2b2724] dark:text-[#dcd8d0] pl-1">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-1 my-2 text-[#2b2724] dark:text-[#dcd8d0] pl-1">
                      {children}
                    </ol>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-[#c15f3c] pl-3 py-1 my-2 bg-[#ffffff]/50 dark:bg-[#201c19]/50 rounded-r-lg italic text-[#6e6a60] dark:text-[#a8a29e]">
                      {children}
                    </blockquote>
                  ),
                  pre: ({ children }) => (
                    <pre className="my-2 overflow-x-auto rounded-lg bg-[#23201d] dark:bg-[#11100e] p-3 text-[#f4f3ee] border border-[#3e3a36] font-mono text-[11px] leading-relaxed shadow-inner">
                      {children}
                    </pre>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className && typeof children === "string" && !children.includes("\n");
                    if (isInline) {
                      return (
                        <code className="px-1.5 py-0.5 rounded bg-[#ffffff] dark:bg-[#282420] text-[#c15f3c] border border-[#b1ada1]/50 dark:border-[#4a433d] font-mono text-[11px]">
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code className="font-mono text-[11px] whitespace-pre text-[#f4f3ee]">
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {rawResponse}
              </Markdown>
            </div>

            {/* Metrics Grid if provided */}
            {cardData?.metrics && cardData.metrics.length > 0 && (
              <div id="aijy-metrics-grid" className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {cardData.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    id={`aijy-metric-card-${idx}`}
                    className="p-2.5 rounded-xl bg-[#f4f3ee] dark:bg-[#171513] border border-[#b1ada1]/60 dark:border-[#3e3832] flex flex-col justify-between"
                  >
                    <span id={`aijy-metric-label-${idx}`} className="text-[10px] uppercase font-mono text-[#6e6a60] dark:text-[#a8a29e]">
                      {metric.label}
                    </span>
                    <div id={`aijy-metric-val-wrap-${idx}`} className="flex items-baseline gap-1.5 mt-1">
                      <span id={`aijy-metric-value-${idx}`} className="text-sm font-bold font-mono text-[#2b2724] dark:text-[#f4f3ee]">
                        {metric.value}
                      </span>
                      {metric.badge && (
                        <span
                          id={`aijy-metric-badge-${idx}`}
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold ${
                            metric.status === "good"
                              ? "bg-[#c15f3c]/15 text-[#c15f3c]"
                              : metric.status === "warn"
                              ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                              : "bg-[#ffffff] dark:bg-[#282420] text-[#6e6a60] dark:text-[#a8a29e] border border-[#b1ada1]/60 dark:border-[#4a433d]"
                          }`}
                        >
                          {metric.badge}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Interactive Diagnostics List */}
            {cardData?.diagnostics && cardData.diagnostics.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#2b2724] dark:text-[#f4f3ee]">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#c15f3c]" />
                    <span>Diagnóstico de Itens e Correções</span>
                  </span>
                  <span className="text-[10px] text-[#6e6a60] dark:text-[#a8a29e] font-mono">
                    {cardData.diagnostics.length} item(ns)
                  </span>
                </div>

                <div className="space-y-2">
                  {cardData.diagnostics.map((diag, dIdx) => {
                    const diagId = diag.id || `diag-${dIdx}`;
                    const isExpanded = expandedDiagnostics[diagId] ?? true;
                    const badge = getSeverityBadge(diag.severity);

                    return (
                      <div
                        key={diagId}
                        className="rounded-xl bg-[#ffffff] dark:bg-[#201c19] border border-[#b1ada1]/70 dark:border-[#3e3832] overflow-hidden shadow-xs"
                      >
                        <div
                          onClick={() => toggleDiagnostic(diagId)}
                          className="px-3.5 py-2.5 flex items-center justify-between cursor-pointer hover:bg-[#f4f3ee] dark:hover:bg-[#282420] transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`p-1 rounded-md border ${badge.bg}`}>
                              {badge.icon}
                            </span>
                            <span className="font-semibold text-[#2b2724] dark:text-[#f4f3ee] text-xs truncate">
                              {diag.title}
                            </span>
                            {diag.filePath && (
                              <span className="hidden sm:inline text-[10px] font-mono text-[#6e6a60] dark:text-[#a8a29e] bg-[#f4f3ee] dark:bg-[#171513] px-1.5 py-0.5 rounded border border-[#b1ada1]/60 dark:border-[#3e3832]">
                                {diag.filePath}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5 text-[#6e6a60] dark:text-[#a8a29e]" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-[#6e6a60] dark:text-[#a8a29e]" />
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="px-3.5 pb-3.5 pt-1 space-y-2.5 text-[11px] border-t border-[#b1ada1]/40 dark:border-[#3e3832] bg-[#f4f3ee]/50 dark:bg-[#171513]/50">
                            <p className="text-[#2b2724] dark:text-[#f4f3ee] leading-relaxed font-sans">
                              {diag.description}
                            </p>

                            {diag.solution && (
                              <div className="p-2.5 rounded-lg bg-[#c15f3c]/10 border border-[#c15f3c]/30 text-[#2b2724] dark:text-[#f4f3ee] flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#c15f3c] shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                  <strong className="text-[#c15f3c] font-semibold block">
                                    Solução Recomendada:
                                  </strong>
                                  <p className="text-[#2b2724] dark:text-[#f4f3ee] font-sans leading-relaxed">
                                    {diag.solution}
                                  </p>
                                </div>
                              </div>
                            )}

                            {diag.autoFixCommand && (
                              <div className="pt-1 flex items-center justify-between">
                                <div className="text-[10px] font-mono text-[#6e6a60] dark:text-[#a8a29e] truncate mr-2">
                                  $ {diag.autoFixCommand}
                                </div>
                                <button
                                  onClick={() => onExecuteCommand(diag.autoFixCommand!)}
                                  disabled={isLoading}
                                  className="px-3 py-1 bg-[#c15f3c] hover:bg-[#a84e2e] disabled:opacity-50 text-white font-medium rounded-lg text-xs font-sans flex items-center gap-1.5 transition-colors shrink-0 shadow-xs cursor-pointer"
                                >
                                  <Wrench className="w-3 h-3" />
                                  <span>{diag.autoFixLabel || "Corrigir Automaticamente"}</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Embedded Code Preview Card if available in visual tab */}
            {cardData?.codeSnippet && (
              <div className="rounded-xl bg-[#ffffff] dark:bg-[#201c19] border border-[#b1ada1]/70 dark:border-[#3e3832] p-3 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#2b2724] dark:text-[#f4f3ee] font-mono text-[11px] font-semibold">
                    <FileCode className="w-3.5 h-3.5 text-[#c15f3c]" />
                    <span>{cardData.codeSnippet.targetPath || cardData.codeSnippet.title || "Código Gerado"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(cardData.codeSnippet!.code)}
                      className="px-2 py-0.5 rounded-lg bg-[#f4f3ee] dark:bg-[#282420] hover:bg-[#ffffff] dark:hover:bg-[#322e29] text-[#2b2724] dark:text-[#f4f3ee] border border-[#b1ada1]/70 dark:border-[#4a433d] text-[10px] flex items-center gap-1 font-mono transition-colors cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-[#c15f3c]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode ? "Copiado!" : "Copiar"}</span>
                    </button>
                    {onApplyCode && cardData.codeSnippet.targetPath && (
                      <button
                        onClick={() =>
                          onApplyCode(
                            cardData.codeSnippet!.targetPath!,
                            cardData.codeSnippet!.code
                          )
                        }
                        className="px-2.5 py-0.5 rounded-lg bg-[#c15f3c] hover:bg-[#a84e2e] text-white text-[10px] font-sans font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Wrench className="w-3 h-3" />
                        <span>Aplicar</span>
                      </button>
                    )}
                  </div>
                </div>

                <pre className="p-3 rounded-lg bg-[#23201d] dark:bg-[#11100e] border border-[#3e3a36] text-[#f4f3ee] font-mono text-[11px] overflow-x-auto max-h-48 whitespace-pre leading-relaxed shadow-inner">
                  {cardData.codeSnippet.code}
                </pre>
              </div>
            )}

            {/* Detected Stack Inspector Radar */}
            {stackInfo && (stackInfo.languages?.length || stackInfo.frameworks?.length || stackInfo.tools?.length) ? (
              <div className="p-3 rounded-xl bg-[#f4f3ee] dark:bg-[#171513] border border-[#b1ada1]/60 dark:border-[#3e3832] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2b2724] dark:text-[#f4f3ee]">
                  <Layers className="w-3.5 h-3.5 text-[#c15f3c]" />
                  <span>Stack Tecnológica Reconhecida no Projeto</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {stackInfo.languages?.map((lang, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-[#ffffff] dark:bg-[#282420] border border-[#b1ada1]/60 dark:border-[#4a433d] text-[#2b2724] dark:text-[#f4f3ee] text-[10px] font-mono font-semibold"
                    >
                      {lang}
                    </span>
                  ))}
                  {stackInfo.frameworks?.map((fw, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-[#ffffff] dark:bg-[#282420] border border-[#b1ada1]/60 dark:border-[#4a433d] text-[#2b2724] dark:text-[#f4f3ee] text-[10px] font-mono font-semibold"
                    >
                      {fw}
                    </span>
                  ))}
                  {stackInfo.tools?.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-[#ffffff] dark:bg-[#282420] border border-[#b1ada1]/60 dark:border-[#4a433d] text-[#2b2724] dark:text-[#f4f3ee] text-[10px] font-mono font-semibold"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Interactive Quick Actions / Suggestions Grid */}
            {((cardData?.quickActions && cardData.quickActions.length > 0) ||
              (suggestedCommands && suggestedCommands.length > 0)) && (
              <div className="space-y-2 pt-1 border-t border-[#b1ada1]/40 dark:border-[#3e3832]">
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#2b2724] dark:text-[#f4f3ee]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#c15f3c]" />
                    <span>Ações Interativas Recomendadas</span>
                  </span>
                  <span className="text-[10px] text-[#6e6a60] dark:text-[#a8a29e] font-mono">
                    1 clique para executar
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {cardData?.quickActions?.map((action, aIdx) => (
                    <button
                      key={aIdx}
                      onClick={() => onExecuteCommand(action.command)}
                      disabled={isLoading}
                      className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all group cursor-pointer shadow-xs ${
                        action.isPrimary
                          ? "bg-[#c15f3c]/10 dark:bg-[#c15f3c]/20 hover:bg-[#c15f3c]/15 border-[#c15f3c]/50 text-[#2b2724] dark:text-[#f4f3ee]"
                          : "bg-[#ffffff] dark:bg-[#201c19] hover:bg-[#f4f3ee] dark:hover:bg-[#282420] border-[#b1ada1]/70 dark:border-[#3e3832] text-[#2b2724] dark:text-[#f4f3ee]"
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                          action.isPrimary
                            ? "bg-[#c15f3c] text-white"
                            : "bg-[#f4f3ee] dark:bg-[#282420] text-[#6e6a60] dark:text-[#a8a29e] group-hover:text-[#c15f3c] border border-[#b1ada1]/60 dark:border-[#4a433d]"
                        }`}
                      >
                        {renderIcon(action.icon)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-xs flex items-center justify-between">
                          <span className="truncate">{action.label}</span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1 text-[#c15f3c]" />
                        </div>
                        {action.description && (
                          <p className="text-[10px] text-[#6e6a60] dark:text-[#a8a29e] leading-tight mt-0.5 line-clamp-1">
                            {action.description}
                          </p>
                        )}
                        <span className="text-[9px] font-mono text-[#6e6a60] dark:text-[#a8a29e] block mt-1">
                          $ {action.command}
                        </span>
                      </div>
                    </button>
                  ))}

                  {/* Fallback to simple suggested commands if no rich quick actions */}
                  {(!cardData?.quickActions || cardData.quickActions.length === 0) &&
                    suggestedCommands.map((cmd, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => onExecuteCommand(cmd)}
                        disabled={isLoading}
                        className="p-2.5 rounded-xl bg-[#ffffff] dark:bg-[#201c19] hover:bg-[#f4f3ee] dark:hover:bg-[#282420] border border-[#b1ada1]/70 dark:border-[#3e3832] hover:border-[#c15f3c]/50 text-left flex items-center justify-between text-xs text-[#2b2724] dark:text-[#f4f3ee] transition-colors group cursor-pointer shadow-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0 font-mono text-[11px]">
                          <Terminal className="w-3.5 h-3.5 text-[#6e6a60] dark:text-[#a8a29e] group-hover:text-[#c15f3c] shrink-0" />
                          <span className="truncate">{cmd}</span>
                        </div>
                        <Play className="w-3 h-3 text-[#6e6a60] dark:text-[#a8a29e] group-hover:text-[#c15f3c] shrink-0 fill-current opacity-60 group-hover:opacity-100" />
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
