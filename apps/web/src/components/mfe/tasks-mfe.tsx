import { lazy, Suspense } from 'react';
import { ErrorBoundaryMfe } from './error-boundary-mfe'; 

const RemoteTasksApp = lazy(() => 
  import('tasksMfe/App').then(module => ({ default: module.App }))
); 

export function TasksMfe() {
  return (
    <ErrorBoundaryMfe mfeName="Tarefas">
      <Suspense fallback={
          <div className="p-6 text-sm text-slate-500">
            Carregando tarefas...
          </div>
        }>
        <RemoteTasksApp />
      </Suspense>
    </ErrorBoundaryMfe>
  );
}
