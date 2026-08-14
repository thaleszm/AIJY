export type PermissionMode = "readonly" | "edit" | "execution";
export type UserLevel = "facil" | "intermediario" | "avancado" | "master" | "iniciante";

export type TerminalLineType =
  | "system"
  | "user-prompt"
  | "agent-thought"
  | "thought"
  | "agent-response"
  | "tool-call"
  | "tool-execution"
  | "tool-result"
  | "diff-view"
  | "diff"
  | "confirmation-prompt"
  | "tool-danger"
  | "command-output"
  | "test-runner"
  | "error-badge"
  | "error"
  | "success-badge";

export interface InteractiveAction {
  label: string;
  command: string;
  description?: string;
  icon?: "play" | "wrench" | "sparkles" | "check" | "file-code" | "terminal" | "shield" | "refresh";
  isPrimary?: boolean;
}

export interface DiagnosticItem {
  id?: string;
  title: string;
  severity: "critical" | "warning" | "optimization" | "info";
  description: string;
  solution?: string;
  filePath?: string;
  lineNumber?: number;
  autoFixCommand?: string;
  autoFixLabel?: string;
}

export interface InteractiveCardData {
  title: string;
  subtitle?: string;
  severity?: "critical" | "warning" | "optimization" | "info" | "success";
  badge?: string;
  diagnostics?: DiagnosticItem[];
  quickActions?: InteractiveAction[];
  metrics?: {
    label: string;
    value: string;
    badge?: string;
    status?: "good" | "warn" | "bad";
  }[];
  codeSnippet?: {
    title?: string;
    language: string;
    code: string;
    targetPath?: string;
    description?: string;
  };
  explanationSteps?: {
    title: string;
    detail: string;
    status?: "done" | "in_progress" | "pending";
  }[];
}

export interface TerminalLine {
  id: string;
  type: TerminalLineType;
  content: string;
  timestamp: string;
  metadata?: {
    toolName?: string;
    toolParams?: Record<string, any>;
    isDangerous?: boolean;
    confirmationId?: string;
    diffData?: {
      path: string;
      diff: string;
      newContent?: string;
    };
    testResults?: {
      suiteName?: string;
      total: number;
      passed: number;
      failed: number;
      skipped?: number;
      duration: string;
      coverage?: {
        lines: number;
        branches: number;
        functions?: number;
      };
      tests?: {
        id?: string;
        name: string;
        suite?: string;
        status: "pass" | "fail" | "skip";
        durationMs?: number;
        error?: string;
      }[];
      details?: string[];
    };
    thoughtSteps?: string[];
    stackInfo?: {
      languages: string[];
      frameworks: string[];
      tools: string[];
      summary?: string;
    };
    suggestedCommands?: string[];
    interactiveCard?: InteractiveCardData;
  };
}

export interface ProjectFile {
  path: string;
  name: string;
  content: string;
  language: string;
  isModified?: boolean;
  isNew?: boolean;
  hasWarning?: boolean;
  warningMessage?: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  badge: string;
  description: string;
  icon: string;
  technologies: string[];
  files: ProjectFile[];
  quickPrompts: string[];
}

export interface AgentMemory {
  sessionMemory: string[];
  projectMemory: {
    name: string;
    stack: string[];
    architecture: string;
    identifiedIssues: string[];
    decisions: string[];
  };
  userPreferences: {
    level: UserLevel;
    permissionMode: PermissionMode;
    theme: "cyber" | "matrix" | "slate" | "paper";
    autoConfirmSafe: boolean;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  projectId?: string;
  topic?: string;
  lines: TerminalLine[];
  memory: AgentMemory;
}

export interface ToolCallExecution {
  id: string;
  tool: string;
  params: Record<string, any>;
  explanation: string;
  isDangerous: boolean;
  confirmationPrompt?: string | null;
  simulatedResult?: string;
  status: "pending" | "waiting_confirmation" | "executing" | "success" | "rejected" | "failed";
}
