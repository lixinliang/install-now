import { existsSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { execa } from 'execa';
import { readInstallNowConfig } from './config';
import { detectByPriorityRules, isCommandAvailable } from './detect';
import { DEFAULT_PRIORITY_RULES } from './constants';
import { getInstallCommand } from './command';

/**
 * 主函数：运行安装命令
 */
export async function runCommand(cwd: string = process.cwd()): Promise<void> {
  // 第一步：检查 node_modules 是否存在
  const nodeModulesPath = join(cwd, 'node_modules');
  if (existsSync(nodeModulesPath)) {
    console.log('✓ node_modules already exists, skipping installation');
    return;
  }

  // 第二步：读取配置，如果读取失败使用内置配置
  console.log('🔍 Detecting package manager...');
  const config = readInstallNowConfig(cwd) || DEFAULT_PRIORITY_RULES;

  // 第三步：遍历配置数组来确定使用哪个安装命令
  const detectionResult = await detectByPriorityRules(cwd, config);

  // 如果最终没有得到唯一的包管理器，报错并给出提示
  if (!detectionResult) {
    throw new Error(
      'No package manager found. Please install one of: bun, pnpm, yarn, cnpm, npm'
    );
  }

  const { packageManager, source, usedLock } = detectionResult;

  // 第四步：检查包管理器命令是否存在
  const commandAvailable = await isCommandAvailable(packageManager);
  if (!commandAvailable) {
    throw new Error(
      `Package manager "${packageManager}" is required but not found. Please install it first.\n` +
        `  Install: npm install -g ${packageManager}`
    );
  }

  const sourceMap = {
    lock: 'lock file',
    config: 'install-now config',
    packageManager: 'packageManager field',
    command: 'system command',
  };
  console.log(
    `✓ Detected package manager: ${packageManager} (from ${sourceMap[source]})`
  );

  // 第五步：执行安装命令
  // 如果使用了 lock 文件，则使用 lock 的安装参数（如 npm ci）
  // 否则使用普通参数（如 npm install）
  const { cmd, args } = getInstallCommand(packageManager, usedLock);
  console.log(`📦 Running: ${cmd} ${args.join(' ')}`);

  try {
    await execa(cmd, args, {
      cwd,
      stdio: 'inherit',
    });
    console.log('✓ Installation completed successfully');
  } catch (error) {
    console.error(`✗ Installation failed: ${error}`);
    throw error;
  }
}
