import React from "react";
import { Check, X, FileCode, ArrowRight, CornerDownRight } from "lucide-react";

interface DiffViewerProps {
  filePath?: string;
  diff?: string;
  oldCode?: string;
  newCode?: string;
  newContent?: string;
  onApply?: (newContent?: string) => void;
  onReject?: () => void;
  applied?: boolean;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  filePath = "Arquivo modificado",
  diff,
  oldCode,
  newCode,
  newContent,
  onApply,
  onReject,
  applied,
}) => {
  // If raw unified diff is provided, use it; otherwise compute simple diff lines from old/new code
  let rawDiff = diff || "";
  if (!rawDiff && (oldCode || newCode || newContent)) {
    const targetNew = newContent || newCode || "";
    if (oldCode && targetNew) {
      rawDiff = `--- ${filePath}\n+++ ${filePath}\n${oldCode
        .split("\n")
        .map((l) => `-${l}`)
        .join("\n")}\n${targetNew
        .split("\n")
        .map((l) => `+${l}`)
        .join("\n")}`;
    } else if (targetNew) {
      rawDiff = `+++ ${filePath}\n${targetNew
        .split("\n")
        .map((l) => `+${l}`)
        .join("\n")}`;
    }
  }

  const lines = (rawDiff || "--- Sem alterações de diff ---").split("\n");

  const handleApply = () => {
    if (onApply) {
      onApply(newContent || newCode || "");
    }
  };

  return (
    <div className="my-2 rounded-2xl border border-[#b1ada1]/70 dark:border-[#3e3832] bg-[#ffffff] dark:bg-[#1a1715] overflow-hidden font-mono text-xs shadow-xs text-[#2b2724] dark:text-[#f4f3ee]">
      {/* Diff Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#f4f3ee] dark:bg-[#201c19] border-b border-[#b1ada1]/60 dark:border-[#3e3832]">
        <div className="flex items-center gap-2 text-[#2b2724] dark:text-[#f4f3ee]">
          <FileCode className="w-4 h-4 text-[#c15f3c]" />
          <span className="font-bold text-[#2b2724] dark:text-[#f4f3ee]">{filePath}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#c15f3c]/10 text-[#c15f3c] border border-[#c15f3c]/30 font-bold">
            diff
          </span>
        </div>

        {applied ? (
          <span className="flex items-center gap-1 text-[11px] text-[#c15f3c] font-sans font-bold">
            <Check className="w-3.5 h-3.5" /> Aplicado no projeto
          </span>
        ) : (
          <div className="flex items-center gap-1.5 font-sans">
            {onReject && (
              <button
                onClick={onReject}
                className="px-2.5 py-1 bg-[#ffffff] dark:bg-[#282420] hover:bg-[#f4f3ee] dark:hover:bg-[#322e29] text-[#6e6a60] dark:text-[#a8a29e] hover:text-[#2b2724] dark:hover:text-[#f4f3ee] border border-[#b1ada1]/70 dark:border-[#4a433d] rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <X className="w-3 h-3 text-red-500" /> Descartar
              </button>
            )}
            {onApply && (
              <button
                onClick={handleApply}
                className="px-3 py-1 bg-[#c15f3c] hover:bg-[#a84e2e] text-white font-medium rounded-lg text-xs transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Check className="w-3 h-3" /> Aplicar Alteração
              </button>
            )}
          </div>
        )}
      </div>

      {/* Diff Content */}
      <div className="p-3 bg-[#23201d] overflow-x-auto max-h-64 leading-relaxed font-mono text-[11px]">
        {lines.map((line, idx) => {
          let lineClass = "text-[#f4f3ee]";
          let bgClass = "";
          let prefix = " ";

          if (line.startsWith("+") && !line.startsWith("+++")) {
            lineClass = "text-emerald-300 font-medium";
            bgClass = "bg-emerald-950/40 border-l-2 border-emerald-500";
            prefix = "+";
          } else if (line.startsWith("-") && !line.startsWith("---")) {
            lineClass = "text-rose-400 line-through opacity-80";
            bgClass = "bg-rose-950/30 border-l-2 border-rose-500";
            prefix = "-";
          } else if (line.startsWith("---") || line.startsWith("+++")) {
            lineClass = "text-[#b1ada1] italic";
          }

          return (
            <div
              key={idx}
              className={`px-2 py-0.5 rounded-sm whitespace-pre flex items-start gap-2 ${bgClass} ${lineClass}`}
            >
              <span className="text-[#6e6a60] select-none text-[10px] w-5 text-right font-mono">
                {idx + 1}
              </span>
              <span className="select-none font-bold opacity-60 w-3">{prefix}</span>
              <span className="flex-1">{line.replace(/^[-+]/, "")}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
