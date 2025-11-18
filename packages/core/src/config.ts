import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { PriorityRule } from './types';
import { PACKAGE_MANAGERS } from './constants';

/**
 * 从 package.json 读取 install-now 配置
 */
export function readInstallNowConfig(cwd: string): PriorityRule[] | null {
  try {
    const packageJsonPath = join(cwd, 'package.json');
    if (!existsSync(packageJsonPath)) {
      return null;
    }

    const packageJsonContent = readFileSync(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);

    // 读取 install-now 配置
    const installNowConfig = packageJson['install-now'];
    if (Array.isArray(installNowConfig) && installNowConfig.length > 0) {
      return installNowConfig as PriorityRule[];
    }
  } catch (error) {
    // 忽略错误
  }
  return null;
}

/**
 * 从 package.json 读取 packageManager 字段
 */
export function readPackageManagerField(cwd: string): string | null {
  try {
    const packageJsonPath = join(cwd, 'package.json');
    if (!existsSync(packageJsonPath)) {
      return null;
    }

    const packageJsonContent = readFileSync(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);
    const packageManager = packageJson.packageManager;

    if (typeof packageManager === 'string') {
      return packageManager;
    }
  } catch (error) {
    // 忽略错误
  }
  return null;
}

/**
 * 解析 packageManager 字段，提取包管理器名称
 */
export function parsePackageManagerField(packageManager: string): string | null {
  // packageManager 格式: "pnpm@8.0.0" 或 "bun@1.0.0"
  const pm = packageManager.split('@')[0];
  if (PACKAGE_MANAGERS.includes(pm as any)) {
    return pm;
  }
  return null;
}

