import React, { useState, useMemo } from "react";
import {
  FolderTree,
  FileCode,
  FileText,
  AlertTriangle,
  Plus,
  Trash2,
  Save,
  Check,
  Search,
  ExternalLink,
  Code2,
  Terminal as TerminalIcon,
  Play,
  RotateCcw,
  Copy,
  Sparkles,
  Zap,
  Filter,
  Shield,
  Layers,
  FileCheck,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
  PanelLeftClose,
} from "lucide-react";
import { ProjectFile, ProjectTemplate } from "../types";

interface WorkspaceExplorerProps {
  currentProject: ProjectTemplate;
  activeFile: ProjectFile | null;
  onSelectFile: (file: ProjectFile) => void;
  onUpdateFileContent: (path: string, content: string) => void;
  onCreateFile: (path: string, content: string) => void;
  onDeleteFile: (path: string) => void;
  onTriggerPrompt: (prompt: string) => void;
  onToggleCollapse?: () => void;
}

export const WorkspaceExplorer: React.FC<WorkspaceExplorerProps> = ({
  currentProject,
  activeFile,
  onSelectFile,
  onUpdateFileContent,
  onCreateFile,
  onDeleteFile,
  onTriggerPrompt,
  onToggleCollapse,
}) => {
  const [editorContent, setEditorContent] = useState<string>(activeFile?.content || "");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [showNewFileDialog, setShowNewFileDialog] = useState<boolean>(false);
  const [newFilePath, setNewFilePath] = useState<string>("");
  const [newFileContent, setNewFileContent] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [fileFilterCategory, setFileFilterCategory] = useState<"all" | "code" | "config" | "warnings">("all");
  const [isFullscreenInspector, setIsFullscreenInspector] = useState<boolean>(false);

  // Sync editor content when activeFile changes
  React.useEffect(() => {
    if (activeFile) {
      setEditorContent(activeFile.content);
      setIsEditing(false);
      setSavedSuccess(false);
    }
  }, [activeFile?.path, activeFile?.content]);

  const handleSave = () => {
    if (activeFile) {
      onUpdateFileContent(activeFile.path, editorContent);
      setIsEditing(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  const handleCopyCode = () => {
    if (activeFile) {
      navigator.clipboard.writeText(editorContent || activeFile.content);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleCreateNewFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFilePath.trim()) return;
    onCreateFile(newFilePath.trim(), newFileContent);
    setNewFilePath("");
    setNewFileContent("");
    setShowNewFileDialog(false);
  };

  const filteredFiles = useMemo(() => {
    return currentProject.files.filter((f) => {
      const matchesSearch = f.path.toLowerCase().includes(searchFilter.toLowerCase());
      if (!matchesSearch) return false;

      if (fileFilterCategory === "code") {
        return f.path.endsWith(".java") || f.path.endsWith(".py") || f.path.endsWith(".ts") || f.path.endsWith(".js");
      }
      if (fileFilterCategory === "config") {
        return (
          f.path.endsWith(".xml") ||
          f.path.endsWith(".yaml") ||
          f.path.endsWith(".yml") ||
          f.path.endsWith(".properties") ||
          f.path.endsWith(".json") ||
          f.path.includes("Dockerfile")
        );
      }
      if (fileFilterCategory === "warnings") {
        return Boolean(f.hasWarning);
      }
      return true;
    });
  }, [currentProject.files, searchFilter, fileFilterCategory]);

  const warningCount = currentProject.files.filter((f) => f.hasWarning).length;

  const getFileIcon = (path: string) => {
    if (path.endsWith(".java")) {
      return <span className="text-rose-400 font-mono font-bold text-[10px]">☕</span>;
    }
    if (path.endsWith(".py")) {
      return <span className="text-amber-400 font-mono font-bold text-[10px]">🐍</span>;
    }
    if (path.endsWith(".ts") || path.endsWith(".js")) {
      return <FileCode className="w-3.5 h-3.5 text-cyan-400" />;
    }
    if (path.endsWith(".xml") || path.endsWith(".json")) {
      return <Code2 className="w-3.5 h-3.5 text-amber-400" />;
    }
    if (path.endsWith(".properties") || path.endsWith(".yaml") || path.endsWith(".yml") || path.includes("Dockerfile")) {
      return <TerminalIcon className="w-3.5 h-3.5 text-[#c15f3c]" />;
    }
    return <FileText className="w-3.5 h-3.5 text-[#6e6a60]" />;
  };

  return (
    <div className="h-full flex flex-col bg-[#ffffff] dark:bg-[#1a1715] border-r border-[#b1ada1]/70 dark:border-[#3e3832] text-xs overflow-hidden text-[#2b2724] dark:text-[#f4f3ee] transition-colors duration-200">
      {/* Workspace Explorer Header */}
      <div className="px-3.5 py-2.5 bg-[#f4f3ee] dark:bg-[#201c19] border-b border-[#b1ada1]/70 dark:border-[#3e3832] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#c15f3c] text-white flex items-center justify-center shadow-xs">
            <FolderTree className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-[#2b2724] dark:text-[#f4f3ee] text-xs tracking-tight">
              <span>WORKSPACE</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#ffffff] dark:bg-[#282420] text-[#c15f3c] border border-[#b1ada1]/60 dark:border-[#4a433d] font-semibold">
                {currentProject.name}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowNewFileDialog(true)}
            className="px-2.5 py-1 rounded-lg bg-[#ffffff] dark:bg-[#282420] hover:bg-[#f4f3ee] dark:hover:bg-[#322e29] text-[#2b2724] dark:text-[#f4f3ee] border border-[#b1ada1]/70 dark:border-[#4a433d] transition-colors flex items-center gap-1 text-[11px] font-medium cursor-pointer shadow-xs"
            title="Criar novo arquivo na workspace"
          >
            <Plus className="w-3 h-3 text-[#c15f3c]" />
            <span className="hidden sm:inline">Novo</span>
          </button>

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg bg-[#ffffff] dark:bg-[#282420] hover:bg-[#f4f3ee] dark:hover:bg-[#322e29] text-[#6e6a60] dark:text-[#a8a29e] hover:text-[#2b2724] dark:hover:text-[#f4f3ee] border border-[#b1ada1]/70 dark:border-[#4a433d] transition-colors cursor-pointer shadow-xs"
              title="Recolher Workspace (Foco no Chat)"
            >
              <PanelLeftClose className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="p-2.5 border-b border-[#b1ada1]/60 dark:border-[#3e3832] bg-[#f4f3ee] dark:bg-[#201c19] space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#6e6a60] dark:text-[#a8a29e] absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Filtrar arquivos na workspace..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-[#ffffff] dark:bg-[#171513] border border-[#b1ada1]/70 dark:border-[#3e3832] rounded-xl pl-8 pr-7 py-1.5 text-[#2b2724] dark:text-[#f4f3ee] placeholder-[#8e8a80] dark:placeholder-[#78726b] text-xs outline-none focus:border-[#c15f3c] font-mono transition-colors shadow-xs"
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter("")}
              className="absolute right-2 top-2 text-[#6e6a60] dark:text-[#a8a29e] hover:text-[#2b2724] dark:hover:text-[#f4f3ee] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto text-[10px] font-mono scrollbar-none">
          <button
            onClick={() => setFileFilterCategory("all")}
            className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              fileFilterCategory === "all"
                ? "bg-[#c15f3c] text-white font-bold shadow-xs"
                : "bg-[#ffffff] dark:bg-[#282420] text-[#6e6a60] dark:text-[#a8a29e] hover:text-[#2b2724] dark:hover:text-[#f4f3ee] border border-[#b1ada1]/60 dark:border-[#4a433d]"
            }`}
          >
            Todos ({currentProject.files.length})
          </button>
          <button
            onClick={() => setFileFilterCategory("code")}
            className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              fileFilterCategory === "code"
                ? "bg-[#c15f3c] text-white font-bold shadow-xs"
                : "bg-[#ffffff] dark:bg-[#282420] text-[#6e6a60] dark:text-[#a8a29e] hover:text-[#2b2724] dark:hover:text-[#f4f3ee] border border-[#b1ada1]/60 dark:border-[#4a433d]"
            }`}
          >
            Código
          </button>
          <button
            onClick={() => setFileFilterCategory("config")}
            className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              fileFilterCategory === "config"
                ? "bg-[#c15f3c] text-white font-bold shadow-xs"
                : "bg-[#ffffff] dark:bg-[#282420] text-[#6e6a60] dark:text-[#a8a29e] hover:text-[#2b2724] dark:hover:text-[#f4f3ee] border border-[#b1ada1]/60 dark:border-[#4a433d]"
            }`}
          >
            Config
          </button>
          {warningCount > 0 && (
            <button
              onClick={() => setFileFilterCategory("warnings")}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                fileFilterCategory === "warnings"
                  ? "bg-amber-700 text-white font-bold shadow-xs"
                  : "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Alertas ({warningCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Container: File List (Top) & Inspector (Bottom) */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* File Tree List */}
        <div
          className={`${
            isFullscreenInspector ? "hidden" : "h-44 shrink-0"
          } overflow-y-auto border-b border-[#b1ada1]/60 dark:border-[#3e3832] p-2 space-y-1 bg-[#ffffff] dark:bg-[#1a1715]`}
        >
          {filteredFiles.length === 0 ? (
            <div className="p-4 text-center text-[#6e6a60] dark:text-[#a8a29e] font-mono text-[11px]">
              Nenhum arquivo encontrado
            </div>
          ) : (
            filteredFiles.map((file) => {
              const isSelected = activeFile?.path === file.path;
              return (
                <div
                  key={file.path}
                  onClick={() => onSelectFile(file)}
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#c15f3c]/10 dark:bg-[#c15f3c]/20 text-[#c15f3c] border border-[#c15f3c]/40 font-semibold shadow-xs"
                      : "hover:bg-[#f4f3ee] dark:hover:bg-[#24201c] text-[#2b2724] dark:text-[#f4f3ee] border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate font-mono text-[11px]">
                    <div className="w-4 h-4 flex items-center justify-center shrink-0">
                      {getFileIcon(file.path)}
                    </div>
                    <span className="truncate">{file.path}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {file.hasWarning && (
                      <span
                        title={file.warningMessage || "Diagnóstico de alerta pelo AIJY"}
                        className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-[9px] font-mono font-medium"
                      >
                        <AlertTriangle className="w-3 h-3" />
                        <span className="hidden sm:inline">aviso</span>
                      </span>
                    )}
                    {file.isModified && (
                      <span
                        className="w-2 h-2 rounded-full bg-[#c15f3c] animate-pulse"
                        title="Arquivo modificado no workspace"
                      />
                    )}
                    {file.isNew && (
                      <span className="text-[9px] px-1.5 py-0.2 bg-[#c15f3c]/10 text-[#c15f3c] border border-[#c15f3c]/30 rounded font-mono font-bold">
                        novo
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Active File Inspector / Editor */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#f4f3ee] dark:bg-[#141210]">
          {activeFile ? (
            <>
              {/* File Title Bar & Fast Action Header */}
              <div className="px-3 py-2 bg-[#ffffff] dark:bg-[#1c1917] border-b border-[#b1ada1]/60 dark:border-[#3e3832] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#2b2724] dark:text-[#f4f3ee] truncate min-w-0">
                  <span className="text-[#6e6a60] dark:text-[#a8a29e]">path:</span>
                  <span className="font-bold text-[#c15f3c] truncate">
                    {activeFile.path}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 rounded-lg bg-[#ffffff] dark:bg-[#282420] hover:bg-[#f4f3ee] dark:hover:bg-[#322e29] text-[#6e6a60] dark:text-[#a8a29e] hover:text-[#2b2724] dark:hover:text-[#f4f3ee] border border-[#b1ada1]/70 dark:border-[#4a433d] transition-colors cursor-pointer shadow-xs"
                    title="Copiar código do arquivo"
                  >
                    {copiedCode ? (
                      <Check className="w-3.5 h-3.5 text-[#c15f3c]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {isEditing ? (
                    <button
                      onClick={handleSave}
                      className="px-3 py-1 bg-[#c15f3c] hover:bg-[#a84e2e] text-white rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
                    >
                      <Save className="w-3 h-3" />
                      <span>Salvar</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-2.5 py-1 bg-[#ffffff] dark:bg-[#282420] hover:bg-[#f4f3ee] dark:hover:bg-[#322e29] text-[#2b2724] dark:text-[#f4f3ee] rounded-lg text-[10px] font-medium border border-[#b1ada1]/70 dark:border-[#4a433d] transition-colors cursor-pointer shadow-xs"
                    >
                      Editar
                    </button>
                  )}

                  <button
                    onClick={() => setIsFullscreenInspector(!isFullscreenInspector)}
                    className="p-1.5 rounded-lg bg-[#ffffff] dark:bg-[#282420] hover:bg-[#f4f3ee] dark:hover:bg-[#322e29] text-[#6e6a60] dark:text-[#a8a29e] hover:text-[#2b2724] dark:hover:text-[#f4f3ee] border border-[#b1ada1]/70 dark:border-[#4a433d] transition-colors cursor-pointer shadow-xs"
                    title={isFullscreenInspector ? "Restaurar layout" : "Expandir editor"}
                  >
                    {isFullscreenInspector ? (
                      <Minimize2 className="w-3.5 h-3.5" />
                    ) : (
                      <Maximize2 className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => onDeleteFile(activeFile.path)}
                    title="Excluir arquivo do projeto"
                    className="p-1.5 text-[#6e6a60] dark:text-[#a8a29e] hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* AIJY Contextual Assistant Banner for Active File */}
              <div className="px-3 py-1.5 bg-[#f4f3ee] dark:bg-[#201c19] border-b border-[#b1ada1]/60 dark:border-[#3e3832] flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-mono">
                <div className="flex items-center gap-1.5 text-[#6e6a60] dark:text-[#a8a29e]">
                  <Sparkles className="w-3 h-3 text-[#c15f3c]" />
                  <span>Ações AIJY para este arquivo:</span>
                </div>

                <div className="flex items-center gap-1 flex-wrap">
                  <button
                    onClick={() =>
                      onTriggerPrompt(
                        `Faça uma revisão e análise profunda de bugs e boas práticas no arquivo ${activeFile.path}.`
                      )
                    }
                    className="px-2.5 py-0.5 rounded-lg bg-[#ffffff] dark:bg-[#282420] hover:bg-[#f4f3ee] dark:hover:bg-[#322e29] text-[#2b2724] dark:text-[#f4f3ee] border border-[#b1ada1]/70 dark:border-[#4a433d] transition-colors flex items-center gap-1 font-medium cursor-pointer shadow-xs"
                  >
                    <span>Analisar</span>
                  </button>
                  <button
                    onClick={() =>
                      onTriggerPrompt(
                        `Gere a suíte completa de testes automatizados com mocks para ${activeFile.path}.`
                      )
                    }
                    className="px-2.5 py-0.5 rounded-lg bg-[#ffffff] dark:bg-[#282420] hover:bg-[#f4f3ee] dark:hover:bg-[#322e29] text-[#2b2724] dark:text-[#f4f3ee] border border-[#b1ada1]/70 dark:border-[#4a433d] transition-colors flex items-center gap-1 font-medium cursor-pointer shadow-xs"
                  >
                    <span>Gerar Testes</span>
                  </button>
                </div>
              </div>

              {/* Diagnostic warning alert banner */}
              {activeFile.hasWarning && (
                <div className="m-2.5 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-[11px] flex items-start gap-2 shadow-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <span className="font-bold text-amber-900 dark:text-amber-200">
                      Alerta de Configuração / Bug Detectado:
                    </span>
                    <p className="text-amber-800 dark:text-amber-300 leading-relaxed font-sans text-xs">
                      {activeFile.warningMessage}
                    </p>
                    <div className="pt-1">
                      <button
                        onClick={() =>
                          onTriggerPrompt(
                            `Corrija automaticamente o problema detectado em ${activeFile.path}: ${activeFile.warningMessage}`
                          )
                        }
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-sans font-medium flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                      >
                        <Zap className="w-3 h-3 text-white" />
                        <span>Aplicar Correção com AIJY</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* File Code Display / Textarea */}
              <div className="flex-1 p-2.5 min-h-0 overflow-y-auto font-mono text-[11px] leading-relaxed">
                {isEditing ? (
                  <textarea
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    className="w-full h-full bg-[#ffffff] dark:bg-[#1a1715] border border-[#b1ada1]/70 dark:border-[#3e3832] rounded-xl p-3 text-[#2b2724] dark:text-[#f4f3ee] outline-none resize-none focus:border-[#c15f3c] leading-relaxed font-mono select-text shadow-inner"
                  />
                ) : (
                  <div className="bg-[#23201d] dark:bg-[#11100e] p-3.5 rounded-xl border border-[#3e3a36] font-mono text-[#f4f3ee] whitespace-pre-wrap break-all select-text overflow-x-auto shadow-inner">
                    {activeFile.content}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#6e6a60] dark:text-[#a8a29e] p-4 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#ffffff] dark:bg-[#201c19] border border-[#b1ada1]/70 dark:border-[#3e3832] flex items-center justify-center text-[#6e6a60] dark:text-[#a8a29e] shadow-xs">
                <FileCode className="w-6 h-6 text-[#c15f3c]" />
              </div>
              <p className="text-xs font-mono text-[#6e6a60] dark:text-[#a8a29e]">
                Selecione um arquivo acima para inspecionar ou editar
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New File Modal */}
      {showNewFileDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#ffffff] dark:bg-[#201c19] border border-[#b1ada1]/70 dark:border-[#3e3832] rounded-2xl p-5 w-full max-w-md shadow-2xl space-y-3 font-sans text-[#2b2724] dark:text-[#f4f3ee]">
            <div className="flex items-center justify-between border-b border-[#b1ada1]/60 dark:border-[#3e3832] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#c15f3c]/10 text-[#c15f3c]">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2b2724] dark:text-[#f4f3ee]">
                    Criar Arquivo na Workspace
                  </h3>
                  <span className="text-[10px] font-mono text-[#6e6a60] dark:text-[#a8a29e]">
                    create_file tool simulation
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowNewFileDialog(false)}
                className="text-[#6e6a60] dark:text-[#a8a29e] hover:text-[#2b2724] dark:hover:text-[#f4f3ee] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewFile} className="space-y-3">
              <div>
                <label className="block text-[11px] text-[#2b2724] dark:text-[#f4f3ee] font-semibold mb-1 font-mono">
                  Caminho do Arquivo:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: src/main/resources/application.properties"
                  value={newFilePath}
                  onChange={(e) => setNewFilePath(e.target.value)}
                  className="w-full bg-[#f4f3ee] dark:bg-[#171513] border border-[#b1ada1]/70 dark:border-[#3e3832] rounded-xl px-3 py-2 text-xs text-[#2b2724] dark:text-[#f4f3ee] font-mono outline-none focus:border-[#c15f3c]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#2b2724] dark:text-[#f4f3ee] font-semibold mb-1 font-mono">
                  Conteúdo Inicial (opcional):
                </label>
                <textarea
                  rows={4}
                  placeholder="// Código ou configuração..."
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  className="w-full bg-[#f4f3ee] dark:bg-[#171513] border border-[#b1ada1]/70 dark:border-[#3e3832] rounded-xl p-2.5 text-xs text-[#2b2724] dark:text-[#f4f3ee] font-mono outline-none resize-none focus:border-[#c15f3c]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#b1ada1]/60 dark:border-[#3e3832]">
                <button
                  type="button"
                  onClick={() => setShowNewFileDialog(false)}
                  className="px-3 py-1.5 bg-[#f4f3ee] dark:bg-[#282420] hover:bg-[#ffffff] dark:hover:bg-[#322e29] border border-[#b1ada1]/70 dark:border-[#4a433d] text-[#2b2724] dark:text-[#f4f3ee] rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#c15f3c] hover:bg-[#a84e2e] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  Criar Arquivo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
