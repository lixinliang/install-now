# install-now / i-now

智能安装依赖工具 - 自动检测包管理器并安装依赖

## 项目概述

这是一个 monorepo 项目，包含两个 npm 包：
- `install-now` - 完整名称版本
- `i-now` - 简短别名版本

两个包共享相同的核心代码，只是包名不同。

## 功能特性

- ✅ 自动检测 `node_modules` 是否存在
- ✅ 如果不存在，自动检测并选择合适的包管理器
- ✅ 支持多种包管理器：`bun`、`pnpm`、`yarn`、`cnpm`、`npm`
- ✅ 智能选择安装命令：
  - 有 lock 文件时使用 `ci` 命令（npm/pnpm/yarn）
  - 没有 lock 文件时使用 `install` 命令
- ✅ 跨平台支持（Windows、macOS、Linux）

## 设计决策

### 包管理器检测优先级

1. **Lock 文件检测**（最准确）
   - `bun.lockb` → bun
   - `pnpm-lock.yaml` → pnpm
   - `yarn.lock` → yarn
   - `package-lock.json` → npm 或 cnpm

2. **package.json 中的 `packageManager` 字段**

3. **按优先级检测可用的命令**
   - bun
   - pnpm
   - yarn
   - cnpm
   - npm

### 安装命令选择逻辑

- **有 lock 文件**：
  - npm/pnpm/yarn → 使用 `ci` 命令（更严格，确保一致性）
  - bun → 使用 `install` 命令（bun 不支持 ci）

- **没有 lock 文件**：
  - 所有包管理器 → 使用 `install` 命令（可以生成 lock 文件）

### 为什么选择这个逻辑？

- `ci` 命令需要 lock 文件，适合 CI/CD 和确保一致性
- `install` 命令更灵活，可以生成 lock 文件，适合首次安装
- 这个设计平衡了严格性和灵活性

## 项目结构

```
install-now/
├── package.json              # 根 package.json
├── pnpm-workspace.yaml       # pnpm workspace 配置
├── lerna.json               # lerna 配置
├── tsconfig.json            # TypeScript 配置
├── packages/
│   ├── core/                # 核心代码（private）
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   └── index.ts     # 核心逻辑
│   │   └── dist/            # 编译输出
│   ├── install-now/         # install-now 包
│   │   ├── package.json
│   │   └── bin/
│   │       └── install-now.js
│   └── i-now/               # i-now 包（短别名）
│       ├── package.json
│       └── bin/
│           └── i-now.js
```

## 技术栈

- **包管理**: pnpm + lerna (monorepo)
- **语言**: TypeScript
- **运行时**: Node.js >= 16.13.0
- **依赖**: execa (执行子进程)

## 使用方式

### 作为 npm script

在项目的 `package.json` 中：

```json
{
  "scripts": {
    "predev": "npx i-now",
    "dev": "your-dev-command"
  }
}
```

### 直接使用

```bash
# 使用完整名称
npx install-now

# 使用短别名
npx i-now
```

## 开发指南

### 初始化项目

```bash
# 安装依赖
pnpm install

# 构建所有包
pnpm run build

# 清理构建产物
pnpm run clean
```

### 发布

```bash
# 发布所有包
pnpm run publish

# 或使用 lerna
lerna publish
```

## 实现细节

### 核心逻辑流程

1. 检查 `node_modules` 目录是否存在
2. 如果存在，直接返回（跳过安装）
3. 如果不存在：
   - 检测 lock 文件，确定包管理器
   - 如果没有 lock 文件，按优先级检测可用的包管理器
   - 根据是否有 lock 文件，选择 `ci` 或 `install` 命令
   - 执行安装命令

### 关键代码位置

- 核心逻辑：`packages/core/src/index.ts`
- 包管理器检测：`detectPackageManagerFromLockFiles()`
- 命令选择：`getInstallCommand()`
- 主入口：`runCommand()`

## 相关讨论

### 为什么选择这个命名？

- `install-now` - 语义清晰，表达"立即安装"
- `i-now` - 简短易用，`i` = install, `now` = 立即

### 为什么不使用 `ci` 包？

- `ci` 包不支持 `bun` 和 `cnpm`
- 我们需要更灵活的检测逻辑
- 需要支持"有 lock 用 ci，没有 lock 用 install"的逻辑

### 为什么使用 monorepo？

- 两个包共享相同的核心代码
- 便于维护和版本管理
- 使用 lerna 可以统一发布

## 待实现功能

- [ ] 支持配置文件（`.ensurerc` 或 `package.json` 中的配置）
- [ ] 支持自定义包管理器优先级
- [ ] 更好的错误处理和提示
- [ ] 支持静默模式（减少输出）

## License

Apache-2.0
