# Meta MCP Installation Guide

Complete step-by-step installation and configuration guide for Meta MCP.

## Prerequisites

- Python 3.10 or higher
- pip (Python package manager)
- Cursor IDE (or another MCP-compatible client)

## Installation Steps

### 1. Install the Package

```powershell
# Navigate to the backend directory
cd D:\Dev\repos\meta_mcp\backend

# Install in development mode
pip install -e .
```

This will:
- Install all required dependencies (FastMCP 2.14.1+, FastAPI, etc.)
- Register the `meta-mcp-server` command
- Make the package available system-wide

### 2. Verify Installation

Test that the server starts correctly:

```powershell
meta-mcp-server
```

You should see:
```
Registering tool suite: diagnostics
Registering tool suite: analysis
Registering tool suite: discovery
Registering tool suite: scaffolding
MetaMCP Modular Suites Loaded Successfully
```

Press `Ctrl+C` to stop the server.

### 3. Configure in Cursor IDE

#### Option A: Manual Configuration

1. Open Cursor Settings:
   - Press `Ctrl+,` (or `Cmd+,` on Mac)
   - Or go to File → Preferences → Settings

2. Find the `mcp` section in your settings.json

3. Add the Meta MCP configuration:

```json
{
  "mcp": {
    "meta-mcp": {
      "command": "meta-mcp-server",
      "args": [],
      "cwd": "D:\\Dev\\repos\\meta_mcp\\backend"
    }
  }
}
```

**Important**: Update the `cwd` path to match your actual repository location!

#### Option B: Using Settings UI

1. Open Cursor Settings (`Ctrl+,`)
2. Search for "mcp"
3. Click "Edit in settings.json"
4. Add the configuration as shown above

### 4. Restart Cursor

**Required**: Cursor must be restarted for MCP configuration changes to take effect.

1. Close Cursor completely
2. Reopen Cursor
3. Wait a few seconds for MCP servers to initialize

### 5. Verify in Cursor

After restarting, Meta MCP tools should be available:

- **Discovery Tools**: `analyze_runts`, `get_repo_status`, `discover_servers`
- **Diagnostic Tools**: `emojibuster`, `powershell_tools`
- **Scaffolding Tools**: `create_mcp_server`, `create_fullstack_app`, etc.

## Configuration for Other MCP Clients

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "meta-mcp": {
      "command": "meta-mcp-server",
      "args": [],
      "cwd": "D:\\Dev\\repos\\meta_mcp\\backend"
    }
  }
}
```

### Antigravity

Add to Antigravity MCP configuration:

```json
{
  "meta-mcp": {
    "command": "meta-mcp-server",
    "args": [],
    "cwd": "D:\\Dev\\repos\\meta_mcp\\backend"
  }
}
```

## Troubleshooting

### Server Won't Start

**Problem**: `meta-mcp-server` command not found

**Solution**:
```powershell
# Reinstall the package
cd D:\Dev\repos\meta_mcp\backend
pip install -e . --force-reinstall
```

### Tools Not Appearing in Cursor

**Problem**: Configuration added but tools don't show up

**Solutions**:
1. **Restart Cursor** - Required after configuration changes
2. **Check paths** - Ensure `cwd` path is correct and uses double backslashes (`\\`)
3. **Check logs** - Look for errors in Cursor's MCP server output panel
4. **Verify installation** - Run `meta-mcp-server` directly to test

### Import Errors

**Problem**: Python import errors when starting server

**Solution**:
```powershell
# Ensure you're in the backend directory
cd D:\Dev\repos\meta_mcp\backend

# Reinstall dependencies
pip install -e . --force-reinstall

# Verify FastMCP version
pip show fastmcp
# Should show version >= 2.14.1
```

### Path Issues on Windows

**Problem**: Paths not working correctly

**Solution**: Use double backslashes in JSON:
```json
"cwd": "D:\\Dev\\repos\\meta_mcp\\backend"
```

Or use forward slashes:
```json
"cwd": "D:/Dev/repos/meta_mcp/backend"
```

## Next Steps

After installation:

1. **Try EmojiBuster**: Scan your repositories for Unicode logging issues
2. **Analyze Repositories**: Use `analyze_runts` to find repos needing upgrades
3. **Create Projects**: Use scaffolding tools to generate new MCP servers or apps

## Uninstallation

To remove Meta MCP:

```powershell
pip uninstall meta_mcp
```

Then remove the configuration from your Cursor settings.json.

---

**Need Help?** Check the [README.md](README.md) for more information or open an issue on GitHub.
