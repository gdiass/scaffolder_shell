import { spawn } from 'node:child_process';

export function runCommand(command, args, options = {}) {
  // Detecta se o sistema atual é Windows
  const isWindows = process.platform === 'win32';

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      // Ativa o shell apenas no Windows para resolver comandos como pnpm.cmd
      shell: isWindows,
      ...options
    });

    child.on('error', (error) => reject(error));
    child.on('exit', (code, signal) => {
      if (code === 0) return resolve();
      reject(new Error(`${command} ${args.join(' ')} falhou com código ${code ?? 'null'}${signal ? ` (signal \${signal})` : ''}.`));
    });
  });
}

export async function runStep(label, command, args, options = {}) {
  console.log(`→ ${label}`);
  await runCommand(command, args, options);
}
