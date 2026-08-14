import React, { useState, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertTriangle,
  Key,
  X,
  ExternalLink,
  Copy,
  Check,
  Cpu,
  Terminal,
} from "lucide-react";

interface GeminiStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  geminiActive: boolean;
  onRefreshStatus: () => void;
}

export const GeminiStatusModal: React.FC<GeminiStatusModalProps> = ({
  isOpen,
  onClose,
  geminiActive,
  onRefreshStatus,
}) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success?: boolean;
    message?: string;
    keyPreview?: string | null;
    source?: string | null;
    errorDetails?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      handleTestConnection();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/gemini/test", { method: "POST" });
      const data = await res.json();
      setTestResult(data);
      if (data.success) {
        onRefreshStatus();
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Falha ao conectar com o backend local: ${err.message}`,
      });
    } finally {
      setTesting(false);
    }
  };

  const copyEnvSnippet = () => {
    navigator.clipboard.writeText("GEMINI_API_KEY=sua_chave_aqui");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
      <div className="w-full max-w-xl bg-[#ffffff] dark:bg-[#1a1715] border border-[#b1ada1]/70 dark:border-[#3e3832] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#2b2724] dark:text-[#f4f3ee]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-[#f4f3ee] dark:bg-[#201c19] border-b border-[#b1ada1]/60 dark:border-[#3e3832] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#c15f3c]/10 text-[#c15f3c] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#c15f3c]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#2b2724] dark:text-[#f4f3ee] flex items-center gap-2">
                <span>Status da Conexão Gemini AI</span>
                {geminiActive ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c15f3c]/10 text-[#c15f3c] border border-[#c15f3c]/30 font-bold">
                    Ativo
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-bold">
                    Chave Pendente
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#6e6a60] dark:text-[#a8a29e]">
                Diagnóstico da API do Google Gemini
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
        <div className="p-5 space-y-4 text-xs">
          {/* Test Status Box */}
          <div
            className={`p-3.5 rounded-xl border flex flex-col gap-2 ${
              testResult?.success
                ? "bg-[#f4f3ee] dark:bg-[#201c19] border-[#c15f3c]/40 text-[#2b2724] dark:text-[#f4f3ee]"
                : testResult?.success === false
                ? "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-300"
                : "bg-[#f4f3ee] dark:bg-[#201c19] border-[#b1ada1]/60 dark:border-[#3e3832] text-[#2b2724] dark:text-[#f4f3ee]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold">
                {testing ? (
                  <RefreshCw className="w-4 h-4 text-[#c15f3c] animate-spin" />
                ) : testResult?.success ? (
                  <CheckCircle2 className="w-4 h-4 text-[#c15f3c]" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                )}
                <span>
                  {testing
                    ? "Testando comunicação com Google GenAI..."
                    : testResult?.success
                    ? "Gemini Conectado e Respondendo com Sucesso!"
                    : "Gemini Não Conectado / Chave Não Reconhecida"}
                </span>
              </div>

              <button
                onClick={handleTestConnection}
                disabled={testing}
                className="px-2.5 py-1 bg-[#ffffff] dark:bg-[#282420] hover:bg-[#f4f3ee] dark:hover:bg-[#322e29] disabled:opacity-50 text-[#2b2724] dark:text-[#f4f3ee] rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors border border-[#b1ada1]/70 dark:border-[#4a433d] cursor-pointer shadow-xs"
              >
                <RefreshCw className={`w-3 h-3 ${testing ? "animate-spin" : ""}`} />
                <span>Testar Novamente</span>
              </button>
            </div>

            {testResult?.message && (
              <p className="text-[11px] font-mono leading-relaxed mt-1 text-[#6e6a60] dark:text-[#a8a29e]">
                {testResult.message}
              </p>
            )}

            {testResult?.keyPreview && (
              <div className="text-[10px] font-mono text-[#6e6a60] dark:text-[#a8a29e] flex items-center gap-2 pt-1 border-t border-[#b1ada1]/40 dark:border-[#3e3832]">
                <span>Variável: <strong className="text-[#2b2724] dark:text-[#f4f3ee]">{testResult.source}</strong></span>
                <span>•</span>
                <span>Chave: <strong className="text-[#2b2724] dark:text-[#f4f3ee]">{testResult.keyPreview}</strong></span>
              </div>
            )}
          </div>

          {/* Localhost Setup Instructions */}
          <div className="bg-[#f4f3ee] dark:bg-[#201c19] border border-[#b1ada1]/60 dark:border-[#3e3832] rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 font-bold text-[#2b2724] dark:text-[#f4f3ee] text-xs">
              <Terminal className="w-4 h-4 text-[#c15f3c]" />
              <span>Como configurar no seu Localhost:</span>
            </div>

            <ol className="list-decimal list-inside space-y-2 text-[#6e6a60] dark:text-[#a8a29e] leading-relaxed font-sans text-[11px]">
              <li>
                Crie um arquivo chamado <code className="text-[#c15f3c] font-mono bg-[#ffffff] dark:bg-[#282420] px-1.5 py-0.5 rounded border border-[#b1ada1]/60 dark:border-[#4a433d] font-semibold">.env</code> na <strong>raiz do projeto</strong> (mesmo nível do <code className="text-[#2b2724] dark:text-[#f4f3ee] font-mono">package.json</code>).
              </li>
              <li>
                Adicione a linha com a sua chave obtida no Google AI Studio:
                <div className="mt-1 flex items-center justify-between bg-[#ffffff] dark:bg-[#171513] border border-[#b1ada1]/60 dark:border-[#3e3832] rounded-xl p-2 font-mono text-[11px] text-[#c15f3c] shadow-xs">
                  <span>GEMINI_API_KEY=AIzaSy...</span>
                  <button
                    onClick={copyEnvSnippet}
                    className="p-1 text-[#6e6a60] dark:text-[#a8a29e] hover:text-[#2b2724] dark:hover:text-[#f4f3ee] cursor-pointer"
                    title="Copiar linha"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#c15f3c]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </li>
              <li>
                <strong>Atenção:</strong> Se o servidor local (<code className="text-[#2b2724] dark:text-[#f4f3ee] font-mono">npm run dev</code>) já estava rodando quando você criou o arquivo <code className="text-[#c15f3c] font-mono font-semibold">.env</code>, <strong>pare o terminal com Ctrl+C e execute novamente:</strong>
                <div className="mt-1 bg-[#23201d] dark:bg-[#0f0e0c] border border-[#b1ada1]/40 dark:border-[#3e3832] rounded-xl p-2 font-mono text-[11px] text-[#f4f3ee] shadow-xs">
                  $ npm run dev
                </div>
              </li>
              <li>
                Após reiniciar o comando local, clique no botão <strong>"Testar Novamente"</strong> acima.
              </li>
            </ol>
          </div>

          {/* Fallback Note */}
          <div className="p-3 rounded-xl bg-[#f4f3ee] dark:bg-[#201c19] border border-[#b1ada1]/60 dark:border-[#3e3832] text-[11px] text-[#6e6a60] dark:text-[#a8a29e] flex items-start gap-2">
            <Cpu className="w-4 h-4 text-[#c15f3c] shrink-0 mt-0.5" />
            <p>
              Mesmo sem a chave Gemini configurada, o <strong>AIJY funciona em modo offline/heurístico</strong>, respondendo análises de código, suítes de teste, diagnósticos de segurança e ferramentas CLI diretamente pelo motor embutido.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[#f4f3ee] dark:bg-[#201c19] border-t border-[#b1ada1]/60 dark:border-[#3e3832] flex items-center justify-between">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#c15f3c] hover:text-[#a84e2e] flex items-center gap-1 font-semibold"
          >
            <span>Obter chave no Google AI Studio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#ffffff] dark:bg-[#282420] hover:bg-[#f4f3ee] dark:hover:bg-[#322e29] border border-[#b1ada1]/70 dark:border-[#4a433d] text-[#2b2724] dark:text-[#f4f3ee] rounded-xl font-semibold text-xs transition-colors cursor-pointer shadow-xs"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
