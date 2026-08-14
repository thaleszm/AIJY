import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { PROJECT_TEMPLATES } from "./data/projectTemplates";
import {
  ProjectTemplate,
  ProjectFile,
  PermissionMode,
  UserLevel,
  TerminalLine,
  AgentMemory,
  ChatSession,
} from "./types";
import { Header } from "./components/Header";
import { TerminalView } from "./components/TerminalView";
import { ChatGPTStyleSidebar } from "./components/ChatGPTStyleSidebar";
import { WorkspaceExplorer } from "./components/WorkspaceExplorer";
import { AgentMemoryModal } from "./components/AgentMemoryModal";
import { SecurityGuardModal } from "./components/SecurityGuardModal";
import { DocumentationModal } from "./components/DocumentationModal";
import { GeminiStatusModal } from "./components/GeminiStatusModal";

const INITIAL_MEMORY: AgentMemory = {
  sessionMemory: [
    "AIJY inicializado no terminal interativo multi-tópicos.",
    "Workspace e histórico de conversas ativos.",
  ],
  projectMemory: {
    name: "Geral & Multi-Projetos",
    stack: ["Java", "Python", "TypeScript", "React", "Docker", "DevOps", "Cálculo & Algoritmos"],
    architecture: "Tutor inteligente adaptativo de Engenharia de Software e TI",
    identifiedIssues: [],
    decisions: ["Manter histórico persistente e adaptação conversacional"],
  },
  userPreferences: {
    level: "intermediario",
    permissionMode: "execution",
    theme: "slate",
    autoConfirmSafe: true,
  },
};

const DEFAULT_INITIAL_SESSIONS: ChatSession[] = [
  {
    id: "session-spring-boot",
    title: "Java & Loja Virtual API",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    projectId: "spring-boot-ecommerce",
    topic: "Spring Boot + Java 17",
    memory: { ...INITIAL_MEMORY },
    lines: [
      {
        id: "init-spring",
        type: "system",
        content:
          "AIJY > Conversa sobre o microsserviço 'loja-virtual-api' (Spring Boot 3.2 e Java 17). Pergunte sobre DTOs, controllers, testes e configurações.",
        timestamp: new Date().toLocaleTimeString(),
      },
    ],
  },
  {
    id: "session-general-ti",
    title: "Tutor Livre de TI & Algoritmos",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    projectId: "general-tutor",
    topic: "Universal",
    memory: { ...INITIAL_MEMORY },
    lines: [
      {
        id: "init-general",
        type: "system",
        content:
          "AIJY > Tutor Universal pronto! Você pode perguntar sobre QUALQUER assunto (Lógica, Python, React, DevOps, Cálculo, Estruturas de Dados, etc.).",
        timestamp: new Date().toLocaleTimeString(),
      },
    ],
  },
  {
    id: "session-calculo-mat",
    title: "Cálculo I-A & Métodos Numéricos",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    projectId: "calculo-1a",
    topic: "Cálculo e Matemática Computacional",
    memory: { ...INITIAL_MEMORY },
    lines: [
      {
        id: "init-calc",
        type: "system",
        content:
          "AIJY > Sessão de Cálculo I-A e Matemática Aplicada aberta. Dúvidas sobre limites, derivadas, integrais ou algoritmos numéricos?",
        timestamp: new Date().toLocaleTimeString(),
      },
    ],
  },
];

export default function App() {
  const [projects, setProjects] = useState<ProjectTemplate[]>(PROJECT_TEMPLATES);
  const [currentProject, setCurrentProject] = useState<ProjectTemplate>(PROJECT_TEMPLATES[0]);
  const [activeFile, setActiveFile] = useState<ProjectFile | null>(PROJECT_TEMPLATES[0].files[0]);
  const [permissionMode, setPermissionMode] = useState<PermissionMode>("execution");
  const [userLevel, setUserLevel] = useState<UserLevel>("intermediario");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("aijy_theme");
    if (saved === "light" || saved === "dark") return saved;
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [geminiActive, setGeminiActive] = useState<boolean>(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState<boolean>(false);

  // Chat sessions state
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem("aijy_chat_sessions");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Could not load saved sessions", e);
    }
    return DEFAULT_INITIAL_SESSIONS;
  });

  const [activeChatId, setActiveChatId] = useState<string>(() => {
    return chatSessions[0]?.id || "session-spring-boot";
  });

  // Current chat session
  const currentChat = chatSessions.find((c) => c.id === activeChatId) || chatSessions[0];

  // Agent memory derived from current active chat session
  const [agentMemory, setAgentMemory] = useState<AgentMemory>(() => currentChat?.memory || INITIAL_MEMORY);

  // Lines currently rendered in the active terminal
  const [lines, setLines] = useState<TerminalLine[]>(() => currentChat?.lines || []);

  // Save sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("aijy_chat_sessions", JSON.stringify(chatSessions));
    } catch {
      // ignore
    }
  }, [chatSessions]);

  // Sync theme with DOM and localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      root.classList.remove("dark");
      document.body.classList.remove("dark");
    }
    try {
      localStorage.setItem("aijy_theme", theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  // Modals state
  const [isMemoryOpen, setIsMemoryOpen] = useState<boolean>(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState<boolean>(false);
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState<boolean>(false);

  // Check health and Gemini status on mount and refresh
  const fetchHealthStatus = () => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setGeminiActive(Boolean(data.geminiActive));
      })
      .catch((err) => console.log("Health check note:", err));
  };

  useEffect(() => {
    fetchHealthStatus();
  }, []);

  // Switch active chat session
  const handleSelectChat = (chatId: string) => {
    const targetChat = chatSessions.find((c) => c.id === chatId);
    if (!targetChat) return;

    setActiveChatId(chatId);
    setLines(targetChat.lines);
    setAgentMemory(targetChat.memory || INITIAL_MEMORY);

    // Switch workspace if bound to a project
    if (targetChat.projectId) {
      const matchProj = projects.find((p) => p.id === targetChat.projectId);
      if (matchProj) {
        setCurrentProject(matchProj);
        setActiveFile(matchProj.files[0] || null);
      }
    }
  };

  // Create new chat session
  const handleNewChat = (initialTopic?: string) => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: initialTopic || `Nova Conversa #${chatSessions.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      projectId: currentProject.id,
      topic: initialTopic || "Conversa Livre",
      memory: {
        ...INITIAL_MEMORY,
        sessionMemory: ["Nova conversa iniciada. AIJY pronto para qualquer tema."],
      },
      lines: [
        {
          id: `init-${newId}`,
          type: "system",
          content: `AIJY > Novo chat iniciado. Pergunte sobre qualquer tópico de TI, programação, matemática ou projetos.`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
    };

    setChatSessions((prev) => [newSession, ...prev]);
    setActiveChatId(newId);
    setLines(newSession.lines);
    setAgentMemory(newSession.memory);
  };

  // Delete chat session
  const handleDeleteChat = (chatId: string) => {
    if (chatSessions.length <= 1) return;
    const remaining = chatSessions.filter((c) => c.id !== chatId);
    setChatSessions(remaining);
    if (activeChatId === chatId) {
      const nextChat = remaining[0];
      setActiveChatId(nextChat.id);
      setLines(nextChat.lines);
      setAgentMemory(nextChat.memory);
    }
  };

  // Update active file and memory when project changes
  const handleSelectProject = (project: ProjectTemplate) => {
    setCurrentProject(project);
    setActiveFile(project.files[0] || null);

    setAgentMemory((prev) => ({
      ...prev,
      sessionMemory: [
        ...prev.sessionMemory,
        `Projeto alternado para ${project.name} (${project.badge})`,
      ],
      projectMemory: {
        name: project.name,
        stack: project.technologies,
        architecture: project.description,
        identifiedIssues: project.files.filter((f) => f.hasWarning).map((f) => `${f.path}: ${f.warningMessage}`),
        decisions: [],
      },
    }));

    const switchLine: TerminalLine = {
      id: `proj-switch-${Date.now()}`,
      type: "system",
      content: `Diretório e contexto alterados para: ~/${project.name} (${project.badge})`,
      timestamp: new Date().toLocaleTimeString(),
    };

    setLines((prev) => [...prev, switchLine]);

    // Update active chat title if generic
    setChatSessions((prev) =>
      prev.map((c) => {
        if (c.id === activeChatId) {
          const isGeneric = c.title.startsWith("Nova Conversa") || c.title.includes("Geral");
          return {
            ...c,
            projectId: project.id,
            title: isGeneric ? `${project.name}` : c.title,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
  };

  // User sends a message/command
  const handleSendMessage = async (promptText: string) => {
    const userLineId = `user-${Date.now()}`;
    const userLine: TerminalLine = {
      id: userLineId,
      type: "user-prompt",
      content: promptText,
      timestamp: new Date().toLocaleTimeString(),
    };

    const updatedLines = [...lines, userLine];
    setLines(updatedLines);
    setIsLoading(true);

    // Auto-rename chat title if this is the first user message in this session
    setChatSessions((prev) =>
      prev.map((c) => {
        if (c.id === activeChatId && (c.title.startsWith("Nova Conversa") || c.lines.length <= 1)) {
          const cleanTitle = promptText.length > 28 ? `${promptText.slice(0, 28)}...` : promptText;
          return { ...c, title: cleanTitle, updatedAt: new Date().toISOString() };
        }
        return c;
      })
    );

    // Prepare conversational history summary for adaptation
    const conversationHistory = lines
      .filter((l) => l.type === "user-prompt" || l.type === "agent-response")
      .map((l) => ({
        role: l.type === "user-prompt" ? "user" : "assistant",
        content: l.content,
      }));

    try {
      const res = await fetch("/api/aijy/interact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          projectContext: {
            name: currentProject.name,
            technologies: currentProject.technologies,
            description: currentProject.description,
          },
          files: currentProject.files,
          permissionMode,
          userLevel,
          memory: agentMemory,
          history: conversationHistory,
        }),
      });

      if (!res.ok) {
        throw new Error(`Servidor retornou status ${res.status}`);
      }

      const data = await res.json();
      const newLines: TerminalLine[] = [];

      // 1. Agent Thought Process
      if (data.thoughtProcess && data.thoughtProcess.length > 0) {
        newLines.push({
          id: `thought-${Date.now()}`,
          type: "agent-thought",
          content: "Planejamento e análise contextual",
          timestamp: new Date().toLocaleTimeString(),
          metadata: {
            thoughtSteps: data.thoughtProcess,
          },
        });
      }

      // 2. Tool Calls
      if (data.toolCalls && data.toolCalls.length > 0) {
        for (const toolCall of data.toolCalls) {
          if (toolCall.isDangerous && permissionMode !== "readonly") {
            newLines.push({
              id: `danger-${Date.now()}-${toolCall.id}`,
              type: "confirmation-prompt",
              content:
                toolCall.confirmationPrompt ||
                `AIJY > Foi solicitado executar '${toolCall.params?.command || toolCall.tool}'. Esta ação pode alterar ou excluir dados. Deseja continuar? [s/N]`,
              timestamp: new Date().toLocaleTimeString(),
              metadata: {
                toolName: toolCall.tool,
                toolParams: toolCall.params,
                isDangerous: true,
                confirmationId: toolCall.id,
              },
            });
          } else {
            newLines.push({
              id: `tool-${Date.now()}-${toolCall.id}`,
              type: "tool-call",
              content: toolCall.explanation,
              timestamp: new Date().toLocaleTimeString(),
              metadata: {
                toolName: toolCall.tool,
                toolParams: toolCall.params,
              },
            });

            if (toolCall.simulatedResult) {
              newLines.push({
                id: `tool-res-${Date.now()}-${toolCall.id}`,
                type: toolCall.tool === "run_tests" ? "test-runner" : "tool-result",
                content: toolCall.simulatedResult,
                timestamp: new Date().toLocaleTimeString(),
                metadata: {
                  testResults:
                    toolCall.tool === "run_tests"
                      ? {
                          suiteName: `${currentProject.name} — Suíte de Testes Automatizados`,
                          total: 10,
                          passed: 10,
                          failed: 0,
                          skipped: 0,
                          duration: "2.148s",
                          coverage: { lines: 95.8, branches: 90.2, functions: 97.4 },
                          tests: [
                            { id: "t1", name: "shouldReturnAllProductsWithHttp200", suite: "ProductControllerTest", status: "pass", durationMs: 38 },
                            { id: "t2", name: "shouldCreateProductWhenPayloadIsValid", suite: "ProductControllerTest", status: "pass", durationMs: 64 },
                            { id: "t3", name: "shouldThrowExceptionWhenPriceIsNegative", suite: "ProductServiceTest", status: "pass", durationMs: 14 },
                            { id: "t4", name: "shouldCalculateStockBalanceCorrectly", suite: "ProductServiceTest", status: "pass", durationMs: 22 },
                            { id: "t5", name: "shouldConnectToDatabaseWithTimeoutLimits", suite: "DatabaseConnectionTest", status: "pass", durationMs: 95 },
                            { id: "t6", name: "shouldAuthenticateAdminUserWithValidJwt", suite: "SecurityConfigTest", status: "pass", durationMs: 55 },
                            { id: "t7", name: "shouldRejectUnauthorizedRequestsOnProtectedEndpoints", suite: "SecurityConfigTest", status: "pass", durationMs: 28 },
                            { id: "t8", name: "shouldHandleConcurrentStockUpdatesAtomically", suite: "ProductConcurrencyTest", status: "pass", durationMs: 82 },
                            { id: "t9", name: "shouldValidateInputSanitizationAgainstSqlInjection", suite: "SecurityAuditTest", status: "pass", durationMs: 44 },
                            { id: "t10", name: "shouldExecuteHealthCheckProbeSuccessfully", suite: "ActuatorEndpointTest", status: "pass", durationMs: 18 }
                          ],
                          details: ["10/10 asserções válidas", "0 falhas de regressão", "Métricas de concorrência normais"],
                        }
                      : undefined,
                },
              });
            }
          }
        }
      }

      // 3. File modifications & Diffs
      if (data.fileModifications && data.fileModifications.length > 0) {
        for (const mod of data.fileModifications) {
          newLines.push({
            id: `diff-${Date.now()}-${mod.path}`,
            type: "diff-view",
            content: mod.diff,
            timestamp: new Date().toLocaleTimeString(),
            metadata: {
              diffData: {
                path: mod.path,
                diff: mod.diff,
                newContent: mod.newContent,
              },
            },
          });
        }
      }

      // 4. Main Agent Response Text
      if (data.response || data.interactiveCard) {
        newLines.push({
          id: `resp-${Date.now()}`,
          type: "agent-response",
          content: data.response || "Análise concluída pelo AIJY.",
          timestamp: new Date().toLocaleTimeString(),
          metadata: {
            suggestedCommands: data.suggestedCommands,
            stackInfo: data.identifiedStack,
            interactiveCard: data.interactiveCard,
          },
        });
      }

      let updatedMemory = agentMemory;
      // 5. Update Memory
      if (data.memoryUpdates) {
        updatedMemory = {
          ...agentMemory,
          sessionMemory: [
            ...agentMemory.sessionMemory.slice(-6),
            `Comando '${promptText.slice(0, 30)}...' processado.`,
            data.memoryUpdates.sessionMemory || "Interação registrada",
          ],
          projectMemory: {
            ...agentMemory.projectMemory,
            decisions: [
              ...agentMemory.projectMemory.decisions,
              data.memoryUpdates.projectMemory || "",
            ].filter(Boolean),
          },
        };
        setAgentMemory(updatedMemory);
      }

      const finalAllLines = [...updatedLines, ...newLines];
      setLines(finalAllLines);

      // Save to chatSessions
      setChatSessions((prev) =>
        prev.map((c) => {
          if (c.id === activeChatId) {
            return {
              ...c,
              lines: finalAllLines,
              memory: updatedMemory,
              updatedAt: new Date().toISOString(),
            };
          }
          return c;
        })
      );
    } catch (err: any) {
      const errorLine: TerminalLine = {
        id: `err-${Date.now()}`,
        type: "agent-response",
        content: `AIJY > Erro na comunicação com o agente: ${err.message}. Tente novamente.`,
        timestamp: new Date().toLocaleTimeString(),
      };
      const finalAllLines = [...updatedLines, errorLine];
      setLines(finalAllLines);

      setChatSessions((prev) =>
        prev.map((c) => (c.id === activeChatId ? { ...c, lines: finalAllLines } : c))
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Apply diff to project file
  const handleApplyDiff = (filePath: string, newContent: string) => {
    setProjects((prevProjects) =>
      prevProjects.map((proj) => {
        if (proj.id === currentProject.id) {
          const fileExists = proj.files.some((f) => f.path === filePath);
          let updatedFiles: ProjectFile[];

          if (fileExists) {
            updatedFiles = proj.files.map((f) =>
              f.path === filePath
                ? { ...f, content: newContent, isModified: true, hasWarning: false }
                : f
            );
          } else {
            const safePath = filePath || "arquivo.txt";
            updatedFiles = [
              ...proj.files,
              {
                path: safePath,
                name: safePath.split("/").pop() || safePath,
                content: newContent || "",
                language: safePath.split(".").pop() || "text",
                isNew: true,
              },
            ];
          }

          return { ...proj, files: updatedFiles };
        }
        return proj;
      })
    );

    if (activeFile && activeFile.path === filePath) {
      setActiveFile((prev) => (prev ? { ...prev, content: newContent, isModified: true, hasWarning: false } : null));
    }

    setLines((prev) => [
      ...prev,
      {
        id: `diff-applied-${Date.now()}`,
        type: "system",
        content: `[OK] Alterações aplicadas com sucesso em '${filePath}'. O arquivo está atualizado no projeto.`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#10b981", "#3b82f6", "#a855f7"],
    });
  };

  // Confirmation for dangerous tool
  const handleConfirmDangerousTool = (toolId: string, confirmed: boolean) => {
    if (confirmed) {
      setLines((prev) => [
        ...prev,
        {
          id: `confirmed-${Date.now()}`,
          type: "system",
          content: `AIJY > Operação confirmada pelo usuário. Executando comando no ambiente isolado...`,
          timestamp: new Date().toLocaleTimeString(),
        },
        {
          id: `confirmed-res-${Date.now()}`,
          type: "tool-result",
          content: `[OK] Comando executado com sucesso sob consentimento explícito.`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } else {
      setLines((prev) => [
        ...prev,
        {
          id: `rejected-${Date.now()}`,
          type: "system",
          content: `AIJY > Operação cancelada com segurança pelo usuário. Nenhum arquivo foi alterado.`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  const handleClearSessionMemory = () => {
    setAgentMemory((prev) => ({
      ...prev,
      sessionMemory: ["Sessão de memória reiniciada."],
    }));
  };

  const handleAddProjectNote = (note: string) => {
    setAgentMemory((prev) => ({
      ...prev,
      projectMemory: {
        ...prev.projectMemory,
        decisions: [...prev.projectMemory.decisions, note],
      },
    }));
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#f4f3ee] dark:bg-[#12100e] text-[#2b2724] dark:text-[#f4f3ee] overflow-hidden font-sans select-none antialiased">
      {/* Top Application Header */}
      <Header
        currentProject={currentProject}
        projects={projects}
        onSelectProject={handleSelectProject}
        permissionMode={permissionMode}
        onChangePermission={setPermissionMode}
        userLevel={userLevel}
        onChangeUserLevel={setUserLevel}
        onOpenMemory={() => setIsMemoryOpen(true)}
        onOpenSecurity={() => setIsSecurityOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenGeminiStatus={() => setIsGeminiModalOpen(true)}
        geminiActive={geminiActive}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
        isWorkspaceOpen={isWorkspaceOpen}
        onToggleWorkspace={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Left Column: ChatGPT Style Sidebar */}
        {isWorkspaceOpen && (
          <div className="w-full md:w-64 lg:w-72 shrink-0 h-[45%] md:h-full flex flex-col transition-all duration-300 z-10 shadow-lg md:shadow-none">
            <ChatGPTStyleSidebar
              currentProject={currentProject}
              projects={projects}
              onSelectProject={handleSelectProject}
              activeFile={activeFile}
              onSelectFile={setActiveFile}
              chatSessions={chatSessions}
              activeChatId={activeChatId}
              onSelectChat={handleSelectChat}
              onNewChat={handleNewChat}
              onDeleteChat={handleDeleteChat}
              onToggleCollapse={() => setIsWorkspaceOpen(false)}
              onOpenDocs={() => setIsDocsOpen(true)}
              onTriggerPrompt={handleSendMessage}
            />
          </div>
        )}

        {/* Right Column: AIJY Interactive CLI Terminal View */}
        <div className="flex-1 h-full flex flex-col min-w-0">
          <TerminalView
            lines={lines}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            permissionMode={permissionMode}
            onChangePermission={setPermissionMode}
            userLevel={userLevel}
            onChangeUserLevel={setUserLevel}
            currentProject={currentProject}
            onApplyDiff={handleApplyDiff}
            onConfirmDangerousTool={handleConfirmDangerousTool}
            isWorkspaceOpen={isWorkspaceOpen}
            onToggleWorkspace={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
            onClearTerminal={() => {
              const clearLine: TerminalLine = {
                id: `clear-${Date.now()}`,
                type: "system",
                content: "Terminal limpo. AIJY pronto para o próximo comando.",
                timestamp: new Date().toLocaleTimeString(),
              };
              setLines([clearLine]);
              setChatSessions((prev) =>
                prev.map((c) => (c.id === activeChatId ? { ...c, lines: [clearLine] } : c))
              );
            }}
          />
        </div>
      </div>

      {/* Modals */}
      <AgentMemoryModal
        isOpen={isMemoryOpen}
        onClose={() => setIsMemoryOpen(false)}
        memory={agentMemory}
        onClearSessionMemory={handleClearSessionMemory}
        onAddProjectNote={handleAddProjectNote}
      />

      <SecurityGuardModal
        isOpen={isSecurityOpen}
        onClose={() => setIsSecurityOpen(false)}
        currentMode={permissionMode}
        onChangeMode={setPermissionMode}
      />

      <DocumentationModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
        onSelectPrompt={handleSendMessage}
      />

      <GeminiStatusModal
        isOpen={isGeminiModalOpen}
        onClose={() => setIsGeminiModalOpen(false)}
        geminiActive={geminiActive}
        onRefreshStatus={fetchHealthStatus}
      />
    </div>
  );
}
