import React, { useState, useRef } from "react";
import {
  Plus,
  Brain,
  Mic,
  MicOff,
  Upload,
  Image as ImageIcon,
  FolderOpen,
  X,
  Lock,
  Edit3,
  Zap,
  ChevronDown,
  Check,
  FileCode,
  Sparkles,
  GraduationCap,
  Cpu,
  Crown,
  Layers,
} from "lucide-react";
import { PermissionMode, UserLevel } from "../types";

export interface AttachedItem {
  id: string;
  name: string;
  type: "file" | "drive" | "photo";
  size?: string;
  content?: string;
  previewUrl?: string;
}

interface QuestionBarProps {
  onSendMessage: (promptText: string, attachments?: AttachedItem[], deepThinking?: boolean) => void;
  isLoading: boolean;
  permissionMode: PermissionMode;
  onChangePermission: (mode: PermissionMode) => void;
  userLevel?: UserLevel;
  onChangeUserLevel?: (level: UserLevel) => void;
  placeholder?: string;
}

export const QuestionBar: React.FC<QuestionBarProps> = ({
  onSendMessage,
  isLoading,
  permissionMode,
  onChangePermission,
  userLevel = "intermediario",
  onChangeUserLevel,
  placeholder = "Pergunte qualquer coisa",
}) => {
  const [inputVal, setInputVal] = useState<string>("");
  const [deepThinking, setDeepThinking] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [showAttachMenu, setShowAttachMenu] = useState<boolean>(false);
  const [showPermMenu, setShowPermMenu] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<AttachedItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setAttachments((prev) => [
        ...prev,
        {
          id: `file-${Date.now()}`,
          name: file.name,
          type: "file",
          size: `${(file.size / 1024).toFixed(1)} KB`,
          content: content,
        },
      ]);
    };
    reader.readAsText(file);
    setShowAttachMenu(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setAttachments((prev) => [
        ...prev,
        {
          id: `photo-${Date.now()}`,
          name: file.name,
          type: "photo",
          size: `${(file.size / 1024).toFixed(1)} KB`,
          previewUrl: url,
        },
      ]);
    };
    reader.readAsDataURL(file);
    setShowAttachMenu(false);
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  // Handle simulated Google Drive connect/import
  const handleDriveImport = () => {
    const driveSampleFiles = [
      { name: "Arquitetura-Backend-v2.pdf", size: "1.4 MB" },
      { name: "schema-database-prod.sql", size: "84 KB" },
      { name: "Sprint-Specs-AIJY.gdoc", size: "12 KB" },
    ];
    const selected = driveSampleFiles[Math.floor(Math.random() * driveSampleFiles.length)];
    setAttachments((prev) => [
      ...prev,
      {
        id: `drive-${Date.now()}`,
        name: selected.name,
        type: "drive",
        size: selected.size,
        content: `[Conteúdo importado do Google Drive: ${selected.name}]`,
      },
    ]);
    setShowAttachMenu(false);
  };

  // Remove attachment
  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Submit message
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputVal.trim() && attachments.length === 0) || isLoading) return;

    let finalPrompt = inputVal.trim();
    if (attachments.length > 0) {
      const filesInfo = attachments.map((a) => `[Anexo ${a.type.toUpperCase()}: ${a.name}]`).join(" ");
      if (finalPrompt) {
        finalPrompt = `${finalPrompt}\n\n${filesInfo}`;
      } else {
        finalPrompt = `Analise os anexos enviados: ${filesInfo}`;
      }
    }

    if (deepThinking) {
      finalPrompt = `[PENSAMENTO PROFUNDO ATIVADO] ${finalPrompt}`;
    }

    onSendMessage(finalPrompt, attachments, deepThinking);
    setInputVal("");
    setAttachments([]);
    setShowAttachMenu(false);
    setShowPermMenu(false);
  };

  // Toggle voice recognition
  const toggleVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
        try {
          const SpeechRecognition =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
          recognition.lang = "pt-BR";
          recognition.continuous = false;
          recognition.interimResults = false;

          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInputVal((prev) => (prev ? `${prev} ${transcript}` : transcript));
            setIsRecording(false);
          };

          recognition.onerror = () => {
            setIsRecording(false);
          };

          recognition.onend = () => {
            setIsRecording(false);
          };

          recognition.start();
        } catch {
          setIsRecording(false);
        }
      } else {
        // Fallback simulation
        setTimeout(() => {
          setInputVal((prev) =>
            prev
              ? `${prev} analise o projeto e rode os testes`
              : "analise o projeto e rode os testes"
          );
          setIsRecording(false);
        }, 1500);
      }
    }
  };

  const getModeLabel = () => {
    switch (permissionMode) {
      case "readonly":
        return { label: "Leitura", icon: <Lock className="w-3 h-3 text-sky-400" />, color: "text-sky-400" };
      case "edit":
        return { label: "Edição", icon: <Edit3 className="w-3 h-3 text-amber-400" />, color: "text-amber-400" };
      case "execution":
      default:
        return { label: "Execução", icon: <Zap className="w-3 h-3 text-[#c15f3c]" />, color: "text-[#c15f3c]" };
    }
  };

  const getLevelLabel = () => {
    switch (userLevel) {
      case "facil":
      case "iniciante":
        return {
          label: "Fácil",
          badge: "FÁCIL",
          desc: "Explicações didáticas, conceitos fundamentais e passo a passo",
          icon: <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />,
          color: "text-emerald-400",
        };
      case "intermediario":
        return {
          label: "Intermediário",
          badge: "INTERMEDIÁRIO",
          desc: "Boas práticas, padrões de código e foco produtivo",
          icon: <Cpu className="w-3.5 h-3.5 text-amber-400" />,
          color: "text-amber-400",
        };
      case "avancado":
        return {
          label: "Avançado",
          badge: "AVANÇADO",
          desc: "Alta performance, concorrência, otimizações e testes",
          icon: <Zap className="w-3.5 h-3.5 text-sky-400" />,
          color: "text-sky-400",
        };
      case "master":
      default:
        return {
          label: "Master",
          badge: "MASTER",
          desc: "Arquitetura distribuída, profiling, baixo nível e máxima densidade técnica",
          icon: <Crown className="w-3.5 h-3.5 text-[#c15f3c]" />,
          color: "text-[#c15f3c]",
        };
    }
  };

  const modeInfo = getModeLabel();
  const levelInfo = getLevelLabel();

  const [activeMenuTab, setActiveMenuTab] = useState<"level" | "mode">("level");

  return (
    <div className="w-full relative select-none">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileUpload}
      />
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handlePhotoUpload}
      />

      {/* Attachments Preview Chips */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-2 px-2">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffffff] dark:bg-[#201c19] border border-[#b1ada1]/70 dark:border-[#3e3832] text-xs text-[#2b2724] dark:text-[#f4f3ee] shadow-sm animate-in fade-in"
            >
              {att.type === "photo" ? (
                <div className="w-4 h-4 rounded overflow-hidden bg-cover bg-center shrink-0">
                  <img src={att.previewUrl} alt={att.name} className="w-full h-full object-cover" />
                </div>
              ) : att.type === "drive" ? (
                <FolderOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              ) : (
                <FileCode className="w-3.5 h-3.5 text-[#c15f3c] shrink-0" />
              )}
              <span className="max-w-[140px] truncate font-medium text-[11px]">{att.name}</span>
              {att.size && <span className="text-[10px] text-[#6e6a60] dark:text-[#a8a29e]">({att.size})</span>}
              <button
                type="button"
                onClick={() => removeAttachment(att.id)}
                className="p-0.5 hover:text-red-500 rounded-full transition-colors cursor-pointer ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Attach Popup Menu */}
      {showAttachMenu && (
        <div className="absolute bottom-full left-2 mb-3 w-56 rounded-2xl bg-[#ffffff] dark:bg-[#1a1715] border border-[#b1ada1]/70 dark:border-[#3e3832] shadow-2xl p-1.5 z-50 text-xs text-[#2b2724] dark:text-[#f4f3ee] animate-in fade-in slide-in-from-bottom-2">
          <div className="px-3 py-1.5 text-[10px] font-mono text-[#6e6a60] dark:text-[#a8a29e] uppercase font-bold border-b border-[#b1ada1]/40 dark:border-[#3e3832]">
            Adicionar Anexo ao AIJY
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#f4f3ee] dark:hover:bg-[#282420] transition-colors cursor-pointer text-left font-medium"
          >
            <Upload className="w-4 h-4 text-[#c15f3c]" />
            <div>
              <div className="font-semibold text-xs">Enviar arquivos</div>
              <div className="text-[10px] text-[#6e6a60] dark:text-[#a8a29e]">Código, PDFs, scripts locais</div>
            </div>
          </button>

          <button
            type="button"
            onClick={handleDriveImport}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#f4f3ee] dark:hover:bg-[#282420] transition-colors cursor-pointer text-left font-medium"
          >
            <FolderOpen className="w-4 h-4 text-blue-500" />
            <div>
              <div className="font-semibold text-xs">Google Drive</div>
              <div className="text-[10px] text-[#6e6a60] dark:text-[#a8a29e]">Conectar e importar docs</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#f4f3ee] dark:hover:bg-[#282420] transition-colors cursor-pointer text-left font-medium"
          >
            <ImageIcon className="w-4 h-4 text-emerald-500" />
            <div>
              <div className="font-semibold text-xs">Fotos &amp; Imagens</div>
              <div className="text-[10px] text-[#6e6a60] dark:text-[#a8a29e]">Screenshots, diagramas</div>
            </div>
          </button>
        </div>
      )}

      {/* Level & Permission Switcher Popup Menu */}
      {showPermMenu && (
        <div className="absolute bottom-full left-12 mb-3 w-80 rounded-2xl bg-[#ffffff] dark:bg-[#1a1715] border border-[#b1ada1]/70 dark:border-[#3e3832] shadow-2xl p-2 z-50 text-xs text-[#2b2724] dark:text-[#f4f3ee] animate-in fade-in slide-in-from-bottom-2">
          {/* Tab Selector Header */}
          <div className="flex items-center p-1 rounded-xl bg-[#f4f3ee] dark:bg-[#25211d] mb-2 border border-[#b1ada1]/30 dark:border-[#3e3832]">
            <button
              type="button"
              onClick={() => setActiveMenuTab("level")}
              className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMenuTab === "level"
                  ? "bg-[#c15f3c] text-white shadow-xs"
                  : "text-[#6e6a60] dark:text-[#a8a29e] hover:text-[#2b2724] dark:hover:text-[#f4f3ee]"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Nível do Desenvolvedor</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMenuTab("mode")}
              className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMenuTab === "mode"
                  ? "bg-[#c15f3c] text-white shadow-xs"
                  : "text-[#6e6a60] dark:text-[#a8a29e] hover:text-[#2b2724] dark:hover:text-[#f4f3ee]"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Modo Sandbox</span>
            </button>
          </div>

          {/* TAB 1: 4 Levels (Fácil, Intermediário, Avançado, Master) */}
          {activeMenuTab === "level" && (
            <div className="space-y-1">
              <div className="px-2 py-1 text-[10px] font-mono text-[#6e6a60] dark:text-[#a8a29e] uppercase font-bold">
                Selecione o nível de profundidade técnica
              </div>

              {/* 1. Fácil */}
              <button
                type="button"
                onClick={() => {
                  if (onChangeUserLevel) onChangeUserLevel("facil");
                  setShowPermMenu(false);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer text-left ${
                  userLevel === "facil" || userLevel === "iniciante"
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold"
                    : "hover:bg-[#f4f3ee] dark:hover:bg-[#282420] border border-transparent"
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-500 shrink-0 mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      Fácil
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                        Didático
                      </span>
                    </div>
                    <div className="text-[10px] text-[#6e6a60] dark:text-[#a8a29e] font-normal leading-tight mt-0.5">
                      Explicações passo a passo, conceitos fundamentais e comandos guiados.
                    </div>
                  </div>
                </div>
                {(userLevel === "facil" || userLevel === "iniciante") && (
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 ml-1" />
                )}
              </button>

              {/* 2. Intermediário */}
              <button
                type="button"
                onClick={() => {
                  if (onChangeUserLevel) onChangeUserLevel("intermediario");
                  setShowPermMenu(false);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer text-left ${
                  userLevel === "intermediario"
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold"
                    : "hover:bg-[#f4f3ee] dark:hover:bg-[#282420] border border-transparent"
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="p-1 rounded-lg bg-amber-500/20 text-amber-500 shrink-0 mt-0.5">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      Intermediário
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-semibold">
                        Produtivo
                      </span>
                    </div>
                    <div className="text-[10px] text-[#6e6a60] dark:text-[#a8a29e] font-normal leading-tight mt-0.5">
                      Foco em boas práticas, padrões de código limpos e arquitetura sólida.
                    </div>
                  </div>
                </div>
                {userLevel === "intermediario" && (
                  <Check className="w-4 h-4 text-amber-500 shrink-0 ml-1" />
                )}
              </button>

              {/* 3. Avançado */}
              <button
                type="button"
                onClick={() => {
                  if (onChangeUserLevel) onChangeUserLevel("avancado");
                  setShowPermMenu(false);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer text-left ${
                  userLevel === "avancado"
                    ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30 font-bold"
                    : "hover:bg-[#f4f3ee] dark:hover:bg-[#282420] border border-transparent"
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="p-1 rounded-lg bg-sky-500/20 text-sky-500 shrink-0 mt-0.5">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      Avançado
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono font-semibold">
                        Otimizado
                      </span>
                    </div>
                    <div className="text-[10px] text-[#6e6a60] dark:text-[#a8a29e] font-normal leading-tight mt-0.5">
                      Alta performance, concorrência, otimização e testes exaustivos.
                    </div>
                  </div>
                </div>
                {userLevel === "avancado" && (
                  <Check className="w-4 h-4 text-sky-500 shrink-0 ml-1" />
                )}
              </button>

              {/* 4. Master */}
              <button
                type="button"
                onClick={() => {
                  if (onChangeUserLevel) onChangeUserLevel("master");
                  setShowPermMenu(false);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer text-left ${
                  userLevel === "master"
                    ? "bg-[#c15f3c]/20 text-[#c15f3c] border border-[#c15f3c]/40 font-bold"
                    : "hover:bg-[#f4f3ee] dark:hover:bg-[#282420] border border-transparent"
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="p-1 rounded-lg bg-[#c15f3c]/20 text-[#c15f3c] shrink-0 mt-0.5">
                    <Crown className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      Master
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#c15f3c]/15 text-[#c15f3c] font-mono font-semibold">
                        Engenharia
                      </span>
                    </div>
                    <div className="text-[10px] text-[#6e6a60] dark:text-[#a8a29e] font-normal leading-tight mt-0.5">
                      Arquitetura distribuída, profiling, baixo nível e máxima densidade técnica.
                    </div>
                  </div>
                </div>
                {userLevel === "master" && (
                  <Check className="w-4 h-4 text-[#c15f3c] shrink-0 ml-1" />
                )}
              </button>
            </div>
          )}

          {/* TAB 2: Sandbox Mode (Leitura, Edição, Execução) */}
          {activeMenuTab === "mode" && (
            <div className="space-y-1">
              <div className="px-2 py-1 text-[10px] font-mono text-[#6e6a60] dark:text-[#a8a29e] uppercase font-bold">
                Selecione o nível de permissão do AIJY
              </div>

              <button
                type="button"
                onClick={() => {
                  onChangePermission("readonly");
                  setShowPermMenu(false);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer text-left ${
                  permissionMode === "readonly"
                    ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 font-bold border border-sky-500/30"
                    : "hover:bg-[#f4f3ee] dark:hover:bg-[#282420] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-sky-400" />
                  <div>
                    <div className="text-xs font-bold">Modo Leitura</div>
                    <div className="text-[10px] text-[#6e6a60] dark:text-[#a8a29e]">Apenas análise estática de código</div>
                  </div>
                </div>
                {permissionMode === "readonly" && <Check className="w-3.5 h-3.5 text-sky-500" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  onChangePermission("edit");
                  setShowPermMenu(false);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer text-left ${
                  permissionMode === "edit"
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30"
                    : "hover:bg-[#f4f3ee] dark:hover:bg-[#282420] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  <div>
                    <div className="text-xs font-bold">Modo Edição</div>
                    <div className="text-[10px] text-[#6e6a60] dark:text-[#a8a29e]">Edição e criação com diff visual</div>
                  </div>
                </div>
                {permissionMode === "edit" && <Check className="w-3.5 h-3.5 text-amber-500" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  onChangePermission("execution");
                  setShowPermMenu(false);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer text-left ${
                  permissionMode === "execution"
                    ? "bg-[#c15f3c]/20 text-[#c15f3c] font-bold border border-[#c15f3c]/40"
                    : "hover:bg-[#f4f3ee] dark:hover:bg-[#282420] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#c15f3c]" />
                  <div>
                    <div className="text-xs font-bold">Modo Execução</div>
                    <div className="text-[10px] text-[#6e6a60] dark:text-[#a8a29e]">Execução autônoma, scripts e testes</div>
                  </div>
                </div>
                {permissionMode === "execution" && <Check className="w-3.5 h-3.5 text-[#c15f3c]" />}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Pill Bar Container (Exactly matching Screenshot 1) */}
      <form
        onSubmit={handleSubmit}
        className="w-full flex items-center gap-2 bg-[#211e1c] text-[#f4f3ee] border border-[#3e3832] hover:border-[#524b43] focus-within:border-[#c15f3c] focus-within:ring-2 focus-within:ring-[#c15f3c]/30 rounded-full px-3 py-2 shadow-2xl transition-all"
      >
        {/* Left "+" Button */}
        <button
          type="button"
          onClick={() => {
            setShowAttachMenu(!showAttachMenu);
            setShowPermMenu(false);
          }}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#d1ccc4] hover:text-white hover:bg-[#342f2b] transition-all cursor-pointer shrink-0"
          title="Adicionar anexo (arquivos, drive, fotos)"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Level & Mode Selector Pill inside question bar */}
        <button
          type="button"
          onClick={() => {
            setShowPermMenu(!showPermMenu);
            setShowAttachMenu(false);
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#171513] hover:bg-[#2e2a26] border border-[#3e3832] text-[11px] font-mono text-[#d1ccc4] transition-colors cursor-pointer shrink-0"
          title={`Nível: ${levelInfo.label} • Modo: ${modeInfo.label} (Clique para alterar)`}
        >
          {levelInfo.icon}
          <span className="font-semibold text-[#f4f3ee]">{levelInfo.label}</span>
          <span className="text-[#6e6a60] dark:text-[#8e8a80] hidden sm:inline">•</span>
          <span className="hidden sm:inline text-[10px] text-[#a8a29e]">{modeInfo.label}</span>
          <ChevronDown className="w-3 h-3 text-[#8e8a80]" />
        </button>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          disabled={isLoading}
          placeholder={isLoading ? "AIJY processando..." : placeholder}
          className="flex-1 bg-transparent text-sm text-[#f4f3ee] placeholder-[#8e8a80] outline-none min-w-0 font-sans"
        />

        {/* "Pensar" (Deep Thinking) Button with Brain Icon */}
        <button
          type="button"
          onClick={() => setDeepThinking(!deepThinking)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer shrink-0 ${
            deepThinking
              ? "bg-[#c15f3c] text-white shadow-sm font-semibold"
              : "text-[#d1ccc4] hover:text-white hover:bg-[#342f2b]"
          }`}
          title="Ativar Raciocínio Aprofundado / Cadeia de Pensamento do AIJY"
        >
          <Brain className="w-4 h-4" />
          <span className="hidden md:inline">Pensar</span>
        </button>

        {/* Microphone Button */}
        <button
          type="button"
          onClick={toggleVoiceRecording}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
            isRecording
              ? "bg-rose-600 text-white animate-pulse"
              : "text-[#d1ccc4] hover:text-white hover:bg-[#342f2b]"
          }`}
          title={isRecording ? "Gravando voz... clique para parar" : "Falar por comando de voz"}
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Blue Circular Voice / Action Wave Button (Rightmost circle) */}
        <button
          type="submit"
          disabled={isLoading || (!inputVal.trim() && attachments.length === 0)}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-md ${
            inputVal.trim() || attachments.length > 0
              ? "bg-[#2563eb] hover:bg-[#1d4ed8] text-white active:scale-95"
              : "bg-[#2563eb] hover:bg-[#1d4ed8] text-white opacity-90"
          }`}
          title={inputVal.trim() ? "Enviar mensagem ao AIJY" : "Modo de voz interativo"}
        >
          {/* Custom audio waveform icon matching screenshot */}
          <div className="flex items-center gap-[2.5px]">
            <span className="w-[3px] h-3.5 bg-white rounded-full animate-pulse" />
            <span className="w-[3px] h-5 bg-white rounded-full" />
            <span className="w-[3px] h-3 bg-white rounded-full animate-pulse" />
          </div>
        </button>
      </form>
    </div>
  );
};
