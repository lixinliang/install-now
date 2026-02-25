import { existsSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { execa } from 'execa';
import type { PackageManager, PriorityRule, DetectionResult } from './types';
import { LOCK_FILE_MAP, PACKAGE_MANAGER_TO_LOCK, PACKAGE_MANAGERS, DEFAULT_PRIORITY_RULES } from './constants';
import { readPackageManagerField, parsePackageManagerField } from './config';

/**
 * 检测 lock 文件并返回对应的包管理器
 */
export function detectPackageManagerFromLockFiles(
  cwd: string
): PackageManager | null {
  for (const [lockFile, pm] of Object.entries(LOCK_FILE_MAP)) {
    if (existsSync(join(cwd, lockFile))) {
      return pm;
    }
  }
  return null;
}

/**
 * 检测指定的 lock 文件是否存在
 */
export function detectSpecificLockFile(
  cwd: string,
  packageManager: PackageManager
): boolean {
  const lockFile = PACKAGE_MANAGER_TO_LOCK[packageManager];
  return existsSync(join(cwd, lockFile));
}

/**
 * 检测命令是否在系统中可用
 */
export async function isCommandAvailable(command: string): Promise<boolean> {
  try {
    // 使用 which (Unix) 或 where (Windows) 命令
    const checkCommand = process.platform === 'win32' ? 'where' : 'which';
    const result = await execa(checkCommand, [command], { reject: false });
    return result.exitCode === 0;
  } catch {
    return false;
  }
}

/**
 * 解析优先级规则
 */
export function parsePriorityRule(rule: PriorityRule): {
  type: 'lock' | 'command' | 'packageManager';
  packageManager?: PackageManager;
} {
  // 特殊规则：packageManager
  if (rule === 'packageManager') {
    return { type: 'packageManager' };
  }

  // lock 文件规则：yarn.lock 或 yarn:lock
  if (rule.endsWith('.lock') || rule.endsWith(':lock')) {
    const pm = rule.replace(/\.lock$|:lock$/, '') as PackageManager;
    return { type: 'lock', packageManager: pm };
  }

  // 简单包管理器名：yarn, pnpm 等
  return { type: 'command', packageManager: rule as PackageManager };
}

/**
 * 根据优先级规则检测包管理器
 * 统一处理所有类型的规则
 */
export async function detectByPriorityRules(
  cwd: string,
  rules: PriorityRule[]
): Promise<DetectionResult | null> {
  for (const rule of rules) {
    const parsed = parsePriorityRule(rule);

    // 处理 lock 文件规则
    if (parsed.type === 'lock' && parsed.packageManager) {
      const hasLock = detectSpecificLockFile(cwd, parsed.packageManager);
      if (hasLock) {
        // 检查命令是否可用
        if (await isCommandAvailable(parsed.packageManager)) {
          return {
            packageManager: parsed.packageManager,
            source: 'lock',
            usedLock: true,
          };
        }
      }
      // lock 文件不存在或命令不可用，跳过继续检查
      continue;
    }

    // 处理命令检查规则
    if (parsed.type === 'command' && parsed.packageManager) {
      if (await isCommandAvailable(parsed.packageManager)) {
        return {
          packageManager: parsed.packageManager,
          source: 'command',
          usedLock: false,
        };
      }
      // 命令不存在，跳过继续检查
      continue;
    }

    // 处理 packageManager 字段规则
    if (parsed.type === 'packageManager') {
      const packageManagerField = readPackageManagerField(cwd);
      if (packageManagerField) {
        const pm = parsePackageManagerField(packageManagerField);
        if (pm && (await isCommandAvailable(pm))) {
          // 检查是否有对应的 lock 文件
          const hasLock = detectSpecificLockFile(cwd, pm as PackageManager);
          return {
            packageManager: pm as PackageManager,
            source: 'packageManager',
            usedLock: hasLock,
          };
        }
      }
      // packageManager 字段不存在或解析失败，跳过继续检查
      continue;
    }

    // 其他类型的规则，跳过
    continue;
  }

  return null;
}


/**
 * 检查是否存在 lock 文件
 */
export function hasLockFile(cwd: string): boolean {
  return detectPackageManagerFromLockFiles(cwd) !== null;
}

