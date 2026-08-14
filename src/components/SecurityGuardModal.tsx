import React from "react";
import { Shield, ShieldAlert, CheckCircle2, Lock, AlertOctagon, Terminal, X } from "lucide-react";
import { PermissionMode } from "../types";

interface SecurityGuardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: PermissionMode;
  onChangeMode: (mode: PermissionMode) => void;
}

export const SecurityGuardModal: React.FC<SecurityGuardModalProps> = ({
  isOpen,
  onClose,
  currentMode,
  onChangeMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#ffffff] dark:bg-[#1a1715] border border-[#b1ada1]/70 dark:border-[#3e3832] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-[#2b2724] dark:text-[#f4f3ee] font-sans">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#b1ada1]/60 dark:border-[#3e3832] bg-[#f4f3ee] dark:bg-[#201c19] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#c15f3c]/10 text-[#c15f3c] flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#2b2724] dark:text-[#f4f3ee] flex items-center gap-2">
                Arquitetura de Segurança do AIJY
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c15f3c]/10 text-[#c15f3c] border border-[#c15f3c]/30 font-mono font-bold">
                  Zero Trust &amp; Consent
                </span>
              </h2>
              <p className="text-xs text-[#6e6a60] dark:text-[#a8a29e]">
                O AIJY não possui acesso irrestrito ao sistema operacional. Toda ação de risco exige consentimento.
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

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Permission Tiers */}
          <div className="space-y-2.5">
            <span className="font-bold text-[#2b2724] dark:text-[#f4f3ee] text-sm block">
              1. Níveis de Permissão do Agente
            </span>

            {/* Level 1 */}
            <div
              onClick={() => onChangeMode("readonly")}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                currentMode === "readonly"
                  ? "bg-[#c15f3c]/10 dark:bg-[#c15f3c]/20 border-[#c15f3c]/50 shadow-xs"
                  : "bg-[#f4f3ee] dark:bg-[#201c19] border-[#b1ada1]/60 dark:border-[#3e3832] hover:bg-[#ffffff] dark:hover:bg-[#282420]"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#2b2724] dark:text-[#f4f3ee] flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#c15f3c]" /> Modo Somente Leitura
                </span>
                {currentMode === "readonly" && (
                  <span className="text-[10px] bg-[#c15f3c] text-white px-2 py-0.5 rounded-md font-mono font-bold">
                    ATIVO
                  </span>
                )}
              </div>
              <p className="text-[#6e6a60] dark:text-[#a8a29e] text-[11px]">
                Permite ao AIJY apenas ler código, listar diretórios e analisar a arquitetura. Nenhuma alteração de arquivo ou comando de terminal é disparado.
              </p>
            </div>

            {/* Level 2 */}
            <div
              onClick={() => onChangeMode("edit")}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                currentMode === "edit"
                  ? "bg-[#c15f3c]/10 dark:bg-[#c15f3c]/20 border-[#c15f3c]/50 shadow-xs"
                  : "bg-[#f4f3ee] dark:bg-[#201c19] border-[#b1ada1]/60 dark:border-[#3e3832] hover:bg-[#ffffff] dark:hover:bg-[#282420]"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#2b2724] dark:text-[#f4f3ee] flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#c15f3c]" /> Modo Edição
                </span>
                {currentMode === "edit" && (
                  <span className="text-[10px] bg-[#c15f3c] text-white px-2 py-0.5 rounded-md font-mono font-bold">
                    ATIVO
                  </span>
                )}
              </div>
              <p className="text-[#6e6a60] dark:text-[#a8a29e] text-[11px]">
                Permite criar novos arquivos e modificar código com exibição prévia de diff unificado para aprovação do desenvolvedor.
              </p>
            </div>

            {/* Level 3 */}
            <div
              onClick={() => onChangeMode("execution")}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                currentMode === "execution"
                  ? "bg-[#c15f3c]/10 dark:bg-[#c15f3c]/20 border-[#c15f3c]/50 shadow-xs"
                  : "bg-[#f4f3ee] dark:bg-[#201c19] border-[#b1ada1]/60 dark:border-[#3e3832] hover:bg-[#ffffff] dark:hover:bg-[#282420]"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#2b2724] dark:text-[#f4f3ee] flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-[#c15f3c]" /> Modo Execução (Padrão)
                </span>
                {currentMode === "execution" && (
                  <span className="text-[10px] bg-[#c15f3c] text-white px-2 py-0.5 rounded-md font-mono font-bold">
                    ATIVO
                  </span>
                )}
              </div>
              <p className="text-[#6e6a60] dark:text-[#a8a29e] text-[11px]">
                Permite executar testes (ex: <code className="text-[#c15f3c] font-mono font-semibold">mvn test</code>, <code className="text-[#c15f3c] font-mono font-semibold">pytest</code>), comandos git e builds.
              </p>
            </div>
          </div>

          {/* Dangerous Operations Sandbox */}
          <div className="bg-[#f4f3ee] dark:bg-[#201c19] border border-[#b1ada1]/60 dark:border-[#3e3832] rounded-xl p-4">
            <span className="font-bold text-rose-700 dark:text-rose-400 text-xs flex items-center gap-1.5 mb-2">
              <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              2. Trava de Segurança para Operações Críticas
            </span>
            <p className="text-[#6e6a60] dark:text-[#a8a29e] text-[11px] mb-2.5">
              Mesmo no Modo Execução, o AIJY intercepta e exige confirmação manual <code className="text-[#c15f3c] font-mono font-bold">[s/N]</code> antes de executar qualquer uma das seguintes ações:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="p-2 rounded-lg bg-[#ffffff] dark:bg-[#171513] border border-[#b1ada1]/60 dark:border-[#3e3832] text-rose-700 dark:text-rose-400 font-semibold shadow-xs">
                • rm -rf / del /s
              </div>
              <div className="p-2 rounded-lg bg-[#ffffff] dark:bg-[#171513] border border-[#b1ada1]/60 dark:border-[#3e3832] text-rose-700 dark:text-rose-400 font-semibold shadow-xs">
                • DROP TABLE / DROP DATABASE
              </div>
              <div className="p-2 rounded-lg bg-[#ffffff] dark:bg-[#171513] border border-[#b1ada1]/60 dark:border-[#3e3832] text-rose-700 dark:text-rose-400 font-semibold shadow-xs">
                • git push --force / reset --hard
              </div>
              <div className="p-2 rounded-lg bg-[#ffffff] dark:bg-[#171513] border border-[#b1ada1]/60 dark:border-[#3e3832] text-rose-700 dark:text-rose-400 font-semibold shadow-xs">
                • kill -9 / pkill
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#b1ada1]/60 dark:border-[#3e3832] bg-[#f4f3ee] dark:bg-[#201c19] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#c15f3c] hover:bg-[#a84e2e] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
