/**
 * 支持的包管理器类型
 */
export type PackageManager = 'bun' | 'pnpm' | 'yarn' | 'cnpm' | 'npm';

/**
 * 优先级规则类型
 */
export type PriorityRule =
  | PackageManager // 简单包管理器名，如 "yarn", "pnpm"
  | `${PackageManager}.lock` // lock 文件规则，如 "yarn.lock"
  | `${PackageManager}:lock` // lock 文件规则（冒号格式），如 "yarn:lock"
  | 'packageManager'; // 特殊规则：使用 package.json 的 packageManager 字段

/**
 * 安装命令配置
 */
export interface InstallCommand {
  cmd: string;
  args: string[];
}

/**
 * 检测结果
 */
export interface DetectionResult {
  packageManager: PackageManager;
  source: 'lock' | 'config' | 'packageManager' | 'command';
  usedLock: boolean; // 是否使用了 lock 文件
}

