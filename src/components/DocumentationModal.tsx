import React, { useState } from "react";
import { BookOpen, Terminal, Code2, GitBranch, Cpu, HelpCircle, X, Search, Check } from "lucide-react";

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"tools" | "git" | "spring" | "docker">("tools");

  if (!isOpen) return null;

  const handleUsePrompt = (prompt: string) => {
    onSelectPrompt(prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#ffffff] dark:bg-[#1a1715] border border-[#b1ada1]/70 dark:border-[#3e3832] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-[#2b2724] dark:text-[#f4f3ee] font-sans">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#b1ada1]/60 dark:border-[#3e3832] bg-[#f4f3ee] dark:bg-[#201c19] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#c15f3c]/10 text-[#c15f3c] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#2b2724] dark:text-[#f4f3ee] flex items-center gap-2">
                Documentação &amp; Manual do AIJY
              </h2>
              <p className="text-xs text-[#6e6a60] dark:text-[#a8a29e]">
                Guia de ferramentas de desenvolvimento, comandos e exemplos práticos.
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

        {/* Tab selector */}
        <div className="flex border-b border-[#b1ada1]/60 dark:border-[#3e3832] bg-[#f4f3ee] dark:bg-[#201c19] px-5 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab("tools")}
            className={`py-2.5 px-3 border-b-2 font-semibold transition-colors cursor-pointer shrink-0 ${
              activeTab === "tools"
                ? "border-[#c15f3c] text-[#c15f3c]"
                : "border-transparent text-[#6e6a60] dark:text-[#a8a29e] hover:text-[#2b2724] dark:hover:text-[#f4f3ee]"
            }`}
          >
            🛠️ Ferramentas do Agente
          </button>
          <button
            onClick={() => setActiveTab("git")}
            className={`py-2.5 px-3 border-b-2 font-semibold transition-colors cursor-pointer shrink-0 ${
              activeTab === "git"
                ? "border-[#c15f3c] text-[#c15f3c]"
                : "border-transparent text-[#6e6a60] dark:text-[#a8a29e] hover:text-[#2b2724] dark:hover:text-[#f4f3ee]"
            }`}
          >
            🌿 Git &amp; Commits
          </button>
          <button
            onClick={() => setActiveTab("spring")}
            className={`py-2.5 px-3 border-b-2 font-semibold transition-colors cursor-pointer shrink-0 ${
              activeTab === "spring"
                ? "border-[#c15f3c] text-[#c15f3c]"
                : "border-transparent text-[#6e6a60] dark:text-[#a8a29e] hover:text-[#2b2724] dark:hover:text-[#f4f3ee]"
            }`}
          >
            ☕ Java &amp; Spring Boot
          </button>
          <button
            onClick={() => setActiveTab("docker")}
            className={`py-2.5 px-3 border-b-2 font-semibold transition-colors cursor-pointer shrink-0 ${
              activeTab === "docker"
                ? "border-[#c15f3c] text-[#c15f3c]"
                : "border-transparent text-[#6e6a60] dark:text-[#a8a29e] hover:text-[#2b2724] dark:hover:text-[#f4f3ee]"
            }`}
          >
            🐳 Docker &amp; DevOps
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {activeTab === "tools" && (
            <div className="space-y-3">
              <h3 className="font-bold text-[#2b2724] dark:text-[#f4f3ee] text-sm">
                Catálogo de Ferramentas Nativas do AIJY
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11px]">
                <div className="p-3.5 rounded-xl bg-[#f4f3ee] dark:bg-[#201c19] border border-[#b1ada1]/60 dark:border-[#3e3832]">
                  <span className="text-[#c15f3c] font-bold">list_files(path)</span>
                  <p className="text-[#6e6a60] dark:text-[#a8a29e] font-sans mt-1 text-[11px]">
                    Varre diretórios recursivamente para mapear a estrutura do repositório.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#f4f3ee] dark:bg-[#201c19] border border-[#b1ada1]/60 dark:border-[#3e3832]">
                  <span className="text-[#c15f3c] font-bold">read_file(path)</span>
                  <p className="text-[#6e6a60] dark:text-[#a8a29e] font-sans mt-1 text-[11px]">
                    Lê o código-fonte de arquivos para diagnóstico e compreensão do contexto.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#f4f3ee] dark:bg-[#201c19] border border-[#b1ada1]/60 dark:border-[#3e3832]">
                  <span className="text-[#c15f3c] font-bold">write_file(path, content)</span>
                  <p className="text-[#6e6a60] dark:text-[#a8a29e] font-sans mt-1 text-[11px]">
                    Aplica alterações e refatorações cirúrgicas exibindo diff visual prévio.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#f4f3ee] dark:bg-[#201c19] border border-[#b1ada1]/60 dark:border-[#3e3832]">
                  <span className="text-[#c15f3c] font-bold">run_command(command)</span>
                  <p className="text-[#6e6a60] dark:text-[#a8a29e] font-sans mt-1 text-[11px]">
                    Executa comandos no terminal (ex: <code className="text-[#2b2724] dark:text-[#f4f3ee] font-semibold">mvn clean compile</code>, <code className="text-[#2b2724] dark:text-[#f4f3ee] font-semibold">npm test</code>).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#f4f3ee] dark:bg-[#201c19] border border-[#b1ada1]/60 dark:border-[#3e3832]">
                  <span className="text-[#c15f3c] font-bold">run_tests()</span>
                  <p className="text-[#6e6a60] dark:text-[#a8a29e] font-sans mt-1 text-[11px]">
                    Executa a suíte de testes unitários e de integração com relatório de cobertura.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#f4f3ee] dark:bg-[#201c19] border border-[#b1ada1]/60 dark:border-[#3e3832]">
                  <span className="text-[#c15f3c] font-bold">search_docs(query)</span>
                  <p className="text-[#6e6a60] dark:text-[#a8a29e] font-sans mt-1 text-[11px]">
                    Consulta documentações oficiais de frameworks, bibliotecas e boas práticas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "git" && (
            <div className="space-y-3">
              <h3 className="font-bold text-[#2b2724] dark:text-[#f4f3ee] text-sm">
                Exemplos de Interação Git com o AIJY
              </h3>
              <div className="space-y-2">
                {[
                  "Analise o git status e crie uma mensagem de commit semântica",
                  "Mostre o git diff das alterações não comitadas",
                  "Como resolver conflito na branch main?",
                  "Explique a diferença entre git rebase e git merge"
                ].map((prompt, i) => (
                  <div
                    key={i}
                    onClick={() => handleUsePrompt(prompt)}
                    className="p-3 rounded-xl bg-[#f4f3ee] dark:bg-[#201c19] border border-[#b1ada1]/60 dark:border-[#3e3832] hover:border-[#c15f3c]/50 hover:bg-[#ffffff] dark:hover:bg-[#282420] cursor-pointer flex items-center justify-between group transition-all shadow-xs"
                  >
                    <span className="text-[#2b2724] dark:text-[#f4f3ee] font-mono text-[11px]">&gt; {prompt}</span>
                    <span className="text-[10px] px-2.5 py-1 rounded-lg bg-[#c15f3c]/10 text-[#c15f3c] group-hover:bg-[#c15f3c] group-hover:text-white font-semibold transition-colors">
                      Enviar ao AIJY
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "spring" && (
            <div className="space-y-3">
              <h3 className="font-bold text-[#2b2724] dark:text-[#f4f3ee] text-sm">
                Exemplos para Projetos Java &amp; Spring Boot
              </h3>
              <div className="space-y-2">
                {[
                  "Analise meu projeto e encontre possíveis problemas.",
                  "Explique o erro que está acontecendo no meu projeto Spring Boot.",
                  "Crie testes unitários com JUnit 5 e Mockito para a camada de serviço",
                  "Como configurar pool HikariCP e conexão segura com MySQL?"
                ].map((prompt, i) => (
                  <div
                    key={i}
                    onClick={() => handleUsePrompt(prompt)}
                    className="p-3 rounded-xl bg-[#f4f3ee] dark:bg-[#201c19] border border-[#b1ada1]/60 dark:border-[#3e3832] hover:border-[#c15f3c]/50 hover:bg-[#ffffff] dark:hover:bg-[#282420] cursor-pointer flex items-center justify-between group transition-all shadow-xs"
                  >
                    <span className="text-[#2b2724] dark:text-[#f4f3ee] font-mono text-[11px]">&gt; {prompt}</span>
                    <span className="text-[10px] px-2.5 py-1 rounded-lg bg-[#c15f3c]/10 text-[#c15f3c] group-hover:bg-[#c15f3c] group-hover:text-white font-semibold transition-colors">
                      Enviar ao AIJY
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "docker" && (
            <div className="space-y-3">
              <h3 className="font-bold text-[#2b2724] dark:text-[#f4f3ee] text-sm">
                Exemplos de DevOps, Containers &amp; CI/CD
              </h3>
              <div className="space-y-2">
                {[
                  "Gere um Dockerfile multi-stage otimizado para produção",
                  "Crie um arquivo docker-compose.yml com a API e banco de dados",
                  "Audite os manifests Kubernetes para boas práticas de segurança",
                  "Crie um pipeline de CI/CD para o GitHub Actions"
                ].map((prompt, i) => (
                  <div
                    key={i}
                    onClick={() => handleUsePrompt(prompt)}
                    className="p-3 rounded-xl bg-[#f4f3ee] dark:bg-[#201c19] border border-[#b1ada1]/60 dark:border-[#3e3832] hover:border-[#c15f3c]/50 hover:bg-[#ffffff] dark:hover:bg-[#282420] cursor-pointer flex items-center justify-between group transition-all shadow-xs"
                  >
                    <span className="text-[#2b2724] dark:text-[#f4f3ee] font-mono text-[11px]">&gt; {prompt}</span>
                    <span className="text-[10px] px-2.5 py-1 rounded-lg bg-[#c15f3c]/10 text-[#c15f3c] group-hover:bg-[#c15f3c] group-hover:text-white font-semibold transition-colors">
                      Enviar ao AIJY
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
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
