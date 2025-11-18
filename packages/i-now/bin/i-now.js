#!/usr/bin/env node
import { runCommand } from '../dist/index.js';

runCommand().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

