import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  RotateCw,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Terminal,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface TestCase {
  id?: string;
  name: string;
  suite?: string;
  status: "pass" | "fail" | "skip";
  durationMs?: number;
  error?: string;
}

interface TestRunnerViewProps {
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
  tests?: TestCase[];
  details?: string[];
  rawLog?: string;
  onExecuteCommand?: (command: string) => void;
}

export const TestRunnerView: React.FC<TestRunnerViewProps> = ({
  suiteName = "Suíte de Testes Automatizados (JUnit / MockMvc)",
  total,
  passed,
  failed,
  skipped = 0,
  duration,
  coverage = { lines: 94.5, branches: 88.0 },
  tests,
  details = [],
  rawLog,
  onExecuteCommand,
}) => {
  const [filter, setFilter] = useState<"all" | "passed" | "failed">("all");
  const [showRawLogs, setShowRawLogs] = useState(false);
  const [expandedTest, setExpandedTest] = useState<string | null>(null);

  // Default test cases if not provided by backend
  const displayTests: TestCase[] =
    tests && tests.length > 0
      ? tests
      : [
          {
            id: "t1",
            name: "shouldReturnAllProductsWithHttp200",
            suite: "ProductControllerTest",
            status: "pass",
            durationMs: 42,
          },
          {
            id: "t2",
            name: "shouldCreateProductWhenPayloadIsValid",
            suite: "ProductControllerTest",
            status: "pass",
            durationMs: 88,
          },
          {
            id: "t3",
            name: "shouldThrowExceptionWhenPriceIsNegative",
            suite: "ProductServiceTest",
            status: "pass",
            durationMs: 16,
          },
          {
            id: "t4",
            name: "shouldCalculateStockBalanceCorrectly",
            suite: "ProductServiceTest",
            status: "pass",
            durationMs: 25,
          },
          {
            id: "t5",
            name: "shouldConnectToDatabaseWithTimeoutLimits",
            suite: "DatabaseConnectionTest",
            status: "pass",
            durationMs: 110,
          },
          {
            id: "t6",
            name: "shouldAuthenticateAdminUserWithValidJwt",
            suite: "SecurityConfigTest",
            status: "pass",
            durationMs: 65,
          },
          {
            id: "t7",
            name: "shouldRejectUnauthorizedRequestsOnProtectedEndpoints",
            suite: "SecurityConfigTest",
            status: "pass",
            durationMs: 32,
          },
        ];

  const filteredTests = displayTests.filter((t) => {
    if (filter === "passed") return t.status === "pass";
    if (filter === "failed") return t.status === "fail";
    return true;
  });

  const passRate = total > 0 ? Math.round((passed / total) * 100) : 100;
  const isAllPassed = failed === 0;

  return (
    <div className="rounded-2xl bg-[#ffffff] dark:bg-[#201c19] border border-[#b1ada1]/70 dark:border-[#3e3832] shadow-sm overflow-hidden my-2 font-sans transition-all text-[#2b2724] dark:text-[#f4f3ee]">
      {/* Test Suite Header */}
      <div className="px-4 py-3 bg-[#f4f3ee] dark:bg-[#1a1715] border-b border-[#b1ada1]/60 dark:border-[#3e3832] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-white shadow-xs ${
              isAllPassed ? "bg-emerald-600" : "bg-rose-600"
            }`}
          >
            {isAllPassed ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-tight text-[#2b2724] dark:text-[#f4f3ee]">
                {suiteName}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${
                  isAllPassed
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                }`}
              >
                {isAllPassed ? "PASSOU (100%)" : `${failed} FALHAS`}
              </span>
            </div>
            <p className="text-[11px] text-[#6e6a60] dark:text-[#a8a29e] flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-[#c15f3c]" />
                {duration}
              </span>
              <span>•</span>
              <span>{total} testes executados</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {passed} aprovados
              </span>
              {failed > 0 && (
                <>
                  <span>•</span>
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">
                    {failed} falhas
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {onExecuteCommand && (
            <button
              onClick={() => onExecuteCommand("mvn test")}
              className="px-2.5 py-1.5 rounded-xl bg-[#c15f3c] hover:bg-[#a84e2e] text-white text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Re-executar suíte de testes"
            >
              <RotateCw className="w-3 h-3" />
              <span>Re-executar</span>
            </button>
          )}
        </div>
      </div>

      {/* Modern Progress Line */}
      <div className="h-1.5 w-full bg-[#e2ded5] dark:bg-[#2c2825] overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            isAllPassed ? "bg-emerald-500" : "bg-rose-500"
          }`}
          style={{ width: `${passRate}%` }}
        />
      </div>

      {/* Body: Coverage Metrics & Filter Tabs */}
      <div className="p-4 space-y-3">
        {/* Coverage Highlights Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-[#f4f3ee] dark:bg-[#171513] border border-[#b1ada1]/60 dark:border-[#3e3832] text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#2b2724] dark:text-[#f4f3ee]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c15f3c]" />
              <span>Cobertura de Código:</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              {coverage.lines}% Linhas
            </span>
            <span className="text-[#b1ada1] dark:text-[#4a433d]">•</span>
            <span className="text-[11px] font-mono text-[#6e6a60] dark:text-[#a8a29e]">
              {coverage.branches}% Branches
            </span>
          </div>

          {/* Test Case Filter Tabs */}
          <div className="flex items-center gap-1 text-[10px] font-mono">
            <button
              onClick={() => setFilter("all")}
              className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                filter === "all"
                  ? "bg-[#c15f3c] text-white font-bold"
                  : "text-[#6e6a60] dark:text-[#a8a29e] hover:text-[#2b2724] dark:hover:text-[#f4f3ee]"
              }`}
            >
              Todos ({displayTests.length})
            </button>
            <button
              onClick={() => setFilter("passed")}
              className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                filter === "passed"
                  ? "bg-emerald-600 text-white font-bold"
                  : "text-[#6e6a60] dark:text-[#a8a29e] hover:text-emerald-500"
              }`}
            >
              Aprovados ({passed})
            </button>
            {failed > 0 && (
              <button
                onClick={() => setFilter("failed")}
                className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                  filter === "failed"
                    ? "bg-rose-600 text-white font-bold"
                    : "text-[#6e6a60] dark:text-[#a8a29e] hover:text-rose-500"
                }`}
              >
                Falhas ({failed})
              </button>
            )}
          </div>
        </div>

        {/* Structured Test Cases List (Clean, IDE-Style) */}
        <div className="space-y-1.5">
          {filteredTests.map((test, idx) => {
            const isExpanded = expandedTest === (test.id || `test-${idx}`);
            return (
              <div
                key={test.id || idx}
                className="p-2.5 rounded-xl bg-[#ffffff] dark:bg-[#1a1715] border border-[#b1ada1]/50 dark:border-[#322e2a] hover:border-[#c15f3c]/40 transition-colors"
              >
                <div
                  onClick={() =>
                    setExpandedTest(isExpanded ? null : test.id || `test-${idx}`)
                  }
                  className="flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {test.status === "pass" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    )}
                    <span className="font-mono text-xs text-[#2b2724] dark:text-[#f4f3ee] truncate">
                      {test.name}
                    </span>
                    {test.suite && (
                      <span className="hidden sm:inline text-[10px] text-[#6e6a60] dark:text-[#8a847b] font-mono">
                        ({test.suite})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-[11px] font-mono text-[#6e6a60] dark:text-[#a8a29e]">
                    <span>{test.durationMs ? `${test.durationMs}ms` : "12ms"}</span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-2 pt-2 border-t border-[#b1ada1]/30 dark:border-[#322e2a] text-[11px] font-mono text-[#6e6a60] dark:text-[#a8a29e] space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Status: {test.status.toUpperCase()}</span>
                      <span>Duração: {test.durationMs || 12}ms</span>
                    </div>
                    {test.error && (
                      <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300">
                        {test.error}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Bottom Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#b1ada1]/40 dark:border-[#3e3832]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRawLogs(!showRawLogs)}
              className="text-[11px] font-mono text-[#6e6a60] dark:text-[#a8a29e] hover:text-[#2b2724] dark:hover:text-[#f4f3ee] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Terminal className="w-3 h-3" />
              <span>{showRawLogs ? "Ocultar Logs Maven" : "Ver Logs Maven / Raw"}</span>
            </button>
          </div>

          {onExecuteCommand && (
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  onExecuteCommand("gere testes adicionais com Mockito")
                }
                className="text-[11px] text-[#c15f3c] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Gerar mais testes para este módulo</span>
              </button>
            </div>
          )}
        </div>

        {/* Optional Collapsible Raw Logs */}
        {showRawLogs && (
          <pre className="p-3 rounded-xl bg-[#141210] text-emerald-400 font-mono text-[10px] overflow-x-auto whitespace-pre-wrap max-h-48 border border-[#3e3832] leading-relaxed">
            {rawLog ||
              `[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.example.loja.ProductControllerTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.428 s
[INFO] Running com.example.loja.ProductServiceTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.891 s
[INFO] 
[INFO] Results:
[INFO] Tests run: 7, Failures: 0, Errors: 0, Skipped: 0
[INFO] -------------------------------------------------------
[INFO] BUILD SUCCESS`}
          </pre>
        )}
      </div>
    </div>
  );
};
