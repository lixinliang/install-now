import type { PackageManager, PriorityRule } from './types';

/**
 * 支持的包管理器列表（默认优先级）
 */
export const PACKAGE_MANAGERS: readonly PackageManager[] = [
  'bun',
  'pnpm',
  'yarn',
  'cnpm',
  'npm',
] as const;

/**
 * 默认优先级配置
 * 可以通过更新这个数组来调整默认优先级
 */
export const DEFAULT_PRIORITY_RULES: PriorityRule[] = [
  'bun.lock',
  'pnpm.lock',
  'yarn.lock',
  'npm.lock', // package-lock.json 对应 npm
  'packageManager',
  'bun',
  'pnpm',
  'yarn',
  'cnpm',
  'npm',
];

/**
 * Lock 文件映射
 */
export const LOCK_FILE_MAP: Record<string, PackageManager> = {
  'bun.lockb': 'bun',
  'pnpm-lock.yaml': 'pnpm',
  'yarn.lock': 'yarn',
  'package-lock.json': 'npm', // npm 或 cnpm
};

/**
 * 包管理器到 lock 文件的反向映射
 */
export const PACKAGE_MANAGER_TO_LOCK: Record<PackageManager, string> = {
  bun: 'bun.lockb',
  pnpm: 'pnpm-lock.yaml',
  yarn: 'yarn.lock',
  cnpm: 'package-lock.json',
  npm: 'package-lock.json',
};

