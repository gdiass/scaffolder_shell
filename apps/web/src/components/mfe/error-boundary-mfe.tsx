import { ErrorBoundary } from 'react-error-boundary';

interface ErrorBoundaryMfeProps {
  children: React.ReactNode;
  mfeName: string;
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

function DefaultMfeFallback({ error, resetErrorBoundary, mfeName }: { 
  error: Error; 
  resetErrorBoundary: () => void; 
  mfeName: string 
}) {
  const isNetworkError = 
    error.message?.includes('Failed to fetch dynamically imported module') ||
    error.name === 'TypeError' ||
    error.message?.includes('script error');

  return (
    <div className="p-5 m-3 border border-slate-200 bg-slate-50 rounded-lg shadow-sm">
      <div className="flex items-start space-x-3">
        <div className="text-red-500 font-bold text-lg mt-0.5">⚠️</div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            O módulo <span className="font-mono text-indigo-600 font-bold">"{mfeName}"</span> falhou
          </h3>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
            {isNetworkError 
              ? 'O servidor deste módulo parece estar offline ou inacessível no momento.'
              : 'Ocorreu um erro inesperado durante a execução deste componente.'}
          </p>

          {import.meta.env.DEV && (
            <details className="mt-3">
              <summary className="text-[11px] text-slate-500 cursor-pointer hover:underline select-none">
                Detalhes técnicos do erro
              </summary>
              <pre className="mt-2 p-2 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-700 font-mono overflow-auto max-h-40">
                {error.stack || error.message}
              </pre>
            </details>
          )}

          <button
            onClick={resetErrorBoundary}
            className="mt-3.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded shadow-sm transition-colors cursor-pointer"
          >
            🔄 Tentar reconectar
          </button>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundaryMfe({ children, mfeName, onError }: ErrorBoundaryMfeProps) {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <DefaultMfeFallback
          error={toError(error)}
          resetErrorBoundary={resetErrorBoundary}
          mfeName={mfeName}
        />
      )}
      onError={(error, info) => {
        console.error(`[ErrorBoundaryMfe] Erro no MFE: ${mfeName}`, error, info);
        if (onError) onError(toError(error), info);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
