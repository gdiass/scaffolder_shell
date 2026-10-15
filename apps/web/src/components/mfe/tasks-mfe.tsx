import { lazy, Suspense } from 'react';

const RemoteTasksApp = lazy(() => 
  import('tasksMfe/App').then(module => ({ default: module.App }))
); 

export function TasksMfe() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate-500">Carregando tarefas...</div>}>
      <RemoteTasksApp />
    </Suspense>
  );
}
