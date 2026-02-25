# install-now / i-now

[![npm version](https://img.shields.io/npm/v/install-now.svg)](https://www.npmjs.com/package/install-now)
[![npm version](https://img.shields.io/npm/v/i-now.svg)](https://www.npmjs.com/package/i-now)
[![npm downloads](https://img.shields.io/npm/dm/install-now.svg)](https://www.npmjs.com/package/install-now)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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
- ✅ 支持自定义优先级配置

## 快速开始

推荐使用 `npx` 直接运行：

```bash
# 使用完整名称
npx install-now

# 使用短别名（推荐）
npx i-now
```

### 作为 npm script

在项目的 `package.json` 中：

```json
{
  "scripts": {
    "predev": "npx -y i-now",
    "dev": "your-dev-command"
  }
}
```

这样当用户首次运行 `npm run dev` 时，会自动检查并安装依赖。

## 配置说明

工具支持通过 `package.json` 中的 `install-now` 字段来自定义包管理器的优先级。

### 配置字段

在 `package.json` 中添加 `install-now` 字段：

```json
{
  "install-now": ["yarn.lock", "pnpm:lock", "yarn", "pnpm"]
}
```

### 优先级规则类型

#### 1. Lock 文件规则

格式：`"包管理器名.lock"` 或 `"包管理器名:lock"`

示例：
- `"yarn.lock"` 或 `"yarn:lock"` - 检查是否存在 `yarn.lock` 文件
- `"pnpm.lock"` 或 `"pnpm:lock"` - 检查是否存在 `pnpm-lock.yaml` 文件
- `"bun.lock"` 或 `"bun:lock"` - 检查是否存在 `bun.lockb` 文件
- `"npm.lock"` 或 `"npm:lock"` - 检查是否存在 `package-lock.json` 文件

**判断规则**：
- 如果对应的 lock 文件存在，且该包管理器的命令可用，则使用该包管理器
- 如果 lock 文件不存在或命令不可用，则跳过，继续检查下一个规则

#### 2. 命令检查规则

格式：直接使用包管理器名称

示例：`"yarn"`, `"pnpm"`, `"bun"`, `"cnpm"`, `"npm"`

**判断规则**：
- 检查系统中是否存在该包管理器的命令
- 如果命令存在，则使用该包管理器
- 如果命令不存在，则跳过，继续检查下一个规则

#### 3. packageManager 字段规则

格式：`"packageManager"`

**判断规则**：
- 读取 `package.json` 中的 `packageManager` 字段（格式如 `"pnpm@8.0.0"`）
- 解析出包管理器名称，检查命令是否可用
- 如果可用，则使用该包管理器
- 如果字段不存在或解析失败，则跳过，继续检查下一个规则

### 默认优先级规则

如果没有配置 `install-now` 字段，工具会使用以下默认优先级：

```json
[
  "bun.lock",
  "pnpm.lock",
  "yarn.lock",
  "npm.lock",
  "packageManager",
  "bun",
  "pnpm",
  "yarn",
  "cnpm",
  "npm"
]
```

**默认规则说明**：
1. 优先检查 lock 文件（bun → pnpm → yarn → npm）
2. 其次使用 `package.json` 的 `packageManager` 字段
3. 最后按优先级检查系统中可用的包管理器命令

### 配置示例

#### 示例 1：优先使用 yarn，其次 pnpm

```json
{
  "install-now": ["yarn", "pnpm"]
}
```

#### 示例 2：优先检查 lock 文件，然后使用 packageManager 字段

```json
{
  "install-now": ["yarn.lock", "pnpm:lock", "packageManager", "yarn", "pnpm"]
}
```

#### 示例 3：只使用 pnpm

```json
{
  "install-now": ["pnpm"]
}
```

### 安装命令选择

工具会根据是否使用 lock 文件自动选择安装命令：

- **使用 lock 文件时**：
  - `npm` / `pnpm` / `yarn` → 使用 `ci` 命令（如 `npm ci`, `pnpm ci`, `yarn install --frozen-lockfile`）
  - `bun` → 使用 `install` 命令（bun 不支持 ci）

- **不使用 lock 文件时**：
  - 所有包管理器 → 使用 `install` 命令（可以生成 lock 文件）

## 相关讨论

### 为什么选择这个命名？

- `install-now` - 语义清晰，表达"立即安装"
- `i-now` - 简短易用，`i` = install, `now` = 立即

### 为什么不使用 `ci` 包？

- `ci` 包不支持 `bun` 和 `cnpm`
- 我们需要更灵活的检测逻辑
- 需要支持"有 lock 用 ci，没有 lock 用 install"的逻辑

## License

MIT

