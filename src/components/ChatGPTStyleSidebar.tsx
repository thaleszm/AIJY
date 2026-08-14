import React, { useState } from "react";
import {
  SquarePen,
  Search,
  PanelLeftClose,
  Image as ImageIcon,
  Library,
  Plug,
  Terminal,
  MoreHorizontal,
  Folder,
  MessageSquare,
  GraduationCap,
  Sparkles,
  Settings,
  LogOut,
  ChevronUp,
  X,
  FileCode,
  Trash2,
  BookOpen,
} from "lucide-react";
import { ProjectTemplate, ProjectFile, ChatSession } from "../types";

interface ChatGPTStyleSidebarProps {
  currentProject: ProjectTemplate;
  projects: ProjectTemplate[];
  onSelectProject: (proj: ProjectTemplate) => void;
  activeFile: ProjectFile | null;
  onSelectFile: (file: ProjectFile) => void;
  chatSessions: ChatSession[];
  activeChatId: string;
  onSelectChat: (chatId: string) => void;
  onNewChat: (initialTopic?: string) => void;
  onDeleteChat: (chatId: string) => void;
  onToggleCollapse: () => void;
  onOpenDocs: () => void;
  onOpenPlugins?: () => void;
  onOpenCodex?: () => void;
  onOpenImages?: () => void;
  onTriggerPrompt?: (prompt: string) => void;
}

export const ChatGPTStyleSidebar: React.FC<ChatGPTStyleSidebarProps> = ({
  currentProject,
  projects,
  onSelectProject,
  activeFile,
  onSelectFile,
  chatSessions,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onToggleCollapse,
  onOpenDocs,
  onOpenPlugins,
  onOpenCodex,
  onOpenImages,
  onTriggerPrompt,
}) => {
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showFilesDrawer, setShowFilesDrawer] = useState<boolean>(false);

  // Quick Subject Items (From user's workflow: Cálculo, Programação, etc.)
  const subjectShortcuts = [
    {
      id: "calc-1a",
      title: "Cálculo I-A & Derivadas",
      type: "folder",
      projectId: "calculo-1a",
      prompt: "Vamos estudar Cálculo I: limites, derivadas, integrais e aplicações computacionais.",
    },
    {
      id: "java-jiraya",
      title: "JAVA & Spring Boot",
      type: "chat",
      projectId: "spring-boot-ecommerce",
      prompt: "Explique boas práticas com Spring Boot, arquitetura limpa e JPA.",
    },
    {
      id: "prog-master",
      title: "Python & Microsserviços",
      type: "grad",
      projectId: "fastapi-microservice",
      prompt: "Explique programação assíncrona com Python, FastAPI e concorrência.",
    },
    {
      id: "chat-geral",
      title: "Tutor Livre de TI & Algoritmos",
      type: "sparkles",
      projectId: "general-tutor",
      prompt: "Estou com dúvidas gerais sobre algoritmos, estruturas de dados e arquitetura.",
    },
  ];

  const handleShortcutClick = (item: (typeof subjectShortcuts)[0]) => {
    const found = projects.find((p) => p.id === item.projectId);
    if (found) {
      onSelectProject(found);
    }
    if (onTriggerPrompt) {
      onTriggerPrompt(item.prompt);
    }
  };

  const filteredChats = chatSessions.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-full h-full flex flex-col bg-[#000000] text-[#ececec] select-none border-r border-[#201e1b] overflow-hidden text-sm">
      {/* Top Header with AIJY Logo and Action Icons */}
      <div className="px-3.5 pt-3.5 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-white font-sans">
            AIJY
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#c15f3c]/20 text-[#c15f3c] border border-[#c15f3c]/40 font-bold">
            PRO
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowSearchModal(true)}
            className="p-2 rounded-lg text-[#9b9b9b] hover:text-white hover:bg-[#212121] transition-colors cursor-pointer"
            title="Buscar nos chats e histórico"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-2 rounded-lg text-[#9b9b9b] hover:text-white hover:bg-[#212121] transition-colors cursor-pointer"
            title="Ocultar barra lateral"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* "Novo chat" Action Pill */}
      <div className="px-3 py-2">
        <button
          type="button"
          onClick={() => onNewChat()}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#212121] hover:bg-[#2f2f2f] text-white text-sm font-medium transition-all cursor-pointer shadow-sm active:scale-[0.99]"
        >
          <SquarePen className="w-4 h-4 text-[#e0e0e0]" />
          <span>Novo chat livre</span>
        </button>
      </div>

      {/* Main Navigation Items */}
      <div className="px-2 py-1 space-y-0.5">
        <button
          type="button"
          onClick={() => {
            if (onOpenImages) onOpenImages();
            else if (onTriggerPrompt)
              onTriggerPrompt(
                "Gere um diagrama de arquitetura e fluxo de dados para o assunto atual"
              );
          }}
          className="w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-[#d4d4d4] hover:text-white hover:bg-[#212121] transition-colors text-sm font-medium cursor-pointer"
        >
          <ImageIcon className="w-4 h-4 text-[#a3a3a3]" />
          <span>Imagens &amp; Diagramas</span>
        </button>

        <button
          type="button"
          onClick={onOpenDocs}
          className="w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-[#d4d4d4] hover:text-white hover:bg-[#212121] transition-colors text-sm font-medium cursor-pointer"
        >
          <Library className="w-4 h-4 text-[#a3a3a3]" />
          <span>Biblioteca &amp; Guia Didático</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setShowFilesDrawer(!showFilesDrawer);
            if (onOpenCodex) onOpenCodex();
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors text-sm font-medium cursor-pointer ${
            showFilesDrawer
              ? "bg-[#212121] text-white"
              : "text-[#d4d4d4] hover:text-white hover:bg-[#212121]"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <Terminal className="w-4 h-4 text-[#a3a3a3]" />
            <span>Workspace Ativo</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#333333] text-[#a3a3a3]">
            {currentProject.name}
          </span>
        </button>
      </div>

      {/* Files Drawer when Codex is clicked */}
      {showFilesDrawer && (
        <div className="px-3 py-2 my-1 mx-2 bg-[#171717] rounded-xl border border-[#2b2b2b] max-h-48 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-mono text-[#8a8a8a] uppercase font-bold mb-1.5 flex items-center justify-between">
            <span>Arquivos de {currentProject.name}</span>
            <button onClick={() => setShowFilesDrawer(false)} className="hover:text-white">
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-1">
            {currentProject.files.map((file) => (
              <button
                key={file.path}
                onClick={() => onSelectFile(file)}
                className={`w-full flex items-center gap-2 px-2 py-1 rounded-lg text-xs font-mono text-left transition-colors cursor-pointer truncate ${
                  activeFile?.path === file.path
                    ? "bg-[#c15f3c]/20 text-[#c15f3c] font-bold"
                    : "text-[#b0b0b0] hover:bg-[#242424] hover:text-white"
                }`}
              >
                <FileCode className="w-3 h-3 shrink-0" />
                <span className="truncate">{file.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scrollable middle lists: Histórico de Conversas & Matérias */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4 custom-scrollbar">
        {/* Section: Histórico de Conversas Recentes */}
        <div>
          <div className="px-3 pb-1 text-xs font-medium text-[#737373] tracking-wide flex items-center justify-between">
            <span>Conversas &amp; Histórico</span>
            <span className="text-[10px] font-mono text-[#555555]">
              {chatSessions.length} sessões
            </span>
          </div>
          <div className="space-y-0.5">
            {chatSessions.map((chat) => (
              <div
                key={chat.id}
                className={`w-full group flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer ${
                  activeChatId === chat.id
                    ? "bg-[#212121] text-white font-medium shadow-inner"
                    : "text-[#d4d4d4] hover:text-white hover:bg-[#1a1a1a]"
                }`}
                onClick={() => onSelectChat(chat.id)}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${activeChatId === chat.id ? "text-[#c15f3c]" : "text-[#777777]"}`} />
                  <span className="truncate text-xs">{chat.title}</span>
                </div>
                {chatSessions.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 rounded transition-opacity"
                    title="Excluir conversa"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section: Atalhos e Matérias */}
        <div>
          <div className="px-3 pb-1 text-xs font-medium text-[#737373] tracking-wide">
            Tópicos &amp; Matérias
          </div>
          <div className="space-y-0.5">
            {subjectShortcuts.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleShortcutClick(item)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[#e5e5e5] hover:text-white hover:bg-[#212121] transition-colors text-xs text-left cursor-pointer group"
              >
                {item.type === "grad" ? (
                  <GraduationCap className="w-3.5 h-3.5 text-[#38bdf8] shrink-0 group-hover:text-[#60a5fa]" />
                ) : item.type === "sparkles" ? (
                  <Sparkles className="w-3.5 h-3.5 text-[#c15f3c] shrink-0" />
                ) : (
                  <Folder className="w-3.5 h-3.5 text-[#999999] shrink-0 group-hover:text-white" />
                )}
                <span className="truncate">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Menu Popup */}
      {showUserMenu && (
        <div className="p-2 mx-2 mb-2 bg-[#212121] rounded-2xl border border-[#333333] shadow-2xl text-xs space-y-1 animate-in fade-in slide-in-from-bottom-2">
          <div className="px-3 py-2 border-b border-[#333333]">
            <div className="font-semibold text-white">Thales Marques</div>
            <div className="text-[11px] text-[#888888]">marquesthales@id.uff.br</div>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowUserMenu(false);
              onOpenDocs();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#cccccc] hover:text-white hover:bg-[#2f2f2f] cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Configurações &amp; Chaves de API</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowUserMenu(false);
              onNewChat("Novo Chat Limpo");
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-400 hover:bg-amber-950/40 cursor-pointer"
          >
            <SquarePen className="w-3.5 h-3.5" />
            <span>Criar Nova Conversa</span>
          </button>
        </div>
      )}

      {/* Bottom Profile Footer */}
      <div className="p-2 border-t border-[#1f1f1f]">
        <button
          type="button"
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#212121] transition-colors cursor-pointer text-left group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#ec4899] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              TM
            </div>

            <div className="min-w-0">
              <div className="text-sm font-medium text-white truncate group-hover:text-white">
                thales marques
              </div>
              <div className="text-xs text-[#8a8a8a] truncate">
                AIJY Multi-Topic Tutor
              </div>
            </div>
          </div>

          <ChevronUp className="w-4 h-4 text-[#777777] group-hover:text-white shrink-0" />
        </button>
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-start justify-center pt-20 p-4">
          <div className="w-full max-w-lg bg-[#1e1e1e] border border-[#333333] rounded-2xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#333333]">
              <div className="flex items-center gap-2 text-white font-medium">
                <Search className="w-4 h-4 text-[#c15f3c]" />
                <span>Buscar Conversas &amp; Projetos</span>
              </div>
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-1 hover:bg-[#333333] rounded-lg text-[#888888] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              autoFocus
              placeholder="Digite o título ou palavra-chave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121212] border border-[#333333] rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#c15f3c]"
            />
            <div className="max-h-48 overflow-y-auto space-y-1">
              {filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    onSelectChat(chat.id);
                    setShowSearchModal(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs text-[#ececec] hover:bg-[#2a2a2a]"
                >
                  <span className="truncate">{chat.title}</span>
                  <span className="text-[10px] text-[#888888] font-mono">
                    {chat.lines.length} msgs
                  </span>
                </button>
              ))}
            </div>
            <div className="text-xs text-[#888888] pt-1">
              Pressione <kbd className="px-1.5 py-0.5 rounded bg-[#333333] text-white">ESC</kbd> para fechar.
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

