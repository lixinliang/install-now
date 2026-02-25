import type { PackageManager, InstallCommand } from './types';

/**
 * 根据包管理器和是否有 lock 文件选择安装命令
 */
export function getInstallCommand(
  packageManager: PackageManager,
  hasLockFile: boolean
): InstallCommand {
  if (hasLockFile) {
    // 有 lock 文件
    switch (packageManager) {
      case 'bun':
        return { cmd: 'bun', args: ['install', '--frozen-lockfile'] };
      case 'pnpm':
        return { cmd: 'pnpm', args: ['install', '--frozen-lockfile'] };
      case 'yarn':
        return { cmd: 'yarn', args: ['install', '--frozen-lockfile'] };
      case 'cnpm':
      case 'npm':
        return { cmd: 'npm', args: ['ci'] };
      default:
        return { cmd: 'npm', args: ['install'] };
    }
  } else {
    // 没有 lock 文件，使用 install 命令
    switch (packageManager) {
      case 'bun':
        return { cmd: 'bun', args: ['install'] };
      case 'pnpm':
        return { cmd: 'pnpm', args: ['install'] };
      case 'yarn':
        return { cmd: 'yarn', args: ['install'] };
      case 'cnpm':
        return { cmd: 'cnpm', args: ['install'] };
      case 'npm':
        return { cmd: 'npm', args: ['install'] };
      default:
        return { cmd: 'npm', args: ['install'] };
    }
  }
}

