import React from "react";
import { Brain, Layers, Cpu, User, CheckCircle2, Shield, Sparkles, X, Plus } from "lucide-react";
import { AgentMemory } from "../types";

interface AgentMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  memory: AgentMemory;
  onClearSessionMemory: () => void;
  onAddProjectNote: (note: string) => void;
}

export const AgentMemoryModal: React.FC<AgentMemoryModalProps> = ({
  isOpen,
  onClose,
  memory,
  onClearSessionMemory,
  onAddProjectNote,
}) => {
  const [newNote, setNewNote] = React.useState("");

  if (!isOpen) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddProjectNote(newNote.trim());
    setNewNote("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#ffffff] dark:bg-[#1a1715] border border-[#b1ada1]/70 dark:border-[#3e3832] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-[#2b2724] dark:text-[#f4f3ee] font-sans">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#b1ada1]/60 dark:border-[#3e3832] bg-[#f4f3ee] dark:bg-[#201c19] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#c15f3c]/10 text-[#c15f3c] flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#2b2724] dark:text-[#f4f3ee] flex items-center gap-2">
                Sistema de Memória do AIJY
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c15f3c]/10 text-[#c15f3c] border border-[#c15f3c]/30 font-mono font-bold">
                  3 Níveis Ativos
                </span>
              </h2>
              <p className="text-xs text-[#6e6a60] dark:text-[#a8a29e]">
                O AIJY retém contexto entre comandos para oferecer respostas precisas e contextualizadas.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#ffffff] dark:hover:bg-[#282420] text-[#6e6a60] dark:text-[#a8a29e] hover:text-[#2b2724] dark:hover:text-[#f4f3ee] border border-transparent hover:border-[#b1ada1]/60 dark:hover:border-[#4a433d] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Level 1: Memória da Sessão */}
          <div className="bg-[#f4f3ee] dark:bg-[#201c19] border border-[#b1ada1]/60 dark:border-[#3e3832] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-[#c15f3c] font-bold">
                <Cpu className="w-4 h-4" />
                <span>1. Memória da Sessão (Temporária)</span>
              </div>
              <button
                onClick={onClearSessionMemory}
                className="text-[11px] text-[#6e6a60] dark:text-[#a8a29e] hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors cursor-pointer"
              >
                Limpar Sessão
              </button>
            </div>
            <p className="text-[#6e6a60] dark:text-[#a8a29e] text-[11px] mb-2.5">
              Armazena o histórico recente de comandos, saídas de ferramentas e raciocínio imediato.
            </p>
            {memory.sessionMemory.length > 0 ? (
              <ul className="space-y-1.5">
                {memory.sessionMemory.map((item, idx) => (
                  <li
                    key={idx}
                    className="bg-[#ffffff] dark:bg-[#171513] border border-[#b1ada1]/60 dark:border-[#3e3832] rounded-lg px-2.5 py-1.5 text-[#2b2724] dark:text-[#f4f3ee] font-mono text-[11px] flex items-start gap-2 shadow-xs"
                  >
                    <span className="text-[#8e8a80] dark:text-[#6e6a60] select-none">{idx + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-[#8e8a80] dark:text-[#78726b] italic text-[11px]">Nenhum log transitório na sessão atual.</div>
            )}
          </div>

          {/* Level 2: Memória do Projeto */}
          <div className="bg-[#f4f3ee] dark:bg-[#201c19] border border-[#b1ada1]/60 dark:border-[#3e3832] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-[#c15f3c] font-bold">
                <Layers className="w-4 h-4" />
                <span>2. Memória do Projeto ({memory.projectMemory.name})</span>
              </div>
            </div>
            <p className="text-[#6e6a60] dark:text-[#a8a29e] text-[11px] mb-3">
              Conhecimento arquitetural persistente sobre este repositório, dependências detectadas e problemas.
            </p>

            <div className="space-y-2.5">
              <div>
                <span className="text-[11px] font-bold text-[#2b2724] dark:text-[#f4f3ee] block mb-1">
                  Stack Detectada:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {memory.projectMemory.stack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg bg-[#ffffff] dark:bg-[#282420] border border-[#b1ada1]/60 dark:border-[#4a433d] text-[#2b2724] dark:text-[#f4f3ee] text-[11px] font-mono font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {memory.projectMemory.identifiedIssues.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 block mb-1">
                    Pendências e Oportunidades:
                  </span>
                  <ul className="space-y-1">
                    {memory.projectMemory.identifiedIssues.map((issue, i) => (
                      <li key={i} className="text-amber-800 dark:text-amber-200 text-[11px] flex items-start gap-1.5">
                        <span className="text-[#c15f3c] font-bold">•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Add custom project note */}
              <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Adicionar nota persistente para o AIJY lembrar sobre o projeto..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 bg-[#ffffff] dark:bg-[#171513] border border-[#b1ada1]/70 dark:border-[#3e3832] rounded-xl px-3 py-1.5 text-[#2b2724] dark:text-[#f4f3ee] text-xs outline-none focus:border-[#c15f3c]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#c15f3c] hover:bg-[#a84e2e] text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar
                </button>
              </form>
            </div>
          </div>

          {/* Level 3: Memória do Usuário */}
          <div className="bg-[#f4f3ee] dark:bg-[#201c19] border border-[#b1ada1]/60 dark:border-[#3e3832] rounded-xl p-4">
            <div className="flex items-center gap-2 text-[#c15f3c] font-bold mb-2">
              <User className="w-4 h-4" />
              <span>3. Memória do Usuário &amp; Preferências</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div className="bg-[#ffffff] dark:bg-[#171513] p-3 rounded-xl border border-[#b1ada1]/60 dark:border-[#3e3832] shadow-xs">
                <span className="text-[#6e6a60] dark:text-[#a8a29e] block mb-0.5 font-medium">Perfil de Explicação:</span>
                <span className="font-bold text-[#2b2724] dark:text-[#f4f3ee] capitalize">
                  {memory.userPreferences.level}
                </span>
                <p className="text-[10px] text-[#6e6a60] dark:text-[#a8a29e] mt-1">
                  {memory.userPreferences.level === "iniciante"
                    ? "Explicações didáticas com foco em conceitos e passo a passo."
                    : memory.userPreferences.level === "intermediario"
                    ? "Foco em código idiomático e boas práticas."
                    : "Respostas concisas, foco em arquitetura e baixo nível."}
                </p>
              </div>

              <div className="bg-[#ffffff] dark:bg-[#171513] p-3 rounded-xl border border-[#b1ada1]/60 dark:border-[#3e3832] shadow-xs">
                <span className="text-[#6e6a60] dark:text-[#a8a29e] block mb-0.5 font-medium">Nível de Permissão:</span>
                <span className="font-bold text-[#2b2724] dark:text-[#f4f3ee] capitalize">
                  Modo {memory.userPreferences.permissionMode}
                </span>
                <p className="text-[10px] text-[#6e6a60] dark:text-[#a8a29e] mt-1">
                  Comandos destrutivos exigem confirmação explícita [s/N].
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[#b1ada1]/60 dark:border-[#3e3832] bg-[#f4f3ee] dark:bg-[#201c19] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#ffffff] dark:bg-[#282420] hover:bg-[#f4f3ee] dark:hover:bg-[#322e29] border border-[#b1ada1]/70 dark:border-[#4a433d] text-[#2b2724] dark:text-[#f4f3ee] rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
