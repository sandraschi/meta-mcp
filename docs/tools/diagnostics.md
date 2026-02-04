# 🔬 Diagnostics Suite

**System health, safety, and validation.**

Tools designed to prevent crashes ("Argh-Coding" moments) and ensure runtime stability, with a heavy focus on Unicode safety and environment correctness.

## Tools

### `emojibuster` (Safe Scanner)
The flagship safety tool. Scans codebases for dangerous Unicode literals that cause crashes in specific terminals/environments.
- **Philosophy**: All Unicode must use hex escapes (e.g., `\U0001F680`) instead of literals (🚀).
- **Features**: Auto-fix mode, logging detection, pattern scanning.
- **Args**: `repo_path` (str), `operation` ("scan"|"fix"), `auto_fix` (bool)

### `powershell_tools`
Validator for PowerShell scripts and profiles.
- **Checks**: PSScriptAnalyzer compliance, profile loading times, module conflicts.
- **Args**: `repo_path` (str), `operation` ("validate"|"analyze")

### `analyze_runts` (Diagnostics Mode)
Deep inspection of project "runts" (undersized/legacy repos) for structural defects.
- **Args**: `scan_path` (str)

## Concepts
- **Safe Scanner**: A rigorous standard that forbids raw emoji literals in source code to ensure 100% cross-platform compatibility (Windows/Linux/macOS) and shell safety.
- **Environment Validation**: ensuring that the runtime environment (Python version, PATH, dependencies) matches the project requirements.
